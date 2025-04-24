/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { DrawingDataService } from './drawing-data.service';
import { IEngDrawingSkillEntity } from '../model/entities/eng-drawing-skill-entity.interface';
import { IEngDrawingEntity } from '../model/entities/eng-drawing-entity.interface';
import { EngDrawingComplete } from '../model/eng-drawing-complete.class';


@Injectable({
	providedIn: 'root'
})

export class DrawingSkillDataService extends DataServiceFlatLeaf<IEngDrawingSkillEntity, IEngDrawingEntity, EngDrawingComplete> {

	public constructor(private _drawingService: DrawingDataService) {
		const options: IDataServiceOptions<IEngDrawingSkillEntity> = {
			apiUrl: 'productionplanning/drawing/skill',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbydrawing',
				prepareParam: ident => ({mainItemId: ident.pKey1})
			},
			roleInfo: <IDataServiceChildRoleOptions<IEngDrawingSkillEntity, IEngDrawingEntity, EngDrawingComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EngDrawingSkill',
				parent: _drawingService,
			},
		};

		super(options);
	}

}



