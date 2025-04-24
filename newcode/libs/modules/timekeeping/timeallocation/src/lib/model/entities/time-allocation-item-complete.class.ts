/*
 * Copyright(c) RIB Software GmbH
 */

import { ITimeAllocationEntity } from './time-allocation-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';
import { IReportEntity } from '@libs/timekeeping/interfaces';

export class TimeAllocationItemComplete implements CompleteIdentification<ITimeAllocationEntity>{

  /**
   * ErrorMessage
   */
  public ErrorMessage?: string | null = '';

  /**
   * MainItemId
   */
  public Id: number=0;

  /**
   * ReportsToDelete
   */
  public ReportsToDelete?: IReportEntity[] | null = [];

  /**
   * ReportsToSave
   */
  public ReportsToSave?: IReportEntity[] | null = [];

  /**
   * TimeAllocation
   */
  public TimeAllocation?: ITimeAllocationEntity | null;

	public constructor(e: ITimeAllocationEntity | null) {
		if (e) {
			this.Id = e.Id;
			this.TimeAllocation = e;
		}
	}

}
