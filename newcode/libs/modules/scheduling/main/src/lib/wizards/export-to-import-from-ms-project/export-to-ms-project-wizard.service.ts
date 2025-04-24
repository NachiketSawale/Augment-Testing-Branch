/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { HttpResponse } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class SchedulingExportToMSProjectService {
	private readonly http = inject(PlatformHttpService);

	public exportToMSProject(dataService: SchedulingMainDataService) {

		const selectedEntity = dataService.getSelectedEntity();
		const scheduleId = selectedEntity?.ScheduleFk;

		if (scheduleId) {
			this.http.request('GET',true,'scheduling/main/export/toproject?scheduleId=' + scheduleId, {
				observe: 'response',
				responseType: 'text'
				})
				.then(async (response) => {
					const res = (response as HttpResponse<string>);
					const a = document.createElement('a');
					const content = res.headers.get('content-disposition');
					a.download = content?.substring(content?.indexOf('filename=') + 9) ?? '';
					a.href = res.body ?? '';
					a.click();
				});
		}
	}
}

