/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';

export interface IRuleParameterValuesUpdateGenerated {

/*
 * itemsToDelete
 */
  itemsToDelete?: IEstimateRuleParameterValueBaseEntity[] | null;

/*
 * itemsToSave
 */
  itemsToSave?: IEstimateRuleParameterValueBaseEntity[] | null;
}
