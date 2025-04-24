/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';


export interface IBasicsStateEntity extends IEntityBase , IEntityIdentification {
	 CountryFk?: number;
	 DescriptionInfo?: IDescriptionInfo;
	 State?: string;
}