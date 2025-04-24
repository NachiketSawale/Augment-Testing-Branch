
/*
 * Copyright(c) RIB Software GmbH
 */
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first, get, has, isFunction, isObject, size } from 'lodash';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { ISalesBillingSetPreviousBillFields } from './interfaces/sales-billing-set-previous-bills-field.interface';
import {
	createLookup,
	FieldType,
	IDialogButtonBase,
	IFormConfig,
	IFormDialog,
	IFormDialogConfig,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { SalesCommonBillsDialogV2LookupService } from '@libs/sales/common';

@Injectable({
	providedIn: 'root',
})

/**
 * Set previous bill wizard service.
 */
export class SalesBillingSetPreviousBillWizardService {
	/**
	 * Get the http action methods to handling the request and response activity
	 */
	private readonly httpSvc = inject(PlatformHttpService);

	/**
	 * Billing data service.
	 */
	private readonly salesBillingSvc = inject(SalesBillingBillsDataService);

	/**
	 * Diplays form dialog box.
	 */
	private readonly formDialogSvc = inject(UiCommonFormDialogService);

	/**
	 * Displays messsage/info/error dialog box.
	 */
	private readonly messageBoxSvc = inject(UiCommonMessageBoxService);

	/**
	 * Used for language translation.
	 */
	private readonly translateSvc = inject(PlatformTranslateService);

	/**
	 * opens dialog on wizard item click.
	 *
	 */
	public async showDialog(): Promise<void> {
		const selectedBills = this.salesBillingSvc.getSelection();
		const title = 'sales.billing.setPreviousBillWizardTitle';
		const msg = 'sales.billing.noCurrentBillSelection';

		if (size(selectedBills) === 1) {
			const selectedBill = first(selectedBills);

			if (!selectedBill) {
				const message = this.translateSvc.instant(msg).text;
				throw new Error(message);
			}

			if (!this.assertBillIsNotReadOnly(title, selectedBill)) {
				return;
			}

			const dialogOptions: IFormDialogConfig<ISalesBillingSetPreviousBillFields> = {
				headerText: title,
				formConfiguration: this.getFormConfig(),
				entity: this.getEntity(selectedBill),
				buttons: this.getButtons(selectedBill),
			};

			await this.formDialogSvc.showDialog<ISalesBillingSetPreviousBillFields>(dialogOptions);
		} else {
			this.showReadOnlyMsg(title, msg, 'ico-info');
		}
	}

	/**
	 * Returns dialog standard buttons.
	 *
	 * @param selectedBill Selected bill entity.
	 * @returns Dialog buttons.
	 */
	private getButtons(selectedBill: IBilHeaderEntity): IDialogButtonBase<IFormDialog<ISalesBillingSetPreviousBillFields>, void>[] {
		return [
			this.getOkButton(selectedBill),
			this.getCancelButton()
		];
	}

	/**
	 * Returns ok button configuration.
	 *
	 * @param selectedBill Selected bill entity
	 * @returns Ok button config.
	 */
	private getOkButton(selectedBill: IBilHeaderEntity): IDialogButtonBase<IFormDialog<ISalesBillingSetPreviousBillFields>, void> {
		return {
			id: StandardDialogButtonId.Ok,
			isDisabled: (info) => {
				return info.dialog.value?.PreviousBillId === selectedBill.PreviousBillFk;
			},
			fn: (event, info) => {
				if (has(info.dialog.value, 'PreviousBillId')) {
					const previousBillId = get(info.dialog.value, 'PreviousBillId');
					if (previousBillId && previousBillId > 0 && isObject(selectedBill)) {
						const url = 'sales/billing/ispreviousbillchangepossible';
						const params = new HttpParams().set('bilHeaderId', selectedBill.Id);

						this.httpSvc.get<boolean>(url, { params: params }).then((response) => {
							if (!response) {
								this.showReadOnlyMsg('sales.billing.setPreviousBillWizardTitle', 'sales.billing.changePreviousBillError', 'ico-error');
							} else {
								const url = 'sales/billing/detectcirculardependency';
								const params = new HttpParams()
									.set('projectId', selectedBill.ProjectFk)
									.set('bilHeaderId', selectedBill.Id)
									.set('newPreviousBillId', previousBillId);

								this.httpSvc.get<boolean>(url, { params: params }).then((response) => {
									if (response === false) {
										selectedBill.PreviousBillFk = previousBillId;
										this.salesBillingSvc.setModified(selectedBill);
										this.salesBillingSvc.entitiesUpdated(selectedBill);
									} else {
										this.showReadOnlyMsg('sales.billing.setPreviousBillWizardTitle', 'sales.billing.setPreviousDetectedCircularDependency', 'ico-error');
									}
								});
							}
						});
					} else {
						const url = 'sales/billing/ispreviousbillchangepossible';
						const params = new HttpParams().set('bilHeaderId', selectedBill.Id);

						this.httpSvc.get<boolean>(url, { params: params }).then((response) => {
							if (!response) {
								this.showReadOnlyMsg('sales.billing.setPreviousBillWizardTitle', 'sales.billing.deletePreviousBillError', 'ico-error');
							} else {
								selectedBill.PreviousBillFkForDeletion = selectedBill.PreviousBillFk;
								selectedBill.PreviousBillFk = previousBillId;
								this.salesBillingSvc.setModified(selectedBill);
								this.salesBillingSvc.entitiesUpdated(selectedBill);
							}
						});
					}
				}
			},
			autoClose: true,
		};
	}

	/**
	 * Gets cancel button configuration
	 *
	 * @returns Cancel button config.
	 */
	private getCancelButton(): IDialogButtonBase<IFormDialog<ISalesBillingSetPreviousBillFields>, void> {
		return {
			id: StandardDialogButtonId.Cancel,
			autoClose: true,
		};
	}

	/**
	 * Returns dialog data.
	 *
	 * @param selectedBill Selected entity.
	 * @returns Dialog specific data.
	 */
	private getEntity(selectedBill: IBilHeaderEntity): ISalesBillingSetPreviousBillFields {
		const entity: ISalesBillingSetPreviousBillFields = {
			BillId: selectedBill.Id,
			PreviousBillId: selectedBill.PreviousBillFk,
			OrdHeaderId: selectedBill.OrdHeaderFk,
			ProjectId: selectedBill.ProjectFk,
		};
		return entity;
	}

	/**
	 * Returns form config for dialog.
	 *
	 * @returns Form config for dialog
	 */
	private getFormConfig(): IFormConfig<ISalesBillingSetPreviousBillFields> {
		const formConfig: IFormConfig<ISalesBillingSetPreviousBillFields> = {
			formId: 'sales.billing.setPreviousBillWizardDialog',
			showGrouping: false,
			groups: [
				{
					groupId: 'baseGroup',
				},
			],
			rows: [
				{
					groupId: 'baseGroup',
					id: 'previousBillId',
					model: 'PreviousBillId',
					sortOrder: 1,
					type: FieldType.Lookup,
					label: {
						key: 'sales.common.PreviousBill',
						text: 'Previous Bill',
					},
					lookupOptions: createLookup<ISalesBillingSetPreviousBillFields, IBilHeaderEntity>({
						dataServiceToken: SalesCommonBillsDialogV2LookupService,
						showClearButton: true,
						descriptionMember: 'BillNo',
						serverSideFilter: {
							key: 'sales-billing-previousbill-filter-by-server',
							execute: (context) => {
								return {
									BillId: context.entity?.BillId,
									IsSetPreviousBillWizard: true,
									OrdHeaderFk: context.entity?.OrdHeaderId,
									ProjectFk: context.entity?.ProjectId,
								};
							}
						},
					}),
					//TODO: additionalField not displayed in UI.
					additionalFields: [
						{
							id: 'DescriptionInfo',
							model: 'DescriptionInfo',
							displayMember: 'DescriptionInfo.Translated',
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							column: true,
							singleRow: true,
						},
					],					
				},
			],
		};
		return formConfig;
	}

	/**
	 * Checks if selected entity is readonly.
	 *
	 * @param title Dialog title
	 * @param billItem Entity data.
	 * @returns Is entity readonly.
	 */
	private assertBillIsNotReadOnly(title: string, billItem: IBilHeaderEntity): boolean {
		const message = 'sales.billing.billIsReadOnly';

		if (!isFunction(get(this.salesBillingSvc, 'isEntityReadOnly'))) {
			throw new Error('Dataservice does not provide isEntityReadOnly() function!');
		}

		if (this.salesBillingSvc.isEntityReadOnly(billItem)) {
			this.showReadOnlyMsg(title, message, 'ico-info');
			return false;
		}
		return true;
	}

	/**
	 * Displays info/error/msg dialog box.
	 *
	 * @param title Dialog header.
	 * @param message Dialog Message.
	 * @param icon Icon type(msg/info/error).
	 */
	private showReadOnlyMsg(title: string, message: string, icon: string): void {
		this.messageBoxSvc.showMsgBox(message, title, icon);
	}
}
