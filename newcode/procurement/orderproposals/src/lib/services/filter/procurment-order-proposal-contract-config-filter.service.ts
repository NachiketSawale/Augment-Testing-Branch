/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { ILookupServerSideFilter, ServerSideFilterValueType} from '@libs/ui/common';
import {ProcurementConfigurationEntity, Rubric} from '@libs/basics/shared';
import { IOrderProposalEntity } from '../../model/entities/order-proposal-entity.interface';


@Injectable({
	providedIn: 'root'
})

/**
 * Procurement OrderProposal Contract Config Filter Service.
 */
export class ProcurementOrderProposalContractConfigFilterService implements ILookupServerSideFilter<ProcurementConfigurationEntity, IOrderProposalEntity> {
	public key = 'prc-order-con-configuration-filter';
	public execute(): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return 'RubricFk = ' + Rubric.Contract;
	}
}