/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PlatformModuleManagerService} from '@libs/platform/common';
import {ProcurementPreloadInfo} from './model/procurement-preload-info.class';

/**
 * Preload configuration.
 */
@NgModule({
  imports: [CommonModule],
})
export class ProcurementPreloadModule {
  public constructor(moduleManager: PlatformModuleManagerService) {
    moduleManager.registerPreloadModule(ProcurementPreloadInfo.instance);
  }
}
