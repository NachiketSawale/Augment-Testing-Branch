/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { DrawingDataService } from './drawing-data.service';
import { IEngDrwRevisionEntity } from '../model/entities/eng-drw-revision-entity.interface';
import { IEngDrawingEntity } from '../model/entities/eng-drawing-entity.interface';
import { EngDrawingComplete } from '../model/eng-drawing-complete.class';
import { CompleteIdentification } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class DrawingRevisionDataService extends DataServiceFlatNode<IEngDrwRevisionEntity, CompleteIdentification<IEngDrwRevisionEntity>, IEngDrawingEntity, EngDrawingComplete> {
	public constructor(private _drawingService: DrawingDataService) {
		const options: IDataServiceOptions<IEngDrwRevisionEntity> = {
			apiUrl: 'productionplanning/drawing/drwrevision',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getbydrawing',
				prepareParam: (ident) => {
					return { drawingFk: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IEngDrwRevisionEntity, IEngDrawingEntity, EngDrawingComplete>>{
				role: ServiceRole.Node,
				itemName: 'DrawingRevision',
				parent: _drawingService,
			},
		};
		super(options);
	}
}
