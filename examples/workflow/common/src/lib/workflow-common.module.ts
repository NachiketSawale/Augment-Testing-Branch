/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiContainerSystemModule } from '@libs/ui/container-system';
import { WorkflowCommonGenericWizardComponent } from './components/workflow-common-generic-wizard/workflow-common-generic-wizard.component';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule } from '@libs/platform/common';
import { WorkflowCommonScrollTabsComponent } from './components/scroll-tabs/workflow-common-scroll-tabs.component';
import { MatIconModule } from '@angular/material/icon';
import { WorkflowCommonGenericWizardInfoBarComponent } from './components/workflow-common-generic-wizard-info-bar/workflow-common-generic-wizard-info-bar.component';
import { GenericWizardReportComponent } from './components/generic-wizard-report/generic-wizard-report.component';
import { FormsModule } from '@angular/forms';
import { RfqBidderReportDynamicFormComponent } from './components/rfq-bidder-report-dynamic-form/rfq-bidder-report-dynamic-form.component';
import { MatGridList, MatGridTile, MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelTitle, MatExpansionPanelHeader, MatExpansionPanelContent } from '@angular/material/expansion';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton } from '@angular/material/button';
import { MatSortHeader } from '@angular/material/sort';
import { MatRadioButton } from '@angular/material/radio';
import { RfqBidderReportComponent } from './components/rfq-bidder-report/rfq-bidder-report.component';
import { WorkflowCommonGenericWizardCoverLetterComponent } from './components/generic-wizard-cover-letter/cover-letter.component';
import { MatRadioModule } from '@angular/material/radio';
import { GenericWizardTransmissionComponent } from './components/generic-wizard-transmission/generic-wizard-transmission.component';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';

@NgModule({
	imports: [
		CommonModule,
		UiContainerSystemModule,
		UiCommonModule,
		PlatformCommonModule,
		MatIconModule,
		FormsModule,
		GridComponent,
		MatGridTile,
		MatGridList,
		MatGridTileHeaderCssMatStyler,
		MatAccordion,
		MatExpansionPanel,
		MatExpansionPanelTitle,
		MatExpansionPanelHeader,
		MatExpansionPanelDescription,
		MatCheckbox,
		MatIconButton,
		MatSortHeader,
		MatRadioButton,
		MatExpansionPanelContent,
		MatRadioModule,
		MatRow,
		MatHeaderRow,
		MatCell,
		MatHeaderCell,
		MatTable,
		MatColumnDef,
		MatHeaderRowDef,
		MatRowDef,
		MatCellDef,
		MatHeaderCellDef
	],
	declarations: [
		WorkflowCommonGenericWizardComponent,
		WorkflowCommonScrollTabsComponent,
		WorkflowCommonGenericWizardInfoBarComponent,
		WorkflowCommonGenericWizardCoverLetterComponent,
		GenericWizardReportComponent,
		RfqBidderReportDynamicFormComponent,
		RfqBidderReportComponent,
		GenericWizardTransmissionComponent,
	],
	exports: [],
})
export class WorkflowCommonModule {}
