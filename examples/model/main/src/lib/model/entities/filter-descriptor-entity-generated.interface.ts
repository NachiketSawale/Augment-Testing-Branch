/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IFilterDescriptorEntityGenerated {

/*
 * HighlightingSchemeFk
 */
  HighlightingSchemeFk?: number | null;

/*
 * filterId
 */
  filterId?: string | null;

/*
 * rulesetId
 */
  rulesetId?: number | null;

/*
 * type
 */
  type?: 'Filter' | 'Simulation' | 'Ruleset' | 'Disabled' | null;
}
