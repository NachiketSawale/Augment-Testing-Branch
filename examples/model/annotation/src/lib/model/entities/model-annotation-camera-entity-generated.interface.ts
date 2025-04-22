/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

// import { IModelAnnotationClipEntity } from './model-annotation-clip-entity.interface';
import { IModelAnnotationEntity } from './model-annotation-entity.interface';
import { IModelAnnotationMarkerEntity } from './model-annotation-marker-entity.interface';
import { IDescriptionInfo, IEntityBase, IIdentificationData } from '@libs/platform/common';

export interface IModelAnnotationCameraEntityGenerated extends IEntityBase {

/*
 * AnnotationFk
 */
  AnnotationFk: number;

/*
 * ClippingPlanes
 */
  // ClippingPlanes?: IModelAnnotationClipEntity[] | null;

/*
 * ContextModelId
 */
  ContextModelId?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DirX
 */
  DirX: number;

/*
 * DirY
 */
  DirY: number;

/*
 * DirZ
 */
  DirZ: number;

/*
 * FileArchiveDocImageFk
 */
  FileArchiveDocImageFk?: number | null;

/*
 * ForeignParentId
 */
  ForeignParentId?: IIdentificationData | null;

/*
 * ForeignParentTypeId
 */
  ForeignParentTypeId?: string | null;

/*
 * HiddenMeshIds
 */
  HiddenMeshIds?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsOrthographic
 */
  IsOrthographic: boolean;

/*
 * LegacyId
 */
  LegacyId?: IIdentificationData | null;

/*
 * ModelAnnotationClipEntities
 */
  // ModelAnnotationClipEntities?: IModelAnnotationClipEntity[] | null;

/*
 * ModelAnnotationEntity
 */
  ModelAnnotationEntity?: IModelAnnotationEntity | null;

/*
 * ModelAnnotationMarkerEntities
 */
  ModelAnnotationMarkerEntities?: IModelAnnotationMarkerEntity[] | null;

/*
 * ObjectSetExcludeFk
 */
  ObjectSetExcludeFk?: number | null;

/*
 * Param
 */
  Param: number;

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
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Snapshot
 */
  Snapshot?: string | null;

/*
 * TemporaryId
 */
  TemporaryId?: string | null;

/*
 * UpX
 */
  UpX: number;

/*
 * UpY
 */
  UpY: number;

/*
 * UpZ
 */
  UpZ: number;

/*
 * Uuid
 */
  Uuid?: string | null;
}
