/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IBilHeaderEntity, IValidationEntity } from '@libs/sales/interfaces';
import { BilHeaderComplete } from '../model/complete-class/bil-header-complete.class';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class SalesBillingValidationDataService extends DataServiceFlatLeaf<IValidationEntity, IBilHeaderEntity, BilHeaderComplete> {
	private readonly configService = inject(PlatformConfigurationService);
	private http = inject(HttpClient);

	private jobList: string[] = [];
	private isUpdateValidation: boolean = false;
	private readonly UPDATE_INTERVAL: number = 1500;
	
	public constructor(salesBillingBillsDataService: SalesBillingBillsDataService) {
		const options: IDataServiceOptions<IValidationEntity> = {
			apiUrl: 'sales/billing/validation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId : ident.pKey1
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IValidationEntity, IBilHeaderEntity, BilHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BilValidation',
				parent: salesBillingBillsDataService
			},
			entityActions: {createSupported: false, deleteSupported: false},
		};

		super(options);
	}

	private updateValidation(jobId: string): void {
		if (this.isUpdateValidation) {
			setTimeout(() => {
				this.http.get<number>(`${this.configService.webApiBaseUrl}sales/billing/transaction/getjobstate?jobId=${jobId}`).subscribe(response => {
					if (response > -1 && [0, 1, 2].includes(response)) {
						this.updateValidation(jobId);
					} else {
						const index = this.jobList.indexOf(jobId);
						if (index > -1) {
							this.jobList.splice(index, 1);
						}
					}
				});
			}, this.UPDATE_INTERVAL);
		}
	}
	
	public updateAll(): void {
		this.isUpdateValidation = true;

		if (this.jobList.length > 0) {
			this.jobList.forEach((jobId: string) => this.updateValidation(jobId));
		} else {
			this.http.get<string[]>(`${this.configService.webApiBaseUrl}sales/billing/transaction/getjobs`).subscribe(res => {
				if (res && res.length > 0) {
					this.jobList = this.jobList.concat(res);
					this.updateAll();
				}
			});
		}
	}

	public addJob(jobId: string): void {
		this.jobList.push(jobId);
	}
	
}












