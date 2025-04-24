/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInstanceHeaderEntityGenerated extends IEntityBase {

/*
 * BasLanguageQtoFk
 */
  BasLanguageQtoFk: number;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * EstimateHeaderFk
 */
  EstimateHeaderFk: number;

/*
 * Hint
 */
  Hint?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsIncremental
 */
  IsIncremental: boolean;

/*
 * MdlChangeSetFk
 */
  MdlChangeSetFk?: number | null;

/*
 * ModelCsFk
 */
  ModelCsFk?: number | null;

/*
 * ModelFk
 */
  ModelFk?: number | null;

/*
 * ModelOldFk
 */
  ModelOldFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * PsdScheduleFk
 */
  PsdScheduleFk?: number | null;

/*
 * QtoAcceptQuality
 */
  QtoAcceptQuality: number;

/*
 * StateFk
 */
  StateFk: number;
}
