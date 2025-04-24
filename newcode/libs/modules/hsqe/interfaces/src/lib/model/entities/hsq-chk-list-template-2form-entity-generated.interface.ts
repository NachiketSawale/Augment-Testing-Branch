/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IHsqChkListTemplateEntity } from './hsq-chk-list-template-entity.interface';

export interface IHsqChkListTemplate2FormEntityGenerated extends IEntityBase {

/*
 * BasFormDataFk
 */
  BasFormDataFk?: number | null;

/*
 * BasFormFk
 */
  BasFormFk: number;

/*
 * Code
 */
  Code: string;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * HsqChklisttemplateEntity
 */
  HsqChklisttemplateEntity?: IHsqChkListTemplateEntity | null;

/*
 * HsqChklisttemplateFk
 */
  HsqChklisttemplateFk: number;

/*
 * Id
 */
  Id: number;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * TemporaryCheckListId
 */
  TemporaryCheckListId?: number | null;
}
