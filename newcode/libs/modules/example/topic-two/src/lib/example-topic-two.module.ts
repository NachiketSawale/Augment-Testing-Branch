import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { ExampleTopicTwoModuleInfoClass } from './model/example-topic-two-module-info.class';
import { AContainerComponent } from './components/a-container/a-container.component';
import { BContainerComponent } from './components/b-container/b-container.component';

const routes: Routes = [
	new BusinessModuleRoute(ExampleTopicTwoModuleInfoClass.instance)
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes)],
	declarations: [
		AContainerComponent,
		BContainerComponent
	]
})
export class ExampleTopicTwoModule {}
