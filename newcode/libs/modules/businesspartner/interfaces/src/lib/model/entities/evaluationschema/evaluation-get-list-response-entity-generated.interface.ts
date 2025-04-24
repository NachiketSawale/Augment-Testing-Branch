/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationStatusEntity } from './evaluation-status-entity.interface';
import { IEvaluationEntity } from './evaluation-entity.interface';
import { IBasicsClerkEntityGenerated } from '@libs/basics/interfaces';
import { IDescriptorDto } from './evaluation-simple.interface';
import { IEvaluationSchemaIconEntity } from './evaluation-schema-icon-entity.interface';
import { IContactLookupEntity } from '../lookup/contact-lookup-entity.interface';
import { IBusinessPartnerLookupVEntity } from '../main/business-partner-lookup-ventity.interface';
import { ISubsidiaryLookupEntity } from '../lookup/subsidiary-lookup-entity.interface';

export interface IEvaluationGetListResponseEntityGenerated {

  /**
   * BusinessPartner
   */
  BusinessPartner?: IBusinessPartnerLookupVEntity[] | null;

  /**
   * Clerk
   */
  Clerk?: IBasicsClerkEntityGenerated[] | null;

  /**
   * EvaluationSchema
   */
  EvaluationSchema?: Map<number, IDescriptorDto> | null;

  /**
   * EvaluationStatus
   */
  EvaluationStatus?: IEvaluationStatusEntity[] | null;

  /**
   * SchemaIcons
   */
  SchemaIcons?: IEvaluationSchemaIconEntity[] | null;

  /**
   * Subsidiary
   */
  Subsidiary?: ISubsidiaryLookupEntity[] | null;

  /**
   * contact
   */
  contact?: IContactLookupEntity[] | null;

  /**
   * dtos
   */
  dtos?: IEvaluationEntity[] | null;
}
