/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControllingCommonControllingCommonVersionReportlogComponent } from './components/controlling-common-version-reportlog/controlling-common-version-reportlog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControllingCommonControllingCommonVersionReportlogDialogComponent } from './components/controlling-common-version-reportlog-dialog/controlling-common-version-reportlog-dialog.component';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule } from '@libs/platform/common';
import { ControllingCommonTransferDataToBisDataComponent } from './components/controlling-common-transfer-data-to-bis-wizard/controlling-common-transfer-data-to-bis-data.component';

@NgModule({
	imports: [CommonModule, ReactiveFormsModule, FormsModule, GridComponent, PlatformCommonModule, UiCommonModule],
	declarations: [ControllingCommonControllingCommonVersionReportlogComponent, ControllingCommonControllingCommonVersionReportlogDialogComponent, ControllingCommonTransferDataToBisDataComponent],
})
export class ControllingCommonModule {}
