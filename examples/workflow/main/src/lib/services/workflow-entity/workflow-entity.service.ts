/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IDataEntityFacade } from '@libs/workflow/interfaces';


@Injectable({
	providedIn: 'root'
})
export class WorkflowEntityService {
	private readonly httpService = inject(PlatformHttpService);
	private _entityFacades: IDataEntityFacade[] = [];
	private _dataEntityFacades: IDataEntityFacade[] = [];

	/**
	 * Loads all configured entity facades
	 */
	public async loadAllEntityFacades(): Promise<void> {
		if(!(this._entityFacades.length > 0 && this._entityFacades.length > 0)) {
			await Promise.all([this.loadEntityFacades(), this.loadDataEntityFacades()]);
		}
	}

	private async loadEntityFacades(): Promise<void> {
		const loadEntityUrl = 'basics/workflow/entity/list';
		this._entityFacades = await this.httpService.get<IDataEntityFacade[]>(loadEntityUrl);
	}

	private async loadDataEntityFacades(): Promise<void> {
		const loadEntityUrl = 'basics/workflow/data/entity/list';
		this._dataEntityFacades = await this.httpService.get<IDataEntityFacade[]>(loadEntityUrl);
	}

	/**
	 * Return all entity facades.
	 */
	public get entityFacades(): IDataEntityFacade[] {
		return this._entityFacades;
	}

	/**
	 * Return data entity facades.
	 */
	public get dataEntityFacades(): IDataEntityFacade[] {
		return this._dataEntityFacades;
	}

	/**
	 * Gets an entity facade based on it's uuid.
	 * @param entityFacadeUuid
	 * @returns An object of `IDataEntityFacade` if entity facade is found, otherwise undefined is returned.
	 */
	public getFacadeById(entityFacadeUuid: string): IDataEntityFacade | undefined {
		return this._entityFacades.filter(entity => entity.Id == entityFacadeUuid)[0];
	}
}