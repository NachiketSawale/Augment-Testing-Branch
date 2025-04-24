/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IRequestedSkillVEntityGenerated extends IEntityBase {

/*
 * Duration
 */
  Duration?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsRequestedEntirePeriod
 */
  IsRequestedEntirePeriod?: boolean | null;

/*
 * NecessaryOperators
 */
  NecessaryOperators?: number | null;

/*
 * ResSkillFk
 */
  ResSkillFk?: number | null;

/*
 * TypeRequestedFk
 */
  TypeRequestedFk?: number | null;

/*
 * TypeRequestedId
 */
  TypeRequestedId?: number | null;

/*
 * UomDayFk
 */
  UomDayFk?: number | null;
}
