/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenAdditionalOfferEntity } from './oen-additional-offer-entity.interface';
import { IOenAkzEntity } from './oen-akz-entity.interface';
import { IOenContractAdjustmentEntity } from './oen-contract-adjustment-entity.interface';
import { IOenServicePartEntity } from './oen-service-part-entity.interface';
import { IOenZzEntity } from './oen-zz-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IOenLvTypeEntity } from './oen-lv-type-entity.interface';

export interface IOenLvHeaderEntityGenerated extends IEntityBase {

/*
 * AdditionalOfferNr
 */
  AdditionalOfferNr?: number | null;

/*
 * AlternativOfferNr
 */
  AlternativOfferNr?: number | null;

/*
 * BidderNr
 */
  BidderNr?: number | null;

/*
 * ChangeOfferNr
 */
  ChangeOfferNr?: number | null;

/*
 * ContractAdjustmentNr
 */
  ContractAdjustmentNr?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsAllowedBoqDiscount
 */
  IsAllowedBoqDiscount?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in BoqMainOenZzVariantDataService service

/*
 * IsAllowedHgDiscount
 */
  IsAllowedHgDiscount?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in BoqMainOenZzVariantDataService service

/*
 * IsAllowedLgDiscount
 */
  IsAllowedLgDiscount?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in BoqMainOenZzVariantDataService service

/*
 * IsAllowedOgDiscount
 */
  IsAllowedOgDiscount?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in BoqMainOenZzVariantDataService service

/*
 * IsAllowedUlgDiscount
 */
  IsAllowedUlgDiscount?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in BoqMainOenZzVariantDataService service

/*
 * IsSumDiscount
 */
  IsSumDiscount?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in BoqMainOenZzVariantDataService service

/*
 * IsWithPriceShares
 */
  IsWithPriceShares?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in BoqMainOenZzVariantDataService service

/*
 * NamePriceShare1
 */
  NamePriceShare1?: string | null;

/*
 * NamePriceShare2
 */
  NamePriceShare2?: string | null;

/*
 * OenAdditionalOffers
 */
  OenAdditionalOffers?: IOenAdditionalOfferEntity[] | null;

/*
 * OenAkzs
 */
  OenAkzs?: IOenAkzEntity[] | null;

/*
 * OenContractAdjustments
 */
  OenContractAdjustments?: IOenContractAdjustmentEntity[] | null;

/*
 * OenLvType
 */
  OenLvType?: IOenLvTypeEntity | null;

/*
 * OenLvTypeFk
 */
  OenLvTypeFk?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in BoqMainOenZzVariantDataService service

/*
 * OenServiceParts
 */
  OenServiceParts?: IOenServicePartEntity[] | null;

/*
 * OenZzs
 */
  OenZzs?: IOenZzEntity[] | null;

/*
 * OfferDeadline
 */
  OfferDeadline?: string | null;

/*
 * OrderCode
 */
  OrderCode?: string | null;

/*
 * PriceBaseDate
 */
  PriceBaseDate?: string | null;

/*
 * ProcessingStatusDate
 */
  ProcessingStatusDate?: string | null;
}
