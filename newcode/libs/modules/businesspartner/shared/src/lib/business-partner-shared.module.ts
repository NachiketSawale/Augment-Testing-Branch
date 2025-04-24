import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { UiExternalModule } from '@libs/ui/external';
import { PlatformCommonModule } from '@libs/platform/common';
import {
	BusinesspartnerSharedSubEntityGridDialogComponent
} from './sub-entity-dialog/components/sub-entity-grid-dialog.component';
import { BusinesspartnerSharedEvaluationContainerComponent } from './evaluation/components/evaluation/evaluation.component';
import {
	BusinessPartnerSearchComponent, BusinessPartnerResultComponent, BusinessPartnerLookupComponent,
	BusinessPartnerWizardComponent
} from './business-partner';
import {
	BusinesspartnerSharedEvaluationScreenModalComponent
} from './evaluation/components/evaluation-screen-modal/evaluation-screen-modal.component';
import {
	BusinesspartnerSharedEvaluationItemDataViewComponent
} from './evaluation/components/evaluation-item-data-view/evaluation-item-data-view.component';
import {
	BusinesspartnerSharedEvaluationDocumentDataViewComponent
} from './evaluation/components/evaluation-document-data-view/evaluation-document-data-view.component';
import {
	BusinesspartnerSharedEvaluationGroupDataViewComponent
} from './evaluation/components/evaluation-group-data-view/evaluation-group-data-view.component';
import {
	BusinesspartnerSharedEvaluationClerkViewComponent
} from './evaluation/components/evaluation-clerk-common-view/evaluation-clerk-view.component';

const routes: Routes = [
	{
		path: 'business-partner',
		component: BusinessPartnerLookupComponent,
	},
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), PlatformCommonModule, FormsModule, UiCommonModule, HttpClientModule, MatPaginatorModule, MatSliderModule, UiExternalModule, GridComponent],
	declarations: [
		BusinessPartnerSearchComponent,
		BusinessPartnerResultComponent,
		BusinessPartnerLookupComponent,
		BusinessPartnerWizardComponent,
		BusinesspartnerSharedSubEntityGridDialogComponent,
		BusinesspartnerSharedEvaluationContainerComponent,
		BusinesspartnerSharedEvaluationScreenModalComponent,
		BusinesspartnerSharedEvaluationItemDataViewComponent,
		BusinesspartnerSharedEvaluationDocumentDataViewComponent,
		BusinesspartnerSharedEvaluationGroupDataViewComponent,
		BusinesspartnerSharedEvaluationClerkViewComponent
	],
	exports: [BusinessPartnerLookupComponent, BusinessPartnerLookupComponent, BusinesspartnerSharedSubEntityGridDialogComponent],
})
export class BusinessPartnerSharedModule {}
