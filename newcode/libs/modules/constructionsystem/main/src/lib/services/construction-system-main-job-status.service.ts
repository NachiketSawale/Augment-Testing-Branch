/**
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ConstructionSystemMainJobStatus } from '../model/enums/cos-main-job-status.enum';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * use to handle Construction System Job Status
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainJobStatusService {
	private readonly translateService = inject(PlatformTranslateService);
	public getJobStatus() {
		return [
			{ Id: ConstructionSystemMainJobStatus.Waiting, Description: this.translateService.instant('constructionsystem.main.status.waiting').text },
			{ Id: ConstructionSystemMainJobStatus.Running, Description: this.translateService.instant('constructionsystem.main.status.running').text },
			{ Id: ConstructionSystemMainJobStatus.Finished, Description: this.translateService.instant('constructionsystem.main.status.finished').text },
			{ Id: ConstructionSystemMainJobStatus.Canceling, Description: this.translateService.instant('constructionsystem.main.status.canceling').text },
			{ Id: ConstructionSystemMainJobStatus.Canceled, Description: this.translateService.instant('constructionsystem.main.status.canceled').text },
			{ Id: ConstructionSystemMainJobStatus.Aborted, Description: this.translateService.instant('constructionsystem.main.status.aborted').text },
		];
	}
}
