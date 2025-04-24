/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IClobEntity } from '@libs/cloud/interfaces';

export interface IEngCadImportConfigEntityGenerated extends IEntityBase {

/*
 * BasClobConfigFk
 */
  BasClobConfigFk?: number | null;

/*
 * BaseDirectory
 */
  BaseDirectory?: string | null;

/*
 * ClobToSave
 */
  ClobToSave?: IClobEntity | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * EngDrawingTypeFk
 */
  EngDrawingTypeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * ImporterKind
 */
  ImporterKind?: number | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * MatchPattern
 */
  MatchPattern?: string | null;

/*
 * MatchPatternType
 */
  MatchPatternType?: number | null;
}
