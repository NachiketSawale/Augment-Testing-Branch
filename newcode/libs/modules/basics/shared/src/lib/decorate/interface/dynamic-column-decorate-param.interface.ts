/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { IBasicsSharedDynamicColumnService } from '../../dynamic-column-config/interface/dynamic-column.interface';

export interface IBasicSharedDynamicColumnDecoratedParam<T extends object> {
	EntitiesPropertyName: string;
	GridGuid: string;
	DynamicServiceTokens: ProviderToken<IBasicsSharedDynamicColumnService<T>>[];
}