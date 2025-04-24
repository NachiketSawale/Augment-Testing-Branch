/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResReservationStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ReservationstatruleFk: number;
	ClerkRoleFk: number;
}
