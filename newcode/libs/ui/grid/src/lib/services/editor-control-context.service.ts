/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { GridRowInfo } from '@libs/ui/common';
import { Dictionary } from '@libs/platform/common';
import { Injectable } from '@angular/core';

/***
 * Service for retrieving the relevant control context for the editors in the grid
 */
@Injectable({
	providedIn: 'root'
})
export class EditorControlContextService<T extends object> {

	private readonly gridControlContexts = new Map<string, Dictionary<T, GridRowInfo<T>>>();

	/***
	 * Add/replace the grid control context map of a particular grid based on the uuid parameter
	 * @param uuid
	 * @param controlContexts
	 */
	public register(uuid: string, controlContexts: Dictionary<T, GridRowInfo<T>>) {
		this.gridControlContexts.set(uuid, controlContexts);
	}

	/***
	 * Remove the grid control context map of a particular grid based on the uuid parameter
	 * @param uuid
	 */
	public unregister(uuid: string) {
		if (this.gridControlContexts.has(uuid)) {
			this.gridControlContexts.delete(uuid);
		}
	}

	/***
	 * Retrieve the control context map of the provided grid uuid
	 * @param uuid
	 */
	public get(uuid: string): Dictionary<T, GridRowInfo<T>> | undefined {
		if (this.gridControlContexts.has(uuid)) {
			return this.gridControlContexts.get(uuid);
		}

		return new Dictionary<T, GridRowInfo<T>>();
	}

	public getGridRowInfo(uuid: string, obj: T) : GridRowInfo<T> | undefined {
		const dict = this.get(uuid);
		if(dict) {
			if(dict.containsKey(obj)) {
				return dict.get(obj);
			} else {
				return undefined;
			}
		}
		return undefined;
	}

	public addGridRowInfo(uuid: string, obj: T, gridRowInfo: GridRowInfo<T>) {
		const dict = this.get(uuid);
		if(dict) {
			if(dict.containsKey(obj)) {
				dict.remove(obj);
			}
			dict.add(obj, gridRowInfo);
		}
	}
}