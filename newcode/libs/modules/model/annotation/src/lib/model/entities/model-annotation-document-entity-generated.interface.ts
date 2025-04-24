/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IModelAnnotationEntity } from './model-annotation-entity.interface';

export interface IModelAnnotationDocumentEntityGenerated extends IEntityBase {

/*
 * AnnotationDocumentTypeFk
 */
  AnnotationDocumentTypeFk: number;

/*
 * AnnotationFk
 */
  AnnotationFk: number;

/*
 * BasDocumentTypeFk
 */
  BasDocumentTypeFk: number;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DocumentDate
 */
  DocumentDate: string;

/*
 * FileArchiveDocFk
 */
  FileArchiveDocFk: number;

/*
 * Id
 */
  Id: number;

/*
 * ModelAnnotationEntity
 */
  ModelAnnotationEntity?: IModelAnnotationEntity | null;

/*
 * OriginFileName
 */
  OriginFileName?: string | null;

/*
 * Uuid
 */
  Uuid?: string | null;
}
