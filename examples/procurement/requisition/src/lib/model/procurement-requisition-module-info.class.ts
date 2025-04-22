/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PROCUREMENT_REQUISITION_HEADER_ENTITY_INFO } from './entitiy-info/requisition-header-entity-info.model';
import {
	PrcModuleInfoBase,
	ProcurementCommonCertificateEntityInfo, ProcurementCommonFeatureKeyManagement,
	ProcurementCommonTotalEntityInfo,
	WIZARD_NAME
} from '@libs/procurement/common';
import { PROCUREMENT_REQUISITION_CHARACTERISTIC2_ENTITY_INFO } from './entitiy-info/procurement-requisition-characteristic2-entity-info.model';
import { PROCUREMENT_REQUISITION_CHARACTERISTIC_ENTITY_INFO } from './entitiy-info/procurement-requisition-characteristics-entity-info.model';
import { PROCUREMENT_REQUISITION_VARIANT_ENTITY_INFO } from './entitiy-info/requisition-variant-entity-info.model';

import { PROCUREMENT_REQUISITION_USER_FORM_ENTITY_INFO } from './entitiy-info/procurement-requisition-user-form-entity-info.model';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { IReqHeaderEntity } from './entities/reqheader-entity.interface';
import { ProcurementRequisitionDocumentProjectDataService } from '../services/procurement-requisition-document-project-data.service';
import { PRC_ITEMS_ENTITY_INFO } from './entitiy-info/prc-items-entity-info.class';
import { PROCUREMENT_REQUISITION_DOCUMENT_ENTITY_INFO } from './entitiy-info/procurement-requisition-document-entity-info.model';
import { ProcurementModule } from '@libs/procurement/shared';
import { RequisitionTotalDataService } from '../services/requisition-total-data.service';
import { RequisitionTotalBehavior } from '../behaviors/requisition-total-behavior.service';
import { PROCUREMENT_REQUISITION_DELIVERY_SCHEDULE_ENTITY_INFO } from './entitiy-info/procurement-requisition-delivery-schedule-entity-info.model';
import { REQ_COMMON_SUGGESTED_BIDDERS_INFO } from './entitiy-info/req-suggested-bidder-entity-info.model';
import { PROCUREMENT_REQUISITION_ITEM_VARIANT_ENTITY_INFO } from './entitiy-info/requisition-item-variant-entity-info.model';
import { PROCUREMENT_REQUISITION_BOQ_VARIANT_ENTITY_INFO } from './entitiy-info/requisition-boq-variant-entity-info.model';
import { PROCUREMENT_REQUISITION_EVENT_ENTITY_INFO } from './entitiy-info/procurement-requisition-event-entity-info.model';
import { PROCUREMENT_REQUISITION_WARRANTY_ENTITY_INFO } from './entitiy-info/procurement-requisition-warranty-entity-info.model';
import { PROCUREMENT_REQUISITION_PAYMENT_SCHEDULE_ENTITY_INFO } from './entitiy-info/procurement-requisition-payment-schedule-entity-info.model';
import { PROCUREMENT_REQUISITION_OVERVIEW_ENTITY_INFO } from './entitiy-info/requisition-overview-entity-info.model';
import { PROCUREMENT_REQUISITION_ITEM_SCOPE_ENTITY_INFO_SERIES } from './entitiy-info/requisition-item-scope-entity-info-series.model';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PROCUREMENT_REQUISITION_GENERALS_ENTITY_INFO } from './entitiy-info/procurement-requisition-generals-entity-info.model';
import { PROCUREMENT_REQUISITION_MILE_STONE_ENTITY_INFO } from './entitiy-info/procurement-requisition-mile-stone-entity-info.model';
import { PROCUREMENT_REQUISITION_SUBCONTRACTOR_ENTITY_INFO } from './entitiy-info/procurement-requisition-subcontractor-entity-info.model';
import { PROCUREMENT_REQUISITION_CONTACT_ENTITY_INFO } from './entitiy-info/requisition-contact-entity-info.model';
import { PROCUREMENT_REQUISITION_PRICE_CONDITION_ENTITY_INFO } from './entitiy-info/requisition-price-condition-entity-info.model';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService } from '@libs/basics/shared';
import { Injector } from '@angular/core';
import { ChangeProjectDocumentRubricCategoryWizardService } from '../wizards/change-project-document-rubric-category-wizard.service';
import { ProcurementRequisitionCertificateDataService } from '../services/requisition-certificate-data.service';
import { REQUISITION_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO } from './entitiy-info/procurement-requisition-historical-price-for-boq-entity-info.model';
import { REQUISITION_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO } from './entitiy-info/procurement-requisition-historical-price-for-item-entity-info.model';
import { REQUISITION_STATUS_HISTORY_ENTITY_INFO } from './entitiy-info/procurement-requisition-status-history-entity-info.model';
import {
	PROCUREMENT_REQUISITION_CONTROLLING_GROUP_SET_ENTITY_INFO
} from '../services/procurement-requisition-controlling-group-set-entity-info.model';
import { PROCUREMENT_REQUISITION_PIN_BOARD_CONTAINER_DEFINITION } from './entitiy-info/requisition-pin-board-container-info.model';
import { ProcurementRequisitionSetBaseAltItemWizardService } from '../wizards/procurement-requisition-set-base-alt-item-wizard.service';
import { ProcurementRequisitioinSplitOverallDiscountWizardService } from '../wizards/procurement-requisitioin-split-overall-discount-wizard.service';
import { ProcurementRequisitionUpdateItemPriceWizardService } from '../wizards/procurement-requisition-update-item-price-wizard.service';
import { PROCUREMENT_REQUISITION_EXT_BIDDER_ENTITY_INFO } from './entitiy-info/procurement-requisition-further-external-bps-entity-info.model';
import { ProcurementRequisitionReplaceNeutralMaterialWizardService } from '../wizards/procurement-requisition-replace-neutral-material-wizard.service';
import { ProcurementRequisitionEnhancedBidderSearchWizardService } from '../wizards/procurement-requisition-enhanced-bidder-search-wizard.service';
import { ProcurementRequisitionTotalValidationService } from '../services/validations/reqsuisition-total-validation.service';
import { PROCUREMENT_REQUISITION_BOQ_ENTITY_INFO } from './entitiy-info/procurement-requisition-boq-entity-info.model';
import { BoqMainModuleInfo } from '@libs/boq/main';
import { ProcurementRequisitionBoqItemDataService } from '../services/procurement-requisition-boq-item-data.service';
/**
 * The module info object for the `procurement.requisition` content module.
 */
export class ProcurementRequisitionModuleInfo extends PrcModuleInfoBase {
	private readonly procurementRequisitionDocumentProjectEntityInfo = DocumentProjectEntityInfoService.create<IReqHeaderEntity>(this.internalPascalCasedModuleName, ProcurementRequisitionDocumentProjectDataService);
	private readonly procurementRequisitionTotalEntityInfo = ProcurementCommonTotalEntityInfo.create({
		permissionUuid: '985f496b39eb4cd08d9cd4f9f3c8d1e4',
		formUuid: '8a1689bcf59a4307a766432e7913657e',
		dataServiceToken: RequisitionTotalDataService,
		validationServiceToken: ProcurementRequisitionTotalValidationService,
		behavior: RequisitionTotalBehavior,
		dtoSchemeConfig: { moduleSubModule: ProcurementModule.Requisition, typeName: 'ReqTotalDto' },
	});
	private readonly procurementRequisitionCertificateEntityInfo = ProcurementCommonCertificateEntityInfo.create({
		permissionUuid: '3304c905ec9249dca401cf64ff00a765',
		formUuid: 'db13e336f3b84535a20888bd2f6b82d7',
		dataServiceToken: ProcurementRequisitionCertificateDataService,
	});

	private constructor() {
		super();
	}

	private SplitAllOverDiscountWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const generateDiliveryScheduleKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.splitAllOverDiscount);
		if (!this.featureRegistry.hasFeature(generateDiliveryScheduleKey)) {
			this.featureRegistry.registerFeature(generateDiliveryScheduleKey, () => {
				return injector.get(ProcurementRequisitioinSplitOverallDiscountWizardService);
			});
		}
	}

	private SetBaseAltItemWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const selectPrcItemGroupsKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.selectPrcItemGroups);
		if (!this.featureRegistry.hasFeature(selectPrcItemGroupsKey)) {
			this.featureRegistry.registerFeature(selectPrcItemGroupsKey, () => {
				return injector.get(ProcurementRequisitionSetBaseAltItemWizardService);
			});
		}
	}

	private UpdateItemPriceWizard(injector: Injector){
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const updateItemPriceKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.updateItemPrice);
		if (!this.featureRegistry.hasFeature(updateItemPriceKey)) {
			this.featureRegistry.registerFeature(updateItemPriceKey, () => {
				return injector.get(ProcurementRequisitionUpdateItemPriceWizardService);
			});
		}
	}

	private replaceNeutralMaterialWizard(injector: Injector){
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const replaceNeutralMaterialKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.replaceNeutralMaterial);
		if (!this.featureRegistry.hasFeature(replaceNeutralMaterialKey)) {
			this.featureRegistry.registerFeature(replaceNeutralMaterialKey, () => {
				return injector.get(ProcurementRequisitionReplaceNeutralMaterialWizardService);
			});
		}
	}

	private enhanceBidderSearchWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const enhanceBidderSearchKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.enhanceBidderSearch);
		if (!this.featureRegistry.hasFeature(enhanceBidderSearchKey)) {
			this.featureRegistry.registerFeature(enhanceBidderSearchKey, () => {
				return injector.get(ProcurementRequisitionEnhancedBidderSearchWizardService);
			});
		}
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		this.SplitAllOverDiscountWizard(injector);
		this.SetBaseAltItemWizard(injector);
		this.UpdateItemPriceWizard(injector);
		this.replaceNeutralMaterialWizard(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, ChangeProjectDocumentRubricCategoryWizardService);
		this.enhanceBidderSearchWizard(injector);
	}

	private static _instance?: ProcurementRequisitionModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProcurementRequisitionModuleInfo {
		if (!this._instance) {
			this._instance = new ProcurementRequisitionModuleInfo();
		}

		return this._instance;
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'procurement.requisition';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Procurement.Requisition';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			PROCUREMENT_REQUISITION_HEADER_ENTITY_INFO,
			PRC_ITEMS_ENTITY_INFO,
			REQ_COMMON_SUGGESTED_BIDDERS_INFO,
			this.procurementRequisitionTotalEntityInfo,
			this.procurementRequisitionCertificateEntityInfo,
			PROCUREMENT_REQUISITION_CHARACTERISTIC2_ENTITY_INFO,
			PROCUREMENT_REQUISITION_OVERVIEW_ENTITY_INFO,
			PROCUREMENT_REQUISITION_ITEM_VARIANT_ENTITY_INFO,
			PROCUREMENT_REQUISITION_BOQ_VARIANT_ENTITY_INFO,
			...PROCUREMENT_REQUISITION_PRICE_CONDITION_ENTITY_INFO,
			PROCUREMENT_REQUISITION_CHARACTERISTIC_ENTITY_INFO,
			PROCUREMENT_REQUISITION_CONTACT_ENTITY_INFO,
			PROCUREMENT_REQUISITION_VARIANT_ENTITY_INFO,
			PROCUREMENT_REQUISITION_USER_FORM_ENTITY_INFO,
			PROCUREMENT_REQUISITION_EVENT_ENTITY_INFO,
			PROCUREMENT_REQUISITION_DOCUMENT_ENTITY_INFO,
			...PROCUREMENT_REQUISITION_ITEM_SCOPE_ENTITY_INFO_SERIES,
			PROCUREMENT_REQUISITION_DELIVERY_SCHEDULE_ENTITY_INFO,
			PROCUREMENT_REQUISITION_PAYMENT_SCHEDULE_ENTITY_INFO,
			...this.procurementRequisitionDocumentProjectEntityInfo,
			PROCUREMENT_REQUISITION_GENERALS_ENTITY_INFO,
			PROCUREMENT_REQUISITION_MILE_STONE_ENTITY_INFO,
			PROCUREMENT_REQUISITION_SUBCONTRACTOR_ENTITY_INFO,
			PROCUREMENT_REQUISITION_WARRANTY_ENTITY_INFO,
			REQUISITION_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO,
			REQUISITION_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO,
			REQUISITION_STATUS_HISTORY_ENTITY_INFO,
			PROCUREMENT_REQUISITION_CONTROLLING_GROUP_SET_ENTITY_INFO,
			PROCUREMENT_REQUISITION_EXT_BIDDER_ENTITY_INFO,
			PROCUREMENT_REQUISITION_BOQ_ENTITY_INFO,
			this.boqItemEntityInfo,
		];
	}

	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo((ctx) => ctx.injector.get(ProcurementRequisitionBoqItemDataService), '58F71F3079C9450D9723FC7194E433C2');

	/**
	 * Loads the translation file used for business partner main
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['basics.characteristic']);
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'f6609c2f11d4c03bda4cd07bed54a64d',
			}),
			PROCUREMENT_REQUISITION_PIN_BOARD_CONTAINER_DEFINITION
		]);
	}
}
