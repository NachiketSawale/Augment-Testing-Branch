/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IEntityStatusName } from '../../model/interfaces/workflow-entity-status-name.interface';


@Injectable({
	providedIn: 'root'
})
export class WorflowEntityStatusService {

	private readonly httpService = inject(PlatformHttpService);

	public async loadEntityStatus(): Promise<void> {
		const loadEntityUrl = 'basics/workflow/entity/status/list';
		const entityStatusList = await this.httpService.get<IEntityStatusName[][]>(loadEntityUrl);
		entityStatusList.forEach(entityStatusNameArray => {
			entityStatusNameArray.forEach(item => {
				item.Id = item.StatusName;
				this._entityStatusNames.push(item);
			});
		});
	}

	private _entityStatusNames: IEntityStatusName[] = [];
	public get entityStatusNames() {
		return this._entityStatusNames;
	}
}