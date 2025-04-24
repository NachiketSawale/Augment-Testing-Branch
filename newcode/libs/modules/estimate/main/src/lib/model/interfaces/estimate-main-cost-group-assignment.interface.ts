import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

export interface IEstimateMainCostGroupAssignment extends IEntityBase{
    Code:string;
    DescriptionInfo?: IDescriptionInfo | null;
    Costgroup:string;
    Costgroup_Desc:string;
}