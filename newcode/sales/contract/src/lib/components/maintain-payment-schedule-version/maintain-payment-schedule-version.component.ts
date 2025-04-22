/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { remove } from 'lodash';
import { FieldType, getCustomDialogDataToken, IGridConfiguration,StandardDialogButtonId } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { firstValueFrom, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
	ISalesContractMainPaymentScheduleVersion,
	ISalesContractMainPaymentScheduleVersionCreateHttpResponse,
	ISalesContractMainPaymentScheduleVersionOption, ISalesContractMaintainPaymentScheduleVersionResult,
	MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS
} from '../../model/interface/sales-contract-payment-schedule-wizard.interface';
import { SalesContractPaymentScheduleDataService } from '../../services/sales-contract-payment-schedule-data.service';
import { IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

@Component({
  selector: 'sales-contract-maintain-payment-schedule-version',
  templateUrl: './maintain-payment-schedule-version.component.html',
  styleUrl: './maintain-payment-schedule-version.component.scss'
})
export class SalesContractMaintainPaymentScheduleVersionComponent {
	protected readonly http = inject(HttpClient);
	protected readonly httpService = inject(PlatformHttpService);
	protected readonly configService = inject(PlatformConfigurationService);
	private readonly translationService = inject(PlatformTranslateService);
	public headerDataService: SalesContractPaymentScheduleDataService = inject(SalesContractPaymentScheduleDataService);
	public newVersionText: string = '';
	public disableCreate: boolean = true;
	public showUniqueVersionMessage: boolean = false;
	public gridSelected = false;
	public selectedRows: ISalesContractMainPaymentScheduleVersion[] = [];
	public createItems: IOrdPaymentScheduleEntity[] = [];
	public deleteRows: ISalesContractMainPaymentScheduleVersion[] = [];
	public uniqueValueErrorMessage = this.translationService.instant('cloud.common.uniqueValueErrorMessage', {object: 'Version'}).text;
	public paymentScheduleVersionOption: ISalesContractMainPaymentScheduleVersionOption = inject(MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<ISalesContractMaintainPaymentScheduleVersionResult, SalesContractMaintainPaymentScheduleVersionComponent>());
	public paymentScheduleVersions: ISalesContractMainPaymentScheduleVersion[] = this.paymentScheduleVersionOption.paymentScheduleVersions;
	public paymentScheduleVersionGridConfig: IGridConfiguration<ISalesContractMainPaymentScheduleVersion> = {
		uuid: '9e72d98420a041ddb78b7d4ff524e083',
		columns: [{
			id: 'Version',
			label: {key: 'cloud.common.entityVersion', text: 'Version'},
			model: 'Version',
			readonly: false,
			sortable: true,
			type: FieldType.Description,
			visible: true
		}, {
			id: 'TotalNet',
			label: {key: 'procurement.common.wizard.totalnet', text: 'Total Net'},
			model: 'TotalNet',
			readonly: false,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'TotalGross',
			label: {key: 'procurement.common.wizard.totalgross', text: 'Total Gross'},
			model: 'TotalGross',
			readonly: false,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'From',
			label: {key: 'procurement.common.wizard.from', text: 'From'},
			model: 'From',
			readonly: false,
			sortable: true,
			type: FieldType.DateUtc,
			visible: true
		}, {
			id: 'End',
			label: {key: 'procurement.common.wizard.end', text: 'End'},
			model: 'End',
			readonly: false,
			sortable: true,
			type: FieldType.DateUtc,
			visible: true
		}]
	};

	public inputVersionText() {
		if (this.newVersionText) {
			this.disableCreate = false;
			this.showUniqueVersionMessage = false;
		} else {
			this.disableCreate = true;
			this.showUniqueVersionMessage = true;
		}
	}

	public async create() {
		const resp = await firstValueFrom(
			this.http.post(`${this.configService.webApiBaseUrl}sales/contract/paymentschedule/createpaymentscheduleversion`, {
				MainItemId: this.paymentScheduleVersionOption.mainItemId,
				VersionText: this.newVersionText
			}),
		);
		if (resp) {
			this.newVersionText = '';
			const response = resp as ISalesContractMainPaymentScheduleVersionCreateHttpResponse;
			response.VersionInfo.Id = this.paymentScheduleVersions.length + 1;
			this.paymentScheduleVersions.push(response.VersionInfo);
			this.createItems = this.createItems.concat(response.PaymentSchedules);
			const items = [...this.paymentScheduleVersions];
			this.paymentScheduleVersions = items;
		}
	}

	public async ok() {
		const selectedHeader = this.headerDataService.getSelectedEntity();
		if(this.selectedRows.length > 0) {
			this.createItems.forEach(item => {
				item.PaymentVersion = this.selectedRows[0].Version;
			});
			const responses = await firstValueFrom(forkJoin([
				this.httpService.post$('sales/contract/paymentschedule/savepaymentscheduleversion', this.createItems),
				this.httpService.post$('sales/contract/paymentschedule/deletepaymentscheduleversion', {
					MainItemId: selectedHeader?.Id,
					VersionInfos: this.deleteRows,
				})]));
			if (responses) {
				this.dialogWrapper.close(StandardDialogButtonId.Ok);
			}
		}
	}

	public async restore() {
		if (this.selectedRows.length > 0) {
			const selectedRow = this.selectedRows[0];
			const resp = await firstValueFrom(
				this.http.post(`${this.configService.webApiBaseUrl}sales/contract/paymentschedule/restorepaymentscheduleversion`, selectedRow)
			);
			if (resp) {
				//paymentScheduleService.load();
			}
		}
	}

	public delete() {
		const selectIds = this.selectedRows.map((item) => item.Id);
		this.deleteRows = remove(this.paymentScheduleVersions, item => {
			return selectIds.includes(item.Id);
		});
		if (this.deleteRows.length > 0) {

			if(this.deleteRows.find(a=> a.Version === this.selectedRows[0].Version)) {
				this.selectedRows[0] = [...this.paymentScheduleVersions][0];
			}

			remove(this.createItems, item => {
				return this.deleteRows.find(version => version.Version === item.PaymentVersion);
			});
		}
		const items = [...this.paymentScheduleVersions];
		this.paymentScheduleVersions = items;
		this.resetGridDataId();
	}

	public resetGridDataId() {
		this.paymentScheduleVersions.forEach((item, index) => {
			item.Id = index + 1;
		});
	}

	public onSelectedRowsChanged(selectedItems: ISalesContractMainPaymentScheduleVersion[]) {
		this.gridSelected = true;
		this.selectedRows = selectedItems;
	}

}
