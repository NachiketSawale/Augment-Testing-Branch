/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IIdentificationData } from '@libs/platform/common';
import { IModelAnnotationEntity } from './model-annotation-entity.interface';
import { IModelAnnotationCameraEntity } from './model-annotation-camera-entity.interface';

export interface IModelAnnotationMarkerEntityGenerated extends IEntityBase {

/*
 * AnnotationEntity
 */
  AnnotationEntity?: IModelAnnotationEntity | null;

/*
 * AnnotationFk
 */
  AnnotationFk: number;

/*
 * CameraFk
 */
  CameraFk?: number | null;

/*
 * CameraPosition
 */
  CameraPosition?: IModelAnnotationCameraEntity | null;

/*
 * Color
 */
  Color?: number | null;

/*
 * ContextModelId
 */
  ContextModelId?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EffectiveColor
 */
  EffectiveColor?: number | null;

/*
 * ForeignParentId
 */
  ForeignParentId?: IIdentificationData | null;

/*
 * ForeignParentTypeId
 */
  ForeignParentTypeId?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * LayoutId
 */
  LayoutId?: string | null;

/*
 * LegacyId
 */
  LegacyId?: IIdentificationData | null;

/*
 * MarkerShapeFk
 */
  MarkerShapeFk?: number | null;

/*
 * MarkupJson
 */
  MarkupJson?: string | null;

/*
 * ModelAnnotationCameraEntity
 */
  ModelAnnotationCameraEntity?: IModelAnnotationCameraEntity | null;

/*
 * OwnerModelFk
 */
  OwnerModelFk?: number | null;

/*
 * PosX
 */
  PosX: number;

/*
 * PosY
 */
  PosY: number;

/*
 * PosZ
 */
  PosZ: number;

/*
 * RawAnnotationBaseType
 */
  RawAnnotationBaseType?: number | null;

/*
 * TemporaryId
 */
  TemporaryId?: string | null;

/*
 * UniformAnnotationParentId
 */
  UniformAnnotationParentId?: string | null;
}
