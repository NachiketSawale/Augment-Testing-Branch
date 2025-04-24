/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcBoqEntity } from '@libs/procurement/interfaces';
import { IPrcItemEntity } from './prc-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IPrcWarrantyEntity } from './prc-warranty-entity.interface';
import { IQtnRequisitionEntity } from './qtn-requisition-entity.interface';
import { IPrcSubreferenceEntity } from './prc-subreference-entity.interface';

export interface IPrcHeaderEntityGenerated extends IEntityBase {

  /**
   * BpdEvaluationFk
   */
  BpdEvaluationFk?: number | null;

  /**
   * ConfigurationFk
   */
  ConfigurationFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcBoqEntities
   */
  PrcBoqEntities?: IPrcBoqEntity[] | null;

  /**
   * PrcItemEntities
   */
  PrcItemEntities?: IPrcItemEntity[] | null;

  /**
   * PrcWarrantyEntities
   */
  PrcWarrantyEntities?: IPrcWarrantyEntity[] | null;

  /**
   * QtnRequisitionEntities
   */
  QtnRequisitionEntities?: IQtnRequisitionEntity[] | null;

  /**
   * StrategyFk
   */
  StrategyFk: number;

  /**
   * StructureFk
   */
  StructureFk?: number | null;

  /**
   * SubReferences
   */
  SubReferences?: IPrcSubreferenceEntity[] | null;
}
