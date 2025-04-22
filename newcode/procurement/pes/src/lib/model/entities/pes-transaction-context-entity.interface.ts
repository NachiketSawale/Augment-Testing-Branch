/*
 * Copyright(c) RIB Software GmbH
 */

import { ITransactionContextBaseEntity } from '@libs/procurement/common';

export interface IPesTransactionContextEntity extends ITransactionContextBaseEntity {
	PesHeaderId?: number | null;
}
