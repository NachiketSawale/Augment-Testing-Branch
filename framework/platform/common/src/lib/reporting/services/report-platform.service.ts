/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { PlatformConfigurationService } from '../../services/platform-configuration.service';

import { IReportPrepareData } from '../model/report-preapre-data.interface';
import { IReportPreparedData } from '../model/report-prepared-data.interface';
import { IReportParametersData } from '../model/report-parameters-data.interface';


/**
 * Service used for preparing and rendering report.
 */
@Injectable({
	providedIn: 'root',
})
export class PlatformReportService {
	/**
	 * Service performing http requests.
	 */
	private readonly http = inject(HttpClient);

	/**
	 * Service holding common config's and utilities.
	 */
	private readonly configurationService = inject(PlatformConfigurationService);

	/**
	 * Retrieves parameters of a given report.
	 *
	 * @param {IReportPrepareData} report Specifies the report which parameters should be returned.
	 * @param {Array<IReportParametersData>} parameters Already initialized (known) parameters, will be merged to parameters read from report.
	 * @returns {Observable<object>} Array of parameters.
	 */
	public getParameters(report: IReportPrepareData, parameters: Array<IReportParametersData>): Observable<object> {
		const data = {
			ReportData: report,
			Parameters: parameters.map((item) => {
				return { Key: item.Name, Value: item };
			}),
		};

		return this.http.post(this.configurationService.webApiBaseUrl + 'reporting/platform/parameters', data).pipe(
			map((result) => {
				return result || null;
			}),
		);
	}

	/**
	 * Renders a report by using specified template, reporting engine and parameters.
	 *
	 * @param {IReportPrepareData} report {defaultReportData} specifies the report which should be rendered.
	 * @param {Array<IReportParametersData>} parameters {defaultParameter} parameters needed to render the report.
	 * @param {string} exportType optional, at the moment "pdf" is supported only. The report will be exported as pdf to be shown or downloaded.
	 * @returns {Observable<IReportPreparedData | null>}
	 */
	public prepare(report: IReportPrepareData, parameters: Array<IReportParametersData>, exportType?: string): Observable<IReportPreparedData | null> {
		const data = {
			reportData: report,
			gearData: {
				name: exportType ? exportType : null,
				reportId: report.Id,
			},
			parameters: parameters.map((item) => {
				return { Key: item.Name, Value: item };
			}),
		};

		data.reportData.limitedWaitingTime = true;

		const observable = new Observable<IReportPreparedData | null>((observer) => {
			if (report.interactive) {
				//TODO: Mocked temporarily
				observer.next(null);
			} else {
				this.http.post<IReportPreparedData>(this.configurationService.webApiBaseUrl + 'reporting/platform/prepare', data).subscribe({
					next: (result) => {
						const isReportPrepared = () => {
							const config = {
								params: {
									id: result.Name,
									type: result.FileExtension.toLowerCase(),
								},
							};

							this.http.get<boolean>(this.configurationService.webApiBaseUrl + 'reporting/platform/isprepared', config).subscribe((response) => {
								if (response) {
									result.GenerationCompleted = true;
									observer.next(result);
								} else if (response === null) {
									observer.next(null);
								} else {
									setTimeout(isReportPrepared, 9500);
								}
							});
						};

						if (!result || result.GenerationCompleted) {
							observer.next(result);
						} else {
							setTimeout(isReportPrepared, 9500);
						}
					},
					error: () => {
						observer.next(null);
					},
				});
			}
		});

		return observable;
	}

	/**
	 * Shows an already rendered report by opening a new tab / popup window in browser.
	 *
	 * @param {IReportPreparedData | null} report Report specific information to identify report on server.
	 * @returns {IReportPreparedData | null}
	 */
	public show(report: IReportPreparedData | null): IReportPreparedData | null {
		let subPath = null;

		if (report !== null) {
			let url = null;

			if (report.FileExtension === 'pdf') {
				subPath = 'downloads/reports/' + report.Name + '.' + report.FileExtension;
				url = window.location.origin + this.configurationService.baseUrl + subPath;
			} else {
				url =
					window.location.origin +
					(report.ClientUrl.indexOf('/') === -1 ? this.configurationService.reportingBaseUrl : this.configurationService.baseUrl) +
					report.ClientUrl +
					'/viewer/show/' +
					(report.uuid ? report.uuid + '/' : '') +
					this.configurationService.savedOrDefaultUiLanguage +
					'/' +
					report.Description +
					'/' +
					report.Name;
			}

			const win = window.open(url);

			if (win) {
				win.focus();
			}

			report.subPath = subPath;
		}

		return report;
	}
}
