/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IOenGraphicEntity } from '@libs/boq/interfaces';

export interface IOenBoqItem2GraphicEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * OenGraphic
 */
  OenGraphic?: IOenGraphicEntity | null;

/*
 * OenGraphicFk
 */
  OenGraphicFk: number;
}
