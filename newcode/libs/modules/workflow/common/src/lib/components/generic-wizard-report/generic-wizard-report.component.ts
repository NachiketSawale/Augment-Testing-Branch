/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Injector, Input, OnChanges, runInInjectionContext, SimpleChanges } from '@angular/core';
import { IGenericWizardReportEntity } from '../../configuration/rfq-bidder/types/generic-wizard-report-entity.interface';
import { IReportParametersData, IReportPrepareData, PlatformConfigurationService, PlatformHttpService, PlatformReportService } from '@libs/platform/common';
import { MatRadioChange } from '@angular/material/radio';
import { GenericWizardReportParametersServiceBase, ReportPlaceholder } from '../../services/base/generic-wizard-report-parameters-base.service';
import { GenericWizardConfigService } from '../../services/base/generic-wizard-config.service';

@Component({
	selector: 'workflow-common-generic-wizard-report',
	templateUrl: './generic-wizard-report.component.html',
	styleUrl: './generic-wizard-report.component.css',
})
export class GenericWizardReportComponent extends GenericWizardReportParametersServiceBase implements OnChanges {

	/*
	List of reports
	 */
	@Input()
	public reportList: IGenericWizardReportEntity[] = [];

	/**
	 * List of keys that will set default value of report parameters by default.
	 */
	@Input()
	public override placeholders: ReportPlaceholder = {};

	/**
	 * Selected cover letter, this property is only valid for cover letter container.
	 */
	public selectedCoverLetter: number = 0;

	private readonly platformReportingService = inject(PlatformReportService);
	private readonly injector = inject(Injector);
	

	public constructor(
		httpService: PlatformHttpService,
		wizardConfigService: GenericWizardConfigService,
		platformConfigurationService: PlatformConfigurationService
	) {
		super(httpService, wizardConfigService, platformConfigurationService);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (this.reportList.length > 0) {
			/**
			 * Setting default value for selected coverletter.
			 */
			this.selectedCoverLetter = (this.reportList.find(item => item.isIncluded) !== undefined ? this.reportList.find(item => item.isIncluded)?.Id : this.reportList.find(item => item.IsDefault)?.Id)  ?? 0;

			runInInjectionContext(this.injector, () => {
				this.prepareReportParameters(this.reportList);
			});
		}
	}

	/**
	 * Updates the current selected coverletter in the report list.
	 * @param item 
	 */
	public onCoverLetterSelected(item: MatRadioChange) {
		this.reportList.forEach(item => item.isIncluded = false);
		const report = this.reportList.find(item => item.Id === this.selectedCoverLetter);
		if(report) {
			report.isIncluded = true;
		}
	}

	/*
	Open report preview
	 */
	public openReport(report: IGenericWizardReportEntity, event: MouseEvent) {
		event?.stopPropagation();
		const prepareReport: IReportPrepareData = {
			Id: report.Id,
			Name: report.Name?.Description ?? '',
			Path: report.FilePath ?? '',
			TemplateName: report.FileName ?? ''
		};

		const prepareParam: IReportParametersData[] = report.ReportParameterEntities?.map(param => {
			const newParam: IReportParametersData = {
				Name: param.ParameterName ?? '',
				Description: param.DescriptionInfo?.Description,
				ParamValueType: param.DataType ?? '',
			};
			return newParam;
		}) ?? [];

		this.platformReportingService.prepare(prepareReport, prepareParam).subscribe((preparedReport) => {
			this.platformReportingService.show(preparedReport);
		}).unsubscribe();
	}
}
