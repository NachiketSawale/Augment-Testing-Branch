/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcDocumentEntity } from './prc-document-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcDocumentTypeEntityGenerated extends IEntityBase {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsInternalOnly
   */
  IsInternalOnly: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * PrcDocumentEntities
   */
  PrcDocumentEntities?: IPrcDocumentEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;
}
