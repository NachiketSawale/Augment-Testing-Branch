/*
 * Copyright(c) RIB Software GmbH
 */

import { IShiftBreakEntity } from './shift-break-entity.interface';
import { IShiftWorkingTimeEntity } from './shift-working-time-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class WorkingTimeComplete implements CompleteIdentification<IShiftWorkingTimeEntity>{

  /**
   * BreaksToDelete
   */
  public BreaksToDelete?: IShiftBreakEntity[] | null = [];

  /**
   * BreaksToSave
   */
  public BreaksToSave?: IShiftBreakEntity[] | null = [];

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * WorkingTimes
   */
  public WorkingTimes?: IShiftWorkingTimeEntity | null = null;

	public constructor(e: IShiftWorkingTimeEntity | null) {
		if (e) {
			this.MainItemId = e.Id || 0;
			this.WorkingTimes = e;
		}
	}
}
