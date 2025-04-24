/*
 * Copyright(c) RIB Software GmbH
 */

import { IDispatchingNoteResultEntity } from './dispatching-note-result-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class DispatchingNoteResultComplete implements CompleteIdentification<IDispatchingNoteResultEntity>{

  /**
   * DispatchingNoteResults
   */
  public DispatchingNoteResults?: IDispatchingNoteResultEntity[] | null = [];

  /**
   * records
   */
 // public records?: ISimpleDispatchRecord[] | null = [];
}
