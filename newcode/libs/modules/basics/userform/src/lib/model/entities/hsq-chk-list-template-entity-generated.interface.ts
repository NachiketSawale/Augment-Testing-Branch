/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqChecklistEntity } from './hsq-checklist-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IHsqChkListTemplateEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * HsqCheckListGroupFk
   */
  HsqCheckListGroupFk: number;

  /**
   * HsqCheckListTypeFk
   */
  HsqCheckListTypeFk: number;

  /**
   * HsqChecklistEntities
   */
  HsqChecklistEntities?: IHsqChecklistEntity[] | null;

  /**
   * HsqContextFk
   */
  HsqContextFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * PsdActivityTemplateFk
   */
  PsdActivityTemplateFk?: number | null;
}
