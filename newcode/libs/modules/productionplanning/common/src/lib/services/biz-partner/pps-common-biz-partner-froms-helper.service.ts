import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class PpsCommonBizPartnerFromsHelper {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly froms = [
		{ id: 'PROJECT', description: this.translateService.instant('project.main.sourceProject').text },
		{ id: 'PPSHEADER', description: this.translateService.instant('productionplanning.common.header.headerTitle').text },
		{ id: 'MNTREQ', description: this.translateService.instant('productionplanning.mounting.entityRequisition').text },
	];
	public getFroms() {
		return this.froms;
	}
}
