/*
 * Copyright(c) RIB Software GmbH
 */
import { Injector } from '@angular/core';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { RFQ_ENTITY_INFO } from './entity-info/rfq-header-entity-info.model';
import { RFQ_REQUISITION_ENTITY_INFO } from './entity-info/rfq-requisition-entity-info.model';
import { RFQ_BUSINESS_PARTNER_ENTITY_INFO } from './entity-info/rfq-bidder-entity-info.model';
import { RFQ_TOTAL_ENTITY_INFO } from './entity-info/rfq-total-entity-info.model';
import { RFQ_BUSINESS_PARTNER_CONTRACT_INFO } from './entity-info/rfq-businesspartner-contact-entity-info.model';
import { RFQ_SEND_HISTORY_ENTITY_INFO } from './entity-info/rfq-send-history-enrity-info.model';
import { RFQ_COMMON_SUGGESTED_BIDDERS_INFO } from './entity-info/rfq-suggest-bidders-entity-info.model';
import { PROCUREMENT_RFQ_USER_FORM_ENTITY_INFO } from './entity-info/procurement-rfq-user-form-entity-info.model';
import { RFQ_CHARACTERISTIC_ENTITY_INFO } from './entity-info/rfq-characteristic-entity-info.model';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { ProcurementRfqDocumentProjectDataService } from '../services/procurement-rfq-document-project-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonFeatureKeyManagement, WIZARD_NAME } from '@libs/procurement/common';
import { ProcurementRfqBidderSearchWizard } from '../wizards/bidder-search-wizard.class';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService } from '@libs/basics/shared';
import { ProcurementRfqChangeProjectDocumentRubricCategoryWizardService } from '../wizards/procurement-rfq-change-project-document-rubric-category-wizard.service';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PROCUREMENT_RFQ_DOCUMENT_ENTITY_INFO } from './entity-info/procurement-rfq-document-entity-info.model';
import { RFQ_MEETING_ENTITY_INFO } from './entity-info/rfq-meeting-entity-info.model';
import { RFQ_STATUS_HISTORY_ENTITY_INFO } from './entity-info/procurement-rfq-status-history-entity-info.model';
import { PROCUREMENT_RFQ_EVENT_ENTITY_INFO } from './entity-info/procurement-rfq-event-entity-info.model';
import { PROCUREMENT_RFQ_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/procurement-rfq-pin-board-container-info.model';
import { PROCUREMENT_RFQ_EXT_BIDDER_ENTITY_INFO } from './entity-info/procurement-rfq-extbidder-entity-info.model';
import { ProcurementRfqChangeDocumentStatusWizardService } from '../wizards/procurement-rfq-change-document-status-wizard.service';
import { ProcurementRfqEnhancedBidderSearchWizardService } from '../wizards/procurement-rfq-enhanced-bidder-search-wizard.service';

/**
 * The module info object for the `procurement.rfq` content module.
 */
export class ProcurementRfqModuleInfo extends BusinessModuleInfoBase {
	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static readonly instance = new ProcurementRfqModuleInfo();
	private readonly procurementRfqDocumentProjectEntityInfo = DocumentProjectEntityInfoService.create<IRfqHeaderEntity>(this.internalPascalCasedModuleName, ProcurementRfqDocumentProjectDataService);

	private constructor() {
		super();
	}
	private ChangeProcurementDocumentStatusWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const changeDocumentStatusKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.changeProcurementDocumentStatus);
		if (!this.featureRegistry.hasFeature(changeDocumentStatusKey)) {
			this.featureRegistry.registerFeature(changeDocumentStatusKey, () => {
				return injector.get(ProcurementRfqChangeDocumentStatusWizardService);
			});
		}
	}

	private enhanceBidderSearchWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const enhanceBidderSearchKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.enhanceBidderSearch);
		if (!this.featureRegistry.hasFeature(enhanceBidderSearchKey)) {
			this.featureRegistry.registerFeature(enhanceBidderSearchKey, () => {
				return injector.get(ProcurementRfqEnhancedBidderSearchWizardService);
			});
		}
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		this.ChangeProcurementDocumentStatusWizard(injector);
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		this.featureRegistry.registerFeature(featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.bidderSearch), () => {
			return new ProcurementRfqBidderSearchWizard();
		});

		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, ProcurementRfqChangeProjectDocumentRubricCategoryWizardService);
		const bidderKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.bidderSearch);
		if (!this.featureRegistry.hasFeature(bidderKey)) {
			this.featureRegistry.registerFeature(bidderKey, () => {
				return new ProcurementRfqBidderSearchWizard();
			});
		}

		this.enhanceBidderSearchWizard(injector);
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'procurement.rfq';
	}

	/**
     * Returns the unique internal module name in PascalCase.
     * */
    public override get internalPascalCasedModuleName(){
        return 'Procurement.Rfq';
    }

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			RFQ_ENTITY_INFO,
			RFQ_BUSINESS_PARTNER_ENTITY_INFO,
			RFQ_REQUISITION_ENTITY_INFO,
			RFQ_TOTAL_ENTITY_INFO,
			RFQ_BUSINESS_PARTNER_CONTRACT_INFO,
			RFQ_SEND_HISTORY_ENTITY_INFO,
			RFQ_COMMON_SUGGESTED_BIDDERS_INFO,
			PROCUREMENT_RFQ_DOCUMENT_ENTITY_INFO,
			RFQ_CHARACTERISTIC_ENTITY_INFO,
			PROCUREMENT_RFQ_USER_FORM_ENTITY_INFO,
			RFQ_CHARACTERISTIC_ENTITY_INFO,
			...this.procurementRfqDocumentProjectEntityInfo,
			RFQ_MEETING_ENTITY_INFO,
			RFQ_STATUS_HISTORY_ENTITY_INFO,
			PROCUREMENT_RFQ_EVENT_ENTITY_INFO,
			PROCUREMENT_RFQ_EXT_BIDDER_ENTITY_INFO
		];
	}

	/**
	 * Returns translations ids that should be loaded during module navigation.
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['procurement.common', 'procurement.package', 'businesspartner.main', 'businesspartner.contact', 'cloud.common', 'basics.characteristic','documents.shared', 'basics.procurementstructure', 'basics.meeting','boq.main', 'procurement.quote','businesspartner.certificate']);
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: '912c754c0082eef903514d25b94c1b75'
			}),
			PROCUREMENT_RFQ_PIN_BOARD_CONTAINER_DEFINITION,
		]);
	}

}
