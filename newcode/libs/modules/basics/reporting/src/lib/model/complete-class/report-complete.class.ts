/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IReportEntity } from '../entities/report-entity.interface';
import { IReportParameterEntity } from '../entities/report-parameter-entity.interface';
import { IReportParameterValuesEntity } from '../entities/report-parameter-values-entity.interface';
import { ReportParameterComplete } from './report-parameter-complete.class';

export class ReportComplete implements CompleteIdentification<IReportEntity>{

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * Report
   */
  public Report?: IReportEntity | null;

  /**
   * ReportParameterToDelete
   */
  public ReportParameterToDelete?: IReportParameterEntity[] | null = [];

  /**
   * ReportParameterToSave
   */
  public ReportParameterToSave?: ReportParameterComplete[] | null = [];

  /**
   * ReportParameterValuesToDelete
   */
  public ReportParameterValuesToDelete?: IReportParameterValuesEntity[] | null = [];
}
