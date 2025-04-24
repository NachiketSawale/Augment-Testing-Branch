/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { IEditorDialogResult, StandardDialogButtonId } from '@libs/ui/common';
import { firstValueFrom } from 'rxjs';
import { BasicsSharedPesStatusLookupService } from '@libs/basics/shared';
import { PES_CREATE_INVOICE_WIZARD_TOKEN, ProcurementPesCreateInvoiceWizardComponent } from '../components/procurement-pes-create-invoice-wizard/procurement-pes-create-invoice-wizard.component';
import { IContractLookupEntity, ProcurementInternalModule, ProcurementShareContractLookupService } from '@libs/procurement/shared';
import { compact } from 'lodash';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

export enum PESCreateInvoiceOption {
	one2One,
	one2SameContract,
	one2All,
}

export interface IPESCreateInvoiceWizardData {
	pesForCreate: IPesHeaderEntity[];
	pesForSkip: IPesHeaderEntity[];
	createOption: PESCreateInvoiceOption;
	invoiceCreateInfo: IInvoiceCreateParam[];
	conHeadersForPes: IContractLookupEntity[];
}

export interface IInvoiceCreateParam {
	pesEntities: IPesHeaderEntity[];
	Reference: string;
	Code: string;
	PrcConfigFk: number;
	InvTypeFk: number;
	DateInvoiced: Date;
	RubricCategoryFk: number;
	PrcConfigHeaderFk: number;
	ConHeaderFk?: number;
	RuntimeData: EntityRuntimeData<IInvoiceCreateParam>
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesCreateInvoiceWizardService extends ProcurementCommonWizardBaseService<IPesHeaderEntity, PesCompleteNew, IInvoiceCreateParam[]> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementPesHeaderDataService),
		});
	}

	private readonly pesStatusLookupService = inject(BasicsSharedPesStatusLookupService);
	private readonly contractLookupService = inject(ProcurementShareContractLookupService);
	private pesCanCreateInvoice: IPesHeaderEntity[] = [];
	private conHeadersForPes: IContractLookupEntity[] = [];

	protected override async startWizardValidate(): Promise<boolean> {
		if (!(await super.startWizardValidate(false))) {
			return false;
		}

		const selPESEntities = this.config.rootDataService.getSelection();
		const pesStatus = await firstValueFrom(this.pesStatusLookupService.getList());

		this.pesCanCreateInvoice = selPESEntities.filter((entity) => {
			const status = pesStatus.find((status) => status.Id === entity.PesStatusFk);
			return status ? status.IsAccepted && !status.Iscanceled && !status.Isvirtual && !status.Isinvoiced : false;
		});

		if (this.pesCanCreateInvoice.length === 0) {
			await this.messageBoxService.showMsgBox('procurement.pes.wizard.createInvoiceStatusNotAllow', 'procurement.pes.wizard.createInvoiceFail', 'ico-error');
			return false;
		}

		this.conHeadersForPes = await this.getConHeadersForPes(this.pesCanCreateInvoice);

		if (this.pesCanCreateInvoice.length < selPESEntities.length) {
			await this.messageBoxService.showMsgBox('procurement.pes.wizard.createInvoiceStatusPassedAllow', 'procurement.pes.wizard.createInvoiceFail', 'ico-warning');
			return true;
		}

		return true;
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<IInvoiceCreateParam[]> | undefined> {
		const selPESEntities = this.config.rootDataService.getSelection();

		return this.dialogService.show({
			width: '620px',
			headerText: 'procurement.pes.wizard.createInvoiceCaption',
			resizeable: true,
			id: 'fd308c3dd8494cbabee281e8fa2d81c6',
			showCloseButton: true,
			bodyComponent: ProcurementPesCreateInvoiceWizardComponent,
			bodyProviders: [
				{
					provide: PES_CREATE_INVOICE_WIZARD_TOKEN,
					useValue: {
						pesForCreate: this.pesCanCreateInvoice,
						pesForSkip: selPESEntities.filter((entity) => !this.pesCanCreateInvoice.includes(entity)),
						createOption: PESCreateInvoiceOption.one2One,
						invoiceCreateInfo: [],
						conHeadersForPes: this.conHeadersForPes
					},
				},
			],
			buttons: [
				{
					id: 'back',
					caption: {key: 'basics.common.button.previousStep'},
					autoClose: false,
					fn(evt, info) {
						info.dialog.body.onBackBtnClicked();
						return undefined;
					},
					//TODO: there is framework issue for the dialog button report error. https://rib-40.atlassian.net/browse/DEV-19483
					isVisible: (info) => {
						return info.dialog.body.backBtnVisible();
					},
				},
				{
					id: 'next',
					caption: {key: 'basics.common.button.nextStep'},
					autoClose: false,
					fn(evt, info) {
						info.dialog.body.onNextBntClicked();
						return undefined;
					},

					isDisabled: (info) => {
						return info.dialog.body.nextBtnDisabled();
					},
				},
				{
					id: StandardDialogButtonId.Ok,
					caption: {key: 'ui.common.dialog.okBtn'},
					fn(evt, info) {
						info.dialog.body.onOkBtnClicked();
						return undefined;
					},
					isDisabled: (info) => {
						return info.dialog.body.okBtnDisabled();
					},
				},
				{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}},
			],
			bottomDescription: 'procurement.pes.wizard.multiplePesCreateInOneInvoiceNote'
		});
	}

	protected override async doExecuteWizard(opt?: IInvoiceCreateParam[], bntId: StandardDialogButtonId | string = StandardDialogButtonId.Ok): Promise<boolean> {
		if (opt) {
			this.wizardUtilService.showLoadingDialog('procurement.pes.wizard.createInvoiceCaption');
			const params = opt.map((param) => {
				return {
					PesIds: param.pesEntities.map((pes) => pes.Id),
					ConHeaderFk: param.ConHeaderFk,
					Reference: param.ConHeaderFk,
					Code: param.Code,
					PrcConfigFk: param.PrcConfigFk,
					InvTypeFk: param.InvTypeFk,
					DateInvoiced: param.DateInvoiced,
				};
			});

			const resp = await this.http.post<{ InvHeader: { Id: number }; Message: string[]; Error: string[] }[]>('procurement/invoice/header/createByPes', {
					InvHeadersCreateFromPesParameter: params
				});

			this.wizardUtilService.closeLoadingDialog();

			if (resp.length) {
				let message = '';
				let hasSuccess = false;

				//Message for success
				if (resp.some((r) => r.Message.length > 0)) {
					hasSuccess = true;
					message += this.translateService.instant('procurement.pes.wizard.createInvSuccess').text + '\n';
					message += resp.map((r) => this.translateService.instant('procurement.pes.wizard.newCode', {newCode: r.Message[0]}).text).join('\n');
				}

				//Message for failed
				if (resp.some((r) => r.Error.length > 0)) {
					message += this.translateService.instant('procurement.pes.wizard.createInvoiceFail').text + '\n';
					message += resp.map((r) => r.Error[0]).join('\n');
				}

				if (hasSuccess) {
					const invoiceIds = resp.map((r) => {
						return {id: r.InvHeader.Id};
					});

					this.wizardUtilService.showGoToMsgBox(message, 'procurement.pes.wizard.createInvoiceCaption', invoiceIds, ProcurementInternalModule.Invoice);
				} else {
					this.messageBoxService.showMsgBox(message, 'procurement.pes.wizard.createInvoiceCaption', 'ico-error');
				}
			}
		}

		return true;
	}

	private async getConHeadersForPes(pesHeader: IPesHeaderEntity[]): Promise<IContractLookupEntity[]> {
		const contractIds = compact(pesHeader.map((i) => i.ConHeaderFk));
		return contractIds?.length > 0 ?
			firstValueFrom(this.contractLookupService.getItemByKeys(contractIds)) :
			[];
	}
}
