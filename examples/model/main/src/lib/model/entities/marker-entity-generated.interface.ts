/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMarkerEntityGenerated extends IEntityBase {

/*
 * CameraPositionX
 */
  CameraPositionX: number;

/*
 * CameraPositionY
 */
  CameraPositionY: number;

/*
 * CameraPositionZ
 */
  CameraPositionZ: number;

/*
 * Id
 */
  Id: number;

/*
 * MarkerTypeFk
 */
  MarkerTypeFk: number;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * PositionX
 */
  PositionX: number;

/*
 * PositionY
 */
  PositionY: number;

/*
 * PositionZ
 */
  PositionZ: number;
}
