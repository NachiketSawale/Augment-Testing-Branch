/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions, IEntityList } from '@libs/platform/data-access';
import { IRecordingEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingResultComplete } from '../model/timekeeping-recording-result-complete.class';
import { ITimekeepingResultEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingComplete } from '../model/timekeeping-recording-complete.class';
import { TimekeepingRecordingDataService } from './timekeeping-recording-data.service';

@Injectable({
	providedIn: 'root',
})
export class TimekeepingRecordingResultDataService extends DataServiceFlatNode<ITimekeepingResultEntity, TimekeepingRecordingResultComplete, IRecordingEntity, TimekeepingRecordingComplete> {
	public constructor() {
		const options: IDataServiceOptions<ITimekeepingResultEntity> = {
			apiUrl: 'timekeeping/recording/result',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeepingResultEntity, IRecordingEntity, TimekeepingRecordingComplete>>{
				role: ServiceRole.Node,
				itemName: 'Results',
				parent: inject(TimekeepingRecordingDataService)
			},
		};

		super(options);
	}

	public override registerNodeModificationsToParentUpdate(complete: TimekeepingRecordingComplete, modified: TimekeepingRecordingResultComplete[], deleted: ITimekeepingResultEntity[]) {
		if (modified && modified.length > 0) {
			complete.ResultsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ResultsToDelete = deleted;
		}
	}

	private takeOverUpdatedFromComplete(complete: TimekeepingRecordingComplete, entityList: IEntityList<ITimekeepingResultEntity>) {
		if (complete && complete.ResultsToSave && complete.ResultsToSave.length > 0) {
			const cG: ITimekeepingResultEntity[] = [];
			complete.ResultsToSave.forEach((cCG) => {
				if (cCG.Results != null) {
					cG.push(cCG.Results);
				}
			});
			entityList.updateEntities(cG);
		}
	}
}
