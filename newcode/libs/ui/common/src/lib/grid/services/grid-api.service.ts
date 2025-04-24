/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IGridApi } from '../model/grid-api.interface';

/**
 * This service provides access to grid api interface implementation.
 */
@Injectable({
	providedIn: 'root'
})
export class GridApiService {
	/**
	 * Collection of grid apis already that are already registered
	 * @private
	 */
	private readonly apis = new Map<string, IGridApi<object>>();

	/**
	 * Registers the API of a grid component, if uuid exists the existing API will be overwritten
	 */
	public register<T extends object>(uuid: string, api: IGridApi<T>): void {
		this.apis.set(uuid, api as unknown as IGridApi<object>);
	}

	/**
	 * Unregisters API of given uuid.
	 * @returns true, if uuid existed and has been removed
	 */
	public unregister(uuid: string): boolean {
		return this.apis.delete(uuid);
	}

	/**
	 * Retrieves API of given uuid.
	 * @returns API or undefined
	 */
	public get<T extends object>(uuid: string): IGridApi<T> {
		return this.apis.get(uuid) as unknown as IGridApi<T>;
	}
}
