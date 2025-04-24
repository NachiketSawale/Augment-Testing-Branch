/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { AccountingJournalsTransactionDataService } from '../accounting-journals-transaction-data.service';
import { IAccountingJournalsTransactionEntity } from '../../model/entities/accounting-journals-transaction-entity.interface';
import { PlatformTranslateService } from '@libs/platform/common';
import { AccountingJournalsMainService } from '../accounting-journals-main.service';
import { IAccountingJournalsEntity } from '../../model/entities/accounting-journals-entity.interface';
import { IAccountingJournalsComplete } from '../../model/entities/accounting-journals-complete.interface';

@Injectable({
	providedIn: 'root',
})
export class ChangeTransactionStatusWizardService extends BasicsSharedChangeStatusService<IAccountingJournalsTransactionEntity, IAccountingJournalsEntity, IAccountingJournalsComplete> {
	protected readonly dataService = inject(AccountingJournalsTransactionDataService);
	protected readonly rootDataService = inject(AccountingJournalsMainService);
	private readonly translateService = inject(PlatformTranslateService);

	protected statusConfiguration: IStatusChangeOptions<IAccountingJournalsEntity, IAccountingJournalsComplete> = {
		title: this.translateService.instant('basics.accountingJournals.wizard.changeStatus.title').text,
		guid: 'a8c2353fca6b48a88c9b25901b0a7528',
		isSimpleStatus: false,
		statusName: 'companytransheaderstatus',
		checkAccessRight: true,
		statusField: 'CompanyTransheaderStatusFk',
		updateUrl: 'basics/company/transheader/changestatus',
		rootDataService: this.rootDataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		//todo--need refresh record
	}
}
