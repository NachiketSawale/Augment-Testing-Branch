/*
 * Copyright(c) RIB Software GmbH
 */
import { Injector } from '@angular/core';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService, CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { Translatable } from '@libs/platform/common';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PpsHeaderDataService } from '../services/pps-header-data.service';
import { PpsHeaderDocumentProjectDataService } from '../services/pps-header-document-project-data.service';
import { PpsHeaderChangeProjectDocumentRubricCategoryWizardService } from '../services/wizards/pps-header-change-project-document-rubric-category-wizard.service';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { PPS_HEADER_CHARACTERISTIC_ENTITY_INFO } from './entity-infos/pps-header-characteristic-entity-info.model';
import { PPS_HEADER_ENTITY_INFO } from './entity-infos/pps-header-entity-info.model';
import { PPS_HEADER_FORMDATA_ENTITY_INFO } from './entity-infos/pps-header-formdata-entity-info.model';
import { PPS_HEADER_GENERIC_DOCUMENT_ENTITY_INFO } from './entity-infos/pps-header-generic-document-entity-info.model';
import { PPS_HEADER_SPLIT_UPSTREAM_ITEM_ENTITY_INFO } from './entity-infos/pps-header-split-upstream-item-entity-info.model';
import { PPS_HEADER_UPSTREAM_ITEM_ENTITY_INFO } from './entity-infos/pps-header-upstream-item-entity-info.model';
import { PPS_HEADER2BP_CONTACT_ENTITY_INFO } from './entity-infos/pps-header2bp-contact-entity-info.model';
import { PPS_HEADER2BP_ENTITY_INFO } from './entity-infos/pps-header2bp-entity-info.model';
import { PPS_HEADER2CLERK_ENTITY_INFO } from './entity-infos/pps-header2clerk-entity-info.model';
import { PPS_PARENT_PLANNED_QUANTITY_ENTITY_INFO } from './entity-infos/pps-parent-planned-quantity-entity-info.model';
import { PPS_PLANNED_QUANTITY_ENTITY_INFO } from './entity-infos/pps-planned-quantity-entity-info.model';
import { PPS_HEADER_UPSTREAM_FORMDATA_ENTITY_INFO } from './entity-infos/pps-header-upstream-formdata-entity-info.model';
import { ProductionplanningSharedJobPinBoardContainerFactory } from '@libs/productionplanning/shared';

// import { IInitializationContext } from '@libs/platform/common';
// import { PpsPlannedQuantityResourceQuantityTypeLookupHelperService } from '../services/pps-planned-quantity-res-qty-lookup-helper.service';

export class ProductionplanningHeaderModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new ProductionplanningHeaderModuleInfo();

	private constructor() {
		super();
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, PpsHeaderChangeProjectDocumentRubricCategoryWizardService);
	}

	public override get internalModuleName(): string {
		return 'productionplanning.header';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'ProductionPlanning.Header';
	}

	public override get entities(): EntityInfo[] {
		return [PPS_HEADER_ENTITY_INFO,
			PPS_HEADER2CLERK_ENTITY_INFO,
			PPS_HEADER2BP_ENTITY_INFO,
			PPS_HEADER2BP_CONTACT_ENTITY_INFO,
			PPS_PLANNED_QUANTITY_ENTITY_INFO,
			PPS_PARENT_PLANNED_QUANTITY_ENTITY_INFO,
			PPS_HEADER_GENERIC_DOCUMENT_ENTITY_INFO,
			PPS_HEADER_CHARACTERISTIC_ENTITY_INFO,
			PPS_HEADER_UPSTREAM_ITEM_ENTITY_INFO,
			PPS_HEADER_SPLIT_UPSTREAM_ITEM_ENTITY_INFO,
			PPS_HEADER_FORMDATA_ENTITY_INFO,
			PPS_HEADER_UPSTREAM_FORMDATA_ENTITY_INFO,
			...DocumentProjectEntityInfoService.create<IPpsHeaderEntity>(this.internalPascalCasedModuleName, PpsHeaderDocumentProjectDataService),
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			// pdf view container
			DrawingContainerDefinition.createPDFViewer({
				uuid: '7dc295cc035842228bddf576c5f7582a'
			}),
			// pinboard
			PinBoardContainerFactory.create({
				uuid: 'a17598ce80fe4cddb4979f76bba28441',
				permission: 'a17598ce80fe4cddb4979f76bba28441',
				title: 'basics.common.commentContainerTitle',
				commentQualifier: 'productionplanning.header.comment',
				commentType: CommentType.Standard,
				parentServiceToken: PpsHeaderDataService,
			}),
			// job pinboard
			ProductionplanningSharedJobPinBoardContainerFactory.create(
				{
					uuid: 'c20525961d92406a9fd8445cd035d01d',
					commentQualifier: 'logistic.job1.comment',
					parentServiceToken: PpsHeaderDataService,
					// permission: 'f7a4c2016e614d21834c50e44c6a65dd',
					// title: 'productionplanning.common.jobCommentContainerTitle',
					// commentType: CommentType.Standard,
					// showLastComments: true,
				}
			),
		]);
	}

	public override get moduleName(): Translatable {
		return {
			key: 'cloud.desktop.moduleDisplayNamePPSHeader'
		};
	}

	/**
	 * Loads the translation file used for PPS Header
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'basics.common',
			'basics.customize',
			'basics.clerk',
			'project.main',
			'businesspartner.main',
			'productionplanning.common',
			'productionplanning.engineering',
			'productionplanning.formulaconfiguration',
			'logistic.job',
			'model.wdeviewer',
		]);
	}

	// protected override async doPrepareModule(context: IInitializationContext): Promise<void> {
	// 	super.doPrepareModule(context);

	// 	// for resource type lookup overload of field ResourceTypeFk of PlannedQuantity container
	// 	const helper = context.injector.get(PpsPlannedQuantityResourceQuantityTypeLookupHelperService);
	// 	helper.loadResourceTypes();
	// }
}
