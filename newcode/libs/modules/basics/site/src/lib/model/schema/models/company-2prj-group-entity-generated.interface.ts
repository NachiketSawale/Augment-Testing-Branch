/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';

export interface ICompany2PrjGroupEntityGenerated {
  CommentText?: string;
  CompanyEntity?: ICompanyEntity;
  CompanyFk?: number;
  GroupFk?: number;
  Id?: number;
  IsActive?: boolean;
  ProjectGroupParentFk?: number;
}
