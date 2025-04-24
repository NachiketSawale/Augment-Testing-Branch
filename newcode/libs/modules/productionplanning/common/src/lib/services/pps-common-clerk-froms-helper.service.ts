import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class PpsCommonClerkFromsHelper {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly froms = [
		{ id: '', description: '' },
		{ id: 'PRJ', description: this.translateService.instant('project.main.sourceProject').text },
		{ id: 'OrdHeader', description: this.translateService.instant('productionplanning.common.ordHeaderFk').text },
	];

	public getFroms() {
		return this.froms;
	}
}
