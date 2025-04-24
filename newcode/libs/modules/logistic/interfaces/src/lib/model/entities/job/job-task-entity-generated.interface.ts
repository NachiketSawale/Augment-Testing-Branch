/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IJobTaskEntityGenerated extends IEntityBase {

  /**
   * ArticleDescription
   */
  ArticleDescription?: string | null;

  /**
   * ArticleFk
   */
  ArticleFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ContractDescription
   */
  ContractDescription?: string | null;

  /**
   * ContractHeaderFk
   */
  ContractHeaderFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InvHeaderFk
   */
  InvHeaderFk?: number | null;

  /**
   * InvOtherFk
   */
  InvOtherFk?: number | null;

  /**
   * InvoiceDescription
   */
  InvoiceDescription?: string | null;

  /**
   * ItemPriceTotal
   */
  ItemPriceTotal?: number | null;

  /**
   * ItemPriceUnit
   */
  ItemPriceUnit?: number | null;

  /**
   * ItemQuantity
   */
  ItemQuantity?: number | null;

  /**
   * JobCardAreaFk
   */
  JobCardAreaFk?: number | null;

  /**
   * JobFk
   */
  JobFk: number;

  /**
   * JobTaskTypeFk
   */
  JobTaskTypeFk: number;

  /**
   * PrcItemFk
   */
  PrcItemFk?: number | null;

  /**
   * Quantity
   */
  Quantity?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

	/**
	 * PlantFk
	 */
	PlantFk?: number | null;


	/**
	 * IsLoadingCostForBillingType
	 */
	IsLoadingCostForBillingType: boolean;
}
