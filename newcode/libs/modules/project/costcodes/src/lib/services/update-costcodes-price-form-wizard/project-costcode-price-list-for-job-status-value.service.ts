/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ProjectCostcodesPriceListForJobStatus } from '../../model/enum/project-cost-codes-price-list-for-job-status.enum ';

@Injectable({
	providedIn: 'root',
})

export class ProjectCostcodePriceListForJobStatusValueService {
	public getDescription(status: ProjectCostcodesPriceListForJobStatus): string {
		switch (status) {
			case ProjectCostcodesPriceListForJobStatus.WarningNoJob:
				return 'project.main.updateCostCodeForJob.warningNoJob';
			case ProjectCostcodesPriceListForJobStatus.Success:
				return 'project.main.updateCostCodeForJob.successMsg';
			case ProjectCostcodesPriceListForJobStatus.Warning:
				return 'project.main.updateCostCodeForJob.warningStatus';
			case ProjectCostcodesPriceListForJobStatus.Error:
				return 'project.main.updateCostCodeForJob.errorStatus';
			default:
				return '';
		}
	}
}
