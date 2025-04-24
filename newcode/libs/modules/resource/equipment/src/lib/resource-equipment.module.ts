/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceEquipmentModuleInfo } from './model/resource-equipment-module-info.class';
import { PlatformCommonModule } from '@libs/platform/common';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';

import { CatalogRecordsComponent } from './components/catalog-records/catalog-records.component';
import { UiExternalModule } from '@libs/ui/external';

const routes: Routes = [new BusinessModuleRoute(new ResourceEquipmentModuleInfo())];
@NgModule({
	declarations: [CatalogRecordsComponent],
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, FormsModule, PlatformCommonModule,GridComponent,UiExternalModule],
	providers: []
})
export class ResourceEquipmentModule {}