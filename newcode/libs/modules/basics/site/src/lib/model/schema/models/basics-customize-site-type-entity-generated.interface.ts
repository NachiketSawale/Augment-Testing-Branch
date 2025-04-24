/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IBasicsCustomizeSiteTypeEntityGenerated {
  DescriptionInfo?: IDescriptionInfo;
  Icon?: number;
  Id?: number;
  IsDefault?: boolean;
  IsFactory?: boolean;
  IsLive?: boolean;
  IsStockYard?: boolean;
  RubricCategoryFk?: number;
  Sorting?: number;
}
