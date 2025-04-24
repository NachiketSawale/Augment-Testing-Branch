/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { PlatformHttpService } from '@libs/platform/common';
import { TimekeepingTimeControllingReportDataService } from '../services/timekeeping-time-controlling-report-data.service';
import { isNil,cloneDeep  } from 'lodash';
import { IMessageBoxOptions, IYesNoDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';

export interface IResponseData{
	ErrorMsg: string,
	IsValid: boolean,
	Report: IReportEntity
}

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimecontrollingReportValidationService extends BaseValidationService<IReportEntity> {

	private readonly dataService = inject(TimekeepingTimeControllingReportDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected generateValidationFunctions(): IValidationFunctions<IReportEntity> {
		return {
			RecordingFk: [this.validateIsMandatory],
			SheetFk: [this.validateIsMandatory],
			ReportStatusFk: [this.validateIsMandatory],
			DueDate: [this.validateIsMandatory,this.asyncValidateDueDate],
			EmployeeFk: [this.validateIsMandatory,this.asyncValidateEmployeeFk]
		};
	}

	private async asyncValidateEmployeeFk(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;

		if (value === null) {
			return Promise.resolve(new ValidationResult());
		}
		await this.doValidateReport(entity,value);
		return new ValidationResult();
	}

	private async asyncValidateDueDate(info: ValidationInfo<IReportEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;

		if (value === null) {
			return Promise.resolve(new ValidationResult());
		}
		await this.doValidateReport(entity,value);
		return new ValidationResult();
	}


	private async doValidateReport(entity: IReportEntity, value: number): Promise<boolean> {
		const item = cloneDeep(entity);
		item.EmployeeFk = value;

		if (item.EmployeeFk > 0 && !isNil(item.DueDate)) {
			const response = await this.http.post<IResponseData>('timekeeping/controlling/report/validateReport', item);

			if (response && response.IsValid === false) {
				const options: IYesNoDialogOptions = {
					defaultButtonId: StandardDialogButtonId.Yes,
					id: 'YesNoModal',
					dontShowAgain: true,
					showCancelButton: true,
					headerText: 'cloud.common.errorDialogTitle',
					bodyText: response.ErrorMsg || 'An unexpected error occurred',
				};

				const userResponse = await this.messageBoxService.showYesNoDialog(options);

				if (userResponse?.closingButtonId === StandardDialogButtonId.Yes && response.Report) {
					const reportResponse = await this.http.post<IResponseData>('timekeeping/controlling/report/createrecordingorsheet', response.Report);

					if (reportResponse?.ErrorMsg?.length === 0) {
						entity.RecordingFk = reportResponse.Report.RecordingFk;
						entity.SheetFk = reportResponse.Report.SheetFk;
						return true;
					} else {
						this.showErrorDialog(reportResponse?.ErrorMsg || 'Unknown error');
					}
				} else {
					this.showErrorDialog(response.ErrorMsg);
				}
				return false;
			}
			return true;
		}
		return false;
	}

	private showErrorDialog(errorMessage: string): void {
		const options: IMessageBoxOptions = {
			headerText: 'cloud.common.errorBoxHeader',
			bodyText: errorMessage,
			buttons: [{ id: StandardDialogButtonId.Ok }],
			iconClass: 'ico-error',
		};
		this.messageBoxService.showMsgBox(options);
	}


	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IReportEntity> {
		return this.dataService;
	}

}

