/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IProjectEntity } from './project-main-entity.interface';

export interface ITenderResultEntityGenerated extends IEntityBase {

/*
 * BasCurrencyFk
 */
  BasCurrencyFk?: number | null;

/*
 * BusinessPartner
 */
  BusinessPartner?: string | null;

/*
 * BusinessPartnerFk
 */
  BusinessPartnerFk?: number | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Discount
 */
  Discount: number;

/*
 * FinalQuotation
 */
  FinalQuotation: number;

/*
 * GlobalPercentage
 */
  GlobalPercentage: number;

/*
 * Id
 */
  Id: number;

/*
 * IsActive
 */
  IsActive: boolean;

/*
 * IsBiddingConsortium
 */
  IsBiddingConsortium: boolean;

/*
 * NumberProposals
 */
  NumberProposals: number;

/*
 * OtherDiscount
 */
  OtherDiscount: number;

/*
 * ProjectEntity
 */
  ProjectEntity?: IProjectEntity | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * Quotation
 */
  Quotation: number;

/*
 * Rank
 */
  Rank: number;

/*
 * SaleFk
 */
  SaleFk?: number | null;

/*
 * StadiumFk
 */
  StadiumFk: number;

/*
 * SubsidiaryFk
 */
  SubsidiaryFk?: number | null;
}
