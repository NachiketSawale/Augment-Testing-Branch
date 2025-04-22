/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { IPrcWarrantyEntity, ProcurementCommonWarrantyDataService} from '@libs/procurement/common';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import {ProcurementContractHeaderDataService} from './procurement-contract-header-data.service';

/**
 * Warranty  service in contract
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractWarrantyDataService extends ProcurementCommonWarrantyDataService<IPrcWarrantyEntity,IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementContractHeaderDataService);
		super(parentService);
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcWarrantyEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}