/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { ESTIMATE_BOQ_ITEM_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';
import { IIdentificationData, PlatformLazyInjectorService, ServiceLocator } from '@libs/platform/common';
import { ILookupFieldOverload, ILookupReadonlyDataService, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IScriptCommonLookupEntity } from '../../model/entities/script-common-lookup-entity.interface';

@Injectable({ providedIn: 'root' })
export class ConstructionSystemSharedBoqRootLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IScriptCommonLookupEntity, TEntity> {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	private estBoqLookup?: ILookupReadonlyDataService<IScriptCommonLookupEntity, IScriptCommonLookupEntity>;

	public constructor() {
		super([], {
			uuid: '9a22f2ee20e7464fa4d76b80a6ba447f',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Reference',
		});
	}

	public override getItemByKey(id: IIdentificationData): Observable<IScriptCommonLookupEntity> {
		return new Observable((observer) => {
			(async () => {
				const estBoqLookup = await this.getEstBoqLookup();

				let foundItem = this.items.find((item) => {
					return id.id === this.identify(item).id;
				});
				if (!foundItem) {
					const result = await firstValueFrom(estBoqLookup.getItemByKey(id));
					if (result) {
						const list = await firstValueFrom(estBoqLookup.getList());
						this.items = this.items.concat(list);
						foundItem = result;
					}
				}

				if (foundItem) {
					this.items.forEach((item) => {
						const i = this.identify(item);
						if (i.id === foundItem?.BoqRootItemFk) {
							observer.next(item);
						}
					});
				}
				observer.complete();
			})();
		});
	}

	public async getEstBoqLookup(): Promise<ILookupReadonlyDataService<IScriptCommonLookupEntity, IScriptCommonLookupEntity>> {
		if (this.estBoqLookup) {
			return this.estBoqLookup;
		}
		const estBoqLookupProvider = await this.lazyInjector.inject(ESTIMATE_BOQ_ITEM_LOOKUP_PROVIDER_TOKEN);
		const lookupDefinition = estBoqLookupProvider.GenerateEstimateBoQItemLookup();
		const lookupOptions = (lookupDefinition as ILookupFieldOverload<IScriptCommonLookupEntity>).lookupOptions;
		this.estBoqLookup = ServiceLocator.injector.get(lookupOptions.getTypedOptions().dataServiceToken) as ILookupReadonlyDataService<IScriptCommonLookupEntity, IScriptCommonLookupEntity>;
		return this.estBoqLookup;
	}
}
