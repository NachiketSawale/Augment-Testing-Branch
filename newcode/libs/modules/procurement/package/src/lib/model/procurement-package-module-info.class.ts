/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PROCUREMENT_PACKAGE_HEADER_ENTITY_INFO } from './entity-info/package-header-entity-info.model';
import { PACKAGE_2HEADER_INFO } from './entity-info/package-2header-entity-info.model';
import { PrcModuleInfoBase, ProcurementCommonFeatureKeyManagement, WIZARD_NAME } from '@libs/procurement/common';
import { PROCUREMENT_PACKAGE_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/procurement-package-characteristic2-entity-info.model';
import { Injector } from '@angular/core';
import { ProcurementPackageBidderSearchWizard } from './wizards/bidder-search-wizard.class';
import { PROCUREMENT_PACKAGE_FORM_DATA_ENTITY_INFO } from './entity-info/procurement-package-form-data-entity-info.model';
import { PROCUREMENT_PACKAGE_DOCUMENT_ENTITY_INFO } from './entity-info/package-document-entity-info.model';
import { PROCUREMENT_PACKAGE_CLERK_ENTITY_INFO } from './entity-info/procurement-package-clerk-entity-info.model';
import { PROCUREMENT_PACKAGE_EST_HEADER_ENTITY_INFO } from './entity-info/package-est-header-entity-info.model';
import { PROCUREMENT_PACKAGE_ITEM_ENTITY_INFO } from './entity-info/procurement-package-item-entity-info.model';
import { PACKAGE_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO } from './entity-info/procurement-package-historical-price-for-boq-entity-info.model';
import { PROCUREMENT_PACKAGE_PAYMENT_SCHEDULE_ENTITY_INFO } from './entity-info/procurement-package-payment-schedule-entity-info.model';
import { PACKAGE_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO } from './entity-info/procurement-package-historical-price-for-item-entity-info.model';
import { PACKAGE_IMPORT_INFO } from './entity-info/package-import-entity-info.model';
import { PROCUREMENT_PACKAGE_DELIVERY_SCHEDULE_ENTITY_INFO } from './entity-info/procurement-package-delivery-schedule-entity-info.model';
import { PROCUREMENT_PACKAGE_OVERVIEW_ENTITY_INFO } from './entity-info/procurement-package-overview-entity-info.model';
import { PROCUREMENT_Package_EVENT_ENTITY_INFO } from './entity-info/procurement-package-event-entity-info.model';
import { PROCUREMENT_PACKAGE_TOTAL_ENTITY_INFO } from './entity-info/package-total-entity-info.model';
import { PROCUREMENT_PACKAGE_ITEM_ASSIGNMENT_ENTITY_INFO } from './entity-info/item-assignment-entity-info.model';
import { PROCUREMENT_PACKAGE_WARRANTY_ENTITY_INFO } from './entity-info/package-warranty-entity-info.model';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService } from '@libs/basics/shared';
import { ProcurementPackageChangeProjectDocumentRubricCategoryWizardService } from '../wizards/procurement-package-change-project-document-rubric-category-wizard.service';
import { ProcurementPackageDocumentProjectDataService } from '../services/procurement-package-document-project-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { PROCUREMENT_PACKAGE_BASELINE_ITEM_ENTITY_INFO } from './entity-info/procurement-package-baseline-item-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PROCUREMENT_PACKAGE_CASH_FLOW_ENTITY_INFO } from './entity-info/procurement-package-cash-flow-entity-info.model';
import { PACKAGE_PRICE_CONDITION_ENTITY_INFO } from './entity-info/package-price-condition-entity-info.model';
import { PROCUREMENT_PACKAGE_PDF_VIEWER_ENTITY_INFO } from './entity-info/pdf-viewer-entity-info.model';
import { PROCUREMENT_PACKAGE_ITEMINFO_BL_SPECIFICATION_PLAIN_ENTITY_INFO } from './entity-info/procurement-package-item-info-bl-specification-plain-entity-info.model';
import { PROCUREMENT_PACKAGE_MASTER_RESTRICTION_ENTITY_INFO } from './entity-info/master-restriction-entity-info.model';
import { PROCUREMENT_PACKAGE_ESTIMATE_LINE_ITEM_ENTITY_INFO } from './entity-info/package-estimate-line-item-entity-info.model';
import { PROCUREMENT_PACKAGE_ESTIMATE_RESOURCE_ENTITY_INFO } from './entity-info/package-estimate-resource-entity-info.model';
import { PROCUREMENT_PACKAGE_CONTROLLING_GROUP_SET_ENTITY_INFO } from './entity-info/procurement-package-controlling-group-set-entity-info.model';
import { PROCUREMENT_PACKAGE_STATUS_HISTORY_ENTITY_INFO } from './entity-info/procurement-package-status-history-entity-info.model';
import { PROCUREMENT_PACKAGE_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/package-pin-board-container-info.model';
import { ProcurementPackageGenerateDeliveryScheduleWizardService } from '../wizards/procurement-package-generate-delivery-schedule-wizard.service';
import { ProcurementPackageSplitOverallDiscountWizardService } from '../wizards/procurement-package-split-overall-discount-wizard.service';
import { PROCUREMENT_PACKAGE_GENERALS_ENTITY_INFO } from './entity-info/procurement-package-generals-entity-info.model';
import { PROCUREMENT_PACKAGE_MILE_STONE_ENTITY_INFO } from './entity-info/procurement-package-mile-stone-entity-info.model';
import { PROCUREMENT_PACKAGE_SUBCONTRACTOR_ENTITY_INFO } from './entity-info/procurement-package-subcontractor-entity-info.model';
import { ProcurementPackageEnhancedBidderSearchWizardService, ProcurementPackageUpdateItemPriceWizardService, ProcurementPackageReplaceNeutralMaterialWizardService } from '../wizards';
import { PROCUREMENT_PACKAGE_CERTIFICATE_ENTITY_INFO } from './entity-info/procurement-package-certificate-entity-info.model';
import { PROCUREMENT_PACKAGE_EXT_BIDDER_ENTITY_INFO } from './entity-info/procurement-package-extbidder-entity-info.model';
import { PROCUREMENT_PACKAGE_BOQ_ENTITY_INFO } from './entity-info/procurement-package-boq-entity-info.model';
import { BoqMainModuleInfo } from '@libs/boq/main';
import { ProcurementPackageBoqItemDataService } from '../services/procurement-package-boq-item-data.service';

/**
 * The module info object for the `procurement.package` content module.
 */
export class ProcurementPackageModuleInfo extends PrcModuleInfoBase {
	private static _instance?: ProcurementPackageModuleInfo;
	private readonly prcPackageDocumentProjectEntityInfo = DocumentProjectEntityInfoService.create<IPrcPackageEntity>(this.internalPascalCasedModuleName, ProcurementPackageDocumentProjectDataService);

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProcurementPackageModuleInfo {
		if (!this._instance) {
			this._instance = new ProcurementPackageModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	private SplitAllOverDiscountWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const generateDiliveryScheduleKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.splitAllOverDiscount);
		if (!this.featureRegistry.hasFeature(generateDiliveryScheduleKey)) {
			this.featureRegistry.registerFeature(generateDiliveryScheduleKey, () => {
				return injector.get(ProcurementPackageSplitOverallDiscountWizardService);
			});
		}
	}
	private GenerateDiliveryScheduleWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const generateDiliveryScheduleKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.generateDiliverySchedule);
		if (!this.featureRegistry.hasFeature(generateDiliveryScheduleKey)) {
			this.featureRegistry.registerFeature(generateDiliveryScheduleKey, () => {
				return injector.get(ProcurementPackageGenerateDeliveryScheduleWizardService);
			});
		}
	}

	private UpdateItemPriceWizard(injector: Injector){
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const updateItemPriceKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.updateItemPrice);
		if (!this.featureRegistry.hasFeature(updateItemPriceKey)) {
			this.featureRegistry.registerFeature(updateItemPriceKey, () => {
				return injector.get(ProcurementPackageUpdateItemPriceWizardService);
			});
		}
	}

	private enhanceBidderSearchWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const enhanceBidderSearchKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.enhanceBidderSearch);
		if (!this.featureRegistry.hasFeature(enhanceBidderSearchKey)) {
			this.featureRegistry.registerFeature(enhanceBidderSearchKey, () => {
				return injector.get(ProcurementPackageEnhancedBidderSearchWizardService);
			});
		}
	}


	private replaceNeutralMaterialWizard(injector: Injector){
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const replaceNeutralMaterialKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.replaceNeutralMaterial);
		if (!this.featureRegistry.hasFeature(replaceNeutralMaterialKey)) {
			this.featureRegistry.registerFeature(replaceNeutralMaterialKey, () => {
				return injector.get(ProcurementPackageReplaceNeutralMaterialWizardService);
			});
		}
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		this.SplitAllOverDiscountWizard(injector);
		this.GenerateDiliveryScheduleWizard(injector);
		this.UpdateItemPriceWizard(injector);
		this.replaceNeutralMaterialWizard(injector);
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const bidderKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.bidderSearch);
		if (!this.featureRegistry.hasFeature(bidderKey)) {
			this.featureRegistry.registerFeature(bidderKey, () => {
				return new ProcurementPackageBidderSearchWizard();
			});
		}

		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, ProcurementPackageChangeProjectDocumentRubricCategoryWizardService);
		this.enhanceBidderSearchWizard(injector);
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'procurement.package';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Procurement.Package';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			PROCUREMENT_PACKAGE_HEADER_ENTITY_INFO,
			PACKAGE_2HEADER_INFO,
			PROCUREMENT_PACKAGE_DOCUMENT_ENTITY_INFO,
			PROCUREMENT_PACKAGE_CHARACTERISTIC2_ENTITY_INFO,
			PROCUREMENT_PACKAGE_FORM_DATA_ENTITY_INFO,
			PROCUREMENT_PACKAGE_CLERK_ENTITY_INFO,
			PROCUREMENT_PACKAGE_EST_HEADER_ENTITY_INFO,
			PACKAGE_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO,
			PACKAGE_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO,
			PROCUREMENT_PACKAGE_OVERVIEW_ENTITY_INFO,
			PROCUREMENT_Package_EVENT_ENTITY_INFO,
			PROCUREMENT_PACKAGE_CASH_FLOW_ENTITY_INFO,
			PROCUREMENT_PACKAGE_PAYMENT_SCHEDULE_ENTITY_INFO,
			PROCUREMENT_PACKAGE_DELIVERY_SCHEDULE_ENTITY_INFO,
			PACKAGE_IMPORT_INFO,
			PROCUREMENT_PACKAGE_TOTAL_ENTITY_INFO,
			PROCUREMENT_PACKAGE_ITEM_ASSIGNMENT_ENTITY_INFO,
			PROCUREMENT_PACKAGE_WARRANTY_ENTITY_INFO,
			PROCUREMENT_PACKAGE_ITEM_ENTITY_INFO,
			...this.prcPackageDocumentProjectEntityInfo,
			PROCUREMENT_PACKAGE_BASELINE_ITEM_ENTITY_INFO,
			...PACKAGE_PRICE_CONDITION_ENTITY_INFO,
			PROCUREMENT_PACKAGE_MASTER_RESTRICTION_ENTITY_INFO,
			PROCUREMENT_PACKAGE_ESTIMATE_LINE_ITEM_ENTITY_INFO,
			PROCUREMENT_PACKAGE_ESTIMATE_RESOURCE_ENTITY_INFO,
			PROCUREMENT_PACKAGE_CONTROLLING_GROUP_SET_ENTITY_INFO,
			PROCUREMENT_PACKAGE_STATUS_HISTORY_ENTITY_INFO,
			PROCUREMENT_PACKAGE_GENERALS_ENTITY_INFO,
			PROCUREMENT_PACKAGE_MILE_STONE_ENTITY_INFO,
			PROCUREMENT_PACKAGE_SUBCONTRACTOR_ENTITY_INFO,
			PROCUREMENT_PACKAGE_CERTIFICATE_ENTITY_INFO,
			PROCUREMENT_PACKAGE_EXT_BIDDER_ENTITY_INFO,
			PROCUREMENT_PACKAGE_BOQ_ENTITY_INFO,
			this.boqItemEntityInfo,
		];
	}

	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo((ctx) => ctx.injector.get(ProcurementPackageBoqItemDataService), '29633DBCE00E41C4B494F867D7699EA5');

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([PROCUREMENT_PACKAGE_PDF_VIEWER_ENTITY_INFO, PROCUREMENT_PACKAGE_ITEMINFO_BL_SPECIFICATION_PLAIN_ENTITY_INFO, PROCUREMENT_PACKAGE_PIN_BOARD_CONTAINER_DEFINITION]);
	}
	/**
	 * Loads the translation file used for business partner main
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['estimate.main', 'project.main', 'basics.procurementconfiguration', 'basics.characteristic', 'procurement.contract', 'estimate.rule', 'estimate.parameter', 'estimate.assemblies']);
	}

	/**
	 * Returns the translation container UUID for the procurement package module.
	 */
	protected override get translationContainer(): string | undefined {
		return 'ea03e9e9be03455f9fa73bbf35f7ef2a';
	}
}
