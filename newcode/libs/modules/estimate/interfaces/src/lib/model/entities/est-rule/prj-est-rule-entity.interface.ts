/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import {IEstCostGrpRuleEntity} from './est-cost-grp-rule-entity.interface';
import {IEstEvaluationSequenceEntity} from './est-evaluation-sequence-entity.interface';
import {IPrjBoq2EstRuleEntity} from './prj-boq-2est-rule-entity.interface';
import {IPrjEstRuleParamEntity} from './prj-est-rule-param-entity.interface';
import {IPrjEstRuleScriptEntity} from './prj-est-rule-script-entity.interface';
import {IEstRuleEntity} from './est-rule-entity.interface';

export interface IPrjEstRuleEntity extends IEstRuleEntity {
    /*
     * EstCostgrpRuleEntities
     */
    EstCostgrpRuleEntities?: IEstCostGrpRuleEntity[] | null;

    /*
     * EstEvaluationSequenceEntity
     */
    EstEvaluationSequenceEntity?: IEstEvaluationSequenceEntity | null;

    /*
     * PrjBoq2estRuleEntities
     */
    PrjBoq2estRuleEntities?: IPrjBoq2EstRuleEntity[] | null;

    /*
     * PrjEstRuleChildren
     */
    PrjEstRuleChildren?: IPrjEstRuleEntity[] | null;

    /*
     * PrjEstRuleFk
     */
    PrjEstRuleFk?: number | null;

    /*
     * PrjEstRuleParamEntities
     */
    PrjEstRuleParamEntities?: IPrjEstRuleParamEntity[] | null;

    /*
     * PrjEstRuleParent
     */
    PrjEstRuleParent?: IPrjEstRuleEntity | null;

    /*
     * PrjEstRuleScriptEntities
     */
    PrjEstRuleScriptEntities?: IPrjEstRuleScriptEntity[] | null;

    /*
     * PrjEstRules
     */
    PrjEstRules?: IPrjEstRuleEntity[] | null;

    /*
     * ProjectFk
     */
    ProjectFk?: number | null;
}
