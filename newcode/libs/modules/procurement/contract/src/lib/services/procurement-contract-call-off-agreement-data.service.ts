/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { ProcurementCommonCallOffAgreementDataService } from '@libs/procurement/common';
import { IProcurementContractCallOffAgreementEntity } from '../model/entities/con-call-off-agreement-entity.interface';

@Injectable({
	providedIn: 'root'
})

/**
 * Contract CallOffAgreement data service
 */
export class ProcurementContractCallOffAgreementDataService extends ProcurementCommonCallOffAgreementDataService<IProcurementContractCallOffAgreementEntity, IConHeaderEntity, ContractComplete> {

	public constructor() {
		const contractDataService = inject(ProcurementContractHeaderDataService);
		super(contractDataService);
	}

	protected override provideLoadPayload(): object {
		return {PKey2: this.getSelectedParent()?.Id};
	}

	protected override provideCreatePayload(): object {
		const parentId = this.getSelectedParent()?.Id;
		if (parentId) {
			return {PKey2: parentId};
		}
		throw new Error('Please select a contract first');
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IProcurementContractCallOffAgreementEntity): boolean {
		return entity.ConHeaderFk === parentKey.Id;
	}
}