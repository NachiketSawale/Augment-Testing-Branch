/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IReportParameterEntity } from '../model/entities/report-parameter-entity.interface';
import { IReportEntity } from '../model/entities/report-entity.interface';
import { BasicsReportingReportDataService } from './basics-reporting-report-data.service';
import { ReportParameterComplete } from '../model/complete-class/report-parameter-complete.class';
import { ReportComplete } from '../model/complete-class/report-complete.class';

@Injectable({
	providedIn: 'root'
})

/**
 * Basics Reporting report parameter dataservice
 */
export class BasicsReportingReportParameterDataService extends DataServiceFlatNode<IReportParameterEntity, ReportParameterComplete,IReportEntity, ReportComplete >{

	public constructor(parentService: BasicsReportingReportDataService) {
		const options: IDataServiceOptions<IReportParameterEntity>  = {
			apiUrl: 'basics/reporting/reportparameter',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IReportParameterEntity,IReportEntity, ReportComplete>>{
				role: ServiceRole.Node,
				itemName: 'ReportParameter',
				parent: parentService,
			},
			entityActions: {createSupported: false, deleteSupported: false},
		};

		super(options);
	}
}