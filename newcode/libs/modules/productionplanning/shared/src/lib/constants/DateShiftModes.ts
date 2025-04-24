import { inject, InjectionToken } from '@angular/core';
import { ISelectItem } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';


export const DATESHIFT_MODES_TOKEN = new InjectionToken<ISelectItem<number>[]>('DateShift Mode', {
	providedIn: 'root', factory: () =>
		[{
			id: 0,
			displayName: inject(PlatformTranslateService).instant('productionplanning.common.event.ignoreBounds').text
		}, {
			id: 1,
			displayName: inject(PlatformTranslateService).instant('productionplanning.common.event.validateBounds').text
		}, {
			id: 2,
			displayName: inject(PlatformTranslateService).instant('productionplanning.common.event.shiftChildren').text
		}]
});