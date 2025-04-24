/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService, CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { EngineeringDocumentProjectDataService } from '../services/engineering-document-project-data.service';
import { EngineeringTaskDataService } from '../services/engineering-task-data.service';
import { EngTaskChangeProjectDocumentRubricCategoryWizardService } from '../services/wizards/eng-task-change-project-document-rubric-category-wizard.service';
import { ENG_TASK_2_CLERK_ENTITY_INFO } from './eng-task-2-clerk-entity-info.model';
import { ENG_TASK_ITEM2_CLERK_ENTITY_INFO } from './eng-task-item-2clerk-entity-info.model';
import { ENG_TASK_PRODUCT_TEMPLATE_DOCUMENT_ENTITY_INFO } from './eng-task-product-template-document-entity-info.model';
import { ENG_TASK_PRODUCT_TEMPLATE_DOCUMENT_REVISION_ENTITY_INFO } from './eng-task-product-template-document-revision-entity-info.model';
import { ENGINEERING_TASK_BP_CONTACT_ENTITY_INFO } from './engineering-task-bp-contact-entity-info.model';
import { ENGINEERING_TASK_BP_ENTITY_INFO } from './engineering-task-bp-entity-info.model';
import { ENGINEERING_TASK_CHARACTERISTIC_ENTITY_INFO } from './engineering-task-characteristic-entity-info.model';
import { ENGINEERING_TASK_CHARACTERISTIC2_ENTITY_INFO } from './engineering-task-characteristic2-entity-info.model';
import { ENGINEERING_TASK_DOCUMENT_ENTITY_INFO } from './engineering-task-document-entity-info.model';
import { ENGINEERING_TASK_DOCUMENT_REVISION_ENTITY_INFO } from './engineering-task-document-revision-entity-info.model';
import { ENGINEERING_TASK_ENTITY_INFO } from './engineering-task-entity-info.model';
import { ENGINEERING_TASK_PRODUCT_TEMPLATE_ENTITY_INFO } from './engineering-task-product-template-entity-info.model';
import { ENGINEERING_TASK_SPLIT_UPSTREAM_ITEM_ENTITY_INFO } from './engineering-task-split-upstream-item-entity-info.model';
import { ENGINEERING_TASK_UPSTREAM_ITEM_ENTITY_INFO } from './engineering-task-upstream-item-entity-info.model';
import { IEngTaskEntity } from './entities/eng-task-entity.interface';
import { ProductionplanningSharedJobPinBoardContainerFactory, ProductionplanningSharedLogPinBoardContainerFactory } from '@libs/productionplanning/shared';
import { ENG_TASK_PRJ2BP_ENTITY_INFO } from './eng-task-prj2bp-entity-info.model';
import { ENG_TASK_PRJ2BPCONTACT_ENTITY_INFO } from './eng-task-prj2bpcontact-entity-info.model';
import { ENG_TASK_COST_GROUP_ENTITY_INFO } from './eng-task-cost-group-entity-info.model';


/**
 * The module info object for the `productionplanning.engineering` content module.
 */
export class ProductionplanningEngineeringModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProductionplanningEngineeringModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningEngineeringModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningEngineeringModuleInfo();
		}

		return this._instance;
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, EngTaskChangeProjectDocumentRubricCategoryWizardService);
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
		return 'productionplanning.engineering';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Productionplanning.Engineering';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			ENGINEERING_TASK_ENTITY_INFO,
			ENGINEERING_TASK_UPSTREAM_ITEM_ENTITY_INFO,
			ENGINEERING_TASK_SPLIT_UPSTREAM_ITEM_ENTITY_INFO,
			...DocumentProjectEntityInfoService.create<IEngTaskEntity>(this.internalPascalCasedModuleName, EngineeringDocumentProjectDataService),
			ENGINEERING_TASK_CHARACTERISTIC_ENTITY_INFO,
			ENGINEERING_TASK_CHARACTERISTIC2_ENTITY_INFO,
			ENG_TASK_2_CLERK_ENTITY_INFO,
			ENG_TASK_ITEM2_CLERK_ENTITY_INFO,
			ENGINEERING_TASK_PRODUCT_TEMPLATE_ENTITY_INFO,
			ENGINEERING_TASK_DOCUMENT_ENTITY_INFO,
			ENGINEERING_TASK_DOCUMENT_REVISION_ENTITY_INFO,
			ENG_TASK_PRODUCT_TEMPLATE_DOCUMENT_ENTITY_INFO,
			ENG_TASK_PRODUCT_TEMPLATE_DOCUMENT_REVISION_ENTITY_INFO,
			ENG_TASK_COST_GROUP_ENTITY_INFO,
			ENGINEERING_TASK_BP_ENTITY_INFO,
			ENGINEERING_TASK_BP_CONTACT_ENTITY_INFO,
			ENG_TASK_PRJ2BP_ENTITY_INFO,
			ENG_TASK_PRJ2BPCONTACT_ENTITY_INFO,
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: '0226c6c63f2c47e0a036df840e8c4119',
			}),
			PinBoardContainerFactory.create({
				uuid: 'f1ceee23c5774036a1cceee9a7b34590',
				permission: 'f1ceee23c5774036a1cceee9a7b34590',
				title: 'basics.common.commentContainerTitle',
				commentQualifier: 'productionplanning.engineering.comment',
				commentType: CommentType.Standard,
				parentServiceToken: EngineeringTaskDataService,
				showLastComments: true,
			}),
			// job pinboard
			ProductionplanningSharedJobPinBoardContainerFactory.create(
				{
					uuid: 'f1e57832cde54380a4b0bd23991f19f9',
					commentQualifier: 'logistic.job.comment',
					parentServiceToken: EngineeringTaskDataService,
					// permission: 'f7a4c2016e614d21834c50e44c6a65dd',
					// title: 'productionplanning.common.jobCommentContainerTitle',
					// commentType: CommentType.Standard,
					// showLastComments: true,
				}
			),
			ProductionplanningSharedLogPinBoardContainerFactory.create(
				{
					uuid: '45fd21c43796480c9498889bf775d5c0',
					commentQualifier: 'productionplanning.engineering.manuallog',
					parentServiceToken: EngineeringTaskDataService,
					permission: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
					title: 'productionplanning.engineering.logPinboardTitle',
					endRead: 'logsForEngTask?mainItemId=',
				}
			),
		]);
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'ui.common',
			'model.wdeviewer',
			'cloud.common',
			'basics.common',
			'productionplanning.common',
			'productionplanning.drawing',
			'project.costcodes',
			'basics.site',
			'documents.shared',
			'productionplanning.product-template',
		];
	}
}
