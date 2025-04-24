/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IReportEntity } from '../model/entities/report-entity.interface';
import { ReportComplete } from '../model/complete-class/report-complete.class';

@Injectable({
	providedIn: 'root'
})
/**
 * Basics Reporting report dataservice
 */
export class BasicsReportingReportDataService extends DataServiceFlatRoot<IReportEntity, ReportComplete> {

	public constructor() {
		const options: IDataServiceOptions<IReportEntity> = {
			apiUrl: 'basics/reporting/report',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete' 
			},
			roleInfo: <IDataServiceRoleOptions<IReportEntity>>{
				role: ServiceRole.Root,
				itemName: 'Report',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IReportEntity | null): ReportComplete {
		const complete = new ReportComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Report = modified;
		}

		return complete;
	}

}