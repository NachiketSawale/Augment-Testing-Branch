/*
 * Copyright(c) RIB Software GmbH
 */

import { CompanyEntity } from '@libs/basics/shared';
import { IBusinessPartner2CompanyEntity } from './business-partner-2-company-entity.interface';

export interface IBusinessParnter2CompanyReponseGenerated {

  /**
   * Company
   */
  Company?: CompanyEntity[] | null;

  /**
   * Main
   */
  Main?: IBusinessPartner2CompanyEntity[] | null;
}
