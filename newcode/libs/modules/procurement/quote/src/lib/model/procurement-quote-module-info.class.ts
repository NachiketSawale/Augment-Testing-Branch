/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { QUOTE_HEADER_ENTITY_INFO } from './entity-info/quote-header-entity-info.model';
import { QUOTE_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO } from './entity-info/quote-historical-price-for-item-entity-info.model';
import { PROCUREMENT_QUOTE_USER_FORM_ENTITY_INFO } from './entity-info/procurement-quote-user-form-entity-info.model';
import { PROCUREMENT_QUOTE_ITEM_ENTITY_INFO } from './entity-info/quote-items-entity-info.model';
import { QUOTE_REQUISITION_ENTITY_INFO } from './entity-info/quote-requisitions-entity-info.model';
import { QUOTE_TOTAL_ENTITY_INFO } from './entity-info/quote-total-entity-info.model';
import { PROCUREMENT_QUOTE_CALL_OFF_AGREEMENT_ENTITY_INFO } from './entity-info/quote-call-off-agreement-entity-info.model';
import { PROCUREMENT_QUOTE_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/procurement-quote-characteristics2-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { IQuoteHeaderEntity } from './entities/quote-header-entity.interface';
import { ProcurementQuoteDocumentProjectDataService } from '../services/procurement-quote-document-project-data.service';
import { PROCUREMENT_QUOTE_CHARACTERISTIC_ENTITY_INFO } from './entity-info/procurement-quote-characteristics-entity-info.model';
import { QUOTE_GENERALS_ENTITY_INFO } from './entity-info/quote-generals-entity-info.model';
import { PROCUREMENT_QUOTE_WARRANTY_ENTITY_INFO } from './entity-info/quote-warranty-entity-info.model';
import { PROCUREMENT_QUOTE_ITEM_SCOPE_ENTITY_INFO_SERIES } from './entity-info/quote-item-scope-entity-info-series.model';
import { QUOTE_BILLING_SCHEMA_ENTITY_INFO } from './entity-info/quote-billing-schema-entity-info.model';
import { PROCUREMENT_QUOTE_DOCUMENT_ENTITY_INFO } from './entity-info/procurement-quote-document-entity-info.model';
import { PROCUREMENT_QUOTE_CONTACT_ENTITY_INFO } from './entity-info/quote-contact-entity-info.model';
import { QUOTE_PRICE_CONDITION_ENTITY_INFO } from './entity-info/quote-price-condition-entity-info.model';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService } from '@libs/basics/shared';
import { Injector } from '@angular/core';
import { ProcurementQuoteChangeProjectDocumentRubricCategoryWizardService } from '../services/wizards/quote-change-project-document-rubric-category-wizard.service';
import { QUOTE_MEETING_ENTITY_INFO } from './entity-info/quote-meeting-entity-info.model';
import { PROCUREMENT_QUOTE_OVERVIEW_ENTITY_INFO } from './entity-info/procurement-quote-overview-entity-info.model';
import { PROCUREMENT_QUOTE_EVENT_ENTITY_INFO } from './entity-info/procurement-quote-event-entity-info.model';
import { PROCUREMENT_QUOTE_DELIVERYSCHEDULE_ENTITY_INFO } from './entity-info/procurement-quote-deliveryschedule-entity-info.model';
import { ProcurementCommonFeatureKeyManagement, WIZARD_NAME } from '@libs/procurement/common';
import {
	ProcurementQuoteSplitOverallDiscountWizardService
} from '../services/wizards/quote-split-overall-discount-wizard.service';
import {
	QUOTE_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO
} from './entity-info/procurement-quote-historical-price-for-boq-entity-info.model';
import { PROCUREMENT_QUOTE_MILE_STONE_ENTITY_INFO } from './entity-info/procurement-quote-mile-stone-entity-info.model';
import { PROCUREMENT_QUOTE_RFQ_DOCUMENT_ENTITY_INFO } from './entity-info/procurement-quote-rfq-document-entity-info.model';
import { QUOTE_STATUS_HISTORY_ENTITY_INFO } from './entity-info/procurement-quote-status-history-entity-info.model';
import { PROCUREMENT_QUOTE_EXT_BIDDER_ENTITY_INFO } from './entity-info/procurement-quote-extbidder-entity-info.model';
import { ProcurementQuoteChangeDocumentStatusWizardService } from '../wizards/procurement-quote-change-document-status-wizard.service';
import { PROCUREMENT_QUOTE_BOQ_ENTITY_INFO } from './entity-info/procurement-quote-boq-entity-info.model';
import { BoqMainModuleInfo } from '@libs/boq/main';
import { ProcurementQuoteBoqItemDataService } from '../services/procurement-quote-boq-item-data.service';
import { PROCUREMENT_QUOTE_ACTUAL_CERTIFICATE_ENTITY_INFO } from './entity-info/procurement-quote-actual-certificate-entity-info.model';
import { PROCUREMENT_QUOTE_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/procurement-quote-pin-board-container-info.model';
import { PROCUREMENT_QUOTE_CERTIFICATE_ENTITY_INFO } from './entity-info/procurement-quote-certificate-entity-info.model';
import {
	QUOTE_BUSINESS_PARTNER_EVALUATION_ENTITY_INFO
} from './entity-info/procurement-quote-business-partner-evaluation-entity-info.model';
import { QUOTE_EVALUATION_ENTITY_INFO } from './entity-info/procurement-quote-evalution-entity-info.model';

/**
 * The module info object for the `procurement.quote` content module.
 */
export class ProcurementQuoteModuleInfo extends BusinessModuleInfoBase {
	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static readonly instance = new ProcurementQuoteModuleInfo();

	private readonly procurementQuoteDocumentProjectEntityInfo = DocumentProjectEntityInfoService.create<IQuoteHeaderEntity>(this.internalPascalCasedModuleName, ProcurementQuoteDocumentProjectDataService);

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'procurement.quote';
	}

	private SplitAllOverDiscountWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const generateDiliveryScheduleKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.splitAllOverDiscount);
		if (!this.featureRegistry.hasFeature(generateDiliveryScheduleKey)) {
			this.featureRegistry.registerFeature(generateDiliveryScheduleKey, () => {
				return injector.get(ProcurementQuoteSplitOverallDiscountWizardService);
			});
		}
	}

	private ChangeProcurementDocumentStatusWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const changeDocumentStatusKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.changeProcurementDocumentStatus);
		if (!this.featureRegistry.hasFeature(changeDocumentStatusKey)) {
			this.featureRegistry.registerFeature(changeDocumentStatusKey, () => {
				return injector.get(ProcurementQuoteChangeDocumentStatusWizardService);
			});
		}
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		this.SplitAllOverDiscountWizard(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, ProcurementQuoteChangeProjectDocumentRubricCategoryWizardService);
		this.ChangeProcurementDocumentStatusWizard(injector);
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			QUOTE_HEADER_ENTITY_INFO,
			QUOTE_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO,
			PROCUREMENT_QUOTE_ITEM_ENTITY_INFO,
			QUOTE_REQUISITION_ENTITY_INFO,
			QUOTE_TOTAL_ENTITY_INFO,
			PROCUREMENT_QUOTE_CALL_OFF_AGREEMENT_ENTITY_INFO,
			...this.procurementQuoteDocumentProjectEntityInfo,
			PROCUREMENT_QUOTE_CHARACTERISTIC2_ENTITY_INFO,
			PROCUREMENT_QUOTE_USER_FORM_ENTITY_INFO,
			PROCUREMENT_QUOTE_CHARACTERISTIC_ENTITY_INFO,
			QUOTE_GENERALS_ENTITY_INFO,
			PROCUREMENT_QUOTE_WARRANTY_ENTITY_INFO,
			...PROCUREMENT_QUOTE_ITEM_SCOPE_ENTITY_INFO_SERIES,
			QUOTE_BILLING_SCHEMA_ENTITY_INFO,
			PROCUREMENT_QUOTE_DOCUMENT_ENTITY_INFO,
			PROCUREMENT_QUOTE_CONTACT_ENTITY_INFO,
			...QUOTE_PRICE_CONDITION_ENTITY_INFO,
			QUOTE_MEETING_ENTITY_INFO,
			PROCUREMENT_QUOTE_OVERVIEW_ENTITY_INFO,
			PROCUREMENT_QUOTE_EVENT_ENTITY_INFO,
			PROCUREMENT_QUOTE_DELIVERYSCHEDULE_ENTITY_INFO,
			QUOTE_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO,
			PROCUREMENT_QUOTE_MILE_STONE_ENTITY_INFO,
			PROCUREMENT_QUOTE_RFQ_DOCUMENT_ENTITY_INFO,
			QUOTE_STATUS_HISTORY_ENTITY_INFO,
			PROCUREMENT_QUOTE_EXT_BIDDER_ENTITY_INFO,
			PROCUREMENT_QUOTE_BOQ_ENTITY_INFO,
			this.boqItemEntityInfo,
			PROCUREMENT_QUOTE_ACTUAL_CERTIFICATE_ENTITY_INFO,
			PROCUREMENT_QUOTE_CERTIFICATE_ENTITY_INFO,
			QUOTE_BUSINESS_PARTNER_EVALUATION_ENTITY_INFO,
			QUOTE_EVALUATION_ENTITY_INFO,
		];
	}

	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo((ctx) => ctx.injector.get(ProcurementQuoteBoqItemDataService), '58D71F3079C9450D9723FC7194E433C2');

	/**
	 * @brief Gets the container definitions, including the PDFViewver container configuration.
	 * This method overrides the base class implementation to include a new container definition
	 * @return An array of ContainerDefinition objects including the PDFViewver container configuration.
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: '72556af28fb455f21be8e3ccfa3f02dc',
			}),
			PROCUREMENT_QUOTE_PIN_BOARD_CONTAINER_DEFINITION,
		]);
	}


	/**
	 * Returns the translation container UUID for the procurement quote module.
	 */
    protected override get translationContainer(): string | undefined {
		return '229b0c6628ce4673bc35ed4f5e8d5260';
	}
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'basics.common',
			'procurement.common',
			'businesspartner.main',
			'procurement.rfq',
			'procurement.package',
			'businesspartner.certificate',
			'basics.shared',
			'cloud.common',
			'basics.material',
		    'documents.shared',
			'basics.procurementstructure',
			'documents.shared',
			'basics.meeting',
			'boq.main']);
	}
}
