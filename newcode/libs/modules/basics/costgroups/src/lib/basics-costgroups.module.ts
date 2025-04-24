/*
 * Copyright(c) RIB Software GmbH
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {ContainerModuleRoute} from '@libs/ui/container-system';
import {GridComponent, UiCommonModule} from '@libs/ui/common';
import {BasicsCostgroupsModuleInfo} from './model/basics-costgroups-module-info.class';
import {
    BasicsCostgroupsCrbBkpCopyrightComponent
} from './components/basics-costgroups-crb-bkp-copyright/basics-costgroups-crb-bkp-copyright.component';
import {
    BasicsCostgroupsCrbBkpImportComponent
} from './components/basics-costgroups-crb-bkp-import/basics-costgroups-crb-bkp-import.component';


const routes: Routes = [new ContainerModuleRoute(new BasicsCostgroupsModuleInfo())];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, GridComponent],

    providers: [],

    declarations: [
        BasicsCostgroupsCrbBkpCopyrightComponent,
        BasicsCostgroupsCrbBkpImportComponent
    ]
})
export class BasicsCostgroupsModule {
}
