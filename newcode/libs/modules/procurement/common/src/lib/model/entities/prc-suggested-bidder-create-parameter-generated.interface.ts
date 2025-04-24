/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessPartnerLookupVEntity } from '@libs/businesspartner/interfaces';

export interface IPrcSuggestedBidderCreateParameterGenerated {

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * bpMapContactDic
   */
  bpMapContactDic?: {[key: string]: number} | null;

  /**
   * bpMapSubsidiaryDic
   */
  bpMapSubsidiaryDic?: {[key: string]: number} | null;

  /**
   * businessPartnerList
   */
  businessPartnerList?: BusinessPartnerLookupVEntity[] | null;
}
