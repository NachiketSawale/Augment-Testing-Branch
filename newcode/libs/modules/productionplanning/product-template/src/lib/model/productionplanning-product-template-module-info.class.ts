/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';

import { PPS_PRODUCT_TEMPLATE_ENTITY_INFO } from './pps-product-template-entity-info.model';
import { PPS_PRODUCT_TEMPLATE_PRODUCT_ENTITY_INFO } from './pps-product-template-product-entity-info.model';
import { PPS_PRODUCT_TEMPLATE_PARAMETER_ENTITY_INFO } from './pps-product-template-parameter-entity-info.model';
import { PPS_PRODUCT_TEMPLATE_DRAWING_COMPONENT_ENTITY_INFO } from './pps-product-template-drawing-component-entity-info.model';
import { PRODUCT_TEMPLATE_CHARACTERISTIC_ENTITY_INFO } from './pps-product-template-characteristic-entity-info.model';
import { PRODUCT_TEMPLATE_CHARACTERISTIC2_ENTITY_INFO } from './pps-product-template-characteristic2-entity-info.model';
import { PPS_PRODUCT_TEMPLATE_DOCUMENT_ENTITY_INFO } from './pps-product-template-document-entity-info.model';
import { PPS_PRODUCT_TEMPLATE_DOCUMENT_REVISION_ENTITY_INFO } from './pps-product-template-document-revision-entity-info.model';

/**
 * The module info object for the `productionplanning.producttemplate` content module.
 */
export class ProductionplanningProducttemplateModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProductionplanningProducttemplateModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningProducttemplateModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningProducttemplateModuleInfo();
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
		return 'productionplanning.producttemplate';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'ProductionPlanning.ProductTemplate';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			PPS_PRODUCT_TEMPLATE_ENTITY_INFO,
			PPS_PRODUCT_TEMPLATE_PRODUCT_ENTITY_INFO,
			PPS_PRODUCT_TEMPLATE_PARAMETER_ENTITY_INFO,
			PPS_PRODUCT_TEMPLATE_DRAWING_COMPONENT_ENTITY_INFO,
			PRODUCT_TEMPLATE_CHARACTERISTIC_ENTITY_INFO,
			PRODUCT_TEMPLATE_CHARACTERISTIC2_ENTITY_INFO,
			PPS_PRODUCT_TEMPLATE_DOCUMENT_ENTITY_INFO,
			PPS_PRODUCT_TEMPLATE_DOCUMENT_REVISION_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'productionplanning.common',
			'productionplanning.drawing',
			'productionplanning.ppsmaterial',
			'productionplanning.formulaconfiguration',
			'productionplanning.strandpattern',
			'productionplanning.product-template',
			'model.wdeviewer',
		];
	}

	protected override get containers():  (ContainerDefinition | IContainerDefinition)[]{
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: '0226c6c63f2c47e0a036df840e8c4119'
			}),
		]);
	}
}
