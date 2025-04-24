/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IFormDataIntersectionEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * FormDataFk
   */
  FormDataFk: number;

  /**
   * FormFk
   */
  FormFk?: number | null;

  /**
   * Id
   */
  Id: number;
}
