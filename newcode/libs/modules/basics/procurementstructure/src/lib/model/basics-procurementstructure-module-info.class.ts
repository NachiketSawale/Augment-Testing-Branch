/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import {PROCUREMENT_STRUCTURE_ENTITY_INFO} from '../procurement-structure/procurement-structure-entity-info.model';
import {PROCUREMENT_STRUCTURE_EVENT_ENTITY_INFO} from '../event/procurement-structure-event-entity-info.model';
import {PROCUREMENT_STRUCTURE_ACCOUNT_ENTITY_INFO} from '../account/procurement-structure-account-entity-info.model';
import {PROCUREMENT_STRUCTURE_ROLE_ENTITY_INFO} from '../role/procurement-structure-role-entity-info.model';
import {PROCUREMENT_STRUCTURE_TAX_CODE_ENTITY_INFO} from '../taxcode/procurement-structure-tax-code-entity-info.model';
import {PROCUREMENT_STRUCTURE_GENERAL_ENTITY_INFO} from '../general/procurement-structure-general-entity-info.model';
import {PROCUREMENT_STRUCTURE_EVALUATION_ENTITY_INFO} from '../evaluation/procurement-structure-evaluation-entity-info.model';
import {PROCUREMENT_STRUCTURE_CERTIFICATE_ENTITY_INFO} from '../certificate/procurement-structure-certificate-entity-info.model';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { ProcurementStructureDocumentProjectDataService } from '../service/procurement-structure-document-project-data.service';
import {PROCUREMENT_STRUCTURE_INTER_COMPANY_ENTITY_INFO} from '../intercompany/procurement-structure-intercompany-entity-info.model';
import { PROCUREMENT_STRUCTURE_CHARACTERISTIC_ENTITY_INFO } from '../characteristic/basics-procurement-structure-characteristic-entity-info.model';
import { PROCUREMENT_STRUCTURE_CHARACTERISTIC2_ENTITY_INFO } from './entities-info/procurement-structure-characteristic2-entity-info.model';
import { ChangeProjectDocumentRubricCategoryWizardService } from '../service/wizards/change-project-document-rubric-category-wizard.service';
import { Injector } from '@angular/core';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService } from '@libs/basics/shared';
import { PROCUREMENT_STRUCTURE_DOCUMENT_ENTITY_INFO } from '../document/procurement-structure-document-entity-info.model';
import { PROCUREMENT_STRUCTURE_CLERK_ENTITY_INFO } from '../clerk/procurement-structure-clerk-entity-info.model';


export class BasicsProcurementStructureModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsProcurementStructureModuleInfo();

	/**
	 * Make module info class singleton
	 * @private
	 */
	private constructor() {
		super();
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector,this.internalModuleName,this.featureRegistry, ChangeProjectDocumentRubricCategoryWizardService);
	}

	public override get internalModuleName(): string {
		return 'basics.procurementstructure';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Basics.ProcurementStructure';

	}

	public override get entities(): EntityInfo[] {
		return [
			PROCUREMENT_STRUCTURE_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_EVENT_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_ACCOUNT_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_ROLE_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_TAX_CODE_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_GENERAL_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_EVALUATION_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_CERTIFICATE_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_INTER_COMPANY_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_CHARACTERISTIC_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_CHARACTERISTIC2_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_CLERK_ENTITY_INFO,
			PROCUREMENT_STRUCTURE_DOCUMENT_ENTITY_INFO,
			...DocumentProjectEntityInfoService.create(this.internalPascalCasedModuleName, ProcurementStructureDocumentProjectDataService)
		];
	}

	/**
	 * Returns translation container uuid for basics procurement structure module.
	 */
	protected override get translationContainer(): string | undefined {
        return 'c0c55603a0dd4c8f99f95529b0ec71ec';
    }

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'documents.shared',
			'procurement.common',
			'basics.characteristic',
			'cloud.common',
			'basics.clerk',
			'basics.materialcatalog',
		];
	}
}
