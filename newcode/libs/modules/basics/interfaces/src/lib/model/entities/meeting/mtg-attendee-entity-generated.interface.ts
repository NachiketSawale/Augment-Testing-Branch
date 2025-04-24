/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMtgAttendeeStatusEntity } from './mtg-attendee-status-entity.interface';
import { IMtgHeaderEntity } from './mtg-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IMtgAttendeeEntityGenerated extends IEntityBase {

/*
 * AttendeeStatusFk
 */
  AttendeeStatusFk?: number | null;

/*
 * BusinessPartnerFk
 */
  BusinessPartnerFk?: number | null;

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * ContactFk
 */
  ContactFk?: number | null;

/*
 * Department
 */
  Department?: string | null;

/*
 * Email
 */
  Email?: string | null;

/*
 * FamilyName
 */
  FamilyName?: string | null;

/*
 * FirstName
 */
  FirstName?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsOptional
 */
  IsOptional?: boolean | null;

/*
 * MtgAttendeestatusEntity
 */
  MtgAttendeestatusEntity?: IMtgAttendeeStatusEntity | null;

/*
 * MtgHeaderEntity
 */
  MtgHeaderEntity?: IMtgHeaderEntity | null;

/*
 * MtgHeaderFk
 */
  MtgHeaderFk?: number | null;

/*
 * Role
 */
  Role?: string | null;

/*
 * SubsidiaryFk
 */
  SubsidiaryFk?: number | null;

/*
 * TelephoneMobil
 */
  // TelephoneMobil?: ITelephoneNumberEntity | null;

/*
 * TelephoneMobilFk
 */
  TelephoneMobilFk?: number | null;

/*
 * TelephoneNumber
 */
  // TelephoneNumber?: ITelephoneNumberEntity | null;

/*
 * TelephoneNumberFk
 */
  TelephoneNumberFk?: number | null;

/*
 * Title
 */
  Title?: string | null;

/*
 * Userdefined1
 */
  Userdefined1?: string | null;

/*
 * Userdefined2
 */
  Userdefined2?: string | null;

/*
 * Userdefined3
 */
  Userdefined3?: string | null;

/*
 * Userdefined4
 */
  Userdefined4?: string | null;

/*
 * Userdefined5
 */
  Userdefined5?: string | null;
}
