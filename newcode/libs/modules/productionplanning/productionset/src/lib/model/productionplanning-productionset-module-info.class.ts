/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { PRODUCTIONPLANNING_PRODUCTIONSET_ENTITY_INFO } from './productionplanning-productionset-entity-info.model';
import { PRODUCTIONPLANNING_COMMON_PRODUCT_PRODUCTION_SET_ENTITY_INFO } from './productionplanning-common-product-production-set-entity-info.model';
import { PPS_COMMON_EVENT_SEQUENCE_LOG_ENTITY_INFO } from './pps-common-event-sequence-log-entity-info.model';
import { PPS_PRODUCTION_SUBSET_ENTITY_INFO } from './pps-production-subset-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PPS_PRODUCTIONSET_EVENT_ENTITY_INFO } from './pps-productionset-event-entity-info.model';
import { ProductionplanningSharedLogPinBoardContainerFactory } from '@libs/productionplanning/shared';
import { ProductionplanningProductionsetDataService } from '../services/productionplanning-productionset-data.service';

// import { PPS_COMMON_LOG_SOURCE_WINDOW_ENTITY_INFO } from './pps-common-log-source-window-entity-info.model';

/**
 * The module info object for the `productionplanning.productionset` content module.
 */
export class ProductionplanningProductionsetModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProductionplanningProductionsetModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningProductionsetModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningProductionsetModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			ProductionplanningSharedLogPinBoardContainerFactory.create(
				{
					uuid: '19fee1b09b914b32b793d58a0a9a4674',
					commentQualifier: 'productionplanning.productionset.manuallog',
					parentServiceToken: ProductionplanningProductionsetDataService,
					permission: '2581963f63944bdca59bec07f539cafb',
					title: 'productionplanning.productionset.logPinboardTitle',
					endRead: 'logsForProdSet?mainItemId=',
				}
			),
			new ContainerDefinition({
				uuid: '96f5cf010264456888ca1fcda1bca0bf',
				title: 'productionplanning.productionset.entityTranslation',
				containerType: DataTranslationGridComponent,
			}),
		]);
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'productionplanning.productionset';
	}

	/**
	 * Loads the translation file
	 */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'productionplanning.common', 'productionplanning.item', 'productionplanning.fabricationunit', 'productionplanning.processconfiguration', 'procurement.inventory'];
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Productionplanning.Productionset';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [PRODUCTIONPLANNING_PRODUCTIONSET_ENTITY_INFO, PRODUCTIONPLANNING_COMMON_PRODUCT_PRODUCTION_SET_ENTITY_INFO, PPS_COMMON_EVENT_SEQUENCE_LOG_ENTITY_INFO, PPS_PRODUCTION_SUBSET_ENTITY_INFO, PPS_PRODUCTIONSET_EVENT_ENTITY_INFO];
	}
}
