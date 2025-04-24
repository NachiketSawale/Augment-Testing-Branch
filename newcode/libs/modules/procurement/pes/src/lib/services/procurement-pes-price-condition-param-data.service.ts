/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, InjectionToken } from '@angular/core';
import { BasicsSharedPriceConditionParamDataService, PriceConditionHeaderEnum } from '@libs/basics/shared';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

export const PROCUREMENT_PES_PRICE_CONDITION_PARAM_DATA_TOKEN = new InjectionToken<ProcurementPesPriceConditionParamDataService>('procurementPesPriceConditionParamDataService');

/**
 * The price condition param service in pes
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesPriceConditionParamDataService extends BasicsSharedPriceConditionParamDataService<IPesHeaderEntity, PesCompleteNew> {
	/**
	 * The constructor
	 */
	public constructor(protected pesService: ProcurementPesHeaderDataService) {
		super(pesService, PriceConditionHeaderEnum.Pes);
	}
}
