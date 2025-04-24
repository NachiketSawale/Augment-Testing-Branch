/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstRuleResultHeaderEntityGenerated extends IEntityBase {

/*
 * CurrentSequence
 */
  CurrentSequence?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * ExecutionState
 */
  ExecutionState?: number | null;

/*
 * Finished
 */
  Finished?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * JobFk
 */
  JobFk?: number | null;

/*
 * Message
 */
  Message?: string | null;

/*
 * Total
 */
  Total?: number | null;
}
