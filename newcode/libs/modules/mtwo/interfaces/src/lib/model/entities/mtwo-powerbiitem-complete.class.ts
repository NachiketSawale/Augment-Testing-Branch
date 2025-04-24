/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IMtwoPowerbiItemEntity } from './mtwo-powerbiitem-entity.interface';

export class MtwoPowerbiItemComplete implements CompleteIdentification<IMtwoPowerbiItemEntity>{

  /**
   * ClerkDataToDelete
   */
  //public ClerkDataToDelete?: IClerkDataEntity[] | null = [];

  /**
   * ClerkDataToSave
   */
  //public ClerkDataToSave?: IClerkDataEntity[] | null = [];

  /**
   * MtoPowerbiitem
   */
  public MtoPowerbiitem?: IMtwoPowerbiItemEntity[] | null = [];
}
