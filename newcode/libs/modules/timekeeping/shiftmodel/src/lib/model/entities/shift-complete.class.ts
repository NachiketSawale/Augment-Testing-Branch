/*
 * Copyright(c) RIB Software GmbH
 */

import { IExceptionDayEntity } from './exception-day-entity.interface';
import { IShift2GroupEntity } from './shift-2group-entity.interface';
import { IShiftEntity } from './shift-entity.interface';
import { IShiftWorkingTimeEntity } from './shift-working-time-entity.interface';
import { WorkingTimeComplete } from './working-time-complete.class';

import { CompleteIdentification } from '@libs/platform/common';

export class ShiftComplete implements CompleteIdentification<IShiftEntity>{

  /**
   * ExceptionDaysToDelete
   */
  public ExceptionDaysToDelete?: IExceptionDayEntity[] | null = [];

  /**
   * ExceptionDaysToSave
   */
  public ExceptionDaysToSave?: IExceptionDayEntity[] | null = [];

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * Shift2GroupsToDelete
   */
  public Shift2GroupsToDelete?: IShift2GroupEntity[] | null = [];

  /**
   * Shift2GroupsToSave
   */
  public Shift2GroupsToSave?: IShift2GroupEntity[] | null = [];

  /**
   * Shifts
   */
  public Shifts: IShiftEntity | undefined | null = null;

  /**
   * WorkingTimesToDelete
   */
  public WorkingTimesToDelete?: IShiftWorkingTimeEntity[] | null = [];

  /**
   * WorkingTimesToSave
   */
  public WorkingTimesToSave?: WorkingTimeComplete[] | null = [];

	public constructor(e: IShiftEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.Shifts = e;
		}
	}
}
