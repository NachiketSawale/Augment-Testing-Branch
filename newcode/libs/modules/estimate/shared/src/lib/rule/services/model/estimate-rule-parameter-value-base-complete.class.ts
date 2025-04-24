
import {CompleteIdentification} from '@libs/platform/common';
import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';

export class EstimateRuleParameterValueBaseComplete extends CompleteIdentification<IEstimateRuleParameterValueBaseEntity> {
    public PKey1?: number;

    public MainItemId?: number | null;

    public Code?: string | null;

    public MdcLineItemContextFk?: number | null;

    public parentId?: number | null;

    public ValueType?: number | null;

    public filter?: string | null;

    public PrjProjectFk? :number|null;
}