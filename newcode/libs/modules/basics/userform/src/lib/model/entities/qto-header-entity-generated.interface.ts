/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from './project-entity.interface';
import { IQtoHeaderFormDataEntity } from './qto-header-form-data-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IQtoHeaderEntityGenerated extends IEntityBase {

  /**
   * ClerkFk
   */
  ClerkFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * GoniometerTypeFk
   */
  GoniometerTypeFk?: number | null;

  /**
   * HeaderFk
   */
  HeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * NoDecimals
   */
  NoDecimals?: number | null;

  /**
   * Performedfrom
   */
  Performedfrom?: Date | string | null;

  /**
   * Performedto
   */
  Performedto?: Date | string | null;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * QtoDate
   */
  QtoDate?: Date | string | null;

  /**
   * QtoHeaderFormdataEntities
   */
  QtoHeaderFormdataEntities?: IQtoHeaderFormDataEntity[] | null;

  /**
   * QtoTargetType
   */
  QtoTargetType: number;

  /**
   * QtoTypeFk
   */
  QtoTypeFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * UseRoundedResults
   */
  UseRoundedResults: boolean;
}
