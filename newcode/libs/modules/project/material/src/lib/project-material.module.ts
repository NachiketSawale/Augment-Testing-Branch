/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ProjectMaterialProjectMaterialUpdatePriceBasicOptionComponent
} from './components/project-material-update-price-basic-option/project-material-update-price-basic-option.component';
import {PlatformCommonModule} from '@libs/platform/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
	ProjectMaterialProjectMaterialUpdatePriceGroupComponent
} from './components/project-material-update-price-group/project-material-update-price-group.component';
import {
	ProjectMaterialProjectMaterialUpdatePriceResultComponent
} from './components/project-material-update-price-result/project-material-update-price-result.component';
import {
	ProjectMaterialProjectMaterialUpdatePriceFromQuoteComponent
} from './components/project-material-update-price-from-quote/project-material-update-price-from-quote.component';
import {
	ProjectMaterialProjectMaterialUpdatePriceFromContractComponent
} from './components/project-material-update-price-from-contract/project-material-update-price-from-contract.component';
import {
	ProjectMaterialProjectMaterialUpdatePriceByMaterialItemComponent
} from './components/project-material-update-price-by-material-item/project-material-update-price-by-material-item.component';
import {
	ProjectMaterialProjectMaterialUpdatePriceByMaterialCatalogComponent
} from './components/project-material-update-price-by-material-catalog/project-material-update-price-by-material-catalog.component';
import {GridComponent, UiCommonModule} from '@libs/ui/common';


@NgModule({
    imports: [CommonModule, PlatformCommonModule, ReactiveFormsModule, FormsModule, UiCommonModule, GridComponent],
	declarations: [
		ProjectMaterialProjectMaterialUpdatePriceBasicOptionComponent
		,ProjectMaterialProjectMaterialUpdatePriceGroupComponent
		,ProjectMaterialProjectMaterialUpdatePriceResultComponent
		,ProjectMaterialProjectMaterialUpdatePriceFromQuoteComponent
		,ProjectMaterialProjectMaterialUpdatePriceFromContractComponent
		,ProjectMaterialProjectMaterialUpdatePriceByMaterialItemComponent
		,ProjectMaterialProjectMaterialUpdatePriceByMaterialCatalogComponent
	]
})
export class ProjectMaterialModule {}
