/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { remove } from 'lodash';
import { FieldType, getCustomDialogDataToken, IGridConfiguration,StandardDialogButtonId } from '@libs/ui/common';
import {
	IProcurementCommonMainPaymentScheduleVersion,
	IProcurementCommonMainPaymentScheduleVersionCreateHttpResponse,
	IProcurementCommonMainPaymentScheduleVersionOption, IProcurementCommonMaintainPaymentScheduleVersionResult,
	MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS
} from '../../model/interfaces/wizard/prc-common-maintain-payment-shedule-wizard.interface';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPrcPaymentScheduleEntity } from '../../model/entities';

@Component({
  selector: 'procurement-common-maintain-payment-schedule-version',
  templateUrl: './maintain-payment-schedule-version.component.html',
  styleUrl: './maintain-payment-schedule-version.component.scss'
})
export class ProcurementCommonMaintainPaymentScheduleVersionComponent {
	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);
	private readonly translationService = inject(PlatformTranslateService);
	public newVersionText: string = '';
	public disableCreate: boolean = true;
	public showUniqueVersionMessage: boolean = false;
	public gridSelected = false;
	public selectedRows: IProcurementCommonMainPaymentScheduleVersion[] = [];
	public createItems: IPrcPaymentScheduleEntity[] = [];
	public deleteRows: IProcurementCommonMainPaymentScheduleVersion[] = [];
	public uniqueValueErrorMessage = this.translationService.instant('cloud.common.uniqueValueErrorMessage', {object: 'Version'}).text;
	public paymentScheduleVersionOption: IProcurementCommonMainPaymentScheduleVersionOption = inject(MAIN_PAYMENT_SCHEDULE_DIALOG_OPTIONS);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IProcurementCommonMaintainPaymentScheduleVersionResult, ProcurementCommonMaintainPaymentScheduleVersionComponent>());
	public paymentScheduleVersions: IProcurementCommonMainPaymentScheduleVersion[] = this.paymentScheduleVersionOption.paymentScheduleVersions;
	public paymentScheduleVersionGridConfig: IGridConfiguration<IProcurementCommonMainPaymentScheduleVersion> = {
		uuid: 'c17ba5671c524f3288270803b386654c',
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
			const sameVersion = this.paymentScheduleVersions.find(item => item.Version === this.newVersionText);
			if (!sameVersion) {
				this.disableCreate = false;
				this.showUniqueVersionMessage = false;
			} else {
				this.disableCreate = true;
				this.showUniqueVersionMessage = true;
			}
		} else {
			this.disableCreate = true;
			this.showUniqueVersionMessage = true;
		}
	}

	public async create() {
		const resp = await firstValueFrom(
			this.http.post(`${this.configService.webApiBaseUrl}procurement/common/prcpaymentschedule/createpaymentscheduleversion`, {
				MainItemId: this.paymentScheduleVersionOption.mainItemId,
				VersionText: this.newVersionText
			}),
		);
		if (resp) {
			this.newVersionText = '';
			const response = resp as IProcurementCommonMainPaymentScheduleVersionCreateHttpResponse;
			response.VersionInfo.Id = this.paymentScheduleVersions.length + 1;
			this.paymentScheduleVersions.push(response.VersionInfo);
			this.createItems = this.createItems.concat(response.PaymentSchedules);
			const items = [...this.paymentScheduleVersions];
			this.paymentScheduleVersions = items;
		}
	}

	public async ok() {
		this.dialogWrapper.value = {
			createItems: this.createItems,
			mainItemId: this.paymentScheduleVersionOption.mainItemId,
			versionInfos: this.deleteRows
		};
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}

	public async restore() {
		/* todo when have payment schedule service
		const list=paymentScheduleService.getList();
		const isDoneItem = list.find(item=>item.isDone);
		if (isDoneItem) {
		 this.messageBoxService.showMsgBox('procurement.common.wizard.haveIsDoneItemsCannotRestore', 'cloud.common.informationDialogHeader', 'ico-info');
		}
		*/
		if (this.selectedRows.length > 0) {
			const selectedRow = this.selectedRows[0];
			const resp = await firstValueFrom(
				this.http.post(`${this.configService.webApiBaseUrl}procurement/common/prcpaymentschedule/restorepaymentscheduleversion`, selectedRow)
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

	public onSelectedRowsChanged(selectedItems: IProcurementCommonMainPaymentScheduleVersion[]) {
		this.gridSelected = true;
		this.selectedRows = selectedItems;
	}

}
