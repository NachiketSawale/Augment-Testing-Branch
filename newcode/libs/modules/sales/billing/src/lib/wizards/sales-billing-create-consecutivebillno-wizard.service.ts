/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import _, { get, isFunction } from 'lodash';

import { FieldType } from '@libs/ui/common';
import { IFormConfig } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { IConsecutiveBillNoFields } from './interfaces/consecutive-billno-fields.interface';

/**
 * Sales billing create consecutive bill no wizard service
 */
@Injectable({
	providedIn: 'root',
})
export class SalesBillingCreateConsecutiveBillNoWizardService {
	/**
	 * inject PlatformHttpService
	 */
	private readonly httpService = inject(PlatformHttpService);

	/**
	 * inject SalesBillingBillsDataService
	 */
	private readonly salesBillingService = inject(SalesBillingBillsDataService);

	/**
	 * inject UiCommonFormDialogService
	 */
	private formDialogService = inject(UiCommonFormDialogService);

	/**
	 * inject UiCommonMessageBoxService
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * configure the formRuntimeInfo
	 */
	private formRuntimeInfo: EntityRuntimeData<IConsecutiveBillNoFields> = {
		readOnlyFields: [
			{
				field: 'ConsecutiveBillNo',
				readOnly: true,
			},
		],
		validationResults: [],
		entityIsReadOnly: false,
	};

	/**
	 * Checks if selected entity is readonly.
	 *
	 * @param title Dialog title
	 * @param billItem Entity data.
	 * @returns Is entity readonly.
	 */
	private assertBillIsNotReadOnly(title: string, billItem: IBilHeaderEntity): boolean {
		const message = 'sales.billing.billIsReadOnly';

		if (!isFunction(get(this.salesBillingService, 'isEntityReadOnly'))) {
			throw new Error('Dataservice does not provide isEntityReadOnly() function!');
		}

		if (this.salesBillingService.isEntityReadOnly(billItem)) {
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
		this.messageBoxService.showMsgBox(message, title, icon);
	}

	/**
	 * This function used for update Consecutive Bill No Field
	 *
	 * @param entity bill Entity Value
	 * @param value readonly Value
	 */
	private updateConsecutiveBillNoField(entity: IConsecutiveBillNoFields, value: boolean) {
		entity.ConsecutiveBillNo = value === true ? 'cloud.common.isGenerated' : entity.BillNo;
		this.formRuntimeInfo.readOnlyFields.forEach((field) => {
			if (field.field === 'ConsecutiveBillNo') {
				field.readOnly = value;
			} else {
				this.formRuntimeInfo.readOnlyFields.push({ field: 'this.formRuntimeInfo.readOnlyFields', readOnly: value });
			}
		});
	}

	/**
	 * This functiono to check assert bill is has no consecutive bill no
	 *
	 * @param title title of the dialog
	 * @param billItem bill entity
	 * @returns boolean
	 */
	private async assertBillIsHasNoConsecutiveBillNo(title: string, billItem: IBilHeaderEntity) {
		if (billItem && billItem.ConsecutiveBillNo) {
			if (_.trim(billItem.ConsecutiveBillNo) === '') {
				return true;
			} else {
				const message = 'sales.billing.billHasAlreadyConsecutiveBillNo';

				await this.messageBoxService.showMsgBox(message, title, 'ico-info', 'assertBillIsHasNoConsecutiveBillNo', false);
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * This function to open from modal dailog
	 *
	 */
	public async showDialog() {
		const selectedBills = this.salesBillingService.getSelection();
		const title = 'sales.billing.createConsecutiveBillNoWizardTitle';
		const msg = 'sales.billing.noCurrentBillSelection';
		if (_.size(selectedBills) === 1) {
			const selectedBill = _.first(selectedBills);
			if (selectedBill && selectedBill.BillNo) {
				if (!this.assertBillIsNotReadOnly(title, selectedBill)) {
					return;
				}
				// stop here if bill already has a Consecutive Bill No.
				if (!this.assertBillIsHasNoConsecutiveBillNo(title, selectedBill)) {
					return;
				}

				const dataItem: IConsecutiveBillNoFields = {
					SelectedBill: selectedBill,
					BillNo: selectedBill.BillNo as string,
					ConsecutiveBillNo: selectedBill.BillNo as string,
					GenerateConsecutiveBillNo: true,
				};
				this.updateConsecutiveBillNoField(dataItem, true);
				const consecutiveBillNoFormConfig: IFormConfig<IConsecutiveBillNoFields> = {
					formId: 'sales.billing.createConsecutiveBillNoWizardDialog',
					showGrouping: false,
					groups: [
						{
							groupId: 'baseGroup',
							header: { text: 'Default Group' },
						},
					],
					rows: [
						{
							groupId: 'baseGroup',
							id: 'billno',
							label: {
								key: 'sales.billing.entityBillNo',
							},
							type: FieldType.Code,
							model: 'BillNo',
							sortOrder: 0,
							required: false,
							readonly: true,
						},
						{
							groupId: 'baseGroup',
							id: 'generateconsecutivebillno',
							label: {
								key: 'sales.billing.generateConsecutiveBillNoOpt',
							},
							type: FieldType.Boolean,
							model: 'GenerateConsecutiveBillNo',
							sortOrder: 1,
							required: false,
							readonly: false,
							validator: (info) => {
								const item = info.entity;
								const value = info.value as boolean;
								this.updateConsecutiveBillNoField(item, value);
								return { valid: true }; // or return a proper ValidationResult
							},
						},
						{
							groupId: 'baseGroup',
							id: 'consecutivebillno',
							label: {
								key: 'sales.billing.entityConsecutiveBillNo',
							},
							type: FieldType.Code,

							model: 'ConsecutiveBillNo',
							sortOrder: 2,
							required: true,
							validator: (info) => {
								//TODO : Dependens on salesBillingValidationService in validateConsecutiveBillNo function
								return { valid: true }; // or return a proper ValidationResult
							},
						},
					],
				};
				const config: IFormDialogConfig<IConsecutiveBillNoFields> = {
					id: 'sales.billing.createConsecutiveBillNoWizardDialog',
					headerText: { key: 'sales.billing.createConsecutiveBillNoWizardTitle' },
					formConfiguration: consecutiveBillNoFormConfig,
					entity: dataItem,
					runtime: this.formRuntimeInfo,
				};
				const result = await this.formDialogService.showDialog<IConsecutiveBillNoFields>(config);
				if (result) {
					if (result.closingButtonId === StandardDialogButtonId.Ok) {
						if (result.value) {
							if (result.value.GenerateConsecutiveBillNo) {
								const generateConsecutiveBillNo = result.value.GenerateConsecutiveBillNo;
								if (generateConsecutiveBillNo === true && _.isObject(selectedBill)) {
									this.httpService.get$<string>('sales/billing/generateconsecutivebillno?billHeaderId=' + selectedBill.Id).subscribe((response: string) => {
										if (selectedBill && selectedBill.ConsecutiveBillNo) {
											selectedBill.ConsecutiveBillNo = response;
										}
										//TODO : depends on salesBillingService in getDataProcessor , markItemAsModified , updateAndExecute function

										// _.each(this.salesBillingService.getDataProcessor(), function (proc) {
										//     proc.processItem(selectedBill);
										// });
										//this.salesBillingService.markItemAsModified(selectedBill);
										//salesBillingService.updateAndExecute(function () {});
									});
								} else {
									if (selectedBill && selectedBill.ConsecutiveBillNo) {
										selectedBill.ConsecutiveBillNo = result.value.ConsecutiveBillNo;
									}
									//TODO : depends on salesBillingService in getDataProcessor , markItemAsModified , updateAndExecute function

									// _.each(this.salesBillingService.getDataProcessor(), function (proc) {
									//     proc.processItem(selectedBill);
									// });
									//this.salesBillingService.markItemAsModified(selectedBill);
									//salesBillingService.updateAndExecute(function () {});
								}
							}
						}
					}
				}
			} else {
				//TODO : Dependens on platformSidebarWizardCommonTasksService
				//const platformSidebarWizardCommonTasksService = inject('platformSidebarWizardCommonTasksService').showErrorNoSelection(title, msg);
			}
		} else {
			this.showReadOnlyMsg(msg, title, 'ico-info');
		}
	}
}

