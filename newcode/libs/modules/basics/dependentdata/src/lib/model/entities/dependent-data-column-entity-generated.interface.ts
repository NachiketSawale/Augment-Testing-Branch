/*
 * Copyright(c) RIB Software GmbH
 */

import { IDependentDataColumnEntity } from './dependent-data-column-entity.interface';
import { IDependentDataEntity } from './dependent-data-entity.interface';
import { IDisplayDomainEntity } from './display-domain-entity.interface';
import { IUserChartEntity } from './user-chart-entity.interface';
import { IUserChartSeriesEntity } from './user-chart-series-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IDependentDataColumnEntityGenerated extends IEntityBase {

  /**
   * BoundColumn
   */
  BoundColumn?: string | null;

  /**
   * DatabaseColumn
   */
  DatabaseColumn: string;

  /**
   * DependentDataColumnEntities_DependentdatacolumnFk
   */
  DependentDataColumnEntities_DependentdatacolumnFk?: IDependentDataColumnEntity[] | null;

  /**
   * DependentDataColumnEntity_DependentDatacColumnFk
   */
  DependentDataColumnEntity_DependentDatacColumnFk?: IDependentDataColumnEntity | null;

  /**
   * DependentDataColumnFk
   */
  DependentDataColumnFk?: number | null;

  /**
   * DependentDataEntity
   */
  DependentDataEntity?: IDependentDataEntity | null;

  /**
   * DependentDataFk
   */
  DependentDataFk: number;

  /**
   * DependentcolParentFk
   */
  DependentcolParentFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DisplayDomainEntity
   */
  DisplayDomainEntity?: IDisplayDomainEntity | null;

  /**
   * DisplayDomainFk
   */
  DisplayDomainFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsVisible
   */
  IsVisible: boolean;

  /**
   * ModuleFk
   */
  ModuleFk?: number | null;

  /**
   * ModuleInternalName
   */
  ModuleInternalName?: string | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * SourceColumn
   */
  SourceColumn?: string | null;

  /**
   * UserChartEntities_DependentdatacolumnGrp1Fk
   */
  UserChartEntities_DependentdatacolumnGrp1Fk?: IUserChartEntity[] | null;

  /**
   * UserChartEntities_DependentdatacolumnGrp2Fk
   */
  UserChartEntities_DependentdatacolumnGrp2Fk?: IUserChartEntity[] | null;

  /**
   * UserChartEntities_DependentdatacolumnXFk
   */
  UserChartEntities_DependentdatacolumnXFk?: IUserChartEntity[] | null;

  /**
   * UserChartEntities_DependentdatacolumnYFk
   */
  UserChartEntities_DependentdatacolumnYFk?: IUserChartEntity[] | null;

  /**
   * UserChartSeriesEntities_DependentdatacolumnRFk
   */
  UserChartSeriesEntities_DependentdatacolumnRFk?: IUserChartSeriesEntity[] | null;

  /**
   * UserChartSeriesEntities_DependentdatacolumnXFk
   */
  UserChartSeriesEntities_DependentdatacolumnXFk?: IUserChartSeriesEntity[] | null;

  /**
   * UserChartSeriesEntities_DependentdatacolumnYFk
   */
  UserChartSeriesEntities_DependentdatacolumnYFk?: IUserChartSeriesEntity[] | null;
}
