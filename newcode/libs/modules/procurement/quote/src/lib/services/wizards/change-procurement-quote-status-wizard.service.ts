/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProcurementQuoteHeaderDataService } from '../quote-header-data.service';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../../model/entities/quote-header-entity-complete.class';

/**
 * Change Procurement Quote Status Wizard Service
 */
@Injectable({
	providedIn: 'root',
})
export class ChangeProcurementQuoteStatusWizardService extends BasicsSharedChangeStatusService<IQuoteHeaderEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	protected readonly dataService = inject(ProcurementQuoteHeaderDataService);
	private readonly translateService = inject(PlatformTranslateService);
	protected statusConfiguration: IStatusChangeOptions<IQuoteHeaderEntity, QuoteHeaderEntityComplete> = {
		title: this.translateService.instant('procurement.quote.wizard.change.statusTitle').text,
		guid: '9EE2683AFCAD489DB7759D5729115995',
		isSimpleStatus: false,
		statusName: 'quote',
		checkAccessRight: true,
		statusField: 'StatusFk',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
