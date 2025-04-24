/*
 * Copyright(c) RIB Software GmbH
 */

import { ITimeAlloc2PrjActionEntity } from './time-alloc-2-prj-action-entity.interface';
import { ITimeAllocationHeaderEntity } from './time-allocation-header-entity.interface';
import { ITimeAllocationEntity } from './time-allocation-entity.interface';
import { TimeAllocationItemComplete } from './time-allocation-item-complete.class';

import { CompleteIdentification } from '@libs/platform/common';

export class TimeAllocationHeaderComplete implements CompleteIdentification<ITimeAllocationHeaderEntity>{

  /**
   * MainItemId
   */
  public Id: number = 0;

  /**
   * TimeAlloc2PrjActions
   */
  public TimeAlloc2PrjActions?: ITimeAlloc2PrjActionEntity[] | null = [];

  /**
   * TimeAlloc2PrjActionsToDelete
   */
  public TimeAlloc2PrjActionsToDelete?: ITimeAlloc2PrjActionEntity[] | null = [];

  /**
   * TimeAlloc2PrjActionsToSave
   */
  public TimeAlloc2PrjActionsToSave?: ITimeAlloc2PrjActionEntity[] | null = [];

  /**
   * TimeAllocationHeaderDto
   */
  public TimeAllocationHeaderDto?: ITimeAllocationHeaderEntity | null;

  /**
   * TimeAllocationHeaderDtos
   */
  public TimeAllocationHeaderDtos?: ITimeAllocationHeaderEntity[] | null = [];

  /**
   * TimeAllocationToDelete
   */
  public TimeAllocationToDelete?: ITimeAllocationEntity[] | null = [];

  /**
   * TimeAllocationToSave
   */
  public TimeAllocationToSave?: TimeAllocationItemComplete[] | null = [];
}
