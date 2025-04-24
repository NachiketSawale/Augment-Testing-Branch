/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResourceCatalogModuleInfo } from './model/resource-catalog-module-info.class';
import { PlatformCommonModule } from '@libs/platform/common';
import { UiCommonModule } from '@libs/ui/common';
import { FormsModule } from '@angular/forms';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { RESOURCE_CATALOG_NEWENTITYVALIDATION_TOKEN, ResourceCatalogNewEntityValidationProcessor } from './services/resource-catalog-new-entity-processor.service';
import { RESOURCE_CATALOG_PRICEINDEX_DATA_TOKEN, ResourceCatalogPriceIndexDataService } from './services/resource-catalog-price-index-data.service';
import { RESOURCE_CATALOG_PRICEINDEN_NEWENTITYVALIDATION_TOKEN, ResourceCatalogPriceIndexNewEntityValidationProcessor } from './services/resource-catalog-price-index-new-entity-processor.service';
import { RESOURCE_CATALOG_PRICEINDEX_VALIDATION_TOKEN, ResourceCatalogPriceIndexValidationService } from './services/resource-catalog-price-index-validation.service';
import { RESOURCE_CATALOG_VALIDATION_TOKEN, ResourceCatalogValidationService } from './services/resource-catalog-validation.service';

const routes: Routes = [
	new BusinessModuleRoute(ResourceCatalogModuleInfo.instance)
];

@NgModule({
	declarations: [],
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule, PlatformCommonModule],
	providers: [
		{ provide: RESOURCE_CATALOG_NEWENTITYVALIDATION_TOKEN, useExisting: ResourceCatalogNewEntityValidationProcessor },
		{ provide: RESOURCE_CATALOG_PRICEINDEX_DATA_TOKEN, useExisting: ResourceCatalogPriceIndexDataService },
		{ provide: RESOURCE_CATALOG_PRICEINDEN_NEWENTITYVALIDATION_TOKEN, useExisting: ResourceCatalogPriceIndexNewEntityValidationProcessor },
		{ provide: RESOURCE_CATALOG_PRICEINDEX_VALIDATION_TOKEN, useExisting: ResourceCatalogPriceIndexValidationService },
		{ provide: RESOURCE_CATALOG_VALIDATION_TOKEN, useExisting: ResourceCatalogValidationService }
	]
})
export class ResourceCatalogModule {}
