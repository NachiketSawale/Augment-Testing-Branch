/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IMaterialGroupCharEntity, IMaterialGroupCharvalEntity } from '@libs/basics/shared';

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
}
