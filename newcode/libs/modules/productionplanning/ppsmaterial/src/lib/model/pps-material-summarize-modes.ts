import { inject, InjectionToken } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ISelectItem } from '@libs/ui/common';

export const PPS_MATERIAL_SUMMARIZEMODES_TOKEN = new InjectionToken<ISelectItem<number>[]>('Summarize Mode', {
	providedIn: 'root', factory: () =>
		[
			{ id: 1, displayName: inject(PlatformTranslateService).instant('productionplanning.ppsmaterial.summarized.merge') },
			{ id: 2, displayName: inject(PlatformTranslateService).instant('productionplanning.ppsmaterial.summarized.group') },
		]
});