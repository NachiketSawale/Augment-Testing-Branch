import { Injectable, InjectionToken } from '@angular/core';
import { BasicsSharedPriceConditionParamDataService, PriceConditionHeaderEnum } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';

export const PROCUREMENT_Package_PRICE_CONDITION_PARAM_DATA_TOKEN = new InjectionToken<ProcurementPackagePriceConditionParamDataService>('procurementContractPriceConditionParamDataService');

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackagePriceConditionParamDataService extends BasicsSharedPriceConditionParamDataService<IPrcPackageEntity, PrcPackageCompleteEntity>{
	public constructor(protected packageService: ProcurementPackageHeaderDataService) {
		super(packageService,PriceConditionHeaderEnum.Package);
	}


}
