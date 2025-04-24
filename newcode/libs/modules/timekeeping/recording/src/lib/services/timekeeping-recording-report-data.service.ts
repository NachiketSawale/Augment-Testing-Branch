/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions, IEntityList, IEntityProcessor, EntityDateProcessorFactory } from '@libs/platform/data-access';
import { IRecordingEntity ,IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingReportComplete } from '../model/timekeeping-recording-report-complete.class';
import { TimekeepingRecordingSheetComplete } from '../model/timekeeping-recording-sheet-complete.class';
import { TimekeepingRecordingSheetDataService } from './timekeeping-recording-sheet-data.service';

@Injectable({
	providedIn: 'root',
})
export class TimekeepingRecordingReportDataService extends DataServiceFlatNode<IReportEntity, TimekeepingRecordingReportComplete, IRecordingEntity, TimekeepingRecordingSheetComplete> {
	public constructor() {
		const options: IDataServiceOptions<IReportEntity> = {
			apiUrl: 'timekeeping/recording/report',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1, PKey3 :1 };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IReportEntity, IRecordingEntity, TimekeepingRecordingSheetComplete>>{
				role: ServiceRole.Node,
				itemName: 'Reports',
				parent: inject(TimekeepingRecordingSheetDataService)
			},
		};

		super(options);
	}

	public override registerNodeModificationsToParentUpdate(complete: TimekeepingRecordingSheetComplete, modified: TimekeepingRecordingReportComplete[], deleted: IReportEntity[]) {
		if (modified && modified.length > 0) {
			complete.ReportsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ReportsToDelete = deleted;
		}
	}

	private takeOverUpdatedFromComplete(complete: TimekeepingRecordingSheetComplete, entityList: IEntityList<IReportEntity>) {
		if (complete && complete.ReportsToSave && complete.ReportsToSave.length > 0) {
			const cG: IReportEntity[] = [];
			complete.ReportsToSave.forEach((cCG) => {
				if (cCG.Reports != null) {
					cG.push(cCG.Reports);
				}
			});
			entityList.updateEntities(cG);
		}
	}
	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			mainItemId: parent.Id,
		};
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IReportEntity>): IEntityProcessor<IReportEntity>[] {
		const allProcessor = super.provideAllProcessor(options);
		allProcessor.push(this.provideDateProcessor());
		return allProcessor;
	}

	private provideDateProcessor(): IEntityProcessor<IReportEntity> {
		const dateProcessorFactory = inject(EntityDateProcessorFactory);
		return dateProcessorFactory.createProcessorFromSchemaInfo<IReportEntity>({ moduleSubModule: 'Timekeeping.Recording', typeName: 'ReportDto' });
	}

}
