/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialCatalogEntity } from '@libs/basics/shared';
import { IAlternativeSourceEntity } from './alternative-source-entity.interface';
import { ICo2SourceEntity } from './co-2-source-entity.interface';
import { IInternetCatalogErrorEntity } from './internet-catalog-error-entity.interface';

import { IMdcCommoditySearchVEntity } from './mdc-commodity-search-ventity.interface';

export interface ISearchResultEntityGenerated {

  /**
   * AlternativeSources
   */
  AlternativeSources?: IAlternativeSourceEntity[] | null;

  /**
   * Attributes
   */
  // Attributes?: IAttributeFilter[] | null;

  /**
   * BusinessPartners
   */
  // BusinessPartners?: IIBusinessPartnerEntity[] | null;

  /**
   * Co2ProjectRange
   */
  // Co2ProjectRange?: IMaterialSearchRange | null;

  /**
   * Co2SourceRange
   */
  // Co2SourceRange?: IMaterialSearchRange | null;

  /**
   * Co2Sources
   */
  Co2Sources?: ICo2SourceEntity[] | null;

  /**
   * Groups
   */
  Groups?: {[key: string]: number} | null;

  /**
   * InternetCatalogErrors
   */
  InternetCatalogErrors?: IInternetCatalogErrorEntity[] | null;

  /**
   * InternetCategories
   */
  InternetCategories?: IMaterialCatalogEntity[] | null;

  /**
   * MatchedCount
   */
  MatchedCount: number;

  /**
   * MaterialCategories
   */
  MaterialCategories?: IMaterialCatalogEntity[] | null;

  /**
   * MaterialIdSelected
   */
  MaterialIdSelected: number;

  /**
   * Materials
   */
  Materials?: IMdcCommoditySearchVEntity[] | null;

  /**
   * MaxGroupCount
   */
  MaxGroupCount: number;

  /**
   * PriceRange
   */
  // PriceRange?: IMaterialSearchRange | null;

  /**
   * Structures
   */
  // Structures?: IPrcStructureEntity[] | null;

  /**
   * TraceLog
   */
  TraceLog?: string | null;

  /**
   * Uoms
   */
  // Uoms?: IUomEntity[] | null;
}
