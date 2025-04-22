/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IChangeSetStatusEntity } from './change-set-status-entity.interface';

export interface IChangeSetEntityGenerated extends IEntityBase {

/*
 * ChangeCount
 */
  ChangeCount: number;

/*
 * ChangeSetStatusEntity
 */
  ChangeSetStatusEntity: IChangeSetStatusEntity;

/*
 * ChangeSetStatusFk
 */
  ChangeSetStatusFk: number;

/*
 * CompareModelColumns
 */
  CompareModelColumns: boolean;

/*
 * CompareObjectLocations
 */
  CompareObjectLocations: boolean;

/*
 * CompareObjects
 */
  CompareObjects: boolean;

/*
 * CompareProperties
 */
  CompareProperties: boolean;

/*
 * ComparedModel
 */
//  ComparedModel?: IIModelEntity | null; //TODO 

/*
 * DescriptionInfo
 */
  DescriptionInfo: IDescriptionInfo;

/*
 * ExcludeOpenings
 */
  ExcludeOpenings: boolean;

/*
 * Id
 */
  Id: number;

/*
 * JobFk
 */
  JobFk?: number | null;

/*
 * LogFileArchiveDocFk
 */
  LogFileArchiveDocFk?: number | null;

/*
 * LoggingLevel
 */
  LoggingLevel: number;

/*
 * Model
 */
 // Model?: IIModelEntity | null;

/*
 * ModelCmpFk
 */
  ModelCmpFk: number;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * SearchPattern
 */
  SearchPattern: string;
}
