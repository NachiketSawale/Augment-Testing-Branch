/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContainerModuleRoute } from '@libs/ui/container-system';
import { BoqWicModuleInfo } from './model/boq-wic-module-info.class';
import { UiCommonModule } from '@libs/ui/common';
import { CrbNpkCopyrightComponent } from './services/boq-wic-crb-nkp-import-wizard.service';

const routes: Routes = [new ContainerModuleRoute(BoqWicModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	declarations: [
		CrbNpkCopyrightComponent
	],
	providers: []
})
export class BoqWicModule {

}
