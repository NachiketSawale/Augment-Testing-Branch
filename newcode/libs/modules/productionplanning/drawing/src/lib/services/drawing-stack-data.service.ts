/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';


import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { DrawingDataService } from './drawing-data.service';
import { IEngDrawingEntity } from '../model/entities/eng-drawing-entity.interface';
import { EngDrawingComplete } from '../model/eng-drawing-complete.class';
import { IEngStackEntity } from '../model/entities/eng-stack-entity.interface';
import { EngStackComplete } from '../model/eng-stack-complete.class';


@Injectable({
	providedIn: 'root'
})

export class DrawingStackDataService extends DataServiceFlatNode<IEngStackEntity, EngStackComplete, IEngDrawingEntity, EngDrawingComplete> {

	public constructor(private _drawingService: DrawingDataService) {
		const options: IDataServiceOptions<IEngStackEntity> = {
			apiUrl: 'productionplanning/drawing/stack',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: ident => {
					return {drawingFk: ident.pKey1};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEngStackEntity, IEngDrawingEntity, EngDrawingComplete>>{
				role: ServiceRole.Node,
				itemName: 'EngStackDto',
				parent: _drawingService,
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IEngStackEntity | null): EngStackComplete {
		const complete = new EngStackComplete();
		if (modified) {
			complete.MainItemId = modified.Id ?? 0;
			complete.Stacks = modified;
		}
		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: EngDrawingComplete, modified: EngStackComplete[], deleted: IEngStackEntity[]) {
		if (modified && modified.length > 0) {
			complete.StacksToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			complete.StacksToDelete = deleted;
		}
	}

}





