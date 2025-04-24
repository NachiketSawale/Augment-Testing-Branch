/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IReportParameterEntity } from './report-parameter-entity.interface';

export interface IReportEntityGenerated extends IEntityBase {

  /**
   * Description
   */
  Description?: IDescriptionInfo | null;

  /**
   * DocumentCategoryFk
   */
  DocumentCategoryFk?: number | null;

  /**
   * DocumentTypeFk
   */
  DocumentTypeFk?: number | null;

  /**
   * FileName
   */
  FileName?: string | null;

  /**
   * FilePath
   */
  FilePath?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Name
   */
  Name?: IDescriptionInfo | null;

  /**
   * Nameing
   */
  Nameing?: string | null;

  /**
   * ReportParameterEntities
   */
  ReportParameterEntities?: IReportParameterEntity[] | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk?: number | null;

  /**
   * StoreInDocuments
   */
  StoreInDocuments: boolean;
}
