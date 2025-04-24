/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IReportEntity, ITimekeepingBreakEntity } from '@libs/timekeeping/interfaces';

export class ControllingReportComplete implements CompleteIdentification<IReportEntity>{

  /**
   * BreaksToDelete
   */
  public BreaksToDelete?: ITimekeepingBreakEntity[] | null = [];

  /**
   * BreaksToSave
   */
  public BreaksToSave?: ITimekeepingBreakEntity[] | null = [];

  /**
   * ReportId
   */
  public ReportId: number=0;

  /**
   * Reports
   */
  public Reports?: IReportEntity[] | null = [];

  public MainItemId: number = 0;

}
