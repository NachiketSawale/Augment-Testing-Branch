/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { BasicsSiteGridEntity } from '../../basics-site-grid-entity.class';

export interface IBasicsCustomizeSiteEntityGenerated {
  DescriptionInfo?: IDescriptionInfo;
  ChildItems?: BasicsSiteGridEntity[];
  Icon?: number;
  Id?: number;
  IsDefault?: boolean;
  IsLive?: boolean;
  Sorting?: number;
  SiteFk?: number;
}
