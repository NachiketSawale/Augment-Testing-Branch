/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelAnnotationCameraEntity } from './model-annotation-camera-entity.interface';
// import { IModelAnnotationClipEntity } from './model-annotation-clip-entity.interface';
// import { IModelAnnotationCommentEntity } from './model-annotation-comment-entity.interface';
import { IModelAnnotationDocumentEntity } from './model-annotation-document-entity.interface';
import { IModelAnnotationMarkerEntity } from './model-annotation-marker-entity.interface';
import { IModelAnnotationReferenceEntity } from './model-annotation-reference-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IModelAnnotationEntityGenerated extends IEntityBase {

/*
 * BpdContactFk
 */
  BpdContactFk?: number | null;

/*
 * BusinessPartnerFk
 */
  BusinessPartnerFk?: number | null;

/*
 * CameraEntities
 */
  CameraEntities?: IModelAnnotationCameraEntity[] | null;

/*
 * CategoryFk
 */
  CategoryFk?: number | null;

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * ClipEntities
 */
  // ClipEntities?: IModelAnnotationClipEntity[] | null;

/*
 * Color
 */
  Color?: number | null;

/*
 * CommentEntities
 */
  // CommentEntities?: IModelAnnotationCommentEntity[] | null;

/*
 * DefaultCameraEntity
 */
  DefaultCameraEntity?: IModelAnnotationCameraEntity | null;

/*
 * DefectFk
 */
  DefectFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DocumentEntities
 */
  DocumentEntities?: IModelAnnotationDocumentEntity[] | null;

/*
 * DueDate
 */
  DueDate?: string | null;

/*
 * EffectiveCategoryFk
 */
  EffectiveCategoryFk: number;

/*
 * HasGoodCamera
 */
  HasGoodCamera?: boolean | null;

/*
 * HsqChecklistFk
 */
  HsqChecklistFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * InfoRequestFk
 */
  InfoRequestFk?: number | null;

/*
 * MarkerEntities
 */
  MarkerEntities?: IModelAnnotationMarkerEntity[] | null;

/*
 * MeasurementFk
 */
  MeasurementFk?: number | null;

/*
 * MeasurementValue
 */
  MeasurementValue?: number | null;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * PriorityFk
 */
  PriorityFk: number;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * RawType
 */
  RawType: number;

/*
 * ReferenceFromEntity
 */
  ReferenceFromEntity?: IModelAnnotationReferenceEntity[] | null;

/*
 * ReferenceToEntity
 */
  ReferenceToEntity?: IModelAnnotationReferenceEntity[] | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * Sorting
 */
  Sorting: number;

/*
 * StatusFk
 */
  StatusFk: number;

/*
 * SubsidiaryFk
 */
  SubsidiaryFk?: number | null;

/*
 * Uuid
 */
  Uuid?: string | null;

/*
 * ViewpointFk
 */
  ViewpointFk?: number | null;
}
