/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import {IEstimateRuleParameterBaseEntity, IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';
import {EstimateRuleParameterBaseComplete} from '@libs/estimate/shared';
import {ProjectRuleParamValueComplete} from './project-rule-param-value-complete.class';

export class ProjectRuleParamComplete extends EstimateRuleParameterBaseComplete{

    public EstimateRuleParameterEntity?: IEstimateRuleParameterBaseEntity | null;



    public PrjRuleParamValueToDelete: IEstimateRuleParameterValueBaseEntity[] | null = [];

    /*
     * EstRuleParamValueToSave
     */
    public PrjRuleParamValueToSave: ProjectRuleParamValueComplete[] | null = [];

}
