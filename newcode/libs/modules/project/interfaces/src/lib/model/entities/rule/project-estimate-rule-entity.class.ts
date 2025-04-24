
import {IPrjEstRuleEntity} from '@libs/estimate/interfaces';

export interface IProjectEstimateRuleEntity extends IPrjEstRuleEntity {
    oldCode?: string | null;
    isUniq?: boolean | null;
}