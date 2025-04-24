/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceTypeAlternativeResTypeEntityGenerated extends IEntityIdentification, IEntityBase {
	 ResTypeFk: number;
	 Quantity: number;
	 ResAlterTypeFk: number;
}