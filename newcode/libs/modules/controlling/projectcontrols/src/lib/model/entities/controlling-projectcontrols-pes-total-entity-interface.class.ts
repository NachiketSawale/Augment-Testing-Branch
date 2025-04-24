/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingCommonPesEntity } from '@libs/controlling/common';

export interface ControllingProjectControlsPesTotalEntity extends IControllingCommonPesEntity {
	PesHeaderFk?: number | null;

	DocumentDate?: Date | null;

	DateDelivered?: Date | null;

	DateDeliveredFrom?: Date | null;

	DateEffective?: Date | null;
}
