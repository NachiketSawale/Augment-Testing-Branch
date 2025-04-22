import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { IFormConfig, StandardDialogButtonId, UiCommonDialogService, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { SalesContractPaymentScheduleDataService } from '../services/sales-contract-payment-schedule-data.service';
import { ISalesContractMainPaymentScheduleVersion, MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS } from '../model/interface/sales-contract-payment-schedule-wizard.interface';
import { SalesContractMaintainPaymentScheduleVersionComponent } from '../components/maintain-payment-schedule-version/maintain-payment-schedule-version.component';

@Injectable({
	providedIn: 'root'
})
export class SalesContractMaintainPaymentScheduleVersionWizardService {
	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	public rootDataService: SalesContractPaymentScheduleDataService = inject(SalesContractPaymentScheduleDataService);
	public headerDataService: SalesContractPaymentScheduleDataService = inject(SalesContractPaymentScheduleDataService);
	protected http = inject(HttpClient);
	protected readonly httpService = inject(PlatformHttpService);
	protected configService = inject(PlatformConfigurationService);
	protected formConfig: IFormConfig<ISalesContractPSVersionEntity> = { rows: [] };
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly dialogService = inject(UiCommonDialogService);

	public maintainPaymentScheduleVersion() {
		this.showChangeVersionDialog();
	}

	public async showChangeVersionDialog() {
		const selHeader = this.headerDataService.getSelectedEntity();
		const header = this.headerDataService.getSelectedEntity();
		if(selHeader){
			this.http.get(this.configService.baseUrl + 'services/sales/contract/paymentschedule/paymentscheduleversion?MainItemId=' + (header?.OrdHeaderFk ?? 0).toString()).subscribe(result =>{
				const versionList = result as ISalesContractMainPaymentScheduleVersion[];
				return this.dialogService.show({
					width: '800px',
					headerText: 'procurement.common.wizard.maintainPaymentScheduleVersion',
					resizeable: true,
					showCloseButton: true,
					bodyComponent: SalesContractMaintainPaymentScheduleVersionComponent,
					bodyProviders: [{
						provide: MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS, useValue: {
							paymentScheduleVersions: versionList,
							mainItemId: header?.OrdHeaderFk
						}
					}],
					customButtons: [
						{
							id: 'delete',
							caption: {key: 'procurement.common.wizard.deleteHighlightedVersion'},
							fn(evt, info) {
								info.dialog.body.delete();
								return undefined;
							},
							isDisabled: info => !info.dialog.body.gridSelected
						},
					],
					buttons: [
						{
							id: 'restore',
							caption: {key: 'procurement.common.wizard.restroeFromVersion'},
							fn(evt, info) {
								info.dialog.body.restore();
								return undefined;
							},
							isDisabled: info => !info.dialog.body.gridSelected
						},
						{
							id: StandardDialogButtonId.Ok,
							caption: {key: 'ui.common.dialog.okBtn'},
							fn(evt, info) {
								info.dialog.body.ok();
								return undefined;
							}
						},
						{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}},
					]
				});
			});
		}
		return undefined;
	}
}

export interface ISalesContractPSVersionEntity {
	Version: string;
	Grids: ISalesContractPSVersionGrid[]
}

export interface ISalesContractPSVersionGrid{
	Version: string;
	NetTotal: number;
	GrossTotal: number;
	From: string;
	End: string;
}