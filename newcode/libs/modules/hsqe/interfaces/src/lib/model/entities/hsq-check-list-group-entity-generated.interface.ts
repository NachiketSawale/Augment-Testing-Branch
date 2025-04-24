/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListGroupEntity } from './hsq-check-list-group-entity.interface';
import { IHsqChkListTemplateEntity } from './hsq-chk-list-template-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IHsqContextEntity } from './hsq-context-entity.interface';

export interface IHsqCheckListGroupEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * HsqCheckListGroupFk
 */
  HsqCheckListGroupFk?: number | null;

/*
 * HsqChecklistgroupChildren
 */
  HsqChecklistgroupChildren?: IHsqCheckListGroupEntity[] | null;

/*
 * HsqChecklistgroupParent
 */
  HsqChecklistgroupParent?: IHsqCheckListGroupEntity | null;

/*
 * HsqChklisttemplateEntities
 */
  HsqChklisttemplateEntities?: IHsqChkListTemplateEntity[] | null;

/*
 * HsqContextEntity
 */
  HsqContextEntity?: IHsqContextEntity | null;

/*
 * HsqContextFk
 */
  HsqContextFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault: boolean;

/*
 * IsLive
 */
  IsLive: boolean;
}
