/*
 * Copyright(c) RIB Software GmbH
 */

export * from './lib/ui-container-system.module';

export { ContainerBaseComponent } from './lib/components/container-base/container-base.component';
// TODO: possibly move grid and form container to business-base module?
export { GridContainerComponent } from './lib/components/grid-container/grid-container.component';
export { FormContainerComponent } from './lib/components/form-container/form-container.component';

export * from './lib/model/container-definition.class';
export { ContainerTypeRef } from './lib/model/container-type-ref.type';
export { IContainerDefinition } from './lib/model/container-definition.interface';
export { ContainerModuleInfoBase } from './lib/model/container-module-info-base.class';
export { ContainerModuleRoute } from './lib/model/container-module-route.class';
export * from './lib/model/container-module-route-info.class';
export * from './lib/model/container-injection-info.model';
export * from './lib/model/container-injection-providers.type';
export * from './lib/model/container-load-permissions.type';
export { IContainerInitializationContext } from './lib/model/container-initialization-context.interface';
export * from './lib/model/container-initialization-context.class';
export * from './lib/model/async-container-factory-enabled.type';
export * from './lib/model/optionally-async-container-resource.type';

export { IContainerUiAddOns } from './lib/model/container-ui-add-ons.interface';

export { UiContainerSystemModuleClientAreaComponent } from './lib/components/module-client-area/module-client-area.component';
// TODO: remove eventually
export { ContainerTestHostComponent } from './lib/components/container-test-host/container-test-host.component';

export { UiContainerSystemMainViewService } from './lib/services/main-view.service';
export { IEditorPanels } from './lib/components/container-layouts/interfaces/container-layout.interface';

// Nav-bar
export * from './lib/services/nav-bar.service';
export * from './lib/model/nav-bar/nav-bar-identifier';

// Tab
export * from './lib/model/tab/tab-changed-args';

// Layout
export * from './lib/model/layout/layout-manager.interface';
export * from './lib/model/layout/container-layout.interface';
export { paneLayouts } from './lib/model/container-pane.model';

// Container Group
export * from './lib/components/container-group/container-group.component';