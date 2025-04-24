/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialEntity } from '@libs/basics/interfaces';


export interface IUpdateMaterialPriceSearchRequestGenerated {

  /**
   * BusinessPartnerId
   */
  BusinessPartnerId?: number | null;

  /**
   * ContractEndDate
   */
  ContractEndDate?: string | null;

  /**
   * ContractStartDate
   */
  ContractStartDate?: string | null;

  /**
   * ContractStatusIds
   */
  ContractStatusIds?: number[] | null;

  /**
   * IsCheckContract
   */
  IsCheckContract: boolean;

  /**
   * IsCheckQuote
   */
  IsCheckQuote: boolean;

  /**
   * MaterialCatalogId
   */
  MaterialCatalogId?: number | null;

  /**
   * MaterialId
   */
  MaterialId?: number | null;

  /**
   * Materials
   */
  Materials?: IMaterialEntity[] | null;

  /**
   * Option
   */
  Option: number;

  /**
   * ProjectId
   */
  ProjectId?: number | null;

  /**
   * QuoteEndDate
   */
  QuoteEndDate?: string | null;

  /**
   * QuoteStartDate
   */
  QuoteStartDate?: string | null;

  /**
   * QuoteStatusIds
   */
  QuoteStatusIds?: number[] | null;
}
