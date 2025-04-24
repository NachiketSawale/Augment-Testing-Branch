/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityTemplateEntity } from './activity-template-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IActivityCriteriaEntityGenerated extends IEntityBase {

/*
 * ActivityTemplateEntity
 */
  ActivityTemplateEntity?: IActivityTemplateEntity | null;

/*
 * ActivityTemplateFk
 */
  ActivityTemplateFk?: number | null;

/*
 * CatalogWicFk
 */
  CatalogWicFk?: number | null;

/*
 * CategoryWicFk
 */
  CategoryWicFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * HeaderWicFk
 */
  HeaderWicFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * ItemWicFk
 */
  ItemWicFk?: number | null;

/*
 * LineItemContextFk
 */
  LineItemContextFk?: number | null;

/*
 * MasterDataContextFk
 */
  MasterDataContextFk?: number | null;

/*
 * StructureFk
 */
  StructureFk?: number | null;
}
