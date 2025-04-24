/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicsSharedModule } from '@libs/basics/shared';
import { PpsProductTemplateDialogLookupComponent } from './components/product-template/pps-product-template-dialog-lookup.component';

import { PpsProcessTemplateDialogLookupComponent } from './components/process-configuration/pps-process-template-dialog-lookup/pps-process-template-dialog-lookup.component';
import { PpsFormworkDialogLookupComponent } from './components/process-configuration/pps-formwork-dialog-lookup/pps-formwork-dialog-lookup.component';

@NgModule({
	imports: [CommonModule, BasicsSharedModule],
	declarations: [PpsProductTemplateDialogLookupComponent, PpsProcessTemplateDialogLookupComponent, PpsFormworkDialogLookupComponent],
	exports: [PpsProductTemplateDialogLookupComponent, PpsProcessTemplateDialogLookupComponent, PpsFormworkDialogLookupComponent],
})
export class ProductionplanningSharedModule {}
