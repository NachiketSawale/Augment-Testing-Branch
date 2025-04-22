/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationDocumentEntity } from './evaluation-document-entity.interface';

export interface IEvaluationDocumentToSaveEntityGenerated {

  /**
   * EvaluationDocument
   */
  EvaluationDocument?: IEvaluationDocumentEntity | null;

  /**
   * MainItemId
   */
  MainItemId: number;
}
