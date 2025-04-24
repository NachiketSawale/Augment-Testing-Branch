/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IPrjEstRuleEntity } from './prj-est-rule-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrjEstRuleFormDataEntityGenerated extends IEntityBase {

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * FormDataEntity
   */
  FormDataEntity?: IFormDataEntity | null;

  /**
   * FormDataFk
   */
  FormDataFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PrjEstRuleEntity
   */
  PrjEstRuleEntity?: IPrjEstRuleEntity | null;
}
