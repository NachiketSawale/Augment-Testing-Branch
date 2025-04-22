import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SplitComponent } from './angular-split/component/split.component';
import { SplitAreaDirective } from './angular-split/directive/split-area.directive';

@NgModule({
	imports: [CommonModule, DragDropModule],
	declarations: [SplitComponent, SplitAreaDirective],
	exports: [SplitComponent, SplitAreaDirective],
})
export class UiExternalModule {}
