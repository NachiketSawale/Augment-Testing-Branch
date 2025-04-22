/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	UiCommonModule,
	GridComponent
} from '@libs/ui/common';
import { UiExternalModule } from '@libs/ui/external';
import { FormContainerComponent } from './entities/components/form-container/form-container.component';
import { GridContainerComponent } from './entities/components/grid-container/grid-container.component';
import { TreeContainerComponent } from './entities/components/tree-container/tree-container.component';
import { SplitGridContainerComponent } from './entities/components/split-grid-container/split-grid-container.component';
import { CompositeGridContainerComponent } from './entities/components/composite-grid-container/composite-grid-container.component';
import { DataTranslationGridComponent } from './entities/components/data-translation-grid/data-translation-grid.component';
import { IssueDialogBodyComponent } from './entities/components/translation-resolution/issue-dialog-body/issue-dialog-body.component';
import { ResolutionHistoryComponent } from './entities/components/translation-resolution/resolution-history/resolution-history.component';
import { ObsoleteEnglishTranslationIssueComponent } from './entities/components/translation-resolution/obsolete-english-translation/obsolete-english-translation-issue.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [CommonModule, UiCommonModule, GridComponent, UiExternalModule, PlatformCommonModule, FormsModule],
	declarations: [FormContainerComponent, GridContainerComponent, TreeContainerComponent, SplitGridContainerComponent, CompositeGridContainerComponent, DataTranslationGridComponent, IssueDialogBodyComponent, ResolutionHistoryComponent, ObsoleteEnglishTranslationIssueComponent]
})
export class UiBusinessBaseModule {
}
