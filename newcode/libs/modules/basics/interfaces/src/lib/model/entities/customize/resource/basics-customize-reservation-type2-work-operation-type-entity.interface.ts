/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeReservationType2WorkOperationTypeEntity extends IEntityBase, IEntityIdentification {
	ReservationTypeFk: number;
	EtmContextFk: number;
	WorkOperationTypeFk: number;
	CommentText: string;
}
