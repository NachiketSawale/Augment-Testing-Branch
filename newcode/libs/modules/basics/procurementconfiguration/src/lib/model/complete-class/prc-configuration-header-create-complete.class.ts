/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IPrcConfigHeaderEntity } from '../entities/prc-config-header-entity.interface';
import { IPrcTotalTypeEntity } from '../entities/prc-total-type-entity.interface';

export class PrcConfigurationHeaderCreateComplete implements CompleteIdentification<IPrcConfigHeaderEntity>{

  /**
   * PrcConfigHeader
   */
  public PrcConfigHeader?: IPrcConfigHeaderEntity;

  /**
   * PrcTotalType
   */
  public PrcTotalType?: IPrcTotalTypeEntity | null;
}
