/*
 * Copyright(c) RIB Software GmbH
 */

import * as math from 'mathjs';
import { merge } from 'lodash';
import { Subscription } from 'rxjs';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BasicsSharedCalculateOverGrossService } from '@libs/basics/shared';
import { IPrcCommonPaymentScheduleTotalSourceContextEntity } from '@libs/procurement/common';
import {
    SalesSharedPaymentScheduleHeaderInfoToken
} from '../../model/sales-contract-payment-schedule-header-info.interface';
import { SalesContractContractsDataService } from '../../services/sales-contract-contracts-data.service';
import {HttpClient} from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { SalesContractPaymentScheduleInterface } from '../../model/interface/sales-contract-payment-schedule.interface';
import { IMdcTaxCodeEntity } from '@libs/basics/interfaces';
import { IOrdPaymentScheduleEntity } from '@libs/sales/interfaces';

/**
 * Procurement common payment schedule grid container header component
 */
@Component({
    selector: 'sales-contract-payment-schedule-header',
    templateUrl: 'payment-schedule-header.component.html',
    styleUrl: 'payment-schedule-header.component.scss'
})
export class SalesContractPaymentScheduleHeaderComponent implements OnInit, OnDestroy {
	 protected http = inject(HttpClient);
	 protected configurationService = inject(PlatformConfigurationService);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
	 private readonly salesContractContractsDataService = inject(SalesContractContractsDataService);
    private readonly headerInfo = inject(SalesSharedPaymentScheduleHeaderInfoToken);
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
	 public VarianceNetOc = 0;
    public settingInfo: ISalesContractPaymentScheduleHeaderInfoEntity = {
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
        this.salesContractContractsDataService.selectionChanged$.subscribe(() => {
		    this.onParentSelectionChanged();
		 });
    }

    private async onParentSelectionChanged() {
        const parent = this.salesContractContractsDataService.getSelectedEntity();
        this.clearSettingInfo();
        this.isReadOnly = !parent;
        this.showTotalSettingSection = true;
        if (parent) {
	        this.http.post(this.configurationService.webApiBaseUrl + 'sales/contract/paymentschedule/listByParent', {PKey1: parent.Id}).subscribe(res=>{
				  const paymentScheduleData = res as SalesContractPaymentScheduleInterface;
				  if(paymentScheduleData) {
                      this.settingInfo.PaymentScheduleNetOc = paymentScheduleData.paymentScheduleNetOc;
                      this.settingInfo.VarianceNetOc = paymentScheduleData.paymentScheduleNetOc * (-1);
                      this.VarianceNetOc = this.settingInfo.VarianceNetOc;
                  }
	        });
        }
    }

    private clearSettingInfo() {
        this.resetSettingInfo({
            AmountNetOc: 0,
            AmountGrossOc: 0
        });
    }

    private resetSettingInfo(info: Partial<IOrdPaymentScheduleEntity>) {
        if (this.settingInfo) {
            merge(this.settingInfo, info);
            this.settingInfo.VarianceNetOc = math.round(math.bignumber(this.settingInfo.TotalNetOc).sub(this.settingInfo.PaymentScheduleNetOc), 2).toNumber();
            this.settingInfo.VarianceGrossOc = math.round(math.bignumber(this.settingInfo.TotalGrossOc).sub(this.settingInfo.PaymentScheduleGrossOc), 2).toNumber();
        }
    }

    public disableUpdateTarget():boolean {
        return this.isReadOnly || this.settingInfo.TotalNetOc === 0 || this.settingInfo.TotalNetOc === null;
    }

    public async updatePaymentScheduleTarget() {
	    const parent = this.salesContractContractsDataService.getSelectedEntity();
		 if(parent) {
             this.http.get(this.configurationService.webApiBaseUrl + 'basics/lookupdata/master/getlist?lookup=taxcode').subscribe(res=> {
				 const selectedTax = (res as IMdcTaxCodeEntity[]).filter(tax => tax.Id == parent.TaxCodeFk);
				 if(selectedTax.length > 0) {
					 this.http.post(this.configurationService.webApiBaseUrl + 'sales/contract/paymentschedule/setpaymentscheduletotal',
					  {
                          ExchangeRate: 1,
                          OrdHeaderFk: parent.Id,
                         TotalGrossOc: this.settingInfo.TotalNetOc + Number(this.settingInfo.TotalNetOc * (selectedTax[0].VatPercent/100)),
					      TotalNetOc: this.settingInfo.TotalNetOc
					  }
					 ).subscribe(res=> {
                         if(res) {
                             this.onParentSelectionChanged();
                             this.settingInfo.TotalNetOc = 0;
                             this.messageBoxService.showInfoBox('Set Payment Schedule Total Successfully','info',true);
                         }
					 });
				 }
			 });
		 }
    }

    /**
     * OnDestroy
     */
    public ngOnDestroy() {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

	public onTotalSourceChanges($event: Event) {
        const inputElement = $event.target as HTMLInputElement;
		this.settingInfo.VarianceNetOc = this.VarianceNetOc + Number(inputElement.value);
	}
}

export interface ISalesContractPaymentScheduleHeaderInfoEntity {
    TotalNetOc: number,
    TotalGrossOc: number,
    PaymentScheduleNetOc: number,
    PaymentScheduleGrossOc: number,
    VarianceNetOc: number,
    VarianceGrossOc: number
}