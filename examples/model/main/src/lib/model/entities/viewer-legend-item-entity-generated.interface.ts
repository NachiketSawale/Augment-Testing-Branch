/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

export interface IViewerLegendItemEntityGenerated {

/*
 * Color
 */
  Color?: number | null;

/*
 * ObjectState
 */
  ObjectState?: string | null;

/*
 * RuleFk
 */
  RuleFk?: IIdentificationData | null;

/*
 * Text
 */
  Text?: string | null;
}
