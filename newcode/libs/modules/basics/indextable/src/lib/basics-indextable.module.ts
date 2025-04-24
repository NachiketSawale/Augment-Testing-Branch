/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiCommonModule } from '@libs/ui/common';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import {BasicsIndextableModuleInfo} from './model/basics-indextable-module-info.class';
const routes: Routes = [new BusinessModuleRoute( BasicsIndextableModuleInfo.instance)];
@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

    providers: [],
})
export class BasicsIndextableModule {}
