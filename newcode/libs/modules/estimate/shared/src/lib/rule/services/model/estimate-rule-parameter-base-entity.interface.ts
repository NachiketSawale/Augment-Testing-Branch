import {IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';


export interface  IEstimateRuleParameterBaseEntity extends IEntityBase, IEntityIdentification  {
    Id: number;
    Info?: string | null;
    EstParameterGroupFk: number;
    DescriptionInfo?: IDescriptionInfo | null;
    Code: string;
    Sorting: number;
    ValueDetail: string;
    UomFk : number ;
    DefaultValue: number;
    ValueType: number;
    IsLookup: boolean;
    EstRuleParamValueFk:number;
}

