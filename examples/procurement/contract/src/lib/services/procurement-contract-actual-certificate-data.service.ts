/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { IPrcHeaderContext, ProcurementCommonActualCertificateDataService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractActualCertificateDataService extends ProcurementCommonActualCertificateDataService<IConHeaderEntity, ContractComplete> {
	public constructor(protected contractService: ProcurementContractHeaderDataService) {
		super(contractService,{
			readPoint:'listtocontract',
			createPoint:'createtocontract'
		});
	}

	public override getHeaderContext():IPrcHeaderContext{
		return this.contractService.getHeaderContext();
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
				businessPartnerFk:parentSelection.BusinessPartnerFk
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
}