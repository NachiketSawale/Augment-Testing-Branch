/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityContainerInjectionTokens, EntityInfo } from '@libs/ui/business-base';
import { BusinessPartnerCommonFeatureKeyManagement, MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';

import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService, BasicsSharedChangeCertificateStatusWizardRegisterService, BasicsSharedPhotoEntityViewerComponent, PHOTO_ENTITY_VIEWER_OPTION_TOKEN } from '@libs/basics/shared';

import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { BusinesspartnerMainPhotoDataService } from '../services/photo-data.service';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { BusinessPartnerMainDocumentProjectDataService } from '../services/businesspartner-main-document-project-data.service';
import { BUSINESS_PARTNER_ENTITY_INFO } from './entity-info/businesspartner-entity-info.model';
import { SUPPLIER_ENTITY_INFO } from './entity-info/suppiler-entity-info.model';
import { GUARANTOR_INFO_ENTITY } from './entity-info/guarantor-entity-info.model';
import { GUARANTEE_USED_INFO_ENTITY } from './entity-info/guarantee-used-entity-info.model';
import { SUBSIDIARY_INFO_ENTITY } from './entity-info/subsidiary-entity-info.model';
import { BUSINESSPARTNER_PRCSTRUCTURE_INFO_ENTITY } from './entity-info/businesspartner-prc-structure-entity-info.model';
import { BUSINESS_PARTNER_BANK_ENTITY_INFO } from './entity-info/businesspartner-bank-entity-info.model';
import { RELATION_ENTITY_INFO } from './entity-info/relation-entity-info.model';
import { CUSTOMER_ENTITY_INFO } from './entity-info/customer-entity-info.model';
import { BP_MAIN_CONTACT_PHOTO_CONTAINER_INFO } from './entity-info/contact-photo-container-info.model';
import { GENERALS_ENTITY_INFO } from './entity-info/generals-entity-info.model';
import { ACTIVITY_ENTITY_INFO } from './entity-info/activity-entity-info.model';
import { AGREEMENT_ENTITY_INFO } from './entity-info/agreement-entity-info.model';
import { BP2CONTROLLING_GROUP_ENTITY_INFO } from './entity-info/bp2controlling-group-entity-info.model';
import { BUSINESSPARTNER_2EXTROLE_ENTITY } from './entity-info/businesspartner-2extrole-entity-info.model';
import { UPDATE_REQUEST_ENTITY_INFO } from './entity-info/update-request-entity-info.model';
import { BUSINESSPARTNER_2EXTERNAL_ENTITY } from './entity-info/businesspartner-2external-entity-info.model';
import { BP_MAIN_CERTIFICATE_ENTITY_INFO } from './entity-info/certificate-entity-info.model';
import { COMMUNITY_ENTITY } from './entity-info/community-entity-info.model';
import { BP_USER_FORM_ENTITY_INFO } from './entity-info/businesspartner-user-form-entity-info.model';
import { CONTACT_USER_FORM_ENTITY_INFO } from './entity-info/contact-user-form-entity-info.model';
import { BUSINESSPARTNER_2COMPANY_ENTITY } from './entity-info/businesspartner-2company-entity-info.model';
import { BUSINESS_PARTNER_CHARACTERISTIC_ENTITY_INFO } from './entity-info/businesspartner-characteristic-entity-info.model';
import { BUSINESS_PARTNER_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/businesspartner-characteristic2-entity-info.model';
import { BUSINESS_PARTNER_CONTRACT_INFO } from './entity-info/businesspartner-contract-info.model';
import { REALESTATE_ENTITY_INFO } from './entity-info/realestate-entity-info.model';
import { BP_MAIN_SYNCHRONISE_CONTACTS_CONTAINER_INFO } from './entity-info/synchronise-contacts-to-exchange-server-container-info.model';
import { EVALUATION_ENTITY_INFO } from './entity-info/evaluation-entity-info.model';
import { BUSINESS_PARTNER_CERTIFICATE_CHARACTERISTIC_ENTITY_INFO } from './entity-info/businesspartner-certificate-characteristic-entity-info.model';
import { BUSINESS_PARTNER_CONTACT_CHARACTERISTIC_ENTITY_INFO } from './entity-info/businesspartner-contact-characteristic-entity-info.model';
import { Injector } from '@angular/core';
import { BPMainChangeProjectDocumentRubricCategoryWizardService } from '../services/wizards/change-project-document-rubric-category-wizard.service';
import { CUSTOMER_OPEN_ITEMS_ENTITY_INFO } from './entity-info/customer-open-items-entity-info.model';
import { SUPPLIER_OPEN_ITEMS_ENTITY_INFO } from './entity-info/supplier-open-items-entity-info.model';
import { CUSTOMER_SATISFACTION_INFO } from './entity-info/customer-satisfaction-info.model';
import { BUSINESS_PARTNER_CLERK_ENTITY_INFO } from './entity-info/businesspartner-clerk-entity-info.model';
import { BUSINESS_PARTNER_CONTACT_CLERK_ENTITY_INFO } from './entity-info/businesspartner-contact-clerk-entity-info.model';
import { BUSINESS_PARTNER_MAIN_CLERK_ENTITY_INFO } from './entity-info/businesspartner-main-clerk-entity-info.model';
import { BP_MAIN_RELATION_CHART_CONTAINER_INFO} from './entity-info/relation-chart-container-info.model';
import { BP_MAIN_PDF_VIEWER_ENTITY_INFO } from './entity-info/pdf-viewer-entity-info.model';
import { BP_MAIN_CERTIFICATE_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/certificate-pin-board-container-info.model';
import { BP_MAIN_CONTACT_PRIVATE_COMMENT_CONTAINER_DEFINITION } from './entity-info/contact-private-comment-container-info.model';
import { BUSINESS_PARTNER_PRIVATE_COMMENT_CONTAINER_DEFINITION } from './entity-info/businesspartner-private-comment-container-info.model';
import { BUSINESS_PARTNER_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/businesspartner-pin-board-container-info.model';
import { BUSINESS_PARTNER_MAIN_REGION_ENTITY_INFO } from './entity-info/business-partner-main-region-entity-info.model';
import { IPhotoEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerMainPortalUserManagementWizardService } from '../services/wizards/bisnesspartner-main-portal-user-management-wizard.service';
import { ChangeCertificateStatusService } from '../services/wizards/change-certificate-status.service';

/**
 * Business Partner module info.
 */
export class BusinesspartnerMainModuleInfo extends BusinessModuleInfoBase {
	// Make this a singleton for IApplicationModule -> will be finally addressed in the user modules workshop
	private static _instance?: BusinesspartnerMainModuleInfo;
	private readonly bpMainDocumentProjectEntityInfo = DocumentProjectEntityInfoService.create(this.internalPascalCasedModuleName, BusinessPartnerMainDocumentProjectDataService);
	public static get instance(): BusinesspartnerMainModuleInfo {
		if (!this._instance) {
			this._instance = new BusinesspartnerMainModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}
	private portalUserManagementWizard(injector: Injector) {
		const featureKeyManagement = injector.get(BusinessPartnerCommonFeatureKeyManagement);
		const portalUserManagementKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, 'portalUserManagement');
		if (!this.featureRegistry.hasFeature(portalUserManagementKey)) {
			this.featureRegistry.registerFeature(portalUserManagementKey, () => {
				const service = injector.get(BusinessPartnerMainPortalUserManagementWizardService);
				return service;
			});
		}
	}
	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		this.portalUserManagementWizard(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, BPMainChangeProjectDocumentRubricCategoryWizardService);
		injector.get(BasicsSharedChangeCertificateStatusWizardRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, ChangeCertificateStatusService);
	}

	public override get internalModuleName(): string {
		return MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName;
	}

	public override get internalPascalCasedModuleName(): string {
		return MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName;
	}

	public override get entities(): EntityInfo[] {
		return [
			BUSINESS_PARTNER_ENTITY_INFO,
			GUARANTOR_INFO_ENTITY,
			GENERALS_ENTITY_INFO,
			BP2CONTROLLING_GROUP_ENTITY_INFO,
			SUPPLIER_ENTITY_INFO,
			GUARANTEE_USED_INFO_ENTITY,
			RELATION_ENTITY_INFO,
			CUSTOMER_ENTITY_INFO,
			SUBSIDIARY_INFO_ENTITY,
			BUSINESS_PARTNER_CONTRACT_INFO,
			BUSINESSPARTNER_PRCSTRUCTURE_INFO_ENTITY,
			BUSINESS_PARTNER_BANK_ENTITY_INFO,
			ACTIVITY_ENTITY_INFO,
			AGREEMENT_ENTITY_INFO,
			BUSINESSPARTNER_2EXTROLE_ENTITY,
			UPDATE_REQUEST_ENTITY_INFO,
			BUSINESSPARTNER_2EXTERNAL_ENTITY,
			COMMUNITY_ENTITY,
			BP_USER_FORM_ENTITY_INFO,
			CONTACT_USER_FORM_ENTITY_INFO,
			BP_MAIN_CERTIFICATE_ENTITY_INFO,
			BUSINESSPARTNER_2COMPANY_ENTITY,
			BUSINESS_PARTNER_CHARACTERISTIC_ENTITY_INFO,
			BUSINESS_PARTNER_CHARACTERISTIC2_ENTITY_INFO,
			REALESTATE_ENTITY_INFO,
			EVALUATION_ENTITY_INFO,
			BUSINESS_PARTNER_CERTIFICATE_CHARACTERISTIC_ENTITY_INFO,
			...this.bpMainDocumentProjectEntityInfo,
			CUSTOMER_OPEN_ITEMS_ENTITY_INFO,
			SUPPLIER_OPEN_ITEMS_ENTITY_INFO,
			BUSINESS_PARTNER_CONTACT_CHARACTERISTIC_ENTITY_INFO,
			BUSINESS_PARTNER_CLERK_ENTITY_INFO,
			BUSINESS_PARTNER_CONTACT_CLERK_ENTITY_INFO,
			BUSINESS_PARTNER_MAIN_CLERK_ENTITY_INFO,
			BUSINESS_PARTNER_MAIN_REGION_ENTITY_INFO,
		];
	}

	/**
	 * Loads the translation file used for business partner main
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			MODULE_INFO_BUSINESSPARTNER.basicsCustomizeModuleName,
			'basics.procurementstructure',
			'basics.characteristic',
			'model.wdeviewer',
			MODULE_INFO_BUSINESSPARTNER.documentsSharedModuleName,
			'basics.common',
			'cloud.common',
			MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName,
		]);
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			new ContainerDefinition({
				uuid: 'c81d6b2b37d44ea1a328a9ca245b6a1c',
				id: 'businesspartner.main.photo',
				title: {
					text: 'Reference Images',
					key: this.internalModuleName + '.photoContainerTitle',
				},
				containerType: BasicsSharedPhotoEntityViewerComponent,
				permission: 'c81d6b2b37d44ea1a328a9ca245b6a1c',
				providers: [
					{
						provide: new EntityContainerInjectionTokens<IPhotoEntity>().dataServiceToken,
						useExisting: BusinesspartnerMainPhotoDataService,
					},
					{
						provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
						useValue: {
							hasCommentTextField: true,
						},
					},
				],
			}),
			BP_MAIN_PDF_VIEWER_ENTITY_INFO,
			BP_MAIN_CONTACT_PHOTO_CONTAINER_INFO,
			BP_MAIN_SYNCHRONISE_CONTACTS_CONTAINER_INFO,
			CUSTOMER_SATISFACTION_INFO,
			BP_MAIN_RELATION_CHART_CONTAINER_INFO,
			BP_MAIN_CERTIFICATE_PIN_BOARD_CONTAINER_DEFINITION,
			BP_MAIN_CONTACT_PRIVATE_COMMENT_CONTAINER_DEFINITION,
			BUSINESS_PARTNER_PRIVATE_COMMENT_CONTAINER_DEFINITION,
			BUSINESS_PARTNER_PIN_BOARD_CONTAINER_DEFINITION,
		]);
	}

	/**
	 * Override this to auto-generate a translation container with the specified UUID.
	 * The default implementation returns `undefined`, in which no translation container
	 * will be automatically added to the module.
	 */
	protected override get translationContainer(): string | undefined {
		return 'cd1bb70740a442c0902a61e12007999d';
	}
}
