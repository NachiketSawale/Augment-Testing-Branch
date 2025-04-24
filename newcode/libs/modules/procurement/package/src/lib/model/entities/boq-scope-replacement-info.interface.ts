/*
 * Copyright(c) RIB Software GmbH
 */

import {IPrcPackageEntity} from '@libs/procurement/interfaces';
import {IPackageBoqItemEntity} from './package-boq-item-entity.interface';
import {InjectionToken} from '@angular/core';

export interface IBoqScopeReplacementData {
	packageItem: IPrcPackageEntity;
	targetBoqItem: IPackageBoqItemEntity;
	targetBoqTree: IPackageBoqItemEntity;
}

export interface IGetReplacementBoqsResponse {
	boqItems: IPackageBoqItemEntity[];
	replacementBoqItemIds: number[];
}

export const BOQ_SCOPE_REPLACEMENT_DATA_TOKEN = new InjectionToken<IBoqScopeReplacementData>('boq-scope-replacement-data');