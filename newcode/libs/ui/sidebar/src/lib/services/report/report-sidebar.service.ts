/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

import { 
	IReportData, 
	IReportError, 
	IReportParameter, 
	IReportState, 
	PlatformConfigurationService, 
	PlatformModuleManagerService 
} from '@libs/platform/common';

import { ISidebarReportAccordionData } from '../../model/interfaces/report/sidebar-report-accordion-data.interface';

/**
 * Service manages report sidebar data.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarReportService {
	/**
	 * Sidebar report data.
	 */
	private state: IReportState = {
		groups: [],
		context: [
			{ id: 0, description$tr$: 'basics.reporting.syscontextNull' },
			{ id: 1, description$tr$: 'basics.reporting.syscontextCompany' },
			{ id: 2, description$tr$: 'basics.reporting.syscontextProfitCenter' },
			{ id: 3, description$tr$: 'basics.reporting.syscontextProjekt' },
			{ id: 4, description$tr$: 'basics.reporting.syscontextMainEntityId' },
			{ id: 5, description$tr$: 'basics.reporting.syscontextMainEntityIdArray' },
			{ id: 6, description$tr$: 'basics.reporting.syscontextUserId' },
			{ id: 7, description$tr$: 'basics.reporting.syscontextUserName' },
			{ id: 8, description$tr$: 'basics.reporting.syscontextUserDescription' },
			{ id: 9, description$tr$: 'basics.reporting.syscontextSelectedMainEntities' },
			{ id: 10, description$tr$: 'basics.reporting.syscontextWatchList' },
			{ id: 11, description$tr$: 'basics.reporting.syscontextDialogSection' },
		],
		userInfo: {},
		moduleName: '',
	};

	/**
	 * Service performing http requests.
	 */
	private readonly http = inject(HttpClient);

	/**
	 * Module manager service holding module data.
	 */
	private readonly platformModuleManagerService = inject(PlatformModuleManagerService);

	/**
	 * Service holding common config's and utilities.
	 */
	private readonly configurationService = inject(PlatformConfigurationService);

	/**
	 * Method returns the user info.
	 *
	 * @returns {Observable<object>} User info.
	 */
	private loadUserInfo(): Observable<object> {
		return this.http.get(this.configurationService.webApiBaseUrl + 'services/platform/getuserinfo').pipe(
			map((userInfo) => {
				this.state.userInfo = userInfo;

				return userInfo;
			}),
		);
	}

	/**
	 * Method fetches report's data from the server and returns it.
	 *
	 * @param {string} module Current module name.
	 * @returns {Observable<Array<IReportData>>} Sidebar report data.
	 */
	private loadReports(module: string): Observable<Array<IReportData>> {
		return this.http.get<Array<IReportData>>(this.configurationService.webApiBaseUrl + 'basics/reporting/sidebar/load?module=' + module).pipe(
			map((response) => {
				this.state.groups = response;
				return response;
			}),
		);
	}

	/**
	 * Method fetches parameters for the report provided from the server and returns the modified report.
	 *
	 * @param {ISidebarReportAccordionData} report Report.
	 * @returns {Observable<ISidebarReportAccordionData>} Modified report with parameters data.
	 */
	public loadReportParameters(report: ISidebarReportAccordionData): Observable<ISidebarReportAccordionData> {
		return this.http.get<Array<IReportParameter>>(this.configurationService.webApiBaseUrl + 'basics/reporting/sidebar/parameters?id=' + report.id + '&module=' + this.state.moduleName).pipe(
			map((response) => {
				report.parameters = response.filter((data) => {
					return data.isVisible;
				});

				report.hiddenParameters = response.filter((data) => {
					return !data.isVisible;
				});

				//TODO: Implementation for dialog section is skipped for now.

				return report;
			}),
		);
	}

	/**
	 * Method creates the error information.
	 *
	 * @param {ISidebarReportAccordionData} report Report.
	 * @param {IReportParameter} parameter Report parameter data.
	 * @param {string} text Error description.
	 */
	private createErrorInfo(report: ISidebarReportAccordionData, parameter: IReportParameter, text: string): void {
		const contextDescription = this.state.context.find((data) => {
			return data.id === parameter.context;
		})?.description$tr$;

		(report.errors as IReportError[]).push({
			parameter: parameter,
			context: contextDescription as string,
			text: text,
		});
	}

	/**
	 * Method resolves the report parameters and checks for the errors if available.
	 *
	 * @param {ISidebarReportAccordionData} report Report data.
	 * @returns {boolean}
	 */
	public resolveParameters(report: ISidebarReportAccordionData): boolean {
		report.errors = [];
		report.hasError = false;
		report.showDetails = report.storeInDocs && report.exportType === 'pdf' ? true : false;

		(report.parameters as IReportParameter[]).forEach((parameter) => {
			switch (parameter.context) {
				case 0:
					report.showDetails = true;
					break;
				case 1:
					parameter.value = this.configurationService.signedInClientId;
					break;

				case 2:
					parameter.value = this.configurationService.clientId;
					break;
				case 3:
					//TODO: Dependency on module state service.
					break;

				case 4: // Selected main entity
					//TODO: Dependency on module state service.
					break;

				case 5: // Main entities (as string separated by ,)
					//TODO: Dependency on module state service.
					break;
				case 6:
					parameter.value = this.state.userInfo.UserId;
					break;

				case 7:
					parameter.value = this.state.userInfo.LogonName;
					break;

				case 8:
					parameter.value = this.state.userInfo.UserName;
					break;
				case 9:
					//TODO: Dependency on module state service.
					break;
				case 10:
					report.showDetails = true;
					break;
				case 11:
					report.showDetails = true;
					break;
			}
		});

		report.hasError = !!report.errors.length;

		return report.showDetails || report.hasError;
	}

	/**
	 * Method fetches, processes and returns the report sidebar data.
	 *
	 * @returns {Observable<IReportState>} Report sidebar data.
	 */
	public getReportData(): Observable<IReportState> {
		//TODO: Below statement is used for retrieving current module name.
		//const moduleName = <string>this.platformModuleManagerService.activeModule?.internalModuleName;

		//TODO: modulename kept static currently, will be replaced in future with above commented statement.
		//TODO: Temporarily kept static for testing & demo purpose.
		const moduleName = 'project.main';

		this.state.moduleName = moduleName;
		const reportData = forkJoin([this.loadReports(moduleName), this.loadUserInfo()]);
		return reportData.pipe(
			map(() => {
				return this.state;
			}),
		);
	}
}
