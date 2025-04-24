/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IPpsDrawingTypeEntity extends IEntityBase {
    Id: number;
    RubricCategoryFk: number;
    DescriptionInfo: IDescriptionInfo;
    Icon?: number;
    IsDefault: boolean;
    Sorting: number;
    IsLive: boolean;
    MaterialGroupFk: number;
    ResTypeDetailerFk: number;
}