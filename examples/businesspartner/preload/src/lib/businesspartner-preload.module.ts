/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PlatformModuleManagerService} from '@libs/platform/common';
import {BusinessPartnerPreloadInfo} from './model/module-preload-info.class';

/**
 * Preload configuration.
 */
@NgModule({
	imports: [CommonModule],
})
export class BusinessPartnerPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(BusinessPartnerPreloadInfo.instance);
	}
}
