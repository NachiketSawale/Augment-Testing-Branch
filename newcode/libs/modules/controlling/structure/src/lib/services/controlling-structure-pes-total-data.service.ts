/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { ProjectMainForCOStructureDataService } from './project-main-for-costructure-data.service';
import { ControllingCommonPesDataService, ControllingCommonProjectComplete, IControllingCommonProjectEntity } from '@libs/controlling/common';
import { ControllingStructurePesTotalEntity } from '../model/entities/controlling-structure-pes-total-entity-interface';


export const CONTROLLING_STRUCTURE_PES_TOTAL_DATA_TOKEN = new InjectionToken<ControllingStructurePesTotalDataService>('controllingStructurePesTotalDataToken');

@Injectable({
	providedIn: 'root'
})

export class ControllingStructurePesTotalDataService extends ControllingCommonPesDataService<ControllingStructurePesTotalEntity,IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ProjectMainForCOStructureDataService), {
			apiUrl: 'procurement/pes/controllingtotal',
			readEndPoint: 'list',
			itemName: 'projectControlPes'
		});
	}
}
