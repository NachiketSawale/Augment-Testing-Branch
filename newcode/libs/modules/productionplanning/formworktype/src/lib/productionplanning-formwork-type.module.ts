import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { FormworkTypeModuleInfo } from './model/formwork-type-module-info.class';

const routes: Routes = [
	new BusinessModuleRoute(FormworkTypeModuleInfo.instance),
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class FormworkTypeModule { }
