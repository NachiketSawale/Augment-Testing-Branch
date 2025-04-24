/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TRANSPORTPLANNING_BUNDLE_GRID_ENTITY_INFO } from './transportplanning-bundle-grid-entity-info.model';
import { PRODUCTIONPLANNING_COMMON_PRODUCT_BUNDLE_ENTITY_INFO } from './productionplanning-common-product-bundle-entity-info.model';
import { PRODUCTIONPLANNING_COMMON_EVENT_ENTITY_INFO } from './productionplanning-common-event-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PRODUCTIONPLANNING_COMMON_PRODUCT_EVENT_ENTITY_INFO } from './productionplanning-common-product-event-entity-info.model';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { TRANSPORTPLANNING_BUNDLE_DOCUMENT_ENTITY_INFO } from './transportplanning-bundle-document-entity-info.model';
import { TRANSPORTPLANNING_BUNDLE_DOCUMENT_REVISION_ENTITY_INFO } from './transportplanning-bundle-document-revision-entity-info.model';
import { TRANSPORTPLANNING_BUNDLE_EVENT_COST_GROUP_ENTITY_INFO } from './transportplanning-bundle-event-cost-group-entity-info.model';
import { TRANSPORTPLANNING_BUNDLE_PRODUCT_COST_GROUP_ENTITY_INFO } from './transportplanning-bundle-product-cost-group-entity-info.model';

/**
 * The module info object for the `transportplanning.bundle` content module.
 */
export class TransportplanningBundleModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TransportplanningBundleModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TransportplanningBundleModuleInfo {
		if (!this._instance) {
			this._instance = new TransportplanningBundleModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'transportplanning.bundle';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Transportplanning.Bundle';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			TRANSPORTPLANNING_BUNDLE_GRID_ENTITY_INFO,
			PRODUCTIONPLANNING_COMMON_PRODUCT_BUNDLE_ENTITY_INFO,
			PRODUCTIONPLANNING_COMMON_EVENT_ENTITY_INFO,
			PRODUCTIONPLANNING_COMMON_PRODUCT_EVENT_ENTITY_INFO,
			TRANSPORTPLANNING_BUNDLE_DOCUMENT_ENTITY_INFO,
			TRANSPORTPLANNING_BUNDLE_DOCUMENT_REVISION_ENTITY_INFO, 
			TRANSPORTPLANNING_BUNDLE_EVENT_COST_GROUP_ENTITY_INFO, 
			TRANSPORTPLANNING_BUNDLE_PRODUCT_COST_GROUP_ENTITY_INFO,
		];
	}

	/**
	 * Loads the translation file used for Bundle
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'cloud.common',
			'basics.site',
			'logistic.job',
			'productionplanning.common',
			'project.main.',
			'boq.main.',
			'productionplanning.item',
			'productionplanning.producttemplate.',
			'productionplanning.strandpattern.',
			'procurement.common.',
			'productionplanning.product.',
			'transportplanning.requisition.',
			'productionplanning.ppsmaterial.',
			'project.costcodes.',
			'model.wdeviewer',
		];
	}
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'c08b71ab6fb74c45a079ad5ad5320776',
			}),
		]);
	}

	/**
	 * Returns the translation container UUID for the bundle module.
	 */
	protected override get translationContainer(): string | undefined {
		return '96f5cf010264456888ca1fcda1bca0bf';
	}
}
