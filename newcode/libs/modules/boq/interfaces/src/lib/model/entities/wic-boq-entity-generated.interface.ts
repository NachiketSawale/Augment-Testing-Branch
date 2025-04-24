/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IWicBoqEntityGenerated extends IEntityBase {

/*
 * BasClerkFk
 */
  BasClerkFk?: number | null;

/*
 * BasPaymentTermAdFk
 */
  BasPaymentTermAdFk?: number | null;

/*
 * BasPaymentTermFiFk
 */
  BasPaymentTermFiFk?: number | null;

/*
 * BasPaymentTermFk
 */
  BasPaymentTermFk?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * BpdBusinessPartnerFk
 */
  BpdBusinessPartnerFk?: number | null;

/*
 * BpdCustomerFk
 */
  BpdCustomerFk?: number | null;

/*
 * BpdSubsidiaryFk
 */
  BpdSubsidiaryFk?: number | null;

/*
 * BpdSupplierFk
 */
  BpdSupplierFk?: number | null;

/*
 * ConHeaderFk
 */
  ConHeaderFk?: number | null;

/*
 * CopyTemplateOnly
 */
  CopyTemplateOnly?: boolean | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * MdcLineItemContextFk
 */
  MdcLineItemContextFk?: number | null;

/*
 * MdcMaterialCatalogFk
 */
  MdcMaterialCatalogFk?: number | null;

/*
 * MdcWicTypeFk
 */
  MdcWicTypeFk?: number | null;

/*
 * OrdHeaderFk
 */
  OrdHeaderFk?: number | null;

/*
 * ValidFrom
 */
  ValidFrom?: Date | null; // TODO-BOQ: "ValidFrom" is of type "Date", but generated entity interface claims it's "string" ???

/*
 * ValidTo
 */
  ValidTo?: Date | null; // TODO-BOQ: "ValidTo" is of type "Date", but generated entity interface claims it's "string" ???

/*
 * WicGroupFk
 */
  WicGroupFk?: number | null;
}
