/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import * as _ from 'lodash';

/**
 * To provide permissions 
 */
@Injectable({
	providedIn: 'root',
})

export class PlatformCommonMainviewService {
	/**
	 * currently loaded module
	 */
	private currentModule: { containers: string[] };

	/**
	 * initializes current module using containers 
	 */
	public constructor() {
		this.currentModule = { containers: [] };
	}
	/**
	 * Provides permission
	 * @param { string } uuid  Container uuid
	 * @returns { string | null } returns permission 
	 */
	public getPermissions(uuid: string): string | null {
		return _.result(
			_.find((this.currentModule && this.currentModule.containers) || [], {
				uuid: uuid,
			}),
			'permission',
			null
		);
	}
}
