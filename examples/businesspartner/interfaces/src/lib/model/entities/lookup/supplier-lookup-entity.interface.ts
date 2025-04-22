/*
 * Copyright(c) RIB Software GmbH
 */

import { ISupplierEntity } from '../main/supplier-entity.interface';

export interface ISupplierLookupEntity extends ISupplierEntity {
	BpdVatGroupFk?: number | null;
}


