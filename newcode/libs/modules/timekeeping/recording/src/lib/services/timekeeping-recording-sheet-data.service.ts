/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions, IEntityList } from '@libs/platform/data-access';

import { TimekeepingRecordingComplete } from '../model/timekeeping-recording-complete.class';
import { TimekeepingRecordingDataService } from './timekeeping-recording-data.service';
import { ISheetEntity, IRecordingEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingSheetComplete } from '../model/timekeeping-recording-sheet-complete.class';


@Injectable({
	providedIn: 'root',
})
export class TimekeepingRecordingSheetDataService extends DataServiceFlatNode<ISheetEntity, TimekeepingRecordingSheetComplete, IRecordingEntity, TimekeepingRecordingComplete> {
	public constructor() {
		const options: IDataServiceOptions<ISheetEntity> = {
			apiUrl: 'timekeeping/recording/sheet',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparentandloginuser',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1, };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ISheetEntity, IRecordingEntity, TimekeepingRecordingComplete>>{
				role: ServiceRole.Node,
				itemName: 'Sheets',
				parent: inject(TimekeepingRecordingDataService)
			},
		};

		super(options);
	}

	private takeOverUpdatedFromComplete(complete: TimekeepingRecordingComplete, entityList: IEntityList<ISheetEntity>) {
		if (complete && complete.SheetsToSave && complete.SheetsToSave.length > 0) {
			const cG: ISheetEntity[] = [];
			complete.SheetsToSave.forEach((cCG) => {
				if (cCG.Sheets != null) {
					cG.push(cCG.Sheets);
				}
			});
			entityList.updateEntities(cG);
		}
	}
	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			PKey1: parent.Id,
		};
	}

	public override createUpdateEntity(modified: ISheetEntity | null): TimekeepingRecordingSheetComplete {
		return new TimekeepingRecordingSheetComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}
	public override registerNodeModificationsToParentUpdate(complete: TimekeepingRecordingComplete, modified: TimekeepingRecordingSheetComplete[], deleted: ISheetEntity[]) {
		if (modified && modified.length > 0) {
			complete.SheetsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.SheetsToDelete = deleted;
		}
	}
	public override getSavedEntitiesFromUpdate(complete: TimekeepingRecordingComplete): ISheetEntity[] {
		return (complete && complete.SheetsToSave)
			? complete.SheetsToSave.map(e => e.Sheets!)
			: [];
	}

	public override isParentFn(parentKey: TimekeepingRecordingComplete, entity: ISheetEntity): boolean {
		return entity.RecordingFk === parentKey.Id;
	}
}
