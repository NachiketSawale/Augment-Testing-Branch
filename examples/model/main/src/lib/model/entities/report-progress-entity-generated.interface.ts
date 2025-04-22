/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

export interface IReportProgressEntityGenerated {

/*
 * ActivityIds
 */
  ActivityIds?: number[] | null;

/*
 * Date
 */
  Date?: string | null;

/*
 * EstHeaderId
 */
  EstHeaderId?: number | null;

/*
 * LineItemIds
 */
  LineItemIds?: IIdentificationData[] | null;

/*
 * ModelId
 */
  ModelId?: number | null;

/*
 * ObjectIds
 */
  ObjectIds?: string | null;

/*
 * Overwrite
 */
  Overwrite?: boolean | null;

/*
 * Remark
 */
  Remark?: string | null;
}
