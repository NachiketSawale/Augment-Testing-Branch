/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBiddingConsortiumEntityGenerated extends IEntityBase {

/*
 * BusinessPartnerFk
 */
  BusinessPartnerFk?: number | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * SubsidiaryFk
 */
  SubsidiaryFk?: number | null;

/*
 * TenderResultFk
 */
  TenderResultFk: number;
}
