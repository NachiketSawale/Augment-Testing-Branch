/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessPartnerStatusEntity } from '../lookup/businesspartner-status-entity.class';
import { IEvaluationEntity } from './evaluation-entity.interface';
import { IEvaluationSchemaEntity } from './evaluation-schema-entity.interface';
import { IEvaluationSchemaIconEntity } from './evaluation-schema-icon-entity.interface';
import { IEvaluationStatusEntity } from './evaluation-status-entity.interface';

export interface IEvaluationGetTreeResponseGenerated {

  /**
   * BusinessPartnerStatus
   */
  BusinessPartnerStatus?: BusinessPartnerStatusEntity[] | null;

  /**
   * Dtos
   */
  Dtos?: IEvaluationEntity[] | null;

  /**
   * EvaluationStatus
   */
  EvaluationStatus?: IEvaluationStatusEntity[] | null;

  /**
   * SchemaIcons
   */
  SchemaIcons?: IEvaluationSchemaIconEntity[] | null;

  /**
   * SchemaId2DiffEvalCount
   */
  SchemaId2DiffEvalCount?: Map<number, number>;

  /**
   * SchemaId2DiffEvalPoints
   */
  SchemaId2DiffEvalPoints?: Map<number, number>;

  /**
   * Schemas
   */
  Schemas?: IEvaluationSchemaEntity[] | null;
}
