/*
 * Copyright(c) RIB Software GmbH
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BusinessModuleRoute} from '@libs/ui/business-base';
import {BasicsTextModulesModuleInfoClass} from './model/basics-textmodules-module-info.class';
import {PlainTextComponent} from './components/plain-text/plain-text.component';
import {FormsModule} from '@angular/forms';
import {UiCommonModule} from '@libs/ui/common';
import {SpecificationComponent} from './components/specification/specification.component';

const routes: Routes = [
	new BusinessModuleRoute(BasicsTextModulesModuleInfoClass.instance)
];

@NgModule({
	imports: [CommonModule, FormsModule, UiCommonModule, RouterModule.forChild(routes)],
	declarations: [PlainTextComponent, SpecificationComponent],
	exports: [PlainTextComponent, SpecificationComponent]
})
export class BasicsTextModulesModule {
}
