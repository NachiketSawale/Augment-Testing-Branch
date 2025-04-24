/*
 * Copyright(c) RIB Software GmbH
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {ContainerModuleRoute} from '@libs/ui/container-system';
import {GridComponent, UiCommonModule} from '@libs/ui/common';
import {BasicsMaterialModuleInfo} from './model/basics-material-module-info.class';
import {UpdateMaterialPriceStep1Component} from './update-material-price/components/update-material-price-step1/update-material-price-step1.component';
import {UpdateMaterialPriceStep2Component} from './update-material-price/components/update-material-price-step2/update-material-price-step2.component';
import {FormsModule} from '@angular/forms';
import {PlatformCommonModule} from '@libs/platform/common';

const routes: Routes = [new ContainerModuleRoute(BasicsMaterialModuleInfo.instance)];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule ,FormsModule,PlatformCommonModule,GridComponent],
    providers: [
    ],
    declarations:[UpdateMaterialPriceStep1Component,UpdateMaterialPriceStep2Component]
})
export class BasicsMaterialModule {
}
