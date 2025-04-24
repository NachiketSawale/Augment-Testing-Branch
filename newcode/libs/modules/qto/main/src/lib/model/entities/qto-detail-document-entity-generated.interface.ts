/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IQtoMainDetailGridEntity } from '../qto-main-detail-grid-entity.class';

export interface IQtoDetailDocumentEntityGenerated extends IEntityBase {

/*
 * DocumentDate
 */
  DocumentDate: string;

/*
 * DocumentDescription
 */
  DocumentDescription?: string | null;

/*
 * DocumentTypeFk
 */
  DocumentTypeFk: number;

/*
 * FileArchiveDocFk
 */
  FileArchiveDocFk: number;

/*
 * Id
 */
  Id: number;

/*
 * OriginFileName
 */
  OriginFileName?: string | null;

/*
 * QtoDetailDocumentTypeFk
 */
  QtoDetailDocumentTypeFk: number;

/*
 * QtoDetailEntity
 */
  QtoDetailEntity?: IQtoMainDetailGridEntity | null;

/*
 * QtoDetailFk
 */
  QtoDetailFk: number;
}
