/*
 * Copyright(c) RIB Software GmbH
 */

import { ITemplateActivityTemplateEntity } from './template-activity-template-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICosActivityTemplateEntityGenerated extends IEntityBase {

  /**
   * ActivityTemplate
   */
  ActivityTemplate: ITemplateActivityTemplateEntity;

  /**
   * ActivityTemplateFk
   */
  ActivityTemplateFk: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CosHeaderFk
   */
  CosHeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * SchedulingContextFk
   */
  SchedulingContextFk: number;
}
