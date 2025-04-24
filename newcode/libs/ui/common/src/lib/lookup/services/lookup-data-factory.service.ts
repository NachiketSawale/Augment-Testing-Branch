/*
 * Copyright(c) RIB Software GmbH
 */

import {Observable} from 'rxjs';
import {inject, Injectable, Injector, runInInjectionContext} from '@angular/core';

import {LookupSimpleEntity} from '../model/lookup-simple-entity';
import {ILookupConfig, ILookupOptions} from '../model/interfaces/lookup-options.interface';
import {UiCommonLookupTypeLegacyDataService} from './lookup-type-legacy-data.service';
import {UiCommonLookupTypeDataService} from './lookup-type-data.service';
import {UiCommonLookupItemsDataService} from './lookup-items-data.service';
import {ILookupSimpleOptions} from '../model/interfaces/lookup-simple-options.interface';
import {UiCommonLookupSimpleDataService} from './lookup-simple-data.service';
import {ILookupEndpointConfig} from '../model/interfaces/lookup-endpoint-config.interface';
import {UiCommonLookupEndpointDataService} from './lookup-endpoint-data.service';

/**
 * Lookup data service factory
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonLookupDataFactoryService {
	private injector = inject(Injector);
	private instanceMap = new Map<string, unknown>();

	/**
	 * Has instance
	 * @param uuid
	 */
	public hasInstance(uuid: string) {
		return this.instanceMap.has(uuid);
	}

	/**
	 * Get instance
	 * @param uuid
	 */
	public getInstance(uuid: string) {
		return this.instanceMap.get(uuid);
	}

	/**
	 * Set instance
	 * @param uuid
	 * @param instance
	 */
	public setInstance(uuid: string, instance: unknown) {
		if (this.hasInstance(uuid)) {
			throw new Error(`exist instance for ${uuid}`);
		}

		return this.instanceMap.set(uuid, instance);
	}

	/**
	 * Delete instance
	 * @param uuid
	 */
	public deleteInstance(uuid: string) {
		return this.instanceMap.delete(uuid);
	}

	/**
	 * Clear all instances
	 */
	public clearInstances() {
		this.instanceMap.clear();
	}

	/**
	 * Create memory lookup data service
	 * @param items
	 * @param config
	 */
	public fromItems<TItem extends object, TEntity extends object>(items: TItem[], config: ILookupConfig<TItem, TEntity>) {
		return runInInjectionContext(this.injector, () => {
			return new UiCommonLookupItemsDataService<TItem, TEntity>(items, config);
		});
	}

	/**
	 * Create legacy lookup type data service
	 * @param lookupType
	 * @param config
	 */
	public fromLookupTypeLegacy<TItem extends object, TEntity extends object>(lookupType: string, config: ILookupConfig<TItem, TEntity>) {
		if (this.hasInstance(config.uuid)) {
			return this.getInstance(config.uuid) as UiCommonLookupTypeLegacyDataService<TItem, TEntity>;
		}

		return runInInjectionContext(this.injector, () => {
			const instance = new UiCommonLookupTypeLegacyDataService<TItem, TEntity>(lookupType, config);
			this.setInstance(config.uuid, instance);
			return instance;
		});
	}

	/**
	 * Create lookup type data service
	 * @param lookupType
	 * @param config
	 */
	public fromLookupType<TItem extends object, TEntity extends object>(lookupType: string, config: ILookupConfig<TItem, TEntity>) {
		if (this.hasInstance(config.uuid)) {
			return this.getInstance(config.uuid) as UiCommonLookupTypeDataService<TItem, TEntity>;
		}

		return runInInjectionContext(this.injector, () => {
			const instance = new UiCommonLookupTypeDataService<TItem, TEntity>(lookupType, config);
			this.setInstance(config.uuid, instance);
			return instance;
		});
	}

	/**
	 * Create memory lookup data service
	 * @param items
	 * @param options
	 */
	public fromSimpleItems<TEntity extends object>(items: [number, string][], options?: ILookupOptions<LookupSimpleEntity, TEntity>) {
		return runInInjectionContext(this.injector, () => {
			const simpleEntities = items.map(item => new LookupSimpleEntity(item[0], item[1]));
			const config: ILookupConfig<LookupSimpleEntity, TEntity> = {
				uuid: '',
				idProperty: 'id',
				valueMember: 'id',
				displayMember: 'desc',
				...options
			};
			return this.fromItems(simpleEntities, config);
		});
	}

	/**
	 * Create memory lookup data service
	 * @param items
	 * @param options
	 */
	public fromSimpleItemClass<TEntity extends object>(items: LookupSimpleEntity[], options?: ILookupOptions<LookupSimpleEntity, TEntity>) {
		return runInInjectionContext(this.injector, () => {
			const config: ILookupConfig<LookupSimpleEntity, TEntity> = {
				uuid: '',
				idProperty: 'id',
				valueMember: 'id',
				displayMember: 'desc',
				...options
			};
			return this.fromItems(items, config);
		});
	}

	/**
	 * Create memory lookup data service from observable
	 * @param dataSource
	 * @param options
	 */
	public fromSimpleObservable<TEntity extends object>(dataSource: Observable<LookupSimpleEntity[]>, options?: ILookupOptions<LookupSimpleEntity, TEntity>) {
		return runInInjectionContext(this.injector, () => {
			const config: ILookupConfig<LookupSimpleEntity, TEntity> = {
				uuid: '',
				idProperty: 'id',
				valueMember: 'id',
				displayMember: 'desc',
				...options
			};
			const items: LookupSimpleEntity[] = [];
			const service = this.fromItems(items, config);

			dataSource.subscribe(items => {
				service.setItems(items);
			});

			return service;
		});
	}

	/**
	 * Create simple lookup data service from simple lookup data provider
	 * @param moduleQualifier
	 * @param config
	 * @param simpleDataOptions
	 */
	public fromSimpleDataProvider<TItem extends object, TEntity extends object>(moduleQualifier: string, config: ILookupConfig<TItem, TEntity>, simpleDataOptions?: ILookupSimpleOptions) {
		if (this.hasInstance(config.uuid)) {
			return this.getInstance(config.uuid) as UiCommonLookupSimpleDataService<TItem, TEntity>;
		}

		return runInInjectionContext(this.injector, () => {
			const instance = new UiCommonLookupSimpleDataService<TItem, TEntity>(moduleQualifier, config, simpleDataOptions);
			this.setInstance(config.uuid, instance);
			return instance;
		});
	}

	/**
	 * Create lookup data service from web api endpoint
	 * @param endpoint
	 * @param config
	 */
	public fromEndpointDataProvider<TItem extends object, TEntity extends object>(endpoint: ILookupEndpointConfig<TItem, TEntity>, config: ILookupConfig<TItem, TEntity>) {
		if (this.hasInstance(config.uuid)) {
			return this.getInstance(config.uuid) as UiCommonLookupEndpointDataService<TItem, TEntity>;
		}

		return runInInjectionContext(this.injector, () => {
			const instance = new UiCommonLookupEndpointDataService<TItem, TEntity>(endpoint, config);
			this.setInstance(config.uuid, instance);
			return instance;
		});
	}
}