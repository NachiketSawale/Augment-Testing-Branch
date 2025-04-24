/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMasterResResource2mdcContextEntityGenerated extends IEntityIdentification, IEntityBase {
	 ResourceFk: number;
	 MdcContextFk: number;
	 CurrencyFk: number;
	 CostCodeFk?: number | null;
	 Rate: number;
}