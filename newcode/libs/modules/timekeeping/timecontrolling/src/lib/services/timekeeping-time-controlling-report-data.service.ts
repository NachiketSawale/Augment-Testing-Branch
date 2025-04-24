/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, IEntityProcessor, EntityDateProcessorFactory } from '@libs/platform/data-access';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { ControllingReportComplete } from '../model/entities/controlling-report-complete.class';


export const TIMEKEEPING_TIME_CONTROLLING_REPORT_DATA_TOKEN = new InjectionToken<TimekeepingTimeControllingReportDataService>('timekeepingTimeControllingReportDataToken');

@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimeControllingReportDataService extends DataServiceFlatRoot<IReportEntity, ControllingReportComplete> {

	public constructor() {
		const options: IDataServiceOptions<IReportEntity> = {
			apiUrl: 'timekeeping/controlling/report',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IReportEntity>>{
				role: ServiceRole.Root,
				itemName: 'Reports',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IReportEntity | null): ControllingReportComplete {
		const complete = new ControllingReportComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.ReportId = 0;
			complete.Reports = [modified];
		}
		return complete;
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







