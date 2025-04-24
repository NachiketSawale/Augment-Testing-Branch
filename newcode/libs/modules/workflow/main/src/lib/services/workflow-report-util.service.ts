import { Injectable, inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { uniqueId } from 'lodash';
import { IReportParameterForClient } from '../model/types/report-parameter.type';
import { IReportParameter } from '../model/interfaces/workflow-report-parameter.interface';
import { ReportSource } from '../model/enum/workflow-report-source.enum';
import { IReport } from '../model/interfaces/workflow-report.interface';

/**
 * Utility service to access reports.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowReportUtilService {
	private reportCache: Record<number, IReportParameterForClient[]> = {};
	private readonly httpService = inject(PlatformHttpService);

	public async getParameters(reportId: number) {
		if (!this.reportCache[reportId]) {
			await this.getParametersFromServer(reportId);
		}
		return this.reportCache[reportId];
	}

	/**
	 * Get report parameters from JSON.
	 * @param reportParameters stringified value of report parameters.
	 * @returns Structured reported parameters or null
	 */
	public getParametersFromJSON(reportParameters: string): IReportParameterForClient[] | null {
		if (reportParameters) {
			const params = JSON.parse(reportParameters);
			const newParams: IReportParameterForClient[] = [];
			if (Array.isArray(params)) {
				params.forEach((param) => {
					newParams.push(this.getStructuredParametersItem(param, ReportSource.JSON));
				});
			}
			return newParams;
		}
		return null;
	}

	private getParametersFromServer(reportId: number) {
		return this.httpService.get<IReportParameter[]>('basics/reporting/sidebar/parametersbyid', { params: { id: reportId } }).then(response => {
			//let newParams = [];
			try {
				const items = response.map(item => {
					return this.getStructuredParametersItem(item, ReportSource.Server);
				});
				this.reportCache[reportId] = items;
				//newParams = response
			} catch (e) {
				console.error(e);
			}
		}).catch(error => console.error(error));
	}

	/**
	 * Returns a report object from the server
	 * @param reportId Id of the report.
	 */
	public getReport(reportId: number): Promise<IReport> {
		return this.httpService.get<IReport>('basics/reporting/report/reportById', { params: { id: reportId } });
	}

	private getStructuredParametersItem(item: (IReportParameter | IReportParameterForClient), source: ReportSource): IReportParameterForClient {
		if (this.isSourceServer(item, source)) {
			return {
				Id: parseInt(uniqueId()),
				Name: item.parameterName,
				ParamValueType: item.dataType,
				ParamValue: ''
			};
		}

		return {
			...item,
			Id: parseInt(uniqueId())
		};
	}

	private isSourceServer(item: (IReportParameter | IReportParameterForClient), source: ReportSource): item is IReportParameter {
		return source === ReportSource.Server;
	}
}