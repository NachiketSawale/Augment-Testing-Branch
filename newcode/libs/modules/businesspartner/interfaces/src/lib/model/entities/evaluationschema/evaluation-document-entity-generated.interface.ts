/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationEntity } from './evaluation-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEvaluationDocumentEntityGenerated extends IEntityBase {

  /**
   * CanDownload
   */
  CanDownload: boolean;

  /**
   * CanUpload
   */
  CanUpload: boolean;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentDate
   */
  DocumentDate?: Date | string | null;

  /**
   * DocumentTypeFk
   */
  DocumentTypeFk: number;

  /**
   * EvaluationEntity
   */
  EvaluationEntity?: IEvaluationEntity | null;

  /**
   * EvaluationFk
   */
  EvaluationFk: number;

  /**
   * FileArchiveDocFk
   */
  FileArchiveDocFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * OriginFileName
   */
  OriginFileName?: string | null;
}
