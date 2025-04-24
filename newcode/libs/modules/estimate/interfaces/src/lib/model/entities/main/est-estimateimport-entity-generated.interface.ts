/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IEstEstimateimportEntityGenerated extends IEntityBase {

/*
 * Errormessage
 */
  Errormessage?: string | null;

/*
 * EstHeaderEntity
 */
  EstHeaderEntity?: IEstHeaderEntity | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * Hint
 */
  Hint?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * Status
 */
  Status?: number | null;

/*
 * WarningMessages
 */
  WarningMessages?: string[] | null;
}
