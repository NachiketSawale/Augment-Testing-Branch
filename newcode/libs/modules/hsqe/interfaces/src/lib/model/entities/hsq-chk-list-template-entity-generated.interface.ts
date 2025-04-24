/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IHsqChkListTemplate2FormEntity } from './hsq-chk-list-template-2form-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IHsqCheckListTypeEntity } from './hsq-check-list-type-entity.interface';
import { IHsqCheckListGroupEntity } from './hsq-check-list-group-entity.interface';

export interface IHsqChkListTemplateEntityGenerated extends IEntityBase {

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
 * HsqCheckListGroupFk
 */
  HsqCheckListGroupFk: number;

/*
 * HsqCheckListTypeEntity
 */
  HsqCheckListTypeEntity?: IHsqCheckListTypeEntity | null;

/*
 * HsqCheckListTypeFk
 */
  HsqCheckListTypeFk: number;

/*
 * HsqChecklistgroupEntity
 */
  HsqChecklistgroupEntity?: IHsqCheckListGroupEntity | null;

/*
 * HsqChklisttemplate2formEntities
 */
  HsqChklisttemplate2formEntities?: IHsqChkListTemplate2FormEntity[] | null;

/*
 * HsqContextFk
 */
  HsqContextFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * PsdActivityTemplateFk
 */
  PsdActivityTemplateFk?: number | null;
}
