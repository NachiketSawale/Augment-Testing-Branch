/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import {ModuleInfoBase} from '@libs/platform/common';
import {PlatformModuleManagerService} from '@libs/platform/common';
import { ActivatedRoute } from '@angular/router';

/**
 * The base class for all client area components.
 *
 * This class is decorated as a directive as otherwise, it is not allowed (by ESLint) to use
 * Angular features.
 */
@Component({
	template: ''
})
export abstract class ClientAreaBaseComponent implements OnInit {

	private readonly moduleManagerService = inject(PlatformModuleManagerService);

	public ngOnInit() {
		this._moduleInfo = this.activatedRoute.snapshot.data['moduleInfo'] as ModuleInfoBase;
		if (!this._moduleInfo) {
			throw new Error('Failed to find module info on route.');
		}

		this.moduleManagerService.activateModule(this._moduleInfo);
	}

	protected readonly activatedRoute = inject(ActivatedRoute);

	private _moduleInfo!: ModuleInfoBase;

	/**
	 * Creates a module info object for the current module.
	 * @protected
	 */
	protected get moduleInfo(): ModuleInfoBase {
		return this._moduleInfo;
	}
}