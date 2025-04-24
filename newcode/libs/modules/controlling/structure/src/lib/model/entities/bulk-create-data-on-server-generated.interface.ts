/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingUnitComplete, IControllingUnitEntity } from '../models';

export interface IBulkCreateDataOnServerGenerated {

/*
 * ControllingUnitCompleteList
 */
  ControllingUnitCompleteList?: ControllingUnitComplete[] | null;

/*
 * ControllingUnitParent
 */
  ControllingUnitParent?: IControllingUnitEntity | null;

/*
 * EntitiesCount
 */
  EntitiesCount?: number | null;

/*
 * IsCheckRootLevelRestrictionDisabled
 */
  IsCheckRootLevelRestrictionDisabled?: boolean | null;

/*
 * IsKeepTemplateCode
 */
  IsKeepTemplateCode?: boolean | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;

/*
 * TemplateId
 */
  TemplateId?: number | null;
}
