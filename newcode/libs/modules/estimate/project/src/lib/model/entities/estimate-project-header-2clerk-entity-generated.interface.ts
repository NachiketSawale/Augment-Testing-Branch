/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * EstimateProjectHeader2ClerkEntityGenerated Interface
 */
export interface IEstimateProjectHeader2ClerkEntityGenerated extends IEntityBase {

/*
 * ClerkFk
 */
  ClerkFk: number;

/*
 * ClerkRoleFk
 */
  ClerkRoleFk: number;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * Id
 */
  Id: number;
}
