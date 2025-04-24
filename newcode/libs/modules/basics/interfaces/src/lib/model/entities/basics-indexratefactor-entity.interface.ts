/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface IBasIndexRateFactorEntity extends IEntityBase , IEntityIdentification {
    DescriptionInfo?: IDescriptionInfo;
}