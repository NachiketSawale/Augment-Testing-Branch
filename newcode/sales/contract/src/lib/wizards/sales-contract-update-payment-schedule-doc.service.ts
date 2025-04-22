/*
 * Copyright(c) RIB Software GmbH
 */
import { FieldType, FormRow, IEditorDialogResult, IFormConfig, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { SalesContractPaymentScheduleDataService } from '../services/sales-contract-payment-schedule-data.service';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';

@Injectable({
	providedIn: 'root'
})

export class SalesContractUpdatePaymentScheduleDocService {
	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected http = inject(HttpClient);
	public readonly paymentScheduleService = inject(SalesContractPaymentScheduleDataService);
	public updateType: UpdatePaymentScheduleDocType = UpdatePaymentScheduleDocType.ListAll;
	public isUpdateTypeReadonly: boolean = false;
	protected configService = inject(PlatformConfigurationService);
	public headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
	protected formConfig: IFormConfig<IPaymentScheduleDoc> = { rows: [] };

	public generateFormConfig(): IFormConfig<IPaymentScheduleDoc> {
		const formRows: FormRow<IPaymentScheduleDoc>[] = [
			{
				id: 'updateType',
				type: FieldType.Radio,
				model: 'UpdateType',
				readonly: false,
				itemsSource: {
					items: [
						{
							id: UpdatePaymentScheduleDocType.Current,
							displayName: 'Update current payment schedule line'
						},
						{
							id: UpdatePaymentScheduleDocType.ListAll,
							displayName: 'Update all payment schedule lines of this header'
						}
					]
				},

			}
		];
		return {
			formId: 'generate.payment.schedule.form',
			showGrouping: false,

			addValidationAutomatically: false,
			rows: formRows,
		};
	}

	public updatePaymentScheduleDoc() {
		this.showUpdatePaymentScheduleDialog();
	}
	public async showUpdatePaymentScheduleDialog() {
		const selectedEntity = this.headerDataService.getSelectedEntity();
		if (!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Generate Payment Schedule').text, 'ico-warning');
			return false;
		}

		const entity: IPaymentScheduleDoc = {
			updateType: 0,
		};

		this.formConfig = this.generateFormConfig();

		const config: IFormDialogConfig<IPaymentScheduleDoc> = {
			headerText: 'procurement.common.wizard.updatePaymetScheduleDOC.caption',
			formConfiguration: this.formConfig,
			customButtons: [],

			entity: entity
		};
		this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<IPaymentScheduleDoc>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				const postData = {
					OrdHeaderFk: selectedEntity.Id,
				};
				const queryPath = this.configService.webApiBaseUrl + 'sales/contract/paymentschedule/updatepaymentscheduledegreeofcompletion';
				this.http.post(queryPath, postData).subscribe((res) => {
					this.messageBoxService.showInfoBox('Update Payment Schedule Successfully.', 'info', true);
					this.headerDataService.refreshSelected();
					return;
				});
			}
		});
		return false;
	}

}
export interface IPaymentScheduleDoc {
	updateType: number;
}

export enum UpdatePaymentScheduleDocType {
	Current,
	ListAll,
}

