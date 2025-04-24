/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_MATERIAL_CATALOG_ENTITY_INFO } from '../material-catalog/basics-material-catalog-entity-info.model';
import { BASICS_MATERIAL_GROUP_ENTITY_INFO } from '../material-group/basics-material-group-entity-info.model';
import { BASICS_MATERIAL_GROUP_CHAR_ENTITY_INFO } from '../attribute/basics-material-group-char-entity-info.model';
import {
	BASICS_MATERIAL_GROUP_CHAR_VAL_ENTITY_INFO
} from '../attribute-value/basics-material-group-char-val-entity-info.model';
import { BASICS_COMPANY_2MATERIAL_CATALOG_ENTITY_INFO } from '../company-2material-catalog/basics-company-2material-catalog-entity-info.model';
import { BASICS_MATERIAL_PRICE_VERSION_ENTITY_INFO } from '../price-version/basics-material-price-version-entity-info.model';
import {
	BASICS_MATERIAL_CATALOG_DISCOUNT_GROUP_ENTITY_INFO
} from '../discount-group/basics-material-catalog-discount-group-entity-info.model';
import { BASICS_MATERIAL_PRICE_VERSION_TO_CUSTOMER_ENTITY_INFO } from '../price-version-to-customer/basics-material-price-version-to-customer-entity-info.model';
import { BASICS_MATERIAL_PRICE_VERSION_TO_COMPANIES_ENTITY_INFO } from '../price-version-to-companies/basics-material-price-version-to-companies-entity-info.model';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { MaterialCatalogDocumentProjectDataService } from '../service/material-catalog-document-project-data.service';

import { BASICS_MATERIAL_CATALOG_CHARACTERISTIC_ENTITY_INFO } from '../characteristic/basics-material-catalog-characteristic-entity-info.model';
import { Injector } from '@angular/core';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService } from '@libs/basics/shared';
import { ChangeProjectDocumentRubricCategoryWizardService } from '../service/wizards/change-project-document-rubric-category-wizard.service';

export class BasicsMaterialcatalogModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsMaterialcatalogModuleInfo();

	/**
	 * Make module info class singleton
	 * @private
	 */
	private constructor() {
		super();
	}


	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector,this.internalModuleName, this.featureRegistry, ChangeProjectDocumentRubricCategoryWizardService);
	}

	public override get internalModuleName(): string {
		return 'basics.materialcatalog';
	}

	/**
	 * Returns the module identifier in PascalCase.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.MaterialCatalog';
	}

	public override get entities(): EntityInfo[] {
		return [
			BASICS_MATERIAL_CATALOG_ENTITY_INFO,
			BASICS_MATERIAL_GROUP_ENTITY_INFO,
			BASICS_MATERIAL_GROUP_CHAR_ENTITY_INFO,
			BASICS_MATERIAL_GROUP_CHAR_VAL_ENTITY_INFO,
			BASICS_COMPANY_2MATERIAL_CATALOG_ENTITY_INFO,
			BASICS_MATERIAL_PRICE_VERSION_ENTITY_INFO,
			BASICS_MATERIAL_CATALOG_DISCOUNT_GROUP_ENTITY_INFO,
			BASICS_MATERIAL_PRICE_VERSION_TO_CUSTOMER_ENTITY_INFO,
			BASICS_MATERIAL_PRICE_VERSION_TO_COMPANIES_ENTITY_INFO,
			BASICS_MATERIAL_CATALOG_CHARACTERISTIC_ENTITY_INFO,
			...DocumentProjectEntityInfoService.create(this.internalPascalCasedModuleName, MaterialCatalogDocumentProjectDataService)
		];
	}

	public override get preloadedTranslations(){
		return [
			...super.preloadedTranslations,
			'documents.shared',
			'basics.characteristic',
			'basics.clerk',
			'basics.procurementstructure',
			'businesspartner.main'
		];
	}

	/**
	 * Return the translation container UUID for the material catalog module.
	 */
    protected override get translationContainer(): string | undefined {
		return '303d9d5565314a398af3e38aa825140b';
	}
}
