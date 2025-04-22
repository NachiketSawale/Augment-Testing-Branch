/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerModuleInfoBase } from './container-module-info-base.class';
import { Data } from '@angular/router';
import { UiContainerSystemModuleClientAreaComponent } from '../components/module-client-area/module-client-area.component';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { ModuleLayoutService } from '../services/module-layout.service';

/**
 * Stores routing information for a standard container-based module.
 *
 * The `ContainerModuleRoute` utility class is a convenient way to specify the default route in a regular, container-based sub-module.
 * Typically, such a route would point to the {@link ModuleClientAreaComponent}.
 * Furthermore, its module info is stored in the `data` object of the route.
 *
 * By using this class, the individual fields of the `Route` instance do not have to be set individually.
 */
export class ContainerModuleRoute {

	/**
	 * Initializes a new instance.
	 * @param {ContainerModuleInfoBase} moduleInfo The module info object for the module.
	 */
	public constructor(private readonly moduleInfo: ContainerModuleInfoBase) {
		this.data =  {
			moduleInfo: this.moduleInfo,
			permissions: [''],
		};
	}

	/**
	 * The empty route path.
	 */
	public readonly path: string = '';

	/**
	 * The default component for displaying container-based modules, {@link UiContainerSystemModuleClientAreaComponent}.
	 */
	public readonly component = UiContainerSystemModuleClientAreaComponent;

	/**
	 * Stores the module info on the route.
	 */
	public readonly data!: Data;

	public readonly resolve = {
		moduleResolver: PlatformModuleManagerService,
		moduleTabs: ModuleLayoutService
	};
}