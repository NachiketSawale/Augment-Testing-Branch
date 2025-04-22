import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiCommonModule } from '@libs/ui/common';

import { ModelSharedDrawingViewerComponent } from './drawing/components/drawing-viewer/drawing-viewer.component';
import { ModelSharedCalibrationComponent } from './drawing/components/calibration/calibration.component';
import { ModelSharedDrawingScaleComponent } from './drawing/components/drawing-scale/drawing-scale.component';
import { ModelSharedDrawingContainerComponent } from './drawing/components/drawing-container/drawing-container.component';
import { DrawingPrintDialogComponent } from './drawing/components/drawing-print-dialog/drawing-print-dialog.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { ModelSharedMarkupCommentComponent } from './drawing/components/markup-comment/markup-comment.component';

@NgModule({
	imports: [CommonModule, UiCommonModule, FormsModule, PlatformCommonModule],
	declarations: [ModelSharedDrawingViewerComponent, ModelSharedDrawingContainerComponent, ModelSharedCalibrationComponent, ModelSharedCalibrationComponent, ModelSharedDrawingScaleComponent, DrawingPrintDialogComponent, ModelSharedMarkupCommentComponent],
	exports: [ModelSharedDrawingViewerComponent, ModelSharedDrawingContainerComponent],
})
export class ModelSharedModule {}
