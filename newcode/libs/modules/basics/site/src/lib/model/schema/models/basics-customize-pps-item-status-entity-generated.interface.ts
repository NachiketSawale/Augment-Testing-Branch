/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IBasicsCustomizePpsItemStatusEntityGenerated  {
  BackgroundColor?: number;
  Code?: string;
  DescriptionInfo?: IDescriptionInfo;
  FontColor?: number;
  Icon?: number;
  Id?: number;
  IsDefault?: boolean;
  IsDeletable?: boolean;
  IsDone?: boolean;
  IsForAutoAssignProduct?: boolean;
  IsInProduction?: boolean;
  IsLive?: boolean;
  IsMergeAllowed?: boolean;
  RubricCategoryFk?: number;
  Sorting?: number;
  Userflag1?: boolean;
  Userflag2?: boolean;
}
