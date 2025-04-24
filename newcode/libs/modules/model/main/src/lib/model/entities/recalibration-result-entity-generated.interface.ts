/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelObject2DEntity } from './model-object-2dentity.interface';

export interface IRecalibrationResultEntityGenerated {

/*
 * AffectedObjectCount
 */
  AffectedObjectCount?: number | null;

/*
 * Dimensions
 */
  Dimensions?: IModelObject2DEntity[] | null;
}
