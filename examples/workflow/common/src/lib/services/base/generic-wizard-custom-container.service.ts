/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { IConcreteEntitySchemaProperty, IEntityList, IEntityProcessor, IEntitySchema, IEntitySelection } from '@libs/platform/data-access';
import { WorkflowCommonGenericWizardCommonBehavior } from '../../behaviors/generic-wizard-common-behavior.service';
import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { GenericWizardLeafDataService, GenericWizardRootDataService } from './generic-wizard-data-service.class';
import { isCustomContainerConfig, isFormContainerConfig, isGridContainerConfig } from '../../models/types/generic-wizard-container-config.type';
import { GenericWizardContainerType } from '../../models/enum/generic-wizard-container-type.enum';
import { GenericWizardRootDataServiceConfig } from '../../models/types/generic-wizard-leaf-data-service-config.type';
import { CustomContainerSettings } from '../../models/types/generic-wizard-custom-container-settings.type';
import { GenericWizardLayoutConfigurationService } from './generic-wizard-layout-configuration.service';
import { IGenericWizardInstanceConfiguration } from '@libs/basics/config';
import { GenericWizardConfigService } from './generic-wizard-config.service';
import { Included } from '../../configuration/rfq-bidder/types/generic-wizard-included.type';
import { PlatformLazyInjectorService, ValueOrType } from '@libs/platform/common';
import { GenericWizardRootEntities } from '../../configuration/base/class/generic-wizard-id-use-case-map';
import { prepareLayoutAttributes } from './helper-fns/prepare-layout-attributes-fn';

/**
 * Helper class to prepare custom data service with entity info for generic wizard.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardCustomContainerService<T extends GenericWizardRootEntities> {

	private readonly layoutConfigurationService = inject(GenericWizardLayoutConfigurationService);
	private readonly wizardConfigService = inject(GenericWizardConfigService);
	private readonly lazyinjector = inject(PlatformLazyInjectorService);
	private readonly injector = inject(Injector);

	/**
	 * Prepares entity info for custom container.
	 * @returns EntityInfo
	 */
	public async prepareEntityInfo(customContainerSettings: CustomContainerSettings<T>, wizardInstanceConfig: IGenericWizardInstanceConfiguration): Promise<EntityInfo> {

		let entitySchema = await this.prepareEntitySchema(customContainerSettings.customContainerConfiguration.entitySchema);

		/**
		 * Adding default dummy schema for custom components.
		 */
		if (customContainerSettings.container.configuration.containerType === GenericWizardContainerType.Custom) {
			entitySchema = {
				schema: `${customContainerSettings.containerUuid}DTO`,
				properties: {} as { readonly [key in keyof Partial<T>]: IConcreteEntitySchemaProperty; }
			};
		}

		const dataService = this.prepareDataService(customContainerSettings);

		let entityInfo: IEntityInfo<T> = {
			permissionUuid: '',
			dataService: ctx => {
				return dataService;
			},
			layoutConfiguration: async ctx => {
				let layoutConfiguration = {};
				if (customContainerSettings.customContainerConfiguration.containerLayoutConfiguration) {
					layoutConfiguration = customContainerSettings.customContainerConfiguration.containerLayoutConfiguration;
				}

				return await this.layoutConfigurationService.prepareLayoutConfiguration({
					layoutConfig: layoutConfiguration,
					ctx: ctx,
					layoutAttributes: prepareLayoutAttributes(wizardInstanceConfig, customContainerSettings.containerUuid),
					isGridContainer: customContainerSettings.container.configuration.containerType === GenericWizardContainerType.Grid
				});
			},
			dtoSchemeId: customContainerSettings.customContainerConfiguration.dtoSchemeId,
			entitySchema: entitySchema,
			validationService: (ctx) => {
				if (customContainerSettings.container.validationService) {
					return ctx.injector.get(customContainerSettings.container.validationService);
				}
			}
		};
		//Add container
		const updatedEntityInfo = this.addContainer(entityInfo, customContainerSettings);
		if (updatedEntityInfo !== null) {
			entityInfo = updatedEntityInfo;
		}
		return EntityInfo.create(entityInfo);
	}

	private prepareDataService(customContainerSettings: CustomContainerSettings<T>): IEntitySelection<T> {

		let dataServiceConfig = customContainerSettings.container.configuration.dataServiceConfig as GenericWizardRootDataServiceConfig<T>;
		if (dataServiceConfig === undefined) {
			dataServiceConfig = {
				apiUrl: '',
				readInfo: {}
			};
		}

		const defaultItems = customContainerSettings.container.configuration.defaultDataServiceValue as T[] | undefined;

		let dataService;
		let loadFn: () => Promise<void>;
		if (customContainerSettings.container.configuration.isLeafContainer) {
			dataService = runInInjectionContext(this.injector, () => {
				new GenericWizardLeafDataService({ ...dataServiceConfig, parentService: (customContainerSettings.rootDataService) }, defaultItems);
			}) as unknown as IEntitySelection<T>;

			//await this.loadDataService(customContainerSettings);
			const loadDataService = this.loadDataService;
			loadFn = async () => {
				await loadDataService(customContainerSettings);
			};
		} else {
			const entityProcessors = customContainerSettings.container.entityProcessors as IEntityProcessor<T>[];
			dataService = runInInjectionContext(this.injector, () => {
				return new GenericWizardRootDataService(dataServiceConfig, defaultItems, entityProcessors);
			});

			dataService.setList([]);

			//await this.loadRootDataService(dataService, customContainerSettings);
			const loadDataService = this.loadRootDataService;
			const typedDataService = dataService;
			loadFn = async () => {
				await loadDataService(typedDataService, customContainerSettings);
			};
		}
		customContainerSettings.dataServiceCache[customContainerSettings.containerUuid] = dataService;
		this.wizardConfigService.updateDataServiceCreateStatus(customContainerSettings.containerUuid, loadFn);
		return dataService;
	}

	private async loadRootDataService(dataService: GenericWizardRootDataService<T, never>, customContainerSettings: CustomContainerSettings<T>): Promise<void> {
		//Load data for root data service if data service configuration is defined. Otherwise, default values are set from the data service.
		if (customContainerSettings.container.configuration.dataServiceConfig) {
			const items = await dataService.loadAllItems();

			//Adding isincluded field based on transient property
			if (customContainerSettings.container.configuration.containerType === GenericWizardContainerType.Grid) {
				if (customContainerSettings.includeAll) {
					(items as unknown as Included[]).forEach((item) => {
						item.isIncluded = true;
					});
				} else {
					(items as unknown as Included[]).forEach((item) => {
						item.isIncluded = false;
					});
				}
			} else {
				if (Array.isArray(items) && items.length > 0) {
					(items as unknown as Included[]).forEach((item) => {
						item.isIncluded = false;
					});
				} else if (typeof items === 'object' && items !== null) {
					(items as unknown as Included).isIncluded = false;
				}

			}

			//Process items after loading.
			dataService.processItems(items);

			//Set items into the dataservice
			dataService.setList(items);

			//Select first item by default to be able to set values for form containers.
			if (customContainerSettings.container.configuration.containerType === GenericWizardContainerType.Form) {
				if (Array.isArray(items) && items.length > 0) {
					dataService.select(items[0]);
				} else {
					dataService.select(items);
				}
			}
		}
	}

	private async loadDataService(customContainerSettings: CustomContainerSettings<T>): Promise<void> {
		const rootDataService = customContainerSettings.rootDataService as unknown as (IEntitySelection<T> & IEntityList<T>);
		if (rootDataService.getSelectedIds().length === 0) {
			rootDataService.select(rootDataService.getList()[0]);
		}
	}

	private addContainer(entityInfo: IEntityInfo<T>, customContainerSettings: CustomContainerSettings<T>): IEntityInfo<T> | null {
		switch (customContainerSettings.customContainerConfiguration.containerType) {
			case GenericWizardContainerType.Grid:
				return this.addGridContainer(entityInfo, customContainerSettings);
			case GenericWizardContainerType.Form:
				return this.addFormContainer(entityInfo, customContainerSettings);
			case GenericWizardContainerType.Custom:
				return this.addCustomContainer(entityInfo, customContainerSettings);
		}
	}

	private addGridContainer(entityInfo: IEntityInfo<T>, customContainerSettings: CustomContainerSettings<T>): IEntityInfo<T> | null {
		if (!isGridContainerConfig(customContainerSettings.customContainerConfiguration)) {
			return null;
		}
		entityInfo = {
			...entityInfo,
			permissionUuid: customContainerSettings.container.permissionUuid,
			grid: {
				...customContainerSettings.customContainerConfiguration.gridConfig,
				containerUuid: customContainerSettings.containerUuid,
				behavior: ctx => ctx.injector.get(WorkflowCommonGenericWizardCommonBehavior<T>)
			},
			form: {
				containerUuid: ''
			}
		};
		return entityInfo;
	}

	private addFormContainer(entityInfo: IEntityInfo<T>, customContainerSettings: CustomContainerSettings<T>): IEntityInfo<T> | null {
		if (!isFormContainerConfig(customContainerSettings.customContainerConfiguration)) {
			return entityInfo;
		}
		entityInfo = {
			...entityInfo,
			permissionUuid: customContainerSettings.container.permissionUuid,
			form: {
				...customContainerSettings.customContainerConfiguration.formConfig,
				containerUuid: customContainerSettings.containerUuid,
				behavior: ctx => ctx.injector.get(WorkflowCommonGenericWizardCommonBehavior<T>)
			},
			grid: {
				containerUuid: ''
			}
		};
		return entityInfo;
	}

	private addCustomContainer(entityInfo: IEntityInfo<T>, customContainerSettings: CustomContainerSettings<T>): IEntityInfo<T> | null {
		if (!isCustomContainerConfig(customContainerSettings.customContainerConfiguration)) {
			return null;
		}
		entityInfo = {
			...entityInfo,
			permissionUuid: customContainerSettings.container.permissionUuid,
			grid: {
				containerUuid: customContainerSettings.containerUuid,
				containerType: customContainerSettings.customContainerConfiguration.containerComponentRef,
				behavior: ctx => ctx.injector.get(WorkflowCommonGenericWizardCommonBehavior<T>)
			}
		};
		return entityInfo;
	}

	private async prepareEntitySchema(entitySchema?: ((injector: Injector, lazyInjector: PlatformLazyInjectorService) => Promise<IEntitySchema<T>>) | ValueOrType<IEntitySchema<T>>): Promise<ValueOrType<IEntitySchema<T>> | undefined> {
		if (entitySchema === undefined) {
			return undefined;
		}
		if ((this.isEntitySchemaFn(entitySchema))) {
			return entitySchema(this.injector, this.lazyinjector);
		} else {
			return entitySchema;
		}
	}

	private isEntitySchemaFn<T>(entitySchema?: ((injector: Injector, lazyInjector: PlatformLazyInjectorService) => Promise<IEntitySchema<T>>) | ValueOrType<IEntitySchema<T>>): entitySchema is (injector: Injector, lazyInjector: PlatformLazyInjectorService) => Promise<IEntitySchema<T>> {
		return typeof entitySchema === 'function';
	}
}