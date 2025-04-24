/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IMaterialGroupCharEntity } from './entities/material-group-char-entity.interface';
import { IMaterialGroupCharvalEntity } from './entities/material-group-charval-entity.interface';

export class MaterialGroupCharComplete implements CompleteIdentification<IMaterialGroupCharEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MaterialGroupChar
   */
  public MaterialGroupChar?: IMaterialGroupCharEntity | null;

  /**
   * MaterialGroupCharvalToDelete
   */
  public MaterialGroupCharvalToDelete?: IMaterialGroupCharvalEntity[] | null = [];

  /**
   * MaterialGroupCharvalToSave
   */
  public MaterialGroupCharvalToSave?: IMaterialGroupCharvalEntity[] | null = [];

  public constructor(e: IMaterialGroupCharEntity | null) {
    if (e) {
      this.MainItemId = e.Id;
      this.MaterialGroupChar = e;
    }
  }
}
