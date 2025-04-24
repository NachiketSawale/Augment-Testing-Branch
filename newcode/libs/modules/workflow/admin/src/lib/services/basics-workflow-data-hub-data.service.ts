import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IWorkflowDataHubStatusChart } from '../model/interfaces/workflow-data-hub-status-chart.interface';
import { IWorkflowDataHubMonthCountChart } from '../model/interfaces/workflow-data-hub-month-count-chart.interface';
import { IWorkflowDataHubTopTenActionsChart } from '../model/interfaces/workflow-data-hub-top-ten-actions-chart.interface';

@Injectable({
	providedIn: 'root'
})
export class BasicsWorkflowDataHubDataService {

	private readonly httpService = inject(PlatformHttpService);

	public getStatus(){
		return this.httpService.get<IWorkflowDataHubStatusChart[]>('basics/workflow/v2/datahub/statuscount');
	}

	public getAvgDuration(){
		return this.httpService.get<IWorkflowDataHubMonthCountChart>('basics/workflow/v2/datahub/avgduration');
	}

	public getTopTenActions() {
		return this.httpService.get<IWorkflowDataHubTopTenActionsChart[]>('basics/workflow/v2/datahub/toptenactions');
	}

	public getUserTaskCount() {
		return this.httpService.get<IWorkflowDataHubMonthCountChart>('basics/workflow/v2/datahub/usertaskcount');
	}
}