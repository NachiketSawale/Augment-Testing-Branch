/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	ControllingCommonPesDataService,
	ControllingCommonProjectComplete,
	IControllingCommonProjectEntity
} from '@libs/controlling/common';
import {
	ControllingProjectControlsPesTotalEntity
} from '../model/entities/controlling-projectcontrols-pes-total-entity-interface.class';
import {ControllingProjectControlsProjectDataService} from './controlling-projectcontrols-project-main-data.service';


export const CONTROLLING_PROJECT_CONTROLS_PES_TOTAL_DATA_TOKEN = new InjectionToken<ControllingProjectControlsPesTotalDataService>('controllingProjectControlsPesTotalDataToken');

@Injectable({
	providedIn: 'root'
})
export class ControllingProjectControlsPesTotalDataService extends ControllingCommonPesDataService<ControllingProjectControlsPesTotalEntity,IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ControllingProjectControlsProjectDataService), {
			apiUrl: 'procurement/pes/controllingtotal',
			readEndPoint: 'list',
			itemName: 'projectControlPes'
		});
	}
}



