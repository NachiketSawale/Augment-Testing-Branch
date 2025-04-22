/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { SalesWipWipsDataService } from '../sales-wip-wips-data.service';
import { SalesCommonChangeCodeService } from '@libs/sales/common';

@Injectable({
	providedIn: 'root'
})
export class SalesWipChangeCodeWizardService {

	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	public headerDataService: SalesWipWipsDataService = inject(SalesWipWipsDataService);
	private salesCommonChangeCodeWizardService = inject(SalesCommonChangeCodeService);

	public changeWipCode() {
		const selectedEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Change Code').text, 'ico-warning');
			return;
		}
		this.salesCommonChangeCodeWizardService.showChangeCodeDialog('wip', selectedEntity);
	}
}