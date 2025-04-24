/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface IClobsEntity extends IEntityBase, IEntityIdentification{
	Id: number;
	Content?: string | null;
}
