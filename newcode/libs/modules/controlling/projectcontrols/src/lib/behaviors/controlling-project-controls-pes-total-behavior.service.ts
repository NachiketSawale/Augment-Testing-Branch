/*
 * Copyright(c) RIB Software GmbH
 */
import { ISearchPayload } from '@libs/platform/common';
import {
	ControllingCommonPesBehaviorService,
	ControllingCommonProjectComplete,
	IControllingCommonProjectEntity
} from '@libs/controlling/common';
import {
	ControllingProjectControlsPesTotalEntity
} from '../model/entities/controlling-projectcontrols-pes-total-entity-interface.class';
import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	ControllingProjectControlsPesTotalDataService
} from '../services/controlling-project-controls-pes-total-data.service';
export const CONTROLLING_PROJECT_CONTROLS_PES_TOTAL_BEHAVIOR_TOKEN = new InjectionToken<ControllingProjectControlsPesTotalBehavior>('controllingProjectControlsPesTotalBehavior');

@Injectable({
	providedIn: 'root'
})
export class ControllingProjectControlsPesTotalBehavior extends ControllingCommonPesBehaviorService<ControllingProjectControlsPesTotalEntity, IControllingCommonProjectEntity,ControllingCommonProjectComplete>{
	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,

		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: '',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true
	};

	public constructor() {
	    const pesDataService = inject(ControllingProjectControlsPesTotalDataService);
		super(pesDataService);
	}
}