/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { Injectable } from '@angular/core';

/**
 * Service for totals config structure type lookup.
 */
@Injectable({
	providedIn: 'root',
})
export class TotalsConfigStructureTypeLookupDataService<TEntity extends object = object> extends UiCommonLookupItemsDataService<{ Id: number; Description: string }, TEntity> {

	public constructor(private translate: PlatformTranslateService) {
		super([
			{ Id: 1, Description: translate.instant('basics.customize.boqHeaderFk').text },
			{ Id: 2, Description: translate.instant('basics.customize.psdActivityFk').text },
			{ Id: 3, Description: translate.instant('basics.customize.prjLocationFk').text },
			{ Id: 4, Description: translate.instant('basics.customize.mdcControllingUnitFk').text },
			{ Id: 5, Description: translate.instant('estimate.main.costGroupTitle1').text },
			{ Id: 6, Description: translate.instant('estimate.main.costGroupTitle2').text },
		], {
			uuid: 'dd401af49a5c4df0927d5287453d3461',
			displayMember: 'Description',
			valueMember: 'Id',
		});
	}
}
