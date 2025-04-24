/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatLeaf, DataServiceFlatRoot, IDataServiceChildRoleOptions, IDataServiceOptions, IEntityProcessor, ServiceRole } from '@libs/platform/data-access';
import { GenericWizardLeafDataServiceConfig, GenericWizardRootDataServiceConfig } from '../../models/types/generic-wizard-leaf-data-service-config.type';
import { inject, Injector } from '@angular/core';
import { PlatformLazyInjectorService } from '@libs/platform/common';

/**
 * Common class for creating readonly leaf data service for generic wizard.
 */
export class GenericWizardLeafDataService<T extends object, PT extends object = object, PU extends object = object> extends DataServiceFlatLeaf<T, PT, PU> {

	private readonly injector = inject(Injector);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public constructor(private readonly genericWizardLeafDataServiceConfig: GenericWizardLeafDataServiceConfig<T, PT, PU>, defaultValues?: T[]) {
		const dataServiceOptions: IDataServiceOptions<T> = {
			apiUrl: genericWizardLeafDataServiceConfig.apiUrl,
			readInfo: genericWizardLeafDataServiceConfig.readInfo,
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				parent: genericWizardLeafDataServiceConfig.parentService
			}
		};
		super(dataServiceOptions);

		if (defaultValues) {
			this.setList(defaultValues);
			this.select(this.getList()[0]);
		}
	}		
}

/**
 * Common class for creating readonly root data service for generic wizard.
 */
export class GenericWizardRootDataService<Type extends object, CompleteType extends object = never> extends DataServiceFlatRoot<Type, CompleteType> {

	private readonly injector = inject(Injector);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public constructor(private readonly genericWizardDataServiceConfig: GenericWizardRootDataServiceConfig<Type>, defaultValues?: Type[], processors: IEntityProcessor<Type>[] = []) {
		super({
			apiUrl: genericWizardDataServiceConfig.apiUrl,
			readInfo: genericWizardDataServiceConfig.readInfo,
			roleInfo: {
				role: ServiceRole.Root,
				itemName: ''
			}
		});

		if (defaultValues) {
			this.setList(defaultValues);
			this.select(this.getList()[0]);
		}

		this.processor.addProcessor(processors);
	}

	/**
	 * Loads all items for the generic wizard root data service.
	 * @returns A promise of items to be loaded.
	 */
	public async loadAllItems() {
		return this.getProvider().load({ id: 0 }).then(items => this.onLoadSucceededFn(items));
	}

	protected async onLoadSucceededFn(loaded: Type[]): Promise<Type[]> {
		if (this.genericWizardDataServiceConfig.onLoadSucceeded) {
			return this.genericWizardDataServiceConfig.onLoadSucceeded(loaded, this.injector, this.lazyInjector);
		}
		return loaded as Type[];
	}

	/**
	 * Processed items according to entity processors set in use case configuration.
	 * @param items All loaded items.
	 * @returns void
	 */
	public processItems(items: Type[]) {
		return this.processor.process(items);
	}
}