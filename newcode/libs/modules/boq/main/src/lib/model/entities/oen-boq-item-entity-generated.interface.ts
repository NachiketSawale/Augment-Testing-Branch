/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	IBoqItemEntity,
	IBoq2estRuleEntity,
	IBoqBillToEntity,
	IBoqSplitQuantityEntity,
	IBoqItem2CostGroupEntity,
	IBoqItem2boqDivisiontypeEntity,
	IBoqItemParamEntity,
	IBoqItemSubPriceEntity,
	IBoqSurchargedItemEntity,
	IBoqTextComplementEntity,
	IBoqTextConfigurationEntity,
	IBoqWic2assemblyEntity,
	IBoqItemDocumentEntity,
	IWicBoq2mdcRuleEntity,
	IBoqCharacterContentEntity,
	IBoqItemFlagEntity
} from '@libs/boq/interfaces';
import { IOenBoqItem2GraphicEntity } from './oen-boq-item-2graphic-entity.interface';
import { IOenBoqItem2ParamEntity } from './oen-boq-item-2param-entity.interface';
import { IOenLbMetadataEntity } from './oen-lb-metadata-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IOenLbChangeTypeEntity } from './oen-lb-change-type-entity.interface';
import { IOenPricingMethodEntity } from './oen-pricing-method-entity.interface';
import { IOenServicePartEntity } from './oen-service-part-entity.interface';
import { IOenStatusEntity } from './oen-status-entity.interface';
import { IOenZzEntity } from './oen-zz-entity.interface';
import { IOenZzVariantEntity } from './oen-zz-variant-entity.interface';

export interface IOenBoqItemEntityGenerated extends IEntityBase {

/*
 * AAN
 */
  AAN?: string | null;

/*
 * AGN
 */
  AGN?: string | null;

/*
 * Approx
 */
  Approx: boolean;

/*
 * BQPrevQuantity
 */
  BQPrevQuantity?: number | null;

/*
 * BQRemainingQuantity
 */
  BQRemainingQuantity?: number | null;

/*
 * BQTotalQuantity
 */
  BQTotalQuantity?: number | null;

/*
 * BasBlobsSpecificationFk
 */
  BasBlobsSpecificationFk?: number | null;

/*
 * BasItemStatusFk
 */
  BasItemStatusFk?: number | null;

/*
 * BasItemType2Fk
 */
  BasItemType2Fk?: number | null;

/*
 * BasItemType85Fk
 */
  BasItemType85Fk?: number | null;

/*
 * BasItemTypeFk
 */
  BasItemTypeFk?: number | null;

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * BilledQuantity
 */
  BilledQuantity?: number | null;

/*
 * BlobsCommentFk
 */
  BlobsCommentFk?: number | null;

/*
 * BlobsLbChangeFk
 */
  BlobsLbChangeFk?: number | null;

/*
 * Boq2estRuleEntities
 */
  Boq2estRuleEntities?: IBoq2estRuleEntity[] | null;

/*
 * BoqBilltoEntities
 */
  BoqBilltoEntities?: IBoqBillToEntity[] | null;

/*
 * BoqCharacterContentEntity_BoqCharacterContentPrjFk
 */
  BoqCharacterContentEntity_BoqCharacterContentPrjFk?: IBoqCharacterContentEntity | null;

/*
 * BoqCharacterContentEntity_BoqCharacterContentWorkFk
 */
  BoqCharacterContentEntity_BoqCharacterContentWorkFk?: IBoqCharacterContentEntity | null;

/*
 * BoqCharacterContentPrjFk
 */
  BoqCharacterContentPrjFk?: number | null;

/*
 * BoqCharacterContentWorkFk
 */
  BoqCharacterContentWorkFk?: number | null;

/*
 * BoqDivisionTypeFk
 */
  BoqDivisionTypeFk?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqHeaderFkFrom
 */
  BoqHeaderFkFrom?: number | null;

/*
 * BoqHeaderFkTo
 */
  BoqHeaderFkTo?: number | null;

/*
 * BoqItem2CostGroupEntities
 */
  BoqItem2CostGroupEntities?: IBoqItem2CostGroupEntity[] | null;

/*
 * BoqItem2boqDivisiontypeEntities
 */
  BoqItem2boqDivisiontypeEntities?: IBoqItem2boqDivisiontypeEntity[] | null;

/*
 * BoqItemBasisFk
 */
  BoqItemBasisFk?: number | null;

/*
 * BoqItemBasisParent
 */
  BoqItemBasisParent?: IBoqItemEntity | null;

/*
 * BoqItemChildren
 */
  BoqItemChildren?: IBoqItemEntity[] | null;

/*
 * BoqItemEntities_BoqItemQtnBoqFk_BoqItemQtnItemFk
 */
  BoqItemEntities_BoqItemQtnBoqFk_BoqItemQtnItemFk?: IBoqItemEntity[] | null;

/*
 * BoqItemEntity_BoqItemQtnBoqFk_BoqItemQtnItemFk
 */
  BoqItemEntity_BoqItemQtnBoqFk_BoqItemQtnItemFk?: IBoqItemEntity | null;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * BoqItemFlagEntity
 */
  BoqItemFlagEntity?: IBoqItemFlagEntity | null;

/*
 * BoqItemFlagFk
 */
  BoqItemFlagFk?: number | null;

/*
 * BoqItemParamEntities
 */
  BoqItemParamEntities?: IBoqItemParamEntity[] | null;

/*
 * BoqItemParent
 */
  BoqItemParent?: IBoqItemEntity | null;

/*
 * BoqItemPrjBoqFk
 */
  BoqItemPrjBoqFk?: number | null;

/*
 * BoqItemPrjItemFk
 */
  BoqItemPrjItemFk?: number | null;

/*
 * BoqItemQtnBoqFk
 */
  BoqItemQtnBoqFk?: number | null;

/*
 * BoqItemQtnItemFk
 */
  BoqItemQtnItemFk?: number | null;

/*
 * BoqItemReferenceFk
 */
  BoqItemReferenceFk?: number | null;

/*
 * BoqItemReferenceParent
 */
  BoqItemReferenceParent?: IBoqItemEntity | null;

/*
 * BoqItemSubPrices
 */
  BoqItemSubPrices?: IBoqItemSubPriceEntity[] | null;

/*
 * BoqItemWicBoqFk
 */
  BoqItemWicBoqFk?: number | null;

/*
 * BoqItemWicItemFk
 */
  BoqItemWicItemFk?: number | null;

/*
 * BoqItems
 */
  BoqItems?: IBoqItemEntity[] | null;

/*
 * BoqLineTypeFk
 */
  BoqLineTypeFk: number;

/*
 * BoqRevenueTypeFk
 */
  BoqRevenueTypeFk?: number | null;

/*
 * BoqSplitQuantityEntities
 */
  BoqSplitQuantityEntities?: IBoqSplitQuantityEntity[] | null;

/*
 * BoqSurchardedItemEntities
 */
  BoqSurchardedItemEntities?: IBoqSurchargedItemEntity[] | null;

/*
 * BoqSurcharedItemFk
 */
  BoqSurcharedItemFk?: IBoqSurchargedItemEntity[] | null;

/*
 * BoqTextComplementEntities
 */
  BoqTextComplementEntities?: IBoqTextComplementEntity[] | null;

/*
 * BoqTextConfigurationEntities
 */
  BoqTextConfigurationEntities?: IBoqTextConfigurationEntity[] | null;

/*
 * BoqWic2assemblyEntities
 */
  BoqWic2assemblyEntities?: IBoqWic2assemblyEntity[] | null;

/*
 * BoqWicCatFk
 */
  BoqWicCatFk?: number | null;

/*
 * BpdAgreementFk
 */
  BpdAgreementFk?: number | null;

/*
 * BriefInfo
 */
  BriefInfo?: IDescriptionInfo | null;

/*
 * BudgetDifference
 */
  BudgetDifference: number;

/*
 * BudgetFixedTotal
 */
  BudgetFixedTotal: boolean;

/*
 * BudgetFixedUnit
 */
  BudgetFixedUnit: boolean;

/*
 * BudgetPerUnit
 */
  BudgetPerUnit: number;

/*
 * BudgetTotal
 */
  BudgetTotal: number;

/*
 * CalculateQuantitySplitting
 */
  CalculateQuantitySplitting: boolean;

/*
 * ColVal1ToCopy
 */
  ColVal1ToCopy?: number | null;

/*
 * ColVal2ToCopy
 */
  ColVal2ToCopy?: number | null;

/*
 * ColVal3ToCopy
 */
  ColVal3ToCopy?: number | null;

/*
 * ColVal4ToCopy
 */
  ColVal4ToCopy?: number | null;

/*
 * ColVal5ToCopy
 */
  ColVal5ToCopy?: number | null;

/*
 * CommentClient
 */
  CommentClient?: string | null;

/*
 * CommentContractor
 */
  CommentContractor?: string | null;

/*
 * ContributionPercent
 */
  ContributionPercent: number;

/*
 * CopyInfo
 */
  CopyInfo?: string | null;

/*
 * Correction
 */
  Correction: number;

/*
 * CorrectionOc
 */
  CorrectionOc: number;

/*
 * CosMatchText
 */
  CosMatchText?: string | null;

/*
 * Cost
 */
  Cost: number;

/*
 * CostGroupAssignments
 */
  //CostGroupAssignments?: IMainItem2CostGroupEntity[] | null;

/*
 * CostOc
 */
  CostOc: number;

/*
 * DeleteCorrespondingBaseBoqItem
 */
  DeleteCorrespondingBaseBoqItem?: boolean | null;

/*
 * DeliveryDate
 */
  DeliveryDate?: string | null;

/*
 * Delta
 */
  Delta: number;

/*
 * DesignDescriptionNo
 */
  DesignDescriptionNo?: string | null;

/*
 * Discount
 */
  Discount: number;

/*
 * DiscountOc
 */
  DiscountOc: number;

/*
 * DiscountPercent
 */
  DiscountPercent: number;

/*
 * DiscountPercentIt
 */
  DiscountPercentIt: number;

/*
 * DiscountPercentItUrb1
 */
  DiscountPercentItUrb1?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * DiscountPercentItUrb2
 */
  DiscountPercentItUrb2?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * DiscountText
 */
  DiscountText?: string | null;

/*
 * DiscountTextTr
 */
  DiscountTextTr?: number | null;

/*
 * DiscountUrb1
 */
  DiscountUrb1?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * DiscountUrb1Oc
 */
  DiscountUrb1Oc?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * DiscountUrb2
 */
  DiscountUrb2?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * DiscountUrb2Oc
 */
  DiscountUrb2Oc?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * DiscountedPrice
 */
  DiscountedPrice: number;

/*
 * DiscountedPriceOc
 */
  DiscountedPriceOc: number;

/*
 * DiscountedUnitprice
 */
  DiscountedUnitprice: number;

/*
 * DiscountedUnitpriceOc
 */
  DiscountedUnitpriceOc: number;

/*
 * Documents
 */
  Documents?: IBoqItemDocumentEntity[] | null;

/*
 * ExQtnIsEvaluated
 */
  ExQtnIsEvaluated: boolean;

/*
 * ExSalesRejectedQuantity
 */
  ExSalesRejectedQuantity: number;

/*
 * ExSalesTaxGroupFk
 */
  ExSalesTaxGroupFk?: number | null;

/*
 * ExWipExpectedRevenue
 */
  ExWipExpectedRevenue?: number | null;

/*
 * ExWipIsFinalQuantity
 */
  ExWipIsFinalQuantity: boolean;

/*
 * ExWipQuantity
 */
  ExWipQuantity?: number | null;

/*
 * ExternalCode
 */
  ExternalCode?: string | null;

/*
 * ExternalUom
 */
  ExternalUom?: string | null;

/*
 * ExtraIncrement
 */
  ExtraIncrement: number;

/*
 * ExtraIncrementOc
 */
  ExtraIncrementOc: number;

/*
 * ExtraPrevious
 */
  ExtraPrevious?: number | null;

/*
 * ExtraTotal
 */
  ExtraTotal?: number | null;

/*
 * Factor
 */
  Factor: number;

/*
 * FactorDetail
 */
  FactorDetail?: string | null;

/*
 * Finaldiscount
 */
  Finaldiscount: number;

/*
 * FinaldiscountOc
 */
  FinaldiscountOc: number;

/*
 * Finalgross
 */
  Finalgross: number;

/*
 * FinalgrossOc
 */
  FinalgrossOc: number;

/*
 * Finalprice
 */
  Finalprice: number;

/*
 * FinalpriceOc
 */
  FinalpriceOc: number;

/*
 * FinalpriceUrb1
 */
  FinalpriceUrb1?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * FinalpriceUrb1Oc
 */
  FinalpriceUrb1Oc?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * FinalpriceUrb2
 */
  FinalpriceUrb2?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * FinalpriceUrb2Oc
 */
  FinalpriceUrb2Oc?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * GuaranteedOfferSumGroup
 */
  GuaranteedOfferSumGroup?: string | null;

/*
 * HasBidderTextComplements
 */
  HasBidderTextComplements?: boolean | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * HasMultipleSplitQuantities
 */
  HasMultipleSplitQuantities?: boolean | null;

/*
 * HasOwnerTextComplements
 */
  HasOwnerTextComplements?: boolean | null;

/*
 * HasQtoDetails
 */
  HasQtoDetails?: boolean | null;

/*
 * HasQtoDetailsAndIsIQ
 */
  HasQtoDetailsAndIsIQ?: boolean | null;

/*
 * HasSplitQuantities
 */
  HasSplitQuantities?: boolean | null;

/*
 * Hours
 */
  Hours: number;

/*
 * HoursUnit
 */
  HoursUnit: number;

/*
 * IQPrevQuantity
 */
  IQPrevQuantity?: number | null;

/*
 * IQRemainingQuantity
 */
  IQRemainingQuantity?: number | null;

/*
 * IQTotalQuantity
 */
  IQTotalQuantity?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * Included
 */
  Included: boolean;

/*
 * InstalledQuantity
 */
  InstalledQuantity?: number | null;

/*
 * IsCostItem
 */
  IsCostItem: boolean;

/*
 * IsCrbBoq
 */
  IsCrbBoq?: boolean | null;

/*
 * IsCustomProjectCostCode
 */
  IsCustomProjectCostCode?: boolean | null;

/*
 * IsDaywork
 */
  IsDaywork: boolean;

/*
 * IsDisabled
 */
  IsDisabled: boolean;

/*
 * IsEssentialPosition
 */
  IsEssentialPosition?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * IsFixed
 */
  IsFixed: boolean;

/*
 * IsFixedPrice
 */
  IsFixedPrice: boolean;

/*
 * IsFreeQuantity
 */
  IsFreeQuantity: boolean;

/*
 * IsGCBoq
 */
  IsGCBoq?: boolean | null;

/*
 * IsKeyitem
 */
  IsKeyitem: boolean;

/*
 * IsLeadDescription
 */
  IsLeadDescription: boolean;

/*
 * IsLumpsum
 */
  IsLumpsum: boolean;

/*
 * IsNoLeadQuantity
 */
  IsNoLeadQuantity: boolean;

/*
 * IsNoMarkup
 */
  IsNoMarkup: boolean;

/*
 * IsNotApplicable
 */
  IsNotApplicable: boolean;

/*
 * IsNotOffered
 */
  IsNotOffered?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * IsOenBoq
 */
  IsOenBoq?: boolean | null;

/*
 * IsQtoForBillBoQQuantity
 */
  IsQtoForBillBoQQuantity?: boolean | null;

/*
 * IsQtoForQuantity
 */
  IsQtoForQuantity?: boolean | null;

/*
 * IsQtoForQuantityAdj
 */
  IsQtoForQuantityAdj?: boolean | null;

/*
 * IsSurcharged
 */
  IsSurcharged: boolean;

/*
 * IsTextitem
 */
  IsTextitem: boolean;

/*
 * IsUnsharedPosition
 */
  IsUnsharedPosition?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * IsUrFromSd
 */
  IsUrFromSd: boolean;

/*
 * IsUrb
 */
  IsUrb: boolean;

/*
 * IsWicItem
 */
  IsWicItem?: boolean | null;

/*
 * ItemInfo
 */
  ItemInfo?: string | null;

/*
 * ItemTotal
 */
  ItemTotal: number;

/*
 * ItemTotalOc
 */
  ItemTotalOc: number;

/*
 * ItemTotalUrb1
 */
  ItemTotalUrb1?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * ItemTotalUrb1Oc
 */
  ItemTotalUrb1Oc?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * ItemTotalUrb2
 */
  ItemTotalUrb2?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * ItemTotalUrb2Oc
 */
  ItemTotalUrb2Oc?: number | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * LbChangeVersionNumber
 */
  LbChangeVersionNumber?: number | null;

/*
 * LbNotInPartialEdition
 */
  LbNotInPartialEdition?: boolean | null; //TODO-BOQ-Its a required field on server dto, but mark as null and optional here to resolve few errors in boq-main-module-info.class service

/*
 * LbReferencePrev
 */
  LbReferencePrev?: string | null;

/*
 * LevelIndex
 */
  LevelIndex: number;

/*
 * LineItemContextWhenLoading
 */
  LineItemContextWhenLoading?: number | null;

/*
 * LineItemString
 */
  LineItemString?: string | null;

/*
 * LumpsumPrice
 */
  LumpsumPrice: number;

/*
 * LumpsumPriceOc
 */
  LumpsumPriceOc: number;

/*
 * MatchRefNo
 */
  MatchRefNo?: string | null;

/*
 * MdcAssetMasterFk
 */
  MdcAssetMasterFk?: number | null;

/*
 * MdcBudgetCodeFk
 */
  MdcBudgetCodeFk?: number | null;

/*
 * MdcClassificationFk
 */
  MdcClassificationFk?: number | null;

/*
 * MdcControllingUnitFk
 */
  MdcControllingUnitFk?: number | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk?: number | null;

/*
 * MdcTaxCodeFk
 */
  MdcTaxCodeFk?: number | null;

/*
 * MdcWorkCategoryFk
 */
  MdcWorkCategoryFk?: number | null;

/*
 * NotSubmitted
 */
  NotSubmitted: boolean;

/*
 * OenBoqItem2Graphics
 */
  OenBoqItem2Graphics?: IOenBoqItem2GraphicEntity[] | null;

/*
 * OenBoqItem2Params
 */
  OenBoqItem2Params?: IOenBoqItem2ParamEntity[] | null;

/*
 * OenLbChangeType
 */
  OenLbChangeType?: IOenLbChangeTypeEntity | null;

/*
 * OenLbChangeTypeFk
 */
  OenLbChangeTypeFk?: number | null;

/*
 * OenLbMetadatas
 */
  OenLbMetadatas?: IOenLbMetadataEntity[] | null;

/*
 * OenPricingMethod
 */
  OenPricingMethod?: IOenPricingMethodEntity | null;

/*
 * OenPricingMethodFk
 */
  OenPricingMethodFk?: number | null;

/*
 * OenServicePart
 */
  OenServicePart?: IOenServicePartEntity | null;

/*
 * OenServicePartFk
 */
  OenServicePartFk?: number | null;

/*
 * OenStatus
 */
  OenStatus?: IOenStatusEntity | null;

/*
 * OenStatusFk
 */
  OenStatusFk?: number | null;

/*
 * OenZz
 */
  OenZz?: IOenZzEntity | null;

/*
 * OenZzFk
 */
  OenZzFk?: number | null;

/*
 * OenZzVariant
 */
  OenZzVariant?: IOenZzVariantEntity | null;

/*
 * OenZzVariantFk
 */
  OenZzVariantFk?: number | null;

/*
 * OrdQuantity
 */
  OrdQuantity?: number | null;

/*
 * OrdinalNo
 */
  OrdinalNo?: number | null;

/*
 * OriginMark
 */
  OriginMark?: string | null;

/*
 * OriginalBoqHeaderId
 */
  OriginalBoqHeaderId?: number | null;

/*
 * OriginalRefNo
 */
  OriginalRefNo?: string | null;

/*
 * PartOfferMark
 */
  PartOfferMark?: number | null;

/*
 * PartSumMark
 */
  PartSumMark?: number | null;

/*
 * PercentComplete
 */
  PercentComplete?: number | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;

/*
 * PrcItemEvaluationFk
 */
  PrcItemEvaluationFk?: number | null;

/*
 * PrcPriceConditionFk
 */
  PrcPriceConditionFk?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * PreEscalation
 */
  PreEscalation: number;

/*
 * PreEscalationOc
 */
  PreEscalationOc: number;

/*
 * PreliminaryMark
 */
  PreliminaryMark?: string | null;

/*
 * PrevQuantity
 */
  PrevQuantity?: number | null;

/*
 * PrevRejectedQuantity
 */
  PrevRejectedQuantity?: number | null;

/*
 * Price
 */
  Price: number;

/*
 * PriceOc
 */
  PriceOc: number;

/*
 * Pricegross
 */
  Pricegross: number;

/*
 * PricegrossOc
 */
  PricegrossOc: number;

/*
 * PrjChangeFk
 */
  PrjChangeFk?: number | null;

/*
 * PrjChangeStatusFactorByAmount
 */
  PrjChangeStatusFactorByAmount: number;

/*
 * PrjChangeStatusFactorByReason
 */
  PrjChangeStatusFactorByReason: number;

/*
 * PrjChangeStatusFk
 */
  PrjChangeStatusFk?: number | null;

/*
 * PrjCharacter
 */
  PrjCharacter?: string | null;

/*
 * PrjLocationFk
 */
  PrjLocationFk?: number | null;

/*
 * PrjStructureFk
 */
  PrjStructureFk?: number | null;

/*
 * ProjectBillToFk
 */
  ProjectBillToFk?: number | null;

/*
 * ProjectCostCodeFk
 */
  ProjectCostCodeFk?: number | null;

/*
 * Quantity
 */
  Quantity: number;

/*
 * QuantityAdj
 */
  QuantityAdj: number;

/*
 * QuantityAdjDetail
 */
  QuantityAdjDetail?: string | null;

/*
 * QuantityDetail
 */
  QuantityDetail?: string | null;

/*
 * QuantityMax
 */
  QuantityMax: number;

/*
 * QuantityTarget
 */
  QuantityTarget: number;

/*
 * RecordingLevel
 */
  RecordingLevel: number;

/*
 * Reference
 */
  Reference?: string | null;

/*
 * Reference2
 */
  Reference2?: string | null;

/*
 * RevenuePercentage
 */
  RevenuePercentage?: number | null;

/*
 * RuleFormula
 */
  RuleFormula?: string | null;

/*
 * RuleFormulaDesc
 */
  RuleFormulaDesc?: string | null;

/*
 * SearchPattern
 */
  SearchPattern?: string | null;

/*
 * StatusComment
 */
  StatusComment?: string | null;

/*
 * Stlno
 */
  Stlno?: string | null;

/*
 * SurchargeFactor
 */
  SurchargeFactor?: number | null;

/*
 * SurchargePercent
 */
  SurchargePercent?: number | null;

/*
 * TargetBoqHeaderId
 */
  TargetBoqHeaderId?: number | null;

/*
 * TotalIQAccepted
 */
  TotalIQAccepted?: number | null;

/*
 * TotalQuantityAccepted
 */
  TotalQuantityAccepted?: number | null;

/*
 * TransactionId
 */
  TransactionId: number;

/*
 * UnitRateFrom
 */
  UnitRateFrom: number;

/*
 * UnitRateFromOc
 */
  UnitRateFromOc: number;

/*
 * UnitRateTo
 */
  UnitRateTo: number;

/*
 * UnitRateToOc
 */
  UnitRateToOc: number;

/*
 * Urb1
 */
  Urb1: number;

/*
 * Urb1Oc
 */
  Urb1Oc: number;

/*
 * Urb2
 */
  Urb2: number;

/*
 * Urb2Oc
 */
  Urb2Oc: number;

/*
 * Urb3
 */
  Urb3: number;

/*
 * Urb3Oc
 */
  Urb3Oc: number;

/*
 * Urb4
 */
  Urb4: number;

/*
 * Urb4Oc
 */
  Urb4Oc: number;

/*
 * Urb5
 */
  Urb5: number;

/*
 * Urb5Oc
 */
  Urb5Oc: number;

/*
 * Urb6
 */
  Urb6: number;

/*
 * Urb6Oc
 */
  Urb6Oc: number;

/*
 * UseSubQuantityPrice
 */
  UseSubQuantityPrice: boolean;

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

/*
 * ValidBillToPortion
 */
  ValidBillToPortion?: number | null;

/*
 * VersionBoqItemToBeDeleted
 */
  //VersionBoqItemToBeDeleted?: IInt32 | null;

/*
 * VobDirectCostPerUnit
 */
  VobDirectCostPerUnit: number;

/*
 * VobDirectCostPerUnitOc
 */
  VobDirectCostPerUnitOc: number;

/*
 * VobIsIndirectCostBalancing
 */
  VobIsIndirectCostBalancing: boolean;

/*
 * VobIsSpecialIndirectCostBalancing
 */
  VobIsSpecialIndirectCostBalancing: boolean;

/*
 * WicBoq2mdcRuleEntities
 */
  WicBoq2mdcRuleEntities?: IWicBoq2mdcRuleEntity[] | null;

/*
 * WicChildren
 */
  WicChildren?: IBoqItemEntity[] | null;

/*
 * WicNumber
 */
  WicNumber?: string | null;

/*
 * WicParent
 */
  WicParent?: IBoqItemEntity | null;

/*
 * WorkContent
 */
  WorkContent?: string | null;
}
