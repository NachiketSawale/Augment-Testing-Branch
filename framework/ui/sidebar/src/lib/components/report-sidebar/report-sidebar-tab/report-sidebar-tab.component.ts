/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Subscription, of } from 'rxjs';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { UiCommonMessageBoxService } from '@libs/ui/common';
import { UiSidebarReportService } from '../../../services/report/report-sidebar.service';

import { IReportData, IReportLanguageData, IReportParameter, IReportParametersData, IReportsData, PlatformReportLanguageItemService, PlatformReportService, PlatformTranslateService } from '@libs/platform/common';

import { ISidebarReportAccordionData } from '../../../model/interfaces/report/sidebar-report-accordion-data.interface';
import { DispatchId } from '../../../model/enums/dispatch-id.enum';

/**
 * Class handles the basic sidebar operations like getting and preparing data, generate report etc.
 */
@Component({
	selector: 'ui-sidebar-report-tab',
	templateUrl: './report-sidebar-tab.component.html',
	styleUrls: ['./report-sidebar-tab.component.scss'],
})
export class UiSidebarReportTabComponent implements OnInit, OnDestroy {
	/**
	 * Header for parameter tab.
	 */
	public infoHeader: string = '';

	/**
	 * Current selected report.
	 */
	public report!: ISidebarReportAccordionData;

	/**
	 * Boolean indicating whether to show list or show parameters.
	 */
	public showList: boolean = true;

	/**
	 * Report language data.
	 */
	public reportLanguageToolbar: IReportLanguageData = {
		showImages: true,
		showTitles: true,
	};

	/**
	 * Report sidebar accordion data.
	 */
	public reportAccordionData!: ISidebarReportAccordionData[];

	/**
	 * Represents a disposable resource for observables.
	 */
	private readonly resultSubscription: Subscription[] = [];

	/**
	 * Service is useful for language translation
	 */
	private readonly platformTranslateService = inject(PlatformTranslateService);

	/**
	 * Service manages report sidebar data.
	 */
	private readonly reportSidebarService = inject(UiSidebarReportService);

	/**
	 * Service used for preparing and rendering report.
	 */
	private readonly reportPlatformService = inject(PlatformReportService);

	/**
	 * service creates the configuration object for modal dialog and also opens and closes modal dialog.
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * Service processes the language data.
	 */
	private readonly reportSidebarLanguageItemService = inject(PlatformReportLanguageItemService);

	/**
	 * Method is invoked only once when the component is instantiated.
	 */
	public ngOnInit(): void {
		this.loadReports();
	}

	/**
	 * Method fetches the report data from server.
	 */
	private loadReports(): void {
		const loadReportSub = this.reportSidebarService.getReportData().subscribe((response) => {
			this.prepareReportAccordionData(response.groups);
		});

		this.resultSubscription.push(loadReportSub);
	}

	/**
	 * Method processes the server data according to accordion data interface.
	 *
	 * @param {IReportData[]} groupData Report data from server.
	 */
	private prepareReportAccordionData(groupData: IReportData[]): void {
		const reportAccordionData: ISidebarReportAccordionData[] = [];

		groupData.forEach((data) => {
			const accordionData: ISidebarReportAccordionData = {
				id: data.id,
				title: data.name,
				imgCss: data.icon,
				expanded: false,
				isSearch: false,
			};

			if (data.reports && data.reports.length > 0) {
				accordionData.hasChild = true;
				accordionData.children = this.getChildAccordionData(data.reports);
			}

			reportAccordionData.push(accordionData);
		});

		this.reportAccordionData = reportAccordionData;
	}

	/**
	 * Method prepares and returns the accordion data.
	 *
	 * @param {IReportsData[]} reports Report data from server.
	 * @returns {ISidebarReportAccordionData[]} Child accordion data.
	 */
	private getChildAccordionData(reports: IReportsData[]): ISidebarReportAccordionData[] {
		const reportAccordionData: ISidebarReportAccordionData[] = [];

		reports.forEach((report, index) => {
			const accordionData: ISidebarReportAccordionData = {
				id: report.id,
				groupId: report.groupId,
				title: report.name,
				comment: report.text,
				parameters: report.parameters,
				documentCategory: report.documentCategory,
				documentType: report.documentType,
				rubricCategory: report.rubricCategory,
				filename: report.filename,
				path: report.path,
				storeInDocs: report.storeInDocs,
				storeInDocsState: report.storeInDocsState,
				hasChild: false,
				sort: index,
			};
			reportAccordionData.push(accordionData);
		});

		return reportAccordionData;
	}

	/**
	 * Method gets called upon report item click, which then validates the data and
	 * prepares the report if no errors present.
	 *
	 * @param {{ dispatcherId: string; report: ISidebarReportAccordionData }} data Report data.
	 */
	public showParametersOrExecute(data: { dispatcherId: string; report: ISidebarReportAccordionData }): void {
		this.report = data.report;

		data.report.pending = true;

		const sub = (!Array.isArray(this.report.parameters) ? this.reportSidebarService.loadReportParameters(this.report) : of(this.report)).subscribe({
			next: (report) => {
				switch (data.dispatcherId) {
					case DispatchId.PdfPrint:
						report.exportType = 'pdf';
						this.showDetailView(this.report);
						break;
					case DispatchId.PdfDirectPrint:
						//TODO: At moment no function declared.
						break;
					case DispatchId.Preview:
						report.exportType = '';
						this.showDetailView(this.report);
						break;
					case DispatchId.PreviewDirectPrint:
						this.showPreviewPrint(this.report);
						break;
				}
				data.report.pending = false;
			},
			error: () => {
				data.report.pending = false;
			},
		});

		this.resultSubscription.push(sub);
	}

	/**
	 * Method prepares the report if no errors present and no details to show or
	 * renders the parameters and errors if present.
	 *
	 * @param {ISidebarReportAccordionData} report Report data.
	 */
	private showDetailView(report: ISidebarReportAccordionData): void {
		if (this.reportSidebarService.resolveParameters(report)) {
			this.prepareInfoHeader(report);
			this.toggleView();
		} else {
			this.prepareReport(report);
		}
	}

	/**
	 * Method Prepares the header title for the parameters tab.
	 *
	 * @param {ISidebarReportAccordionData} report Report data.
	 */
	private prepareInfoHeader(report: ISidebarReportAccordionData): void {
		let header = '';

		if (report.errors && report.errors.length) {
			header += this.platformTranslateService.instant('basics.reporting.sidebarErrorTitle').text;
		}

		if (report.errors && report.errors.length && report.showDetails) {
			header += ' | ';
		}

		if (report.showDetails) {
			header += this.platformTranslateService.instant('basics.reporting.sidebarParameterTitle').text;
		}

		this.infoHeader = header;
	}

	/**
	 * Method prepares the report.
	 *
	 * @param {ISidebarReportAccordionData} report Report data.
	 */
	private showPreviewPrint(report: ISidebarReportAccordionData) {
		this.prepareReport(report);
	}

	/**
	 * Method toggles the view from list to parameter and vice versa.
	 *
	 * @param {boolean} forceList To forcefully render the list.
	 */
	public toggleView(forceList?: boolean): void {
		this.showList = forceList || !this.showList;
	}

	/**
	 * Method gets called upon the change in the parameter values to generate the report,
	 * after some validations.
	 *
	 * @param {boolean} uiTriggered
	 */
	public validateParametersAndExecute(uiTriggered: boolean): void {
		if (!this.showList) {
			this.reportSidebarService.resolveParameters(this.report);
			if (uiTriggered) {
				if (!this.report.hasError && !this.report.pending) {
					this.report.pending = true;
					this.prepareReport(this.report);
				}
				this.prepareInfoHeader(this.report);
			} else if (!this.report.hasError && !this.report.showDetails && !this.report.pending) {
				this.report.pending = true;
				this.prepareReport(this.report);
				this.toggleView(true);
			} else {
				this.prepareInfoHeader(this.report);
			}
		}
	}

	/**
	 * Method Prepares and renders the report.
	 *
	 * @param {ISidebarReportAccordionData} report Report data.
	 */
	private prepareReport(report: ISidebarReportAccordionData): void {
		const reportData = {
			Name: report.title as string,
			TemplateName: report.filename as string,
			Path: report.path as string,
			Id: +report.id,
		};

		const parameters: IReportParametersData[] = [];

		(report.parameters as IReportParameter[]).forEach((parameter) => {
			const paramValue = {
				Name: parameter.parameterName,
				ParamValue: parameter.value === null ? null : JSON.stringify(parameter.value),
				ParamValueType: parameter.dataType,
			};
			parameters.push(paramValue);
		});

		report.hiddenParameters?.forEach((item) => {
			parameters.push({
				Name: item.parameterName,
				ParamValue: item.value !== undefined ? (item.value === null ? null : JSON.stringify(item.value)) : item.defaultValue,
				ParamValueType: item.dataType,
			});
		});

		parameters.push({
			Name: 'PreviewUICulture',
			ParamValue: JSON.stringify(this.reportSidebarLanguageItemService.getCultureViaId(this.reportLanguageToolbar)),
			ParamValueType: 'System.String',
		});

		const sub = this.reportPlatformService.prepare(reportData, parameters, report.exportType as string).subscribe({
			next: (result) => {
				this.reportPlatformService.show(result);

				if (report.storeInDocsState) {
					this.messageBoxService.showMsgBox('basics.reporting.infoStoreInDocsText', 'basics.reporting.infoDialogHeader', 'ico-info', 'message', false);
				}

				report.pending = false;
			},
			error: () => {
				report.pending = false;
			},
		});

		this.resultSubscription.push(sub);
	}

	/**
	 * Unsubscribed the mouseevents to avoid leak problems.
	 */
	public ngOnDestroy(): void {
		this.resultSubscription.forEach((s) => s.unsubscribe());
	}
}
