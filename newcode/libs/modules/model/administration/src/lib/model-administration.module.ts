import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { ModelAdministrationModuleInfo } from './model/model-administration-module-info.class';
import {
	FilterStateInfoContainerComponent
} from './hl-schemes/components/filter-state-info-container/filter-state-info-container.component';
import { PropertyKeyTagSelectorComponent } from './property-keys/components/property-key-tag-selector/property-key-tag-selector.component';
import { PlatformCommonModule } from '@libs/platform/common';

const routes: Routes = [
	new BusinessModuleRoute(ModelAdministrationModuleInfo.instance)
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), PlatformCommonModule],
	declarations: [
		FilterStateInfoContainerComponent,
		PropertyKeyTagSelectorComponent
	]
})
export class ModelAdministrationModule {}
