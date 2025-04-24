/*
 * Copyright(c) RIB Software GmbH
 */

import { ICertificateEntity } from './certificate-entity.interface';
import { IFilterResponse } from '@libs/basics/shared';
import { IContractLookupEntity } from '@libs/procurement/shared';
import { IBasicsCustomizeCertificateStatusEntity, IBasicsCustomizeCertificateTypeEntity } from '@libs/basics/interfaces';

export interface ICertificateResponseGenerated {

  /**
   * BusinessPartner
   */
  //BusinessPartner?: IIBusinessPartnerLookupData[] | null;

  /**
   * CertificateStatus
   */
  CertificateStatus?: IBasicsCustomizeCertificateStatusEntity[] | null; //ICertificateStatusLookupEntity[] | null;

  /**
   * CertificateType
   */
  CertificateType?: IBasicsCustomizeCertificateTypeEntity[] | null; //IBasicsCustomizeCertificateTypeEntity[] | null;

  /**
   * ConHeader
   */
  ConHeader?: IContractLookupEntity[] | null;

  /**
   * FilterResult
   */
  //FilterResult?: IFilterResponse | null;
  FilterResult: IFilterResponse;

  /**
   * Project
   */
  //Project?: IIProjectLookupData[] | null;

  /**
   * dtos
   */
  //dtos?: ICertificateEntity[] | null;
  dtos: ICertificateEntity[];
}
