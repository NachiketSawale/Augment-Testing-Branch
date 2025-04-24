import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { RouterModule, Routes } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ContainerGroupComponent } from './components/container-group/container-group.component';
import { FormContainerComponent } from './components/form-container/form-container.component';
import { GridContainerComponent } from './components/grid-container/grid-container.component';
import { ContainerTestHostComponent } from './components/container-test-host/container-test-host.component';
import { FormsModule } from '@angular/forms';
import { UiContainerSystemModuleClientAreaComponent } from './components/module-client-area/module-client-area.component';
import { UiContainerSystemModuleTabBarComponent } from './components/module-tab-bar/module-tab-bar.component';
import { UiContainerSystemNavbarComponent } from './components/navbar/navbar.component';
import { UiContainerSystemContainerLayoutsComponent } from './components/container-layouts/container-layouts.component';
import { UiContainerSystemAccessDeniedContainerComponent } from './components/access-denied-container/access-denied-container.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { DelayedContainerComponent } from './components/delayed-container/delayed-container.component';
import { UiExternalModule } from '@libs/ui/external';
import { UiContainerSystemLayoutHostComponent } from './components/layout-host/layout-host.component';
import { UiContainerSystemLayoutSplitterComponent } from './components/layout-splitter/layout-splitter.component';
import { UiContainerSystemLayoutSaverComponent } from './components/layout-saver/layout-saver.component';
import { UiContainerSystemLayoutEditorComponent } from './components/layout-editor/layout-editor.component';
import { UiContainerSystemLayoutEditorTabsComponent } from './components/layout-editor-tabs/layout-editor-tabs.component';
import { UiContainerSystemLayoutEditorViewComponent } from './components/layout-editor-view/layout-editor-view.component';
import { UiContainerSystemLayoutExporterComponent } from './components/layout-exporter/layout-exporter.component';
import { UiContainerSystemFullsizeButtonComponent } from './components/fullsize-button/fullsize-button.component';
import { LoadingErrorsContainerComponent } from './components/loading-errors-container/loading-errors-container.component';
import { PlaceholderContainerComponent } from './components/placeholder-container/placeholder-container.component';

// TODO: remove this route, just for testing!
const routes: Routes = [];

@NgModule({
	imports: [CommonModule, UiCommonModule, RouterModule.forChild(routes), FormsModule, UiExternalModule, DragDropModule, PlatformCommonModule, GridComponent],
	declarations: [
		ContainerGroupComponent,
		FormContainerComponent,
		GridContainerComponent,
		ContainerTestHostComponent,
		UiContainerSystemModuleClientAreaComponent,
		UiContainerSystemNavbarComponent,
		UiContainerSystemModuleTabBarComponent,
		UiContainerSystemContainerLayoutsComponent,
		UiContainerSystemAccessDeniedContainerComponent,
		DelayedContainerComponent,
		LoadingErrorsContainerComponent,
		PlaceholderContainerComponent,
		UiContainerSystemLayoutHostComponent,
		UiContainerSystemLayoutSplitterComponent,
		UiContainerSystemLayoutSaverComponent,
		UiContainerSystemLayoutEditorComponent,
		UiContainerSystemLayoutEditorTabsComponent,
		UiContainerSystemLayoutEditorViewComponent,
		UiContainerSystemLayoutExporterComponent,
		UiContainerSystemFullsizeButtonComponent
	],
	exports: [UiContainerSystemLayoutHostComponent, ContainerGroupComponent]
})
export class UiContainerSystemModule { }
