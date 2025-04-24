import { inject, InjectionToken } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ISelectItem } from '@libs/ui/common';

export const PPS_MATERIAL_PRODUCTIONMODES_TOKEN = new InjectionToken<ISelectItem<string>[]>('Production Mode', {
	providedIn: 'root', factory: () =>
		[
			{ id: 'MP', displayName: inject(PlatformTranslateService).instant('productionplanning.ppsmaterial.ppsMaterialToMdlProductType.manualProduction').text },
			{ id: 'AP', displayName: inject(PlatformTranslateService).instant('productionplanning.ppsmaterial.ppsMaterialToMdlProductType.autoProduction').text },

		]
});