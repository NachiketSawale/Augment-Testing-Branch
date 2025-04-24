/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILanguageEntityGenerated extends IEntityBase {

/*
 * AccessGuid
 */
  AccessGuid?: string | null;

/*
 * Culture
 */
  Culture?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * ExportColumnName
 */
  ExportColumnName?: string | null;

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
 * IsSystem
 */
  IsSystem?: boolean | null;

/*
 * LanguageId
 */
  LanguageId?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
