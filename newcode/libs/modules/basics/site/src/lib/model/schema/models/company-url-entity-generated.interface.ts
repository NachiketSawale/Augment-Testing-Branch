/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';

export interface ICompanyUrlEntityGenerated {
  CompanyEntity?: ICompanyEntity;
  CompanyFk?: number;
  CompanyUrltypeFk?: number;
  EncryptionTypeFk?: number;
  Id?: number;
  UrlPassword?: string;
  UrlUser?: string;
  url?: string;
}
