/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { ICompanyTransheaderEntity } from './company-transheader-entity.interface';

export interface ICompanyTransHeaderStatusEntityGenerated  {
  CompanyTransheaderEntities?: Array<ICompanyTransheaderEntity>;
  DescriptionInfo?: IDescriptionInfo;
  Icon?: number;
  Id?: number;
  IsDefault?: boolean;
  IsLive?: boolean;
  IsReadOnly?: boolean;
  IsReadyForAccounting?: boolean;
  Sorting?: number;
}
