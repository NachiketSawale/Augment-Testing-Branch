/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';


import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { DrawingDataService } from './drawing-data.service';
import { IEngDrawingComponentEntity } from '../model/entities/eng-drawing-component-entity.interface';
import { IEngDrawingEntity } from '../model/entities/eng-drawing-entity.interface';
import { EngDrawingComplete } from '../model/eng-drawing-complete.class';


@Injectable({
	providedIn: 'root'
})


export class DrawingComponentDataService extends DataServiceFlatLeaf<IEngDrawingComponentEntity, IEngDrawingEntity, EngDrawingComplete> {

	public constructor(private _drawingService: DrawingDataService) {
		const options: IDataServiceOptions<IEngDrawingComponentEntity> = {
			apiUrl: 'productionplanning/drawing/component',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getbydrawing',
				usePost: true,
				prepareParam: ident => {
					return {PKey1: ident.pKey1};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEngDrawingComponentEntity, IEngDrawingEntity, EngDrawingComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'DrawingComponents',
				parent: _drawingService,
			},
		};

		super(options);
	}
}



