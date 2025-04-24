/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_MATERIAL_MATERIAL_CATALOG_ENTITY_INFO } from '../material-catalog/basics-material-material-catalog-entity-info.model';
import { BASICS_MATERIAL_MATERIAL_GROUP_ENTITY_INFO } from '../material-group/basics-material-material-group-entity-info.model';
import { BASICS_MATERIAL_RECORD_ENTITY_INFO } from '../material/basics-material-record-entity-info.model';
import { BASICS_MATERIAL_MATERIAL_REFERENCE_ENTITY_INFO } from '../material-reference/basics-material-material-reference-entity-info.model';
import { BASICS_MATERIAL_UOM_ENTITY_INFO } from '../material-uom/basics-material-uom-entity-info.model';
import { BASICS_MATERIAL_SCOPE_ENTITY_INFO } from '../scope/basics-material-scope-entity-info.model';
import { BASICS_MATERIAL_SCOPE_DETAIL_ENTITY_INFO } from '../scope-detail/basics-material-scope-detail-entity-info.model';
import { BASICS_MATERIAL_PRICE_LIST_ENTITY_INFO } from '../material-price-list/basics-material-price-list-entity-info.model';
import { BASICS_MATERIAL_CERTIFICATES_ENTITY_INFO } from '../certificates/basics-material-certificates-entity-info.model';
import { BASICS_MATERIAL_STOCK_ENTITY_INFO } from '../stock/basics-material-stock-entity-info.model';
import { BASICS_MATERIAL_ATTRIBUTE_ENTITY_INFO } from '../material-attribute/basics-material-attribute-entity-info.model';
import { Injector } from '@angular/core';
import { BasicsMaterialMaterialCatalogDataService } from '../material-catalog/basics-material-material-catalog-data.service';
import { BASICS_MATERIAL_PORTION_ENTITY_INFO } from '../portion/basics-material-portion-entity-info.model';
import { BASICS_MATERIAL_DOCUMENT_ENTITY_INFO } from '../document/basics-material-document-entity-info.model';
import { BASICS_MATERIAL_PRICE_VERSION_TO_STOCK_LIST_ENTITY_INFO } from '../price-version-to-stock-list/basics-material-price-version-to-stock-list-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { MATERIAL_PREVIEW_CONTAINER_DEFINITION } from '../material/basics-material-preview-container-definition.class';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { BASICS_MATERIAL_CHARACTERISTIC_ENTITY_INFO } from './characteristic-entities-info/basics-material-characteristic-entity-info.model';
import { BASICS_MATERIAL_PRICE_CONDITION_ENTITY_INFO } from '../price-condition/basics-material-price-condition-entity-info.model';
import { BASICS_MATERIAL_PRICE_LIST_PRICE_CONDITION_ENTITY_INFO } from '../price-list-price-condition/basics-material-price-list-price-condition-entity-info.model';
import { BASICS_MATERIAL_SCOPE_DETAIL_PRICE_CONDITION_ENTITY_INFO } from '../scope-detail-price-condition/basics-material-scope-detail-price-condition-entity-info.model';
import { BASICS_MATERIAL_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO } from '../historical-price-for-item/basics-material-historical-price-for-item-entity-info.model';
import { IBasicsMaterialImportMaterialService } from '../import-material/basics-material-import-material.service';
import { IInitializationContext, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedCompanyContextService } from '@libs/basics/shared';
import { BasicsMaterialNavBarExportService } from '../material/basics-material-navbar-export.service';
import { BASICS_MATERIAL_SPECIFICATION_CONTAINER_DEFINITION } from '../material/basics-material-specification-container-definition.model';

export class BasicsMaterialModuleInfo extends BusinessModuleInfoBase {
	/**
	 * Module instance
	 */
	public static readonly instance = new BasicsMaterialModuleInfo();

	/**
	 * This method is invoked when a user enters the module.
	 */
	public override get internalModuleName(): string {
		return 'basics.material';
	}

	/**
	 * Returns the module identifier in PascalCase.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.Material';
	}

	/**
	 * Returns the entities used by the module.
	 * Container definition objects will be automatically generated based on these entity info objects.
	 *
	 * @returns The list of entities.
	 */
	public override get entities(): EntityInfo[] {
		return [
			//Material record need to be the first. It will become the real root entity in the module
			BASICS_MATERIAL_RECORD_ENTITY_INFO,
			BASICS_MATERIAL_MATERIAL_CATALOG_ENTITY_INFO,
			BASICS_MATERIAL_MATERIAL_GROUP_ENTITY_INFO,
			BASICS_MATERIAL_MATERIAL_REFERENCE_ENTITY_INFO,
			BASICS_MATERIAL_UOM_ENTITY_INFO,
			BASICS_MATERIAL_SCOPE_ENTITY_INFO,
			BASICS_MATERIAL_SCOPE_DETAIL_ENTITY_INFO,
			BASICS_MATERIAL_PRICE_LIST_ENTITY_INFO,
			BASICS_MATERIAL_CERTIFICATES_ENTITY_INFO,
			BASICS_MATERIAL_STOCK_ENTITY_INFO,
			BASICS_MATERIAL_ATTRIBUTE_ENTITY_INFO,
			BASICS_MATERIAL_PORTION_ENTITY_INFO,
			BASICS_MATERIAL_DOCUMENT_ENTITY_INFO,
			BASICS_MATERIAL_PRICE_VERSION_TO_STOCK_LIST_ENTITY_INFO,
			BASICS_MATERIAL_CHARACTERISTIC_ENTITY_INFO,
			...BASICS_MATERIAL_PRICE_CONDITION_ENTITY_INFO,
			...BASICS_MATERIAL_PRICE_LIST_PRICE_CONDITION_ENTITY_INFO,
			...BASICS_MATERIAL_SCOPE_DETAIL_PRICE_CONDITION_ENTITY_INFO,
			BASICS_MATERIAL_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO,
		];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'basics.common',
			'basics.materialcatalog',
			'procurement.stock',
			'model.wdeviewer',
			'procurement.common',
			'procurement.stock',
			'cloud.common',
			'project.main',
			'project.stock',
			'basics.procurementstructure',
			'basics.customize',
			'basics.costcodes',
			'documents.project',
			'businesspartner.main',
		];
	}

	/**
	 * This method is invoked when a user enters the module.
	 *
	 * @param injector An Angular injector that allows for retrieving Angular injectables.
	 */
	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		const basicsMaterialMaterialCatalogDataService = injector.get(BasicsMaterialMaterialCatalogDataService);
		basicsMaterialMaterialCatalogDataService.getCatalogTypes();
		basicsMaterialMaterialCatalogDataService.load().then(() => {
			basicsMaterialMaterialCatalogDataService.goToFirst();
		});
		const importMaterialService = injector.get(IBasicsMaterialImportMaterialService);
		importMaterialService.initImport(injector);
		injector.get(BasicsMaterialNavBarExportService).initExport();

	}

	/**
	 * @brief Gets the container definitions, including the language container configuration.
	 * This method overrides the base class implementation to include a new container definition
	 * @return An array of ContainerDefinition objects including the language container configuration.
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			MATERIAL_PREVIEW_CONTAINER_DEFINITION,
			DrawingContainerDefinition.createPDFViewer({
				uuid: '2b439e03f8a74cac966da334a4016845',
			}),
			BASICS_MATERIAL_SPECIFICATION_CONTAINER_DEFINITION,
		]);
	}

	/**
	 * Returns the translation container UUID for the basics material module.
	 */
	protected override get translationContainer(): string | undefined {
		return 'f15abe2a43684ffc8bf5e1d59a31f87c';
	}

	protected override async doPrepareModule(context: IInitializationContext): Promise<void> {
		await Promise.all([super.doPrepareModule(context), ServiceLocator.injector.get(BasicsSharedCompanyContextService).prepareLoginCompany()]);
	}
}

