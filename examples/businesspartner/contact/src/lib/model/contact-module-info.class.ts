/*
 * Copyright(c) RIB Software GmbH
 */

import {BusinessModuleInfoBase, EntityInfo} from '@libs/ui/business-base';
import {
	BusinessPartnerCommonFeatureKeyManagement,
	CommonContactEntityInfoService,
	ContactSource,
	MODULE_INFO_BUSINESSPARTNER
} from '@libs/businesspartner/common';
import {ServiceLocator} from '@libs/platform/common';
import {ContactDataService} from '../services/contact-data.service';
import {ASSIGNMENT_ENTITY_INFO} from './entity-info/assignment-entity-info.model';
import {CONTACT2COMPANY_ENTITY_INFO} from './entity-info/contact-to-company-entity-info.model';
import {CONTACT2EXTERNAL_ENTITY_INFO} from './entity-info/contact-to-external-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import {CONTACT_CONTACT2EXTERNALROLE_ENTITY_INFO} from './entity-info/contact-to-external-role-entity-info.model';
import {CONTACT_PHOTO_CONTAINER_INFO} from './entity-info/contact-photo-container-info.model';
import { CONTACT_CHARACTERISTIC_ENTITY_INFO } from './entity-info/contact-characteristic-entity-info.model';
import { Injector } from '@angular/core';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService } from '@libs/basics/shared';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import{ ContactDocumentProjectDataService } from '../services/contact-document-project-data.service';
import { CONTACT_FORM_DATA_ENTITY_INFO } from './entity-info/contact-form-data-entity-info.model';
import { BPContactChangeProjectDocumentRubricCategoryWizardService } from '../services/wizards/change-project-document-rubric-category-wizard.service';
import { CONTACT_CLERK_ENTITY_INFO } from './entity-info/contact-clerk-entity-info.model';
import { CONTACT_PRIVATE_COMMENT_CONTAINER_DEFINITION } from './entity-info/contact-private-comment-container-info.model';
import { ContactValidationService } from '../services/validations/contact-validation.service';
import { BusinessPartnerContactPortalUserManagementWizardService } from '../services/wizards/businesspartner-contact-portal-user-management-wizard.service';
export class ContactModuleInfo extends BusinessModuleInfoBase {
	// Make this a singleton for IApplicationModule -> will be finally addressed in the user modules workshop
	private static _instance?: ContactModuleInfo;

	public static get instance(): ContactModuleInfo {
		if (!this._instance) {
			this._instance = new ContactModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	private portalUserManagementWizard(injector: Injector){
		const featureKeyManagement = injector.get(BusinessPartnerCommonFeatureKeyManagement);
		const portalUserManagementKey = featureKeyManagement.getOrAddFeatureKey(this.internalModuleName, 'portalUserManagement');
		if (!this.featureRegistry.hasFeature(portalUserManagementKey)) {
			this.featureRegistry.registerFeature(portalUserManagementKey, () => {
				const service = injector.get(BusinessPartnerContactPortalUserManagementWizardService);
				return service;
			});
		}
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		this.portalUserManagementWizard(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector,this.internalModuleName,this.featureRegistry, BPContactChangeProjectDocumentRubricCategoryWizardService);
	}
	private readonly contactEntityInfoService=ServiceLocator.injector.get(CommonContactEntityInfoService);
	private readonly contactEntityInfo = EntityInfo.create(this.contactEntityInfoService.getContactEntityInfo({
		gridUuid:'a4f91b1ed487410ba6edf1d40709a9f7',
		fromUuid: 'b732f04ccaa24375a410dbff7f294f70',
		permissionUuid :'73b6280b180149a09f3a97f142bfc3dc',
		dataServiceToken: (ctx) => ctx.injector.get(ContactDataService),
		source: ContactSource.Contact,
		validationService: (ctx) => ctx.injector.get(ContactValidationService)
	}));
	private readonly bpContactDocumentProjectEntityInfo = DocumentProjectEntityInfoService.create(this.internalPascalCasedModuleName,ContactDocumentProjectDataService);
	public override get internalModuleName(): string {
		return MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName;
	}

	public override get internalPascalCasedModuleName(): string {
		return MODULE_INFO_BUSINESSPARTNER.businesspartnerContactPascalCasedModuleName;
	}

	public override get entities(): EntityInfo[] {
		return [
			this.contactEntityInfo,
			ASSIGNMENT_ENTITY_INFO,
			CONTACT2COMPANY_ENTITY_INFO,
			CONTACT2EXTERNAL_ENTITY_INFO,
			CONTACT_CONTACT2EXTERNALROLE_ENTITY_INFO,
			CONTACT_CHARACTERISTIC_ENTITY_INFO,
			CONTACT_FORM_DATA_ENTITY_INFO,
			CONTACT_CLERK_ENTITY_INFO,
			...this.bpContactDocumentProjectEntityInfo
		];
	}

	/**
	 * Loads the translation file used for business partner contact
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			MODULE_INFO_BUSINESSPARTNER.basicsCustomizeModuleName,
			MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName,
			'basics.characteristic',
			MODULE_INFO_BUSINESSPARTNER.documentsSharedModuleName
		]);
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			CONTACT_PHOTO_CONTAINER_INFO,
			CONTACT_PRIVATE_COMMENT_CONTAINER_DEFINITION
		]);
	}
}
