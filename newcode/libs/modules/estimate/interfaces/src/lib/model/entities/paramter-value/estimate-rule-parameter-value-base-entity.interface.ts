import {IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

export interface  IEstimateRuleParameterValueBaseEntity extends IEntityBase, IEntityIdentification  {
    Id: number;
    DescriptionInfo?: IDescriptionInfo | null;
    ValueDetail: string;
    ValueType: number;
    Value: number;
    IsDefault: boolean;
    ParameterCode: string;
    Sorting: number;
}

