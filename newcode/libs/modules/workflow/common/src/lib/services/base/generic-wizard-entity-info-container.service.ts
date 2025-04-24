/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, GenericWizardEntityConfig, IEntityInfo, IGridContainerSettings } from '@libs/ui/business-base';
import { IChildRoleBase, IEntityList, IEntitySelection, SimpleIdIdentificationDataConverter } from '@libs/platform/data-access';
import { WorkflowCommonGenericWizardCommonBehavior } from '../../behaviors/generic-wizard-common-behavior.service';
import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { EntityInfoContainerSettings } from '../../models/types/generic-wizard-entity-info-container-settings.type';
import { IGenericWizardInstanceConfiguration } from '@libs/basics/config';
import { GenericWizardBaseConfig } from '../../models/types/generic-wizard-base-config.type';
import { GenericWizardContainerTypeArr, } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { GenericWizardLayoutConfigurationService } from './generic-wizard-layout-configuration.service';
import { TransientFieldSpec } from '@libs/ui/common';
import { prepareLayoutAttributes } from './helper-fns/prepare-layout-attributes-fn';
import { GenericWizardConfigService } from './generic-wizard-config.service';

function isGridProperties<T extends object>(item: boolean | [string] | IGridContainerSettings<T> | undefined): item is IGridContainerSettings<T> {
	return item !== undefined && typeof item !== 'boolean' && !Array.isArray(item);
}

/**
 * Helper class to prepare entity info for entity info container.
 */
@Injectable({
	providedIn: 'root'
})
export class GenericWizardEntityInfoContainerService<T extends object> {

	private readonly injector = inject(Injector);
	private readonly layoutConfigurationService = inject(GenericWizardLayoutConfigurationService);
	private readonly wizardConfigService = inject(GenericWizardConfigService);


	private async loadDataService(wizardConfig: GenericWizardBaseConfig, entitySettings: EntityInfoContainerSettings<T>, childDataService: IEntitySelection<T>): Promise<void> {
		const loadedItems = entitySettings.rootDataService.getList();

		if (entitySettings.rootDataService.getSelectedIds().length <= 0 && loadedItems.length > 0) {
			entitySettings.rootDataService.select(loadedItems[0]);
		}

		if (loadedItems.length > 0) {
			const ident = new SimpleIdIdentificationDataConverter().convert(loadedItems[0]);
			const typedChildService = childDataService as unknown as (IEntitySelection<GenericWizardContainerTypeArr> & IEntityList<GenericWizardContainerTypeArr> & IChildRoleBase<GenericWizardContainerTypeArr, never>);
			await typedChildService.loadSubEntities(ident);

			if (entitySettings.container.filterFn) {
				const filterFn = entitySettings.container.filterFn as unknown as (injector: Injector, entities: GenericWizardContainerTypeArr[], wizardConfig: GenericWizardBaseConfig) => GenericWizardContainerTypeArr;
				const items = typedChildService.getList();
				const filteredItems = filterFn(this.injector, items, wizardConfig);
				typedChildService.setList(filteredItems as unknown as GenericWizardContainerTypeArr[]);
			}

			this.wizardConfigService.setDataServiceStatus(entitySettings.containerUuid, true);
		}
	}

	/**
	 * Helper function to prepare entity info.
	 * @param containerConfig base container info from it's respective module.
	 * @param rootDataService root dataservice based on which this container should load.
	 * @returns
	 */
	public prepareEntityInfo(entitySettings: EntityInfoContainerSettings<T>, wizardInstanceConfig: IGenericWizardInstanceConfiguration, wizardConfig: GenericWizardBaseConfig): EntityInfo {
		const entityInfo = entitySettings.entityInfo;
		if (!entityInfo) {
			throw new Error('Entity info config is not defined');
		}

		let layoutConfig = entityInfo.entityConfig.layoutConfiguration;
		if (layoutConfig === undefined) {
			layoutConfig = this.getNewEntityConfig(entityInfo)?.layoutConfiguration;
			//throw Error('Layout configuration is not defined');
		}
		let gridConfig = entityInfo.entityConfig.grid;
		if (!isGridProperties<T>(gridConfig)) {
			gridConfig = this.getNewEntityConfig(entityInfo)?.grid;
			//throw new Error('Grid is not configured properly');
		}

		const dataService = this.prepareDataService(wizardConfig, entitySettings, entityInfo);

		const preparedEntityInfo: IEntityInfo<T> = {
			...entityInfo.entityConfig,
			permissionUuid: entitySettings.container.permissionUuid,

			grid: {
				...gridConfig as IGridContainerSettings<T>,
				containerUuid: entitySettings.containerUuid,
				behavior: ctx => ctx.injector.get(WorkflowCommonGenericWizardCommonBehavior<T>)
			},
			dataService: ctx => {
				return dataService;
			},
			layoutConfiguration: async (ctx) => {
				const transientFields = entitySettings.container.configuration.transientFields as TransientFieldSpec<T>[];
				return await this.layoutConfigurationService.prepareLayoutConfiguration({
					layoutConfig: layoutConfig!,
					ctx: ctx,
					layoutAttributes: prepareLayoutAttributes(wizardInstanceConfig, entitySettings.containerUuid),
					transientFields: transientFields
				});
			},
			validationService: (ctx) => {
				if (entitySettings.container.validationService) {
					return ctx.injector.get(entitySettings.container.validationService);
				}
			}
		};
		return EntityInfo.create(preparedEntityInfo);
	}

	/**
	 * prepareDataService :- prepares the parameters for loading dataservice and 
	 * updates the status once data service loaded successfully against the selected container.
	 * @param wizardConfig 
	 * @param entitySettings 
	 * @param entityInfo 
	 * @returns 
	 */
	private prepareDataService(
		wizardConfig: GenericWizardBaseConfig,
		entitySettings: EntityInfoContainerSettings<T>,
		entityInfo: GenericWizardEntityConfig<T>
	): IEntitySelection<T> {

		const dataService = runInInjectionContext(this.injector, () => {
			return new entityInfo.dataServiceType(entitySettings.rootDataService);
		}) as unknown as IEntitySelection<T>;
		const loadFn = async () => {
			await this.loadDataService(wizardConfig, entitySettings, dataService);
		};

		entitySettings.dataServiceCache[entitySettings.containerUuid] = dataService;
		this.wizardConfigService.updateDataServiceCreateStatus(entitySettings.containerUuid, loadFn);

		return dataService;
	}


	private getNewEntityConfig(entityInfo: GenericWizardEntityConfig<T>): IEntityInfo<T> | undefined {
		if ('config' in entityInfo.entityConfig && !(entityInfo.entityConfig.config === undefined)) {
			const newEntityConfig = entityInfo.entityConfig.config as IEntityInfo<T>;
			return newEntityConfig;
		}
		return;
	}
}