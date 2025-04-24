/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from './est-line-item-entity.interface';
import { IEstRuleEntity } from './est-rule-entity.interface';
import { IFormDataEntity } from './form-data-entity.interface';
import { IFormFieldEntity } from './form-field-entity.interface';
import { IPrjEstRuleEntity } from './prj-est-rule-entity.interface';
import { IQtoFormulaEntity } from './qto-formula-entity.interface';
import { IRubricEntity } from './rubric-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IFormEntityGenerated extends IEntityBase {

  /**
   * ContainerUuid
   */
  ContainerUuid?: string | null;

  /**
   * ContextId
   */
  ContextId: number;

  /**
   * CurrentFormDataId
   */
  CurrentFormDataId: number;

  /**
   * CurrentFormOpenMethod
   */
  CurrentFormOpenMethod: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EstLineItemEntities
   */
  EstLineItemEntities?: IEstLineItemEntity[] | null;

  /**
   * EstRuleEntities
   */
  EstRuleEntities?: IEstRuleEntity[] | null;

  /**
   * FileArchiveDocFk
   */
  FileArchiveDocFk?: number | null;

  /**
   * FormDataEntities
   */
  FormDataEntities?: IFormDataEntity[] | null;

  /**
   * FormHeight
   */
  FormHeight: number;

  /**
   * FormWidth
   */
  FormWidth: number;

  /**
   * FormfieldEntities
   */
  FormfieldEntities?: IFormFieldEntity[] | null;

  /**
   * HtmlTemplateContent
   */
  HtmlTemplateContent?: string | null;

  /**
   * HtmlTemplateFileName
   */
  HtmlTemplateFileName?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsContainer
   */
  IsContainer: boolean;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * IsVisible
   */
  IsVisible: boolean;

  /**
   * PrjEstRuleEntities
   */
  PrjEstRuleEntities?: IPrjEstRuleEntity[] | null;

  /**
   * QtoFormulaEntities
   */
  QtoFormulaEntities?: IQtoFormulaEntity[] | null;

  /**
   * RubricEntity
   */
  RubricEntity?: IRubricEntity | null;

  /**
   * RubricFk
   */
  RubricFk: number;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * ValidFrom
   */
  ValidFrom?: Date | string | null;

  /**
   * ValidTo
   */
  ValidTo?: Date | string | null;

  /**
   * WindowParameter
   */
  WindowParameter?: string | null;

  /**
   * WorkflowTemplateFk
   */
  WorkflowTemplateFk?: number | null;
}
