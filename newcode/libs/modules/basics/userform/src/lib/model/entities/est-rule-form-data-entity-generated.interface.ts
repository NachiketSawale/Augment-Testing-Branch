/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstRuleEntity } from './est-rule-entity.interface';
import { IFormDataEntity } from './form-data-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstRuleFormDataEntityGenerated extends IEntityBase {

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EstRuleEntity
   */
  EstRuleEntity?: IEstRuleEntity | null;

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
}
