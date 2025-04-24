/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IAIReplaceMaterialEntity } from '../entities';


export class AIReplaceMaterialComplete implements CompleteIdentification<IAIReplaceMaterialEntity>{

  /**
   * AIReplaceMaterials
   */
  public AIReplaceMaterials?: IAIReplaceMaterialEntity[] | null = [];

  /**
   * CompanyCurrencyId
   */
  public CompanyCurrencyId: number = 0;

  /**
   * ProjectId
   */
  public ProjectId: number = 0;
}
