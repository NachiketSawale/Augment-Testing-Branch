/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ControllingCommonProjectComplete, ControllingCommonProjectDataService, IControllingCommonProjectEntity } from '@libs/controlling/common';
import { ISearchResult } from '@libs/platform/common';
import { get } from 'lodash';


@Injectable({
	providedIn: 'root'
})

export class ProjectMainForCOStructureDataService extends ControllingCommonProjectDataService<IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
	public constructor() {

		super({
			readInfo: {
				endPoint: 'filtered',
				usePost: true
			}
		});

	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IControllingCommonProjectEntity> {
		const fr = get(loaded, 'FilterResult')!;
		return {
			FilterResult: fr,
			dtos: get(loaded, 'dtos')! as IControllingCommonProjectEntity[]
		};
	}


	public override createUpdateEntity(modified: IControllingCommonProjectEntity | null): ControllingCommonProjectComplete {
		return new ControllingCommonProjectComplete();
	}
}






