/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRoundingMethodEntity extends IEntityBase, IEntityIdentification {
	Type: string;
	IsDefault: boolean;
	IsLive: boolean;
}
