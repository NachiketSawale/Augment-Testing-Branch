/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiCommonModule } from '@libs/ui/common';

const routes: Routes = [];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [],
})
export class ModelInterfacesModule {}
