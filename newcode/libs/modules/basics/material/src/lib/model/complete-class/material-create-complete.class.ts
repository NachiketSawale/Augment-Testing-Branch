/*
 * Copyright(c) RIB Software GmbH
 */



import { IMaterialEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
import { IMaterialCreateEntity } from '../entities/material-create-entity.interface';
import { IMaterialCharacteristicEntity } from '@libs/basics/shared';

export class MaterialCreateComplete implements CompleteIdentification<IMaterialCreateEntity>{

  /**
   * Material
   */
  public Material?: IMaterialEntity | null;

  /**
   * MaterialCharacteristics
   */
  public MaterialCharacteristics?: IMaterialCharacteristicEntity[] | null = [];

  /**
   * MaterialTempUpdateStatus
   */
  // public MaterialTempUpdateStatus?: {[key: string]: {}} | null = [];
}
