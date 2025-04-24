/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMtgAttendeeEntity } from './mtg-attendee-entity.interface';
import { IMtgDocumentEntity } from './mtg-document-entity.interface';
import { IMtgHeaderEntity } from './mtg-header-entity.interface';
import { IMtgStatusEntity } from './mtg-status-entity.interface';
import { IMtgTypeEntity } from './mtg-type-entity.interface';
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';


export interface IMtgHeaderEntityGenerated extends IEntityBase, IEntityIdentification {

/*
 * BasBlobsSpecificationFk
 */
  BasBlobsSpecificationFk?: number | null;

/*
 * BidHeaderFk
 */
  BidHeaderFk?: number | null;

/*
 * CheckListFk
 */
  CheckListFk?: number | null;

/*
 * ClerkOwnerFk
 */
  ClerkOwnerFk?: number | null;

/*
 * ClerkRspFk
 */
  ClerkRspFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * CompanyFk
 */
  CompanyFk: number;

/*
 * DateReceived
 */
  DateReceived?: string | null;

/*
 * DefectFk
 */
  DefectFk?: number | null;

/*
 * ExtGuid
 */
  ExtGuid?: string | null;

/*
 * FinishTime
 */
  FinishTime?: string | null;

/*
 * Id
 */
  // Id?: number | null;
  Id: number;

/*
 * IsHighImportance
 */
  IsHighImportance?: boolean | null;

/*
 * Location
 */
  Location?: string | null;

/*
 * MtgAttendeeEntities
 */
  MtgAttendeeEntities?: IMtgAttendeeEntity[] | null;

/*
 * MtgDocumentEntities
 */
  MtgDocumentEntities?: IMtgDocumentEntity[] | null;

/*
 * MtgHeaderEntities_MtgHeaderFk
 */
  MtgHeaderEntities_MtgHeaderFk?: IMtgHeaderEntity[] | null;

/*
 * MtgHeaderEntity_MtgHeaderFk
 */
  MtgHeaderEntity_MtgHeaderFk?: IMtgHeaderEntity | null;

/*
 * MtgHeaderFk
 */
  MtgHeaderFk?: number | null;

/*
 * MtgStatusEntity
 */
  MtgStatusEntity?: IMtgStatusEntity | null;

/*
 * MtgStatusFk
 */
  MtgStatusFk: number;

/*
 * MtgTypeEntity
 */
  MtgTypeEntity?: IMtgTypeEntity | null;

/*
 * MtgTypeFk
 */
  MtgTypeFk: number;

/*
 * MtgUrl
 */
  MtgUrl?: string | null;

/*
 * PrjInfoRequestFk
 */
  PrjInfoRequestFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * QtnHeaderFk
 */
  QtnHeaderFk?: number | null;

/*
 * Recurrence
 */
  Recurrence?: boolean | null;

/*
 * RecurrenceRule
 */
  RecurrenceRule?: string | null;

/*
 * RfqHeaderFk
 */
  RfqHeaderFk?: number | null;

/*
 * StartTime
 */
  StartTime?: string | null;

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
