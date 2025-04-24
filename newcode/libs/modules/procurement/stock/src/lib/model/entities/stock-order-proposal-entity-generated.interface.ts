/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IStockOrderProposalItemDescription } from './stock-order-proposal-item-description.interface';

export interface IStockOrderProposalEntityGenerated extends IEntityBase {

/*
 * BasAddressFk
 */
  BasAddressFk?: number | null;

/*
 * BasClerkPrcFk
 */
  BasClerkPrcFk?: number | null;

/*
 * BasClerkReqFk
 */
  BasClerkReqFk?: number | null;

/*
 * BpdBusinessPartnerFk
 */
  BpdBusinessPartnerFk: number;

/*
 * BpdContactFk
 */
  BpdContactFk?: number | null;

/*
 * BpdSubsidiaryFk
 */
  BpdSubsidiaryFk?: number | null;

/*
 * BpdSupplierFk
 */
  BpdSupplierFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsFrameworkAgreement
 */
  IsFrameworkAgreement?: boolean | null;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * ItemDescription
 */
  ItemDescription?: IStockOrderProposalItemDescription | null;

/*
 * LeadTime
 */
  LeadTime: number;

/*
 * Log
 */
  Log?: string | null;

/*
 * PrcConfigurationFk
 */
  PrcConfigurationFk: number;

/*
 * PrcConfigurationReqFk
 */
  PrcConfigurationReqFk?: number | null;

/*
 * PrcItemFk
 */
  PrcItemFk?: number | null;

/*
 * PrcPackageFk
 */
  PrcPackageFk?: number | null;

/*
 * PrjStock2MdcMaterialFk
 */
  PrjStock2MdcMaterialFk: number;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * ProposedQuantity
 */
  ProposedQuantity: number;

/*
 * Tolerance
 */
  Tolerance: number;

	/*
	 * IsSuffixes
	 */
	IsSuffixes: boolean;
	/*
	 * MaterialDescription
	 */
	MaterialDescription: string;
}
