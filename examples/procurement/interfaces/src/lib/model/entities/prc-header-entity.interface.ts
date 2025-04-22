/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

/**
 * Prc header dto
 */
export interface IPrcHeaderEntity extends IEntityBase, IEntityIdentification{
  BpdEvaluationFk?: number;
  ConfigurationFk: number;
  //PrcBoqEntities?: Array<PrcBoqDto>;
  //PrcItemEntities?: Array<PrcItemDto>;
  //PrcWarrantyEntities?: Array<PrcWarrantyDto>;
  //QtnRequisitionEntities?: Array<QtnRequisitionDto>;
  StrategyFk: number;
  StructureFk?: number;
  //SubReferences?: Array<PrcSubreferenceDto>;
  TaxCodeFk?: number;
}
