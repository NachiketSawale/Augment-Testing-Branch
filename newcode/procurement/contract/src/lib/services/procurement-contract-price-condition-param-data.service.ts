/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, InjectionToken } from '@angular/core';
import { BasicsSharedPriceConditionParamDataService, PriceConditionHeaderEnum } from '@libs/basics/shared';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';


export const PROCUREMENT_CONTRACT_PRICE_CONDITION_PARAM_DATA_TOKEN = new InjectionToken<ProcurementContractPriceConditionParamDataService>('procurementContractPriceConditionParamDataService');

/**
 * The price condition param service in contract
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractPriceConditionParamDataService extends BasicsSharedPriceConditionParamDataService<IConHeaderEntity,ContractComplete>{
	/**
	 * The constructor
	 */
	public constructor(protected contractService: ProcurementContractHeaderDataService) {
		super(contractService,PriceConditionHeaderEnum.Contract);
	}
}
