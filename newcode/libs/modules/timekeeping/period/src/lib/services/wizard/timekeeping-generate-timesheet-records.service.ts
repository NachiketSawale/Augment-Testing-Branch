import { inject, Injectable } from '@angular/core';
import { TimekeepingPeriodDataService } from '../timekeeping-period-data.service';
import { PlatformTranslateService, PlatformConfigurationService, Dictionary } from '@libs/platform/common';
import { catchError, of } from 'rxjs';
import { IMessageBoxOptions, UiCommonMessageBoxService } from '@libs/ui/common';
import { IRecordingEntity, IReportEntity, ISheetEntity } from '@libs/timekeeping/interfaces';
import { HttpClient } from '@angular/common/http';

interface ApiResponse {

	newEntities: {
		newRecordings: IRecordingEntity[];
		newSheets: ISheetEntity[];
		newReports: IReportEntity[];
	};
	message: string;
}

@Injectable({
	providedIn: 'root'
})

export class TimekeepingGenerateTimesheetRecordsService {

	protected readonly translateServiceService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	private readonly dataService = inject(TimekeepingPeriodDataService);

	public generateTimeSheetRecords(options: Dictionary<string, unknown>) {
		const selectedEntity = this.dataService.getSelectedEntity();
		if (!selectedEntity) {
			const bodyText = this.translateServiceService.instant('timekeeping.period.selectrecord');
			this.messageBoxService.showInfoBox(bodyText.text, 'error', true);
			return;
		}
		const overwrite = String(options.get('OverwriteExistingEntries') ?? '').toLowerCase() === 'true';
		const postData = {
			PeriodIds: [selectedEntity.Id],
			OverwriteExistingEntries: overwrite
		};

		this.http.post<ApiResponse>(this.configurationService.webApiBaseUrl + 'timekeeping/period/generatetimesheetrecords', postData)
			.pipe(
				catchError(error => {
					console.error('Error occurred during HTTP request:', error);
					return of(null);
				})
			)
			.subscribe(response => {
				if (response) {
					const newRecordings = response.newEntities.newRecordings.length;
					const newSheets = response.newEntities.newSheets.length;
					const newReports = response.newEntities.newReports.length;
					const message = response.message;
					const modalOptions:IMessageBoxOptions=
						{
							headerText: this.translateServiceService.instant('timekeeping.period.generatetimesheetrecords').text,
							bodyText: '',
							iconClass: 'ico-info'
						};
					if (newRecordings > 0 || newSheets > 0 || newReports > 0) {
						const bodyText = `${message}! ${this.translateServiceService.instant('timekeeping.period.newRecordings').text}: "${newRecordings}"; ${this.translateServiceService.instant('timekeeping.period.newSheets').text}: "${newSheets}"; ${this.translateServiceService.instant('timekeeping.period.newReports').text}: "${newReports}" ${this.translateServiceService.instant('timekeeping.period.generatedSuccess').text}`;
						modalOptions.bodyText = bodyText;
					} else {
						modalOptions.bodyText = `${message}! ${this.translateServiceService.instant('timekeeping.period.noRecordGenerated').text}`;
					}
					this.messageBoxService.showMsgBox(modalOptions);
				} else {
					this.messageBoxService.showInfoBox(this.translateServiceService.instant('timekeeping.period.generatetimesheetrecords').text, 'error', true);
				}
			});
	}
}