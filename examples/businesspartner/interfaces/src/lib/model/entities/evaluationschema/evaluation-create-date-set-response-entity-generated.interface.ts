/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationStatusEntity } from './evaluation-status-entity.interface';
import { IEvaluationEntity } from './evaluation-entity.interface';
import { IEvaluationSchemaIconEntity } from './evaluation-schema-icon-entity.interface';
import { BusinessPartnerLookupVEntity } from '../lookup/business-partner-lookup-v-entity.class';
import { ISubsidiaryLookupEntity } from '../lookup/subsidiary-lookup-entity.interface';

export interface IEvaluationCreateDateSetResponseEntityGenerated {

  /**
   * BusinessPartner
   */
  BusinessPartner?: BusinessPartnerLookupVEntity[] | null;

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
   * dtos
   */
  dtos?: IEvaluationEntity | null;
}
