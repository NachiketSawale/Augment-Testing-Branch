/*
 * Copyright(c) RIB Software GmbH
 */

export interface IWorkingTimeAccountVEntityGenerated {

  /**
   * ControllingunitFk
   */
  ControllingunitFk?: number | null;

  /**
   * DueDate
   */
  DueDate: string;

  /**
   * Duration
   */
  Duration?: number | null;

  /**
   * EmployeeFk
   */
  EmployeeFk: number;

  /**
   * FromDateTime
   */
  FromDateTime?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsVacation
   */
  IsVacation: boolean;

  /**
   * ProjectActionFk
   */
  ProjectActionFk?: number | null;

  /**
   * RecordingFk
   */
  RecordingFk: number;

  /**
   * ReportstatusFk
   */
  ReportstatusFk: number;

  /**
   * SheetFk
   */
  SheetFk: number;

  /**
   * TimeSymbolFk
   */
  TimeSymbolFk?: number | null;

  /**
   * TimeSymbolGroupFk
   */
  TimeSymbolGroupFk: number;

  /**
   * ToDateTime
   */
  ToDateTime?: string | null;

  /**
   * WorkingTimeModelFk
   */
  WorkingTimeModelFk?: number | null;
}
