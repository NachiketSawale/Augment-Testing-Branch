/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IReportParameterEntity } from '../entities/report-parameter-entity.interface';
import { IReportParameterValuesEntity } from '../entities/report-parameter-values-entity.interface';

export class ReportParameterComplete implements CompleteIdentification<IReportParameterEntity>{

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * ReportParameter
   */
  public ReportParameter?: IReportParameterEntity | null;

  /**
   * ReportParameterValuesToDelete
   */
  public ReportParameterValuesToDelete?: IReportParameterValuesEntity[] | null = [];

  /**
   * ReportParameterValuesToSave
   */
  public ReportParameterValuesToSave?: IReportParameterValuesEntity[] | null = [];
}
