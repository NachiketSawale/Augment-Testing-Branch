/*
 * Copyright(c) RIB Software GmbH
 */


import { IMaterialGroupEntity } from '@libs/basics/shared';
import { MaterialGroupCharComplete } from './material-group-char-complete.class';

import { CompleteIdentification } from '@libs/platform/common';
import { IMaterialGroupCharEntity } from './entities/material-group-char-entity.interface';

export class MaterialGroupComplete implements CompleteIdentification<IMaterialGroupEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MaterialGroup
   */
  public MaterialGroup?: IMaterialGroupEntity | null;

  /**
   * MaterialGroupCharToDelete
   */
  public MaterialGroupCharToDelete?: IMaterialGroupCharEntity[] | null = [];

  /**
   * MaterialGroupCharToSave
   */
  public MaterialGroupCharToSave?: MaterialGroupCharComplete[] | null = [];

  public constructor(e: IMaterialGroupEntity | null) {
        if (e) {
          this.MainItemId = e.Id;
          this.MaterialGroup = e;
        }
      }
}
