/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstRuleParamEntity } from './est-rule-param-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstParametergroupEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstRuleParamEntities
 */
  EstRuleParamEntities?: IEstRuleParamEntity[] | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
