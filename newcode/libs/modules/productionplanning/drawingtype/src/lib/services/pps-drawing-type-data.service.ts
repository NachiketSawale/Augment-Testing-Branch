/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken} from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { PpsDrawingTypeCompleteEntity } from '../model/entities/pps-drawing-type-complete.class';
import {IPpsDrawingTypeEntity} from '../model/entities/pps-drawing-type-entity.interface';

export const PPS_DRAWING_TYPE_DATA_TOKEN = new InjectionToken<PpsDrawingTypeDataService>('ppsDrawingTypeDataToken');

@Injectable({
	providedIn: 'root'
})

export class PpsDrawingTypeDataService extends DataServiceFlatRoot<IPpsDrawingTypeEntity, PpsDrawingTypeCompleteEntity> {
	public constructor() {
		const options: IDataServiceOptions<IPpsDrawingTypeEntity> = {
			apiUrl: 'productionplanning/drawingtype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceRoleOptions<IPpsDrawingTypeEntity>>{
				role: ServiceRole.Root,
				itemName: 'EngDrawingType',
			}
		};
		super(options);
	}
	public override createUpdateEntity(modified: IPpsDrawingTypeEntity | null): PpsDrawingTypeCompleteEntity {
		const complete = new PpsDrawingTypeCompleteEntity();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.EngDrawingTypes = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: PpsDrawingTypeCompleteEntity): IPpsDrawingTypeEntity[] {
		if (complete.EngDrawingTypes === null) {
			complete.EngDrawingTypes = [];
		}

		return complete.EngDrawingTypes!;
	}
}







