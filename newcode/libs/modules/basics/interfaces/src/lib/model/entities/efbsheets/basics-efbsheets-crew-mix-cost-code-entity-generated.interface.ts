/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
export interface IBasicsEfbsheetsCrewMixCostCodeEntityGenerated extends IEntityBase{
    Id?: number | null;
    DescriptionInfo?: IDescriptionInfo | null;
    EstCrewMixFk?: number | null;
    MdcCostCodeFk?: number | null;
}