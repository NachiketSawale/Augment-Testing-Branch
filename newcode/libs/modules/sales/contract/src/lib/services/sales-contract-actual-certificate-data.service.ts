/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BusinesspartnerSharedCertificateNodeDataService } from '@libs/businesspartner/shared';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { IIdentificationData } from '@libs/platform/common';
import { ICertificateResponse } from '@libs/businesspartner/interfaces';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root',
})
export class SalesContractActualCertificateDataService extends BusinesspartnerSharedCertificateNodeDataService<IOrdHeaderEntity, SalesContractContractsComplete> {
	public constructor(protected contractService: SalesContractContractsDataService) {
		const options = {
			readInfo: {
				endPoint: 'listtosalescontract',
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				},
			},
			createInfo: {
				endPoint: 'createtosalescontract',
			},
			roleInfo: {
				parent: contractService,
			},
		};
		super('businesspartner.main.certificate', options);
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
				businessPartnerFk:parentSelection.BusinesspartnerFk
			};
		}
		throw new Error('Should have selected parent entity');
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		throw new Error('Should have selected parent entity');
	}

	protected override onLoadSucceeded(loaded: ICertificateResponse) {
		const data = loaded.dtos;
		return data;
	}
}