/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyICPartnerEntity } from '@libs/basics/interfaces';
import { ICompanyICPartnerAccEntity } from '@libs/basics/interfaces';


export interface ICompanyICPartnerCompleteEntityGenerated {

/*
 * CompanyICPartner
 */
  CompanyICPartner?: ICompanyICPartnerEntity | null;

/*
 * CompanyICPartnerAccToDelete
 */
  CompanyICPartnerAccToDelete?: ICompanyICPartnerAccEntity[] | null;

/*
 * CompanyICPartnerAccToSave
 */
  CompanyICPartnerAccToSave?: ICompanyICPartnerAccEntity[] | null;

/*
 * MainItemId
 */
  MainItemId?: number | null;
}
