/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';

export interface IBlobsEntityGenerated {
  CompanyEntities?: Array<ICompanyEntity>;
  Content?: ArrayBuffer;
  Id?: number;
}
