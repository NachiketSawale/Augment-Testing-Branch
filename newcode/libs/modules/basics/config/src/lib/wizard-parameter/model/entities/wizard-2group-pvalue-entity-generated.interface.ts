/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IWizard2GroupEntity } from '../../../wizard-to-group/model/entities/wizard-2group-entity.interface';

export interface IWizard2GroupPValueEntityGenerated extends IEntityBase {

  /*
   * Domain
   */
  Domain?: string | null;

  /*
   * Id
   */
  Id?: number | null;

  /*
   * ReportEntity
   */
  // ReportEntity?: IReportEntity | null;

  /*
   * ReportFk
   */
  ReportFk?: number | null;

  /*
   * Sorting
   */
  Sorting?: number | null;

  /*
   * Value
   */
  Value?: string | null;

  /*
   * Wizard2GroupEntity
   */
  Wizard2GroupEntity?: IWizard2GroupEntity | null;

  /*
   * Wizard2GroupFk
   */
  Wizard2GroupFk?: number | null;

  /*
   * WizardParameterEntity
   */
  // WizardParameterEntity?: IWizardParameterEntity | null;

  /*
   * WizardParameterFk
   */
  WizardParameterFk?: number | null;
}
