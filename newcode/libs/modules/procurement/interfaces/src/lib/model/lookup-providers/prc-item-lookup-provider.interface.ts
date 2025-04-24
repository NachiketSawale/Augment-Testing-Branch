/*
 * Copyright(c) RIB Software GmbH
 */

import { ILookupFieldOverload, ILookupOptions } from '@libs/ui/common';
import { LazyInjectionToken } from '@libs/platform/common';
import { IPrcItemLookupVEntity } from '../entities/prc-item-lookup-entity.interface';

export interface IPrcItemLookupOptions<T extends object> {
	lookupOptions?: Partial<ILookupOptions<IPrcItemLookupVEntity, T>>;
}

export interface IPrcItemLookupProvider {
	generateProcurementItemLookup<T extends object>(options?: IPrcItemLookupOptions<T>): ILookupFieldOverload<T>;
}

export const PROCUREMENT_ITEM_LOOKUP_PROVIDER_TOKEN = new LazyInjectionToken<IPrcItemLookupProvider>('procurement.shared.IPrcItemLookupProvider');