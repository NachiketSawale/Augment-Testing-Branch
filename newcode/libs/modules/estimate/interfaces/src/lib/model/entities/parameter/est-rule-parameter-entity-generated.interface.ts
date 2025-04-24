
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstRuleParameterEntityGenerated extends IEntityBase{

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
    EstRuleFk:number;
    MdcLineItemContextFk:number |null;
    PrjProjectFk:number|null;
}
