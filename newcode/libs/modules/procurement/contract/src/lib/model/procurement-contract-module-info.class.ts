/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import {
	PrcModuleInfoBase,
	ProcurementCommonCertificateEntityInfo,
	ProcurementCommonDocumentEntityInfo,
	ProcurementCommonItemInfoBlEntityInfo,
	ProcurementCommonMileStoneEntityInfo,
	ProcurementCommonOverviewEntityInfo,
	ProcurementCommonDeliveryscheduleEntityInfo, ProcurementCommonFeatureKeyManagement, WIZARD_NAME
} from '@libs/procurement/common';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { ProcurementContractDocumentProjectDataService } from '../services/procurement-contract-document-project-data.service';
import { PROCUREMENT_CONTRACT_ENTITY_INFO, PROCUREMENT_CONTRACT_ITEM_ENTITY_INFO, PROCUREMENT_CONTRACT_ITEM_SCOPE_ENTITY_INFO_SERIES } from './entity-info';
import { ProcurementInternalModule, ProcurementModule } from '@libs/procurement/shared';
import { PROCUREMENT_CONTRACT_BOQ_ENTITY_INFO } from './entity-info/procurement-contract-boq-entity-info.model';
import { BoqMainModuleInfo, BoqSplitQuantityDataService } from '@libs/boq/main';
import { ProcurementContractBoqItemDataService } from '../services/procurement-contract-boq-item-data.service';
import { ProcurementContractItemInfoBlDataService } from '../services/procurement-contract-item-info-bl-data.service';
import { ProcurementContractDocumentDataService } from '../services/procurement-contract-document-data.service';
import { ProcurementContractMileStoneDataService } from '../services/procurement-contract-mile-stone-data.service';
import { BasicsSharedBillingSchemaEntityInfo } from '@libs/basics/shared';
import { ProcurementContractCertificateDataService } from '../services/procurement-contract-certificate-data.service';
import { ProcurementContractOverviewDataService } from '../services/procurement-contract-overview-data.service';
import { ProcurementContractBillingSchemaBehavior } from '../behaviors/procurement-contract-billing-schema-behavior.service';
import { ProcurementContractBillingSchemaDataService } from '../services/procurement-contract-billing-schema-data.service';
import { ProcurementContractDeliveryScheduleDataService } from '../services/procurement-contract-deliveryschedule-data.service';
import { PROCUREMENT_CONTRACT_CHARACTERISTIC_ENTITY_INFO } from './entity-info/procurement-contract-characteristic-entity-info.model';
import { PROCUREMENT_CONTRACT_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/procurement-contract-characteristic2-entity-info.model';
import { PROCUREMENT_CONTRACT_CREW_ENTITY_INFO } from './entity-info/procurement-contract-crew-entity-info.model';
import { PROCUREMENT_CONTRACT_USER_FORM_ENTITY_INFO } from './entity-info/procurement-contract-user-form-entity-info.model';
import { IConHeaderEntity } from './entities';
import { PROCUREMENT_CONTRACT_SUBCONTRACTOR_ENTITY_INFO } from './entity-info/procurement-contract-subcontractor-entity-info.model';
import { PROCUREMENT_CONTRACT_WARRANTY_ENTITY_INFO } from './entity-info/procurement-contract-warranty-entity-info.model';
import { PROCUREMENT_CONTRACT_CONTACT_ENTITY_INFO } from './entity-info/procurement-contract-contact-entity-info.model';
import { PROCUREMENT_CONTRACT_CONTROLLING_GROUP_SET_ENTITY_INFO } from './entity-info/procurement-contract-controlling-group-set-entity-info.model';
import { PROCUREMENT_CONTRACT_TRANSACTION_ENTITY_INFO } from './entity-info/procurement-contract-transaction-entity-info.model';
import { PROCUREMENT_CONTRACT_ACCOUNT_ASSIGNMENT_ENTITY_INFO } from './entity-info/procurement-contract-account-assignment-entity-info.model';
import { PROCUREMENT_CONTRACT_PRICE_CONDITION_ENTITY_INFO } from './entity-info/procurement-contract-price-condition-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { PROCUREMENT_CONTRACT_CLERK_ENTITY_INFO } from './entity-info/procurement-contract-clerk-entity-info.model';
import { PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_ENTITY_INFO } from './entity-info/procurement-contract-payment-schedule-entity-info.model';
import { PROCUREMENT_CONTRACT_ACTUAL_CERTIFICATE_ENTITY_INFO } from './entity-info/procurement-contract-actual-certificate-entity-info.model';
import { PROCUREMENT_CONTRACT_CALL_OFF_AGREEMENT_ENTITY_INFO } from './entity-info/procurement-contract-call-off-agreement-entity-info.model';
import { PROCUREMENT_CONTRACT_MANDATORY_DEADLINE_ENTITY_INFO } from './procurement-contract-mandatory-deadline-entity-info.model';
import { PROCUREMENT_CONTRACT_PROJECT_CHANGE_ENTITY_INFO } from './entity-info/procurement-contract-project-change-entity-info.model';
import { PROCUREMENT_CONTRACT_ADVANCE_ENTITY_INFO } from './entity-info/procurement-contract-advance-entity-info.model';
import { PROCUREMENT_CONTRACT_CALL_OFFS_ENTITY_INFO } from './entity-info/procurement-contract-call-offs-entity-info.model';
import { PROCUREMENT_CONTRACT_POST_CON_HISTORY_ENTITY_INFO } from './entity-info/procurement-contract-postcon-history-entity-info.model';
import { PROCUREMENT_CONTRACT_EVENTS_ENTITY_INFO } from './entity-info/procurement-contract-event-entity-info.model';
import { PROCUREMENT_CONTRACT_GENERALS_ENTITY_INFO } from './entity-info/procurement-contract-generals-entity-info.model';
import { PROCUREMENT_CONTRACT_MASTER_RESTRICTION_ENTITY_INFO } from './entity-info/procurement-contract-master-restriction-entity-info.model';
import { PROCUREMENT_CONTRACT_ITEMINFO_BL_SPECIFICATION_PLAIN_ENTITY_INFO } from './entity-info/procurement-contract-item-info-bl-specification-plain-entity-info.model';
import { Injector } from '@angular/core';
import {
	ProcurementContractBoqExcelImportWizardService,
	ProcurementContractBoqExcelExportWizardService,
	ProcurementContractBoqUpdateWizardService,
	ProcurementContractRenumberFreeBoqWizardService,
	ProcurementContractRenumberBoqWizardService,
	ProcurementContractGaebExportWizardService,
	ProcurementContractGaebImportWizardService,
	ProcurementContractCrbSiaImportWizardService,
	ProcurementContractCrbSiaExportWizardService,
	ProcurementContractImportOenOnlvWizardService,
	ProcurementContractExportOenOnlvWizardService
} from '../wizards/procurement-contract-boq-wizard.service';
import { PRC_CONTRACT_APPROVER_ENTITY_INFO } from './entity-info/procurement-contract-approver-entity-info.model';
import { ProcurementContractSetBaseAltItemWizardService } from '../wizards/procurement-contract-set-base-alt-item-wizard.service';
import { ProcurementContractGenerateDeliveryScheduleWizardService } from '../wizards/procurement-contract-generate-delivery-schedule-wizard.service';
import { ProcurementContractSplitOverallDiscountWizardService } from '../wizards/procurement-contract-split-overall-discount-wizard.service';
import { BoqWizardRegisterService } from '@libs/boq/interfaces';
import { PROCUREMENT_CONTRACT_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/procurement-contract-pin-board-container-info.model';
import { ProcurementContractUpdateItemPriceWizardService } from '../wizards/procurement-contract-update-item-price-wizard.service';
import { ProcurementContractChangeDocumentStatusWizardService } from '../wizards/procument-contract-change-document-status-wizard.service';
import { ProcurementContractReplaceNeutralMaterialWizardService } from '../wizards/procurement-contract-replace-neutral-material-wizard.service';
import { PROCUREMENT_CONTRACT_TOTAL_ENTITY_INFO } from './entity-info/procurement-contract-total-entity-info.model';

/**
 * Contract module info.
 */
export class ProcurementContractModuleInfo extends PrcModuleInfoBase {
	public static readonly instance = new ProcurementContractModuleInfo();

	public constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return ProcurementInternalModule.Contract;
	}

	/**
	 * Returns the module identifier in PascalCase.
	 */
	public override get internalPascalCasedModuleName(): string {
		return ProcurementModule.Contract;
	}

	private SplitAllOverDiscountWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const generateDiliveryScheduleKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.splitAllOverDiscount);
		if (!this.featureRegistry.hasFeature(generateDiliveryScheduleKey)) {
			this.featureRegistry.registerFeature(generateDiliveryScheduleKey, () => {
				return injector.get(ProcurementContractSplitOverallDiscountWizardService);
			});
		}
	}

	private SetBaseAltItemWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const selectPrcItemGroupsKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.selectPrcItemGroups);
		if (!this.featureRegistry.hasFeature(selectPrcItemGroupsKey)) {
			this.featureRegistry.registerFeature(selectPrcItemGroupsKey, () => {
				return injector.get(ProcurementContractSetBaseAltItemWizardService);
			});
		}
	}

	private GenerateDiliveryScheduleWizard(injector: Injector) {
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const generateDiliveryScheduleKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.generateDiliverySchedule);
		if (!this.featureRegistry.hasFeature(generateDiliveryScheduleKey)) {
			this.featureRegistry.registerFeature(generateDiliveryScheduleKey, () => {
				return injector.get(ProcurementContractGenerateDeliveryScheduleWizardService);
			});
		}
	}

	private UpdateItemPriceWizard(injector: Injector){
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const updateItemPriceKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.updateItemPrice);
		if (!this.featureRegistry.hasFeature(updateItemPriceKey)) {
			this.featureRegistry.registerFeature(updateItemPriceKey, () => {
				return injector.get(ProcurementContractUpdateItemPriceWizardService);
			});
		}
	}

	private chnageProcumentDocumentStatusWizard(injector: Injector){
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const changeDocumentStatusKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.changeProcurementDocumentStatus);
		if (!this.featureRegistry.hasFeature(changeDocumentStatusKey)) {
			this.featureRegistry.registerFeature(changeDocumentStatusKey, () => {
				return injector.get(ProcurementContractChangeDocumentStatusWizardService);
			});
		}
	}

	private replaceNeutralMaterialWizard(injector: Injector){
		const featureKeyManagement = injector.get(ProcurementCommonFeatureKeyManagement);
		const replaceNeutralMaterialKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, WIZARD_NAME.replaceNeutralMaterial);
		if (!this.featureRegistry.hasFeature(replaceNeutralMaterialKey)) {
			this.featureRegistry.registerFeature(replaceNeutralMaterialKey, () => {
				return injector.get(ProcurementContractReplaceNeutralMaterialWizardService);
			});
		}
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		this.SplitAllOverDiscountWizard(injector);
		this.GenerateDiliveryScheduleWizard(injector);
		this.SetBaseAltItemWizard(injector);
		this.UpdateItemPriceWizard(injector);
		this.replaceNeutralMaterialWizard(injector);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractBoqUpdateWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractBoqExcelImportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractBoqExcelExportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractRenumberFreeBoqWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractRenumberBoqWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractGaebExportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractGaebImportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractCrbSiaImportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractCrbSiaExportWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractImportOenOnlvWizardService);
		injector.get(BoqWizardRegisterService).registerFeature(injector, this.featureRegistry, this.internalModuleName, ProcurementContractExportOenOnlvWizardService);
		this.chnageProcumentDocumentStatusWizard(injector);
	}

	public override get entities(): EntityInfo[] {
		return [
			PROCUREMENT_CONTRACT_ENTITY_INFO,
			PROCUREMENT_CONTRACT_USER_FORM_ENTITY_INFO,
			PRC_CONTRACT_APPROVER_ENTITY_INFO,
			PROCUREMENT_CONTRACT_ITEM_ENTITY_INFO,
			...PROCUREMENT_CONTRACT_ITEM_SCOPE_ENTITY_INFO_SERIES,
			PROCUREMENT_CONTRACT_TOTAL_ENTITY_INFO,
			PROCUREMENT_CONTRACT_WARRANTY_ENTITY_INFO,
			...PROCUREMENT_CONTRACT_PRICE_CONDITION_ENTITY_INFO,
			PROCUREMENT_CONTRACT_BOQ_ENTITY_INFO,
			this.boqItemEntityInfo,
			this.boqSplitQuantityEntityInfo,
			...DocumentProjectEntityInfoService.create<IConHeaderEntity>(this.internalPascalCasedModuleName, ProcurementContractDocumentProjectDataService),
			ProcurementCommonItemInfoBlEntityInfo.create({
				permissionUuid: '87aa7026f1704173938cf4ec8d3ce967',
				formUuid: 'd7a5e82de8b24dc1907a6b8c9f07c362',
				dataServiceToken: ProcurementContractItemInfoBlDataService,
			}),
			ProcurementCommonDocumentEntityInfo.create({
				permissionUuid: 'ec2420d04c8d458490c29edbd9b9cafc',
				formUuid: '03b10c1f188f4b219b491f5696c056c6',
				dataServiceToken: ProcurementContractDocumentDataService,
			}),
			ProcurementCommonMileStoneEntityInfo.create({
				permissionUuid: 'e146e86368bf41ff9682b989a9df3291',
				formUuid: '5f9769e2287446eca7bab31fa2badf04',
				dataServiceToken: ProcurementContractMileStoneDataService,
			}),
			ProcurementCommonOverviewEntityInfo.create({
				permissionUuid: '314df1fa485d4d1aa8722a086bd57c70',
				dataServiceToken: ProcurementContractOverviewDataService,
			}),
			ProcurementCommonCertificateEntityInfo.create({
				permissionUuid: '5055ba9ce9c14f78b445a97d74bc8b90',
				formUuid: '2ef9cdb7254c4fb597dd79b86cefa948',
				dataServiceToken: ProcurementContractCertificateDataService,
			}),
			PROCUREMENT_CONTRACT_GENERALS_ENTITY_INFO,
			BasicsSharedBillingSchemaEntityInfo.create({
				permissionUuid: '9f5d33b39555424ba877447f2bfd1269',
				dataServiceToken: ProcurementContractBillingSchemaDataService,
				behavior: ProcurementContractBillingSchemaBehavior,
				projectFkGetter: mainEntity => mainEntity.ProjectFk,
			}),
			PROCUREMENT_CONTRACT_SUBCONTRACTOR_ENTITY_INFO,
			ProcurementCommonDeliveryscheduleEntityInfo.create({
				permissionUuid: '3bc0eafcae734307b5cc0974405ba10f',
				formUuid: '57f7a43edc2d40f198704f06e2b7ad5b',
				dataServiceToken: ProcurementContractDeliveryScheduleDataService,
			}),
			PROCUREMENT_CONTRACT_POST_CON_HISTORY_ENTITY_INFO,
			PROCUREMENT_CONTRACT_CHARACTERISTIC_ENTITY_INFO,
			PROCUREMENT_CONTRACT_CHARACTERISTIC2_ENTITY_INFO,
			PROCUREMENT_CONTRACT_EVENTS_ENTITY_INFO,
			PROCUREMENT_CONTRACT_CREW_ENTITY_INFO,
			PROCUREMENT_CONTRACT_CONTACT_ENTITY_INFO,
			PROCUREMENT_CONTRACT_CONTROLLING_GROUP_SET_ENTITY_INFO,
			PROCUREMENT_CONTRACT_TRANSACTION_ENTITY_INFO,
			PROCUREMENT_CONTRACT_ACCOUNT_ASSIGNMENT_ENTITY_INFO,
			PROCUREMENT_CONTRACT_CLERK_ENTITY_INFO,
			PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_ENTITY_INFO,
			PROCUREMENT_CONTRACT_ACTUAL_CERTIFICATE_ENTITY_INFO,
			PROCUREMENT_CONTRACT_CALL_OFF_AGREEMENT_ENTITY_INFO, PROCUREMENT_CONTRACT_MANDATORY_DEADLINE_ENTITY_INFO,
			PROCUREMENT_CONTRACT_PROJECT_CHANGE_ENTITY_INFO,
			PROCUREMENT_CONTRACT_ADVANCE_ENTITY_INFO,
			PROCUREMENT_CONTRACT_CALL_OFFS_ENTITY_INFO,
			PROCUREMENT_CONTRACT_MASTER_RESTRICTION_ENTITY_INFO,
		];
	}


	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo((ctx) => ctx.injector.get(ProcurementContractBoqItemDataService), 'DC5C6ADCDC2346E09ADADBF5508842DE');
	private readonly boqSplitQuantityEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqSplitQuantityEntityInfo(ctx => ctx.injector.get(BoqSplitQuantityDataService), '0da233bc77f3447db8a0e059b0df8cae', 'DC5C6ADCDC2346E09ADADBF5508842DE');


	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'd7bb075997478318bdbcd9fa1bc92262'
			}),
			PROCUREMENT_CONTRACT_ITEMINFO_BL_SPECIFICATION_PLAIN_ENTITY_INFO,
			PROCUREMENT_CONTRACT_PIN_BOARD_CONTAINER_DEFINITION,
		]);
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'project.main',
			'change.main',
			'basics.procurementconfiguration',
		];
	}
}
