/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { IInvHeaderEntity } from '../model/entities';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { InvComplete } from '../model';

/**
 * Change Procurement Invoice Status Wizard Service
 */
@Injectable({
	providedIn: 'root',
})
export class ChangeProcurementInvoiceStatusWizardService extends BasicsSharedChangeStatusService<IInvHeaderEntity, IInvHeaderEntity, InvComplete> {
	protected readonly dataService = inject(ProcurementInvoiceHeaderDataService);
	private readonly translateService = inject(PlatformTranslateService);
	protected statusConfiguration: IStatusChangeOptions<IInvHeaderEntity, InvComplete> = {
		title: this.translateService.instant('procurement.invoice.wizard.change.status.headerText').text,
		guid: '6bfc42be60cf4609b7bd49241e8620ca',
		isSimpleStatus: false,
		statusName: 'invoice',
		checkAccessRight: true,
		statusField: 'InvStatusFk',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}