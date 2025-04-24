/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBasicsSupportsIsLive extends IEntityBase {
	IsLive: boolean;
}