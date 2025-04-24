/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable, InjectionToken} from '@angular/core';

import {
	ControllingCommonProjectComplete,
	ControllingCommonProjectDataService, IControllingCommonProjectEntity
} from '@libs/controlling/common';


import {ISearchResult} from '@libs/platform/common';
import {get} from 'lodash';


export const CONTROLLING_PROJECTCONTROLS_PROJECT_MAIN_DATA_TOKEN = new InjectionToken<ControllingProjectControlsProjectDataService>('controllingProjectcontrolsProjectMainDataToken');

@Injectable({
	providedIn: 'root'
})

export class ControllingProjectControlsProjectDataService extends ControllingCommonProjectDataService<IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
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





		
			





