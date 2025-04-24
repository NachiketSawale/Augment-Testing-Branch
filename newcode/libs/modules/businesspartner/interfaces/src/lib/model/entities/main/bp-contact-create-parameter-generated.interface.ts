/*
 * Copyright(c) RIB Software GmbH
 */

import { TelephoneEntity } from '@libs/basics/shared';
import { ISubsidiaryEntity } from './subsidiary-entity.interface';

export interface IBpContactCreateParameterGenerated {

  /**
   * BusinessPartnerEmail
   */
  BusinessPartnerEmail?: string | null;

  /**
   * BusinessPartnerName1
   */
  BusinessPartnerName1?: string | null;

  /**
   * ContactEmail
   */
  ContactEmail?: string | null;

  /**
   * FamilyName
   */
  FamilyName?: string | null;

  /**
   * FirstName
   */
  FirstName?: string | null;

  /**
   * SubsidiaryDescriptor
   */
  SubsidiaryDescriptor?: ISubsidiaryEntity | null;

  /**
   * TelephoneNumberDescriptor
   */
  TelephoneNumberDescriptor?: TelephoneEntity | null;
}
