/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule } from '@libs/platform/common';
import { ConstructionsystemCommonModuleInfo } from './model/constructionsystem-common-module-info.class';
import { CosCommonSelectionStatementComponent } from './components/selection-statement/main-filter/main-filter.component';
import { PropertyFilterComponent } from './components/selection-statement/property-filter/property-filter.component';
import { SimpleFilterComponent } from './components/selection-statement/simple-filter/simple-filter.component';
import { ExpertFilterComponent } from './components/selection-statement/expert-filter/expert-filter.component';
import { EnhancedFilterComponent } from './components/selection-statement/enhanced-filter/enhanced-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterEditorComponent } from './components/filter-editor/filter-editor.component';
import { ImageFilterComponent } from './components/selection-statement/image-filter/image-filter.component';

const routes: Routes = [new BusinessModuleRoute(ConstructionsystemCommonModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, PlatformCommonModule, ReactiveFormsModule, FormsModule, ImageFilterComponent],
	providers: [],
	declarations: [CosCommonSelectionStatementComponent, FilterEditorComponent, SimpleFilterComponent, PropertyFilterComponent, ExpertFilterComponent, EnhancedFilterComponent],
	exports: [CosCommonSelectionStatementComponent],
})
export class ConstructionsystemCommonModule {}
