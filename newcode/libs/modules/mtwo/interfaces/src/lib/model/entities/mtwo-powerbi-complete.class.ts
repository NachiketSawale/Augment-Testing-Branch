/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IMtwoPowerbiEntity } from './mtwo-powerbi-entity.interface';
import { IMtwoPowerbiItemEntity } from './mtwo-powerbiitem-entity.interface';
import { MtwoPowerbiItemComplete } from './mtwo-powerbiitem-complete.class';

export class MtwoPowerbiComplete implements CompleteIdentification<IMtwoPowerbiEntity>{

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MtoPowerbi
   */
  public MtoPowerbi?: IMtwoPowerbiEntity [] | null;

  /**
   * MtoPowerbiitem
   */
  public MtoPowerbiitem?: IMtwoPowerbiItemEntity [] | null;

  /**
   * MtoPowerbiitemToSave
   */
  public MtoPowerbiitemToSave?: MtwoPowerbiItemComplete[] | null = [];
}
