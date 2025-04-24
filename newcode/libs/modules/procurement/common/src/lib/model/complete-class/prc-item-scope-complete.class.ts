/*
 * Copyright(c) RIB Software GmbH
 */


import { IPrcItemScopeDetailEntity, IPrcItemScopeEntity } from '../entities';
import { PrcItemScopeDetailComplete } from './prc-item-scope-detail-complete.class';

import { CompleteIdentification } from '@libs/platform/common';

export class PrcItemScopeComplete implements CompleteIdentification<IPrcItemScopeEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * PrcItemScope
   */
  public PrcItemScope?: IPrcItemScopeEntity | null;

  /**
   * PrcItemScopeDetailToDelete
   */
  public PrcItemScopeDetailToDelete?: IPrcItemScopeDetailEntity[] | null = [];

  /**
   * PrcItemScopeDetailToSave
   */
  public PrcItemScopeDetailToSave?: PrcItemScopeDetailComplete[] | null = [];
}
