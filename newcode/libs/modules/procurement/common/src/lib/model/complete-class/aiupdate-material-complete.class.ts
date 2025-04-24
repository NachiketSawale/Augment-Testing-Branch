/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IAIUpdateMaterialEntity, IPrcItemCreateParameter } from '../entities';

export class AIUpdateMaterialComplete implements CompleteIdentification<IAIUpdateMaterialEntity>{

  /**
   * AIUpdatePrcItems
   */
  public AIUpdatePrcItems?: IAIUpdateMaterialEntity[] | null = [];

  /**
   * CompanyCurrencyId
   */
  public CompanyCurrencyId: number = 0;

  /**
   * Param
   */
  public Param?: IPrcItemCreateParameter | null;
}
