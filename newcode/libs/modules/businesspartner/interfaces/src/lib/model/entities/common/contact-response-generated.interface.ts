/*
 * Copyright(c) RIB Software GmbH
 */

import { IFilterResponse } from '@libs/basics/shared';
import { IBasicsClerkEntity, ICompanyEntity } from '@libs/basics/interfaces';
import { ISubsidiaryLookupEntity } from '../lookup/subsidiary-lookup-entity.interface';
import { IContactEntity } from '../contact';


export interface IContactResponseGenerated {

  /**
   * Clerk
   */
  Clerk?: IBasicsClerkEntity[] | null;

  /**
   * CompanyBusinessUnit
   */
  CompanyBusinessUnit?: ICompanyEntity[] | null;

  /**
   * FilterResult
   */
  //FilterResult?: IFilterResponse | null; //todo - generated from DTO generator
  FilterResult: IFilterResponse;

  /**
   * Main
   */
  //Main?: IContactEntity[] | null; //todo - generated from DTO generator
  Main: IContactEntity[];

  /**
   * Subsidiary
   */
  Subsidiary?: ISubsidiaryLookupEntity[] | null;
}