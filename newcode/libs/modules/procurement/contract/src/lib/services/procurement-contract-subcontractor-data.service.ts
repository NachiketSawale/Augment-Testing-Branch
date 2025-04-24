/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { IPrcSubreferenceEntity, ProcurementCommonSubcontractorDataService } from '@libs/procurement/common';
import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import {ProcurementContractHeaderDataService} from './procurement-contract-header-data.service';

/**
 * subcontractor service in contract
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractSubcontractorDataService extends ProcurementCommonSubcontractorDataService<IPrcSubreferenceEntity,IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementContractHeaderDataService);
		super(parentService);
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcSubreferenceEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}