/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, ITranslationContainerInfo } from '@libs/ui/business-base';
import { PRODUCTIONPLANNING_DRAWING_ENTITY_INFO } from './productionplanning-drawing-entity-info.model';
import { PRODUCTIONPLANNING_DRAWING_STACK_ENTITY_INFO } from './productionplanning-drawing-stack-entity-info.model';
import { PRODUCTIONPLANNING_DRAWING_REVISION_ENTITY_INFO } from './productionplanning-drawing-revision-entity-info.model';
import { PRODUCTIONPLANNING_DRAWING_COMPONENT_ENTITY_INFO } from './productionplanning-drawing-component-entity-info.model';
import { PRODUCTIONPLANNING_DRAWING_SKILL_ENTITY_INFO } from './productionplanning-drawing-skill-entity-info.model';
import { PRODUCTIONPLANNING_DRAWING_PRODUCT_TEMPLATE_ENTITY_INFO } from './productionplanning-drawing-product-template-entity-info.model';
import { DRAWING_PRODUCT_TEMPLATE_CHARACTERISTIC_ENTITY_INFO } from './pps-drawing-product-template-characteristic-entity-info.model';
import { DRAWING_PRODUCT_TEMPLATE_CHARACTERISTIC2_ENTITY_INFO } from './pps-drawing-product-template-characteristic2-entity-info.model';
import { DRAWING_PRODUCT_TEMPLATE_DRAWING_COMPONENT_ENTITY_INFO } from './pps-drawing-product-template-component-entity-info.model';

import { PPS_DRAWING_COST_GROUP_ENTITY_INFO } from './pps-drawing-cost-group-entity-info.model';
import { PPS_DRAWING_DOCUMENT_ENTITY_INFO } from './pps-drawing-document-entity-info.model';
import { PPS_DRAWING_PRODUCT_TEMPLATE_DOCUMENT_ENTITY_INFO } from './pps-drawing-product-template-document-entity-info.model';
import { PPS_DRAWING_DOCUMENT_REVISION_ENTITY_INFO } from './pps-drawing-document-revision-entity-info.model';
import { PPS_DRAWING_PRODUCT_TEMPLATE_DOCUMENT_REVISION_ENTITY_INFO } from './pps-drawing-product-template-document-revision-entity-info.model';
import { PPS_PROJECT_LOCATION_ENTITY_INFO } from '@libs/productionplanning/common';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { DrawingDataService } from '../services/drawing-data.service';
import { PRODUCTIONPLANNING_DRAWING_REVISION_TEMPLATE_REVISION_ENTITY_INFO } from './productionplanning-drawing-revision-template-revision-entity-info.model';

/**
 * The module info object for the `productionplanning.drawing` content module.
 */
export class DrawingModuleInfo extends BusinessModuleInfoBase {
	private constructor() {
		super();
	}

	private static _instance?: DrawingModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): DrawingModuleInfo {
		if (!this._instance) {
			this._instance = new DrawingModuleInfo();
		}

		return this._instance;
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'productionplanning.drawing';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			PRODUCTIONPLANNING_DRAWING_ENTITY_INFO,
			PRODUCTIONPLANNING_DRAWING_STACK_ENTITY_INFO,
			PRODUCTIONPLANNING_DRAWING_REVISION_ENTITY_INFO,
			PRODUCTIONPLANNING_DRAWING_COMPONENT_ENTITY_INFO,
			PRODUCTIONPLANNING_DRAWING_SKILL_ENTITY_INFO,
			PRODUCTIONPLANNING_DRAWING_PRODUCT_TEMPLATE_ENTITY_INFO,
			DRAWING_PRODUCT_TEMPLATE_CHARACTERISTIC_ENTITY_INFO,
			DRAWING_PRODUCT_TEMPLATE_CHARACTERISTIC2_ENTITY_INFO,
			DRAWING_PRODUCT_TEMPLATE_DRAWING_COMPONENT_ENTITY_INFO,
			PPS_DRAWING_COST_GROUP_ENTITY_INFO,
			PPS_DRAWING_DOCUMENT_ENTITY_INFO,
			PPS_DRAWING_PRODUCT_TEMPLATE_DOCUMENT_ENTITY_INFO,
			PPS_DRAWING_DOCUMENT_REVISION_ENTITY_INFO,
			PPS_DRAWING_PRODUCT_TEMPLATE_DOCUMENT_REVISION_ENTITY_INFO,
			PPS_PROJECT_LOCATION_ENTITY_INFO,
			PRODUCTIONPLANNING_DRAWING_REVISION_TEMPLATE_REVISION_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'basics.material', 'basics.common', 'model.wdeviewer', 'productionplanning.common', 'project.costcodes', 'resource.type', 'productionplanning.product-template'];
	}

	protected override get translationContainer(): string | ITranslationContainerInfo | undefined {
		return 'f5a22809146f48649c0c2cfd1de2fd37';
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: '4a26bd928609432ebfe4c82771a75836',
			}),
			PinBoardContainerFactory.create({
				uuid: '355c473b900f4cf7987fe00608509be1',
				permission: '355c473b900f4cf7987fe00608509be1',
				title: 'basics.common.commentContainerTitle',
				commentQualifier: 'productionplanning.drawing.comment',
				commentType: CommentType.Standard,
				parentServiceToken: DrawingDataService,
			}),
		]);
	}
}
