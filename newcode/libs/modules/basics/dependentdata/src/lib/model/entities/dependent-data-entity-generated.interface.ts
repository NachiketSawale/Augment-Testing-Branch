/*
 * Copyright(c) RIB Software GmbH
 */

import { IDependentDataColumnEntity } from './dependent-data-column-entity.interface';
import { IDependentDataTypeEntity } from './dependent-data-type-entity.interface';
import { IUserChartEntity } from './user-chart-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IDependentDataEntityGenerated extends IEntityBase {

  /**
   * BoundColumn
   */
  BoundColumn?: string | null;

  /**
   * BoundContainerUuid
   */
  BoundContainerUuid?: string | null;

  /**
   * ContainerName
   */
  ContainerName?: string | null;

  /**
   * ContainerNameTr
   */
  ContainerNameTr?: number | null;

  /**
   * ContainerUuid
   */
  ContainerUuid?: string | null;

  /**
   * DependentDataColumnDto
   */
  DependentDataColumnDto?: IDependentDataColumnEntity[] | null;

  /**
   * DependentDataTypeFk
   */
  DependentDataTypeFk: number;

  /**
   * DependentdataTypeEntity
   */
  DependentdataTypeEntity?: IDependentDataTypeEntity | null;

  /**
   * DependentdatacolumnEntities
   */
  DependentdatacolumnEntities?: IDependentDataColumnEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo: IDescriptionInfo;

  /**
   * Id
   */
  Id: number;

  /**
   * IsCompanyContext
   */
  IsCompanyContext: boolean;

  /**
   * IsEstimateContext
   */
  IsEstimateContext: boolean;

  /**
   * IsModelContext
   */
  IsModelContext: boolean;

  /**
   * IsProjectContext
   */
  IsProjectContext: boolean;

  /**
   * IsUserContext
   */
  IsUserContext: boolean;

  /**
   * Isdefault
   */
  Isdefault: boolean;

  /**
   * ModuleFk
   */
  ModuleFk: number;

  /**
   * SortBy
   */
  SortBy?: string | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * SourceObject
   */
  SourceObject: string;

  /**
   * UserchartEntities
   */
  UserchartEntities?: IUserChartEntity[] | null;
}
