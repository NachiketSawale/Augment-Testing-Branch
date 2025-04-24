/*
 * Copyright(c) RIB Software GmbH
 */

import { IChangeEntity } from './change-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class ModelChangeComplete implements CompleteIdentification<IChangeEntity>{

  /**
   * Change
   */
  public Change?: IChangeEntity[] | null = [];
}
