/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';

import { IMessageBoxOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';

import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Procurement Common Order Proposals Wizard Service
 */
@Injectable({
	providedIn: 'root',
})
export abstract class ProcurementCommonOrderProposalsWizardService {
	/**
	 * To inject UiCommonMessageBoxService
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * To inject UiCommonDialogService
	 */
	public modalDialogService = inject(UiCommonDialogService);

	/**
	 * To inject PlatformTranslateService
	 */
	protected readonly translateService = inject(PlatformTranslateService);

	/**
	 * Abstract method for creating a contract or requisition
	 * @returns {Promise<void>}
	 */
	protected abstract createContractOrCreateRequisition(headerText: string, item: string): Promise<void>;

	/**
	 * Abstract method for creating a contract or requisition.
	 * @param {number[]} entityIds
	 */
	protected abstract goToModule(entityIds: number[]): void;

	/**
	 * To display success dialog after contract or requistion created
	 * @param {string} successMessage
	 * @param {string} item
	 */
	public showCreationSuccessDialog(successMessage: string, item: string, headerText: string, entityIds: number[]): void {
		const gotoCaption = this.translateService.instant('procurement.stock.wizard.createByOrderProposal.goto', { goto: item }).text;
		const buttons = [
			{ id: 'gotoType', caption: { key: gotoCaption }, fn: () => this.goToModule(entityIds), autoClose: true },
			{ id: StandardDialogButtonId.Ok, caption: { key: 'ui.common.dialog.okBtn' } },
		];
		const msgOptions: IMessageBoxOptions = {
			headerText: headerText,
			topDescription: { text: successMessage, iconClass: 'tlb-icons ico-info' },
			buttons: buttons,
		};
		this.messageBoxService.showMsgBox(msgOptions);
	}
}
