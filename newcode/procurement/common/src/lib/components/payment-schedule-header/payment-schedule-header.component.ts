/*
 * Copyright(c) RIB Software GmbH
 */

import * as math from 'mathjs';
import { merge } from 'lodash';
import { Subscription } from 'rxjs';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BasicsSharedCalculateOverGrossService } from '@libs/basics/shared';
import { IPrcCommonPaymentScheduleTotalSourceContextEntity } from '../../model/entities/prc-payment-schedule-total-source-entity.interface';
import { IPrcCommonPaymentScheduleHeaderInfoEntity } from '../../model/entities/prc-payment-schedule-header-info-entity.interface';
import { PrcCommonPaymentScheduleHeaderInfoToken } from '../../model/interfaces/prc-common-payment-schedule-header-info.interface';

/**
 * Procurement common payment schedule grid container header component
 */
@Component({
	selector: 'procurement-common-payment-schedule-header',
	templateUrl: './payment-schedule-header.component.html',
	styleUrl: './payment-schedule-header.component.scss'
})
export class ProcurementCommonPaymentScheduleHeaderComponent implements OnInit, OnDestroy {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly headerInfo = inject(PrcCommonPaymentScheduleHeaderInfoToken);
	private readonly dataService = inject(this.headerInfo.dataServiceToken);
	private readonly totalSourceUrl = this.dataService.totalSourceUrl;
	public readonly isOverGross = inject(BasicsSharedCalculateOverGrossService).isOverGross;
	public readonly totalSourceTextTr = this.isOverGross ?
		'procurement.common.paymentSchedule.totalSourceGrossOC' :
		'procurement.common.paymentSchedule.totalSourceNetOC';
	public readonly paymentScheduleTargetTextTr = this.isOverGross ?
		'procurement.common.paymentSchedule.paymentScheduleTargetGrossOC' :
		'procurement.common.paymentSchedule.paymentScheduleTargetNetOC';
	private subscriptions: Subscription[] = [];

	public isReadOnly = true;
	public showTotalSettingSection = true;
	public settingInfo: IPrcCommonPaymentScheduleHeaderInfoEntity = {
		TotalNetOc: 0,
		TotalGrossOc: 0,
		PaymentScheduleNetOc: 0,
		PaymentScheduleGrossOc: 0,
		VarianceNetOc: 0,
		VarianceGrossOc: 0
	};
	public totalSourceContextEntity: IPrcCommonPaymentScheduleTotalSourceContextEntity = {
		ParentConfigurationFk: undefined,
		ParentId: undefined,
		VatPercent: 0,
		SourceNetOc: 0,
		SourceGrossOc: 0,
		Url: this.totalSourceUrl
	};

	private get parentService() {
		return this.dataService.parentService;
	}

	/**
	 * OnInit
	 */
	public ngOnInit() {
		const parentSelectionChangedSub = this.parentService.selectionChanged$.subscribe(() => {
			this.onParentSelectionChanged();
		});
		const listChangedSub = this.dataService.listChanged$.subscribe(() => {
			this.resetPaymentScheduleTarget();
		});
		this.subscriptions.push(parentSelectionChangedSub);
		this.subscriptions.push(listChangedSub);
	}

	private async onParentSelectionChanged() {
		const parent = this.parentService.getSelectedEntity();
		this.clearSettingInfo();
		this.isReadOnly = !parent;
		this.showTotalSettingSection = true;
		if (parent) {
			this.showTotalSettingSection = this.dataService.isParentMainEntity(parent);
			const configurationId = this.parentService.getHeaderEntity().ConfigurationFk;
			this.resetTotalSourceContext(parent.Id, configurationId);
		}

	}

	private resetTotalSourceContext(parentId: number, configurationId?: number) {
		this.totalSourceContextEntity = {
			ParentConfigurationFk: configurationId,
			ParentId: parentId,
			VatPercent: this.dataService.getVatPercent(),
			SourceNetOc: 0,
			SourceGrossOc: 0,
			Url: this.totalSourceUrl
		};
	}

	private resetPaymentScheduleTarget() {
		this.resetSettingInfo({
			PaymentScheduleNetOc: this.dataService.paymentScheduleTarget.netOc,
			PaymentScheduleGrossOc: this.dataService.paymentScheduleTarget.grossOc
		});
	}

	private clearSettingInfo() {
		this.resetSettingInfo({
			TotalNetOc: 0,
			TotalGrossOc: 0,
			PaymentScheduleNetOc: 0,
			PaymentScheduleGrossOc: 0
		});
	}

	private resetSettingInfo(info: Partial<IPrcCommonPaymentScheduleHeaderInfoEntity>) {
		if (this.settingInfo) {
			merge(this.settingInfo, info);
			this.settingInfo.VarianceNetOc = math.round(math.bignumber(this.settingInfo.TotalNetOc).sub(this.settingInfo.PaymentScheduleNetOc), 2).toNumber();
			this.settingInfo.VarianceGrossOc = math.round(math.bignumber(this.settingInfo.TotalGrossOc).sub(this.settingInfo.PaymentScheduleGrossOc), 2).toNumber();
		}
	}

	/**
	 * handle total source value change
	 * @param totalSourceEntity
	 */
	public onTotalSourceChanged(totalSourceEntity: IPrcCommonPaymentScheduleTotalSourceContextEntity) {
		this.resetSettingInfo({
			TotalNetOc: totalSourceEntity.SourceNetOc,
			TotalGrossOc: totalSourceEntity.SourceGrossOc
		});
	}

	public disableUpdateTarget():boolean {
		return this.isReadOnly || this.settingInfo.TotalNetOc === 0 || this.settingInfo.TotalGrossOc === 0;
	}

	public async updatePaymentScheduleTarget() {
		const isSuccessful = await this.dataService.updatePaymentScheduleTarget(this.settingInfo.TotalNetOc, this.settingInfo.TotalGrossOc);
		const parentId = this.parentService.getSelectedEntity()?.Id;
		if (isSuccessful && parent) {
			await this.dataService.load({id: 0, pKey1: parentId});
		}
		this.messageBoxService.showMsgBox({
			headerText: 'procurement.common.paymentSchedule.setPaymentScheduleTotal',
			bodyText: isSuccessful ?
				'procurement.common.paymentSchedule.setPaymentScheduleTotalSuccessfully' :
				'procurement.common.paymentSchedule.setPaymentScheduleTotalFailed',
			iconClass: isSuccessful ?
				'ico-info' :
				'ico-error'
		});
	}

	/**
	 * OnDestroy
	 */
	public ngOnDestroy() {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}