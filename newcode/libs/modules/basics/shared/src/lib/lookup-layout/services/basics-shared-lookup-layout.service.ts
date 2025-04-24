/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { Injectable, inject, ProviderToken } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { IField, ILayoutConfiguration, ILookupReadonlyDataService, LookupIdentificationData, TransientFieldSpec } from '@libs/ui/common';
import { BasicsSharedProviderResolverService } from '../../utilities';
import { ILookupFieldsConfig } from '../model';
import { IEntityModification } from '@libs/platform/data-access';

/**
 * A lookup layout service to deal with lookup fields in container layout.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedLookupLayoutService {
	private readonly providerResolver = inject(BasicsSharedProviderResolverService);
	/**
	 * A map which records lookup identifier of loading lookup entity async.
	 * @private
	 */
	private readonly asyncLookupIdentifierMap = new WeakMap<object, string[]>();

	/**
	 * Appends lookup transient fields into the container layout.
	 * @param containerLayout The container layout configuration.
	 * @param config The configuration object.
	 * @param config.gid The group ID to merge the fields into.
	 * @param config.lookupKeyGetter Function to get the lookup key from an entity.
	 * @param config.lookupFields The lookup fields to merge.
	 * @param config.lookupService The service to retrieve lookup data.
	 * @param config.dataService The service to notify about entity updates.
	 * @throws Will throw an error if container layout groups are not found.
	 * @throws Will throw an error if the target group is not found.
	 */
	public appendLookupFieldsIntoLayout<T extends object, TL extends object>(containerLayout: ILayoutConfiguration<T>, config: ILookupFieldsConfig<T, TL>) {
		if (!containerLayout.groups) {
			throw new Error('Container layout groups are not found');
		}

		const group = containerLayout.groups.find((e) => e.gid === config.gid);

		if (!group) {
			throw new Error(`Target group ${config.gid} not found`);
		}

		config.lookupFields.forEach((lookupField) => {
			group.attributes.push(lookupField.id);
		});

		containerLayout.transientFields = [...(containerLayout.transientFields ?? []), ...this.generateLookupTransientFields(config)];
	}

	/*
	 * Generates lookup transient fields.
	 * @param config The configuration object.
	 * @param config.lookupFields The lookup fields to merge.
	 * @param config.lookupKeyGetter Function to get the lookup key from an entity.
	 * @param config.lookupService The service to retrieve lookup data.
	 * @param config.dataService The service to notify about entity updates.
	 */
	public generateLookupTransientFields<T extends object, TL extends object>(config: ILookupFieldsConfig<T, TL>): TransientFieldSpec<T>[] {
		return config.lookupFields.map((lookupField) => {
			const field = <IField<T>>lookupField;
			const lookupModel = <string>lookupField.lookupModel;

			// lookup field must be readonly
			field.readonly = true;

			field.model = {
				getValue: (entity) => {
					const lookupKey = config.lookupKeyGetter(entity);

					if (lookupKey == null) {
						return undefined;
					}

					const dataService = this.providerResolver.getProvider(config.dataService);
					return this.getLookupTransientFieldValue(lookupKey, config.lookupService, lookupModel, dataService, entity);
				},
			};

			return field;
		});
	}

	/*
	 * Gets the lookup transient field value.
	 * @param lookupKey The lookup key.
	 * @param lookupServiceToken The lookup service token.
	 * @param lookupModel The lookup model path.
	 * @param dataService The data service.
	 * @param entity The entity.
	 */
	public getLookupTransientFieldValue<T extends object, TL extends object>(
		lookupKey: number | string | IIdentificationData,
		lookupServiceToken: ILookupReadonlyDataService<TL, T> | ProviderToken<ILookupReadonlyDataService<TL, T>>,
		lookupModel: string,
		dataService: IEntityModification<T>,
		entity: T,
	) {
		const lookupService = this.providerResolver.getProvider(lookupServiceToken);
		const id = LookupIdentificationData.convert(lookupKey as number | string | IIdentificationData);
		const identifier = LookupIdentificationData.stringify(id);

		if (this.isLookupEntityLoadingAsync(lookupService, identifier)) {
			return undefined;
		}

		const item = lookupService.cache.getItem(id);

		if (item) {
			return get(item, lookupModel);
		}

		this.setLookupEntityLoadingAsync(lookupService, identifier);
		// lookup entity is not loaded yet, load it now
		lookupService.getItemByKey(id).subscribe((item) => {
			this.resetLookupEntityLoadingAsync(lookupService, identifier);
			if (!item) {
				return;
			}

			// cache the lookup entity
			lookupService.cache.setItem(item);
			// notify the data service about the update to refresh UI
			dataService.entitiesUpdated(entity);
		});

		return undefined;
	}

	private setLookupEntityLoadingAsync<T extends object, TL extends object>(lookupService: ILookupReadonlyDataService<TL, T>, identifier: string) {
		const models = this.asyncLookupIdentifierMap.get(lookupService) || [];

		if (!models.includes(identifier)) {
			models.push(identifier);
			this.asyncLookupIdentifierMap.set(lookupService, models);
		}
	}

	private resetLookupEntityLoadingAsync<T extends object, TL extends object>(lookupService: ILookupReadonlyDataService<TL, T>, identifier: string) {
		let models = this.asyncLookupIdentifierMap.get(lookupService) || [];

		if (models.includes(identifier)) {
			models = models.filter((e) => e !== identifier);
			this.asyncLookupIdentifierMap.set(lookupService, models);
		}
	}

	private isLookupEntityLoadingAsync<T extends object, TL extends object>(lookupService: ILookupReadonlyDataService<TL, T>, identifier: string) {
		const models = this.asyncLookupIdentifierMap.get(lookupService) || [];
		return models.includes(identifier);
	}
}
