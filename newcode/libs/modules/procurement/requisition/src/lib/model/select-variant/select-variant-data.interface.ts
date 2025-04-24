import {IReqHeaderEntity} from '../entities/reqheader-entity.interface';
import {InjectionToken} from '@angular/core';

export interface ISelectVariantData {
	variantId: number;
	reqHeader?: IReqHeaderEntity;
}

export const SELECT_VARIANT_DATA_TOKEN = new InjectionToken<ISelectVariantData>('select-variant-data-token');