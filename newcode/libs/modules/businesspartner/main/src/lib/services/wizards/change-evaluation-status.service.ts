/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { IEvaluationEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerSharedEvaluationEntityInfoService} from '@libs/businesspartner/shared';
@Injectable({
	providedIn: 'root'
})
/*
 * Service for Change Evaluation Status Wizard.
 */
export class ChangeEvaluationStatusService extends BasicsSharedChangeStatusService<IEvaluationEntity, object, object> {

	private readonly translateService = inject(PlatformTranslateService);
	protected readonly dataService = BusinesspartnerSharedEvaluationEntityInfoService.getDataServiceFromCache('953895e120714ab4b6d7283c2fc50e14')!;

	protected statusConfiguration: IStatusChangeOptions<object, object> = {
		title: this.translateService.instant('businesspartner.main.evaluationStatusTitle').text,
		guid: '68ea49dabf0940308445a6e61b00dd2b',
		isSimpleStatus: false,
		statusName: 'evaluation',
		checkAccessRight: true,
		statusField: 'EvalStatusFk',
		updateUrl: 'businesspartner/main/businesspartnermain/changeevaluationstatus'
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		//TODO: After Selection Changed
	}

}