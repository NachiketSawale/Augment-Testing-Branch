/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerRelationEntity } from './business-partner-relation-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBusinessPartnerRelationTypeEntityGenerated extends IEntityBase {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * OppositeDescriptionInfo
   */
  OppositeDescriptionInfo?: IDescriptionInfo | null;

  /**
   * OppositeRelationColor
   */
  OppositeRelationColor: number;

  /**
   * RelationColor
   */
  RelationColor: number;

  /**
   * RelationEntities
   */
  RelationEntities?: IBusinessPartnerRelationEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;
}
