/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IEngDrawingEntity } from '../model/entities/eng-drawing-entity.interface';
import { EngDrawingComplete } from '../model/eng-drawing-complete.class';


@Injectable({
	providedIn: 'root'
})

export class DrawingDataService extends DataServiceFlatRoot<IEngDrawingEntity, EngDrawingComplete> {

	public constructor() {
		const options: IDataServiceOptions<IEngDrawingEntity> = {
			apiUrl: 'productionplanning/drawing',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customfiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IEngDrawingEntity>>{
				role: ServiceRole.Root,
				itemName: 'Drawing',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IEngDrawingEntity | null): EngDrawingComplete {
		const complete = new EngDrawingComplete();
		if (modified) {
			complete.MainItemId = modified.Id ?? 0;
			complete.Drawing = [modified];
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: EngDrawingComplete): IEngDrawingEntity[] {
		if (complete.Drawing) {
			return complete.Drawing;
		}
		return [];
	}

}







