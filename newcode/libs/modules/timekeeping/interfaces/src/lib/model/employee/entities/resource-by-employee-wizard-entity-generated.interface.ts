/*
 * Copyright(c) RIB Software GmbH
 */

export interface IResourceByEmployeeWizardEntityGenerated {

  /**
   * CostCodeFk
   */
  CostCodeFk: number;

  /**
   * EmployeeFks
   */
  EmployeeFks?: number[] | null;

  /**
   * JobFk
   */
  JobFk: number;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * Requisitions
   */
  //Requisitions?: IIResRequisitionEntity[] | null;

  /**
   * ResGroupFk
   */
  ResGroupFk: number;

  /**
   * ResKindFk
   */
  ResKindFk: number;

  /**
   * ResTypeFk
   */
  ResTypeFk: number;

  /**
   * SiteFk
   */
  SiteFk: number;

  /**
   * UoMTimeFk
   */
  UoMTimeFk: number;
}
