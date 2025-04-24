/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IMaterialRoundingConfigEntity } from '../entities/material-rounding-config-entity.interface';
import { IMaterialRoundingConfigDetailEntity } from '../entities/material-rounding-config-detail-entity.interface';

export class MaterialRoundingComplete implements CompleteIdentification<IMaterialRoundingConfigEntity>{

  /**
   * ContextFk
   */
  public ContextFk!: number;

  /**
   * MaterialRoundingConfig
   */
  public MaterialRoundingConfig?: IMaterialRoundingConfigEntity | null;

  /**
   * MaterialRoundingConfigDetails
   */
  public MaterialRoundingConfigDetails?: IMaterialRoundingConfigDetailEntity[] | null = [];
}

