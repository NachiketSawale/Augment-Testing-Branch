/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRoundToEntity extends IEntityBase, IEntityIdentification {
	RoundTo: string;
	IsDefault: boolean;
	IsLive: boolean;
}
