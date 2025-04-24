/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsStrandPatternEntity } from './pps-strand-pattern-entity-].interface';

export interface IPpsStrandPatternEntityGenerated {
  AsyncState?: [];
  CreationOptions?: 'None' | 'PreferFairness' | 'LongRunning' | 'AttachedToParent' | 'DenyChildAttach' | 'HideScheduler' | 'RunContinuationsAsynchronously';
  Exception?: [];
  Id?: number;
  IsCanceled?: boolean;
  IsCompleted?: boolean;
  IsCompletedSuccessfully?: boolean;
  IsFaulted?: boolean;
  Result?: IPpsStrandPatternEntity;
  Status?: 'Created' | 'WaitingForActivation' | 'WaitingToRun' | 'Running' | 'WaitingForChildrenToComplete' | 'RanToCompletion' | 'Canceled' | 'Faulted';
}
