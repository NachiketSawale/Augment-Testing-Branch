/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import {
	BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService,
	CommentType,
	PinBoardContainerFactory
} from '@libs/basics/shared';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { ProductionplanningSharedJobPinBoardContainerFactory, ProductionplanningSharedLogPinBoardContainerFactory } from '@libs/productionplanning/shared';
import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { PpsItemDataService } from '../services/pps-item-data.service';
import { PpsItemDocumentProjectDataService } from '../services/pps-item-document-project-data.service';
import {
	PpsItemChangeProjectDocumentRubricCategoryWizardService
} from '../services/wizards/pps-item-change-project-document-rubric-category-wizard.service';
import { IPPSItemEntity } from './entities/pps-item-entity.interface';
import { PPS_ITEM_TO_CLERK_ENTITY_INFO } from './pps-item-2-clerk-entity-info.model';
import { PPS_ITEM_BP_CONTACT_ENTITY_INFO } from './pps-item-bp-contact-entity-info.model';
import { PPS_ITEM_BUSINESS_PARTNER_ENTITY_INFO } from './pps-item-business-partner-entity-info.model';
import { PPS_ITEM_DOCUMENT_ENTITY_INFO } from './pps-item-document-entity-info.model';
import { PPS_ITEM_DOCUMENT_REVISION_ENTITY_INFO } from './pps-item-document-revision-entity-info.model';
import { PPS_ITEM_ENTITY_INFO } from './pps-item-entity-info.model';
import { PPS_ITEM_EVENT_ENTITY_INFO } from './pps-item-event-entity-info.model';
import { PPS_ITEM_EVENT_COST_GROUP_ENTITY_INFO } from './pps-item-event-cost-group-entity-info.model';
import { PPS_ITEM_FORMDATA_ENTITY_INFO } from './pps-item-formdata-entity-info.model';
import { PPS_ITEM_HEADER_CHARACTERISTIC_ENTITY_INFO } from './characteristic/pps-item-header-characteristic-entity-info.model';
// import { PPS_ITEM_HEADER_TO_BUSINESS_PARTNER_ENTITY_INFO } from './pps-item-header2bp-entity-info.model';
import { PPS_ITEM_HEADER_PRJ2BP_ENTITY_INFO } from './pps-item-header-prj2bp-entity-info.model';
import { PPS_ITEM_HEADER_PRJ2BPCONTACT_ENTITY_INFO } from './pps-item-header-prj2bpcontact-entity-info.model';
import { PPS_ITEM_PRJ2BP_ENTITY_INFO } from './pps-item-prj2bp-entity-info.model';
import { PPS_ITEM_PRJ2BPCONTACT_ENTITY_INFO } from './pps-item-prj2bpcontact-entity-info.model';
import { PPS_ITEM_PROJECT_FORMDATA_ENTITY_INFO } from './pps-item-project-formdata-entity-info.model';
import { PPS_ITEM_SOURCE_ENTITY_INFO } from './pps-item-source-entity-info.model';
import { PPS_ITEM_SPLIT_UPSTREAM_ITEM_ENTITY_INFO } from './pps-item-split-upstream-item-entity-info.model';
import { PPS_ITEM_UPSTREAM_FORMDATA_ENTITY_INFO } from './pps-item-upstream-formdata-entity-info.model';
import { PPS_UPSTREAM_ITEM_ENTITY_INFO } from './pps-upstream-item-entity-info.model';
import { PPS_UPSTREAM_ITEM_FORMDATA_ENTITY_INFO } from './pps-upstream-item-formdata-entity-info.model';
import { PPS_ITEM_PRODUCT_TEMPLATE_ENTITY_INFO } from './pps-item-product-template-entity-info.model';
import {
	PPS_ITEM_PRODUCT_TEMPLATE_PARAMETER_ENTITY_INFO
} from './pps-item-product-template-parameter-entity-info.model';
import {
	PPS_ITEM_PRODUCT_TEMPLATE_COMPONENT_ENTITY_INFO
} from './pps-item-product-template-component-entity-info.model';
import { PPS_ITEM_CHARACTERISTIC_ENTITY_INFO } from './characteristic/pps-item-characteristic-entity-info.model';
import { PPS_ITEM_CHARACTERISTIC2_ENTITY_INFO } from './characteristic/pps-item-characteristic2-entity-info.model';
import {
	PPS_ITEM_PRODUCT_TEMPLATE_CHARACTERISTIC_ENTITY_INFO
} from './characteristic/pps-item-product-template-characteristic-entity-info.model';
import {
	PPS_ITEM_PRODUCT_TEMPLATE_CHARACTERISTIC2_ENTITY_INFO
} from './characteristic/pps-item-product-template-characteristic2-entity-info.model';
import { PpsItemRootItemCommentDataService } from '../services/pps-item-root-item-comment-data.service';

/**
 * The module info object for the `productionplanning.item` content module.
 */
export class PpsItemModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: PpsItemModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): PpsItemModuleInfo {
		if (!this._instance) {
			this._instance = new PpsItemModuleInfo();
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
		return 'productionplanning.item';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [PPS_ITEM_ENTITY_INFO,
			PPS_UPSTREAM_ITEM_ENTITY_INFO,
			PPS_ITEM_SPLIT_UPSTREAM_ITEM_ENTITY_INFO,
			PPS_ITEM_EVENT_ENTITY_INFO,
			PPS_ITEM_EVENT_COST_GROUP_ENTITY_INFO,
			PPS_ITEM_SOURCE_ENTITY_INFO,
			PPS_ITEM_BUSINESS_PARTNER_ENTITY_INFO,
			PPS_ITEM_BP_CONTACT_ENTITY_INFO,
			// PPS_ITEM_HEADER_TO_BUSINESS_PARTNER_ENTITY_INFO,
			PPS_ITEM_PRJ2BP_ENTITY_INFO,
			PPS_ITEM_PRJ2BPCONTACT_ENTITY_INFO,
			PPS_ITEM_HEADER_PRJ2BP_ENTITY_INFO,
			PPS_ITEM_HEADER_PRJ2BPCONTACT_ENTITY_INFO,
			PPS_ITEM_DOCUMENT_ENTITY_INFO,
			PPS_ITEM_DOCUMENT_REVISION_ENTITY_INFO,
			...DocumentProjectEntityInfoService.create<IPPSItemEntity>(this.internalPascalCasedModuleName, PpsItemDocumentProjectDataService),
			PPS_ITEM_FORMDATA_ENTITY_INFO,
			PPS_ITEM_PROJECT_FORMDATA_ENTITY_INFO,
			PPS_ITEM_UPSTREAM_FORMDATA_ENTITY_INFO,
			PPS_UPSTREAM_ITEM_FORMDATA_ENTITY_INFO,
			PPS_ITEM_HEADER_CHARACTERISTIC_ENTITY_INFO,
			PPS_ITEM_TO_CLERK_ENTITY_INFO,
			PPS_ITEM_PRODUCT_TEMPLATE_ENTITY_INFO,
			PPS_ITEM_PRODUCT_TEMPLATE_PARAMETER_ENTITY_INFO,
			PPS_ITEM_PRODUCT_TEMPLATE_COMPONENT_ENTITY_INFO,
			PPS_ITEM_CHARACTERISTIC_ENTITY_INFO,
			PPS_ITEM_CHARACTERISTIC2_ENTITY_INFO,
			PPS_ITEM_PRODUCT_TEMPLATE_CHARACTERISTIC_ENTITY_INFO,
			PPS_ITEM_PRODUCT_TEMPLATE_CHARACTERISTIC2_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'basics.common', 'basics.material', 'logistic.job', 'project.costcodes', 'project.main', 'estimate.main', 'productionplanning.common',
			'model.wdeviewer', 'documents.project', 'cloud.common', 'productionplanning.engineering',
			'productionplanning.product-template',
			'productionplanning.formulaconfiguration',
			'productionplanning.drawing',
		];
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, PpsItemChangeProjectDocumentRubricCategoryWizardService);
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			PinBoardContainerFactory.create({
				uuid: '15eef56b65344be3b563d99351a38341',
				permission: '15eef56b65344be3b563d99351a38341',
				title: 'basics.common.commentContainerTitle',
				commentQualifier: 'productionplanning.item.comment',
				commentType: CommentType.Standard,
				parentServiceToken: PpsItemDataService,
				showLastComments: true,
			}),
			ProductionplanningSharedJobPinBoardContainerFactory.create(
				{
					uuid: '2b8e07b715c5456eb10e0d737b10dfa3',
					commentQualifier: 'logistic.job1.comment',
					parentServiceToken: PpsItemDataService,
					// permission: 'f7a4c2016e614d21834c50e44c6a65dd',
					// title: 'productionplanning.common.jobCommentContainerTitle',
					// commentType: CommentType.Standard,
					// showLastComments: true,
				}
			),
			ProductionplanningSharedLogPinBoardContainerFactory.create(
				{
					uuid: '102d90b038b74ece9e1e668b6c50e0b3',
					commentQualifier: 'productionplanning.item.manuallog',
					parentServiceToken: PpsItemDataService,
					permission: '5907fffe0f9b44588254c79a70ba3af1',
					title: 'productionplanning.item.itemLogPinboardTitle',
					endRead: 'logsForPpsItem?itemId=',
				}
			),
			DrawingContainerDefinition.createPDFViewer({
				uuid: '0226c6c63f2c47e0a036df840e8c4119'
			}),
			new ContainerDefinition({
				uuid: 'd7cd0e614f1a44889d161544e35cb07e',
				title: { key: 'ui.business-base.translationContainerTitle' },
				containerType: DataTranslationGridComponent as ContainerTypeRef
			}),
			PinBoardContainerFactory.create({
				uuid: 'c8ac638c8214493f9937a4c544674e7a',
				permission: '15eef56b65344be3b563d99351a38341',
				title: 'productionplanning.item.rootItemPinboardTitle',
				commentQualifier: 'productionplanning.item.rootcomment',
				commentType: CommentType.Standard,
				dataService: PpsItemRootItemCommentDataService,
				parentServiceToken: PpsItemDataService,
				showLastComments: true,
				isPinBoardReadonly: false,
			}),
		]);
	}
}
