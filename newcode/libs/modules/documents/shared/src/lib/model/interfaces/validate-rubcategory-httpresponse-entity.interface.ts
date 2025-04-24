/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

export interface IValidateRubcategoryHttpResponseEntity extends IEntityBase{
    BasRubricCategoryFk: number,
    DescriptionTranslateType?:IDescriptionInfo | null,
    FrmAccessRightDescriptorFk?:number|null,
    Id:number,
    Isdefault:boolean,
    IsLive:boolean
}