/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IReportParameterValuesEntity } from '../model/entities/report-parameter-values-entity.interface';
import { IReportParameterEntity } from '../model/entities/report-parameter-entity.interface';
import { BasicsReportingReportParameterDataService } from './basics-reporting-report-parameter-data.service';
import { ReportParameterComplete } from '../model/complete-class/report-parameter-complete.class';
export const BASICS_REPORTING_REPORT_PARAMETER_VALUES_DATA_TOKEN = new InjectionToken<BasicsReportingReportParameterValuesDataService>('basicsReportingReportParameterValuesDataToken');

@Injectable({
	providedIn: 'root'
})

/**
 * Basics Reporting report parameter values dataservice
 */
export class BasicsReportingReportParameterValuesDataService extends DataServiceFlatLeaf<IReportParameterValuesEntity,IReportParameterEntity, ReportParameterComplete >{

	public constructor(parentService: BasicsReportingReportParameterDataService) {
		const options: IDataServiceOptions<IReportParameterValuesEntity>  = {
			apiUrl: 'basics/reporting/reportparametervalues',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId : ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IReportParameterValuesEntity,IReportParameterEntity, ReportParameterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ReportParameterValues',
				parent: parentService,
			},
		};

		super(options);
	}
	
}