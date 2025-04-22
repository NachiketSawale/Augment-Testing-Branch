/*
 * Copyright(c) RIB Software GmbH
 */

import { IContact2BasCompanyEntity } from '../common';



export interface IContact2CompanyReponseGenerated {

  /**
   * Company
   */
  // Company?: ICompanyLookupEntity[] | null;

  /**
   * Main
   */
  Main?: IContact2BasCompanyEntity[] | null;
}
