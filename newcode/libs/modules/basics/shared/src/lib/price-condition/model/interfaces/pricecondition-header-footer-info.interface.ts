/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import { IEntityIdentification } from '@libs/platform/common';
import { IBasicsSharedPriceConditionService } from '../../services/interfaces/price-condition-service.interface';

/**
 * injection token of priceConditionHeaderGridFooter
 */
export const BasicsSharedPriceConditionHeaderGridFooterInfoToken = new InjectionToken<IBasicsSharedPriceConditionHeaderGridFooterInfo<IMaterialPriceConditionEntity>>('price-condition-header-grid-footer-info');

export interface IBasicsSharedPriceConditionHeaderGridFooterInfo<T extends IMaterialPriceConditionEntity> {
	readonly dataService: IBasicsSharedPriceConditionService<T, IEntityIdentification>;
}
