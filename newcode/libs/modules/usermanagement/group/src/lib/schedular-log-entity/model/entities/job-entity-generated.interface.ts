/*
 * Copyright(c) RIB Software GmbH
 */


import { IUserEntity } from '@libs/usermanagement/interfaces';
import { IJobEntity } from './job-entity.interface';
import { IEntityBase } from '@libs/platform/common';

/**
 * Usermanagement Group Log generated interface
 */
export interface IJobEntityGenerated extends IEntityBase {

/*
 * AdditionalParam
 */
  AdditionalParam?: ArrayBuffer | null;

/*
 * AllowChangeContext
 */
  AllowChangeContext?: boolean | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Enable
 */
  Enable?: boolean | null;

/*
 * EndDate
 */
  EndDate?: string | null;

/*
 * EndTime
 */
  EndTime?: string | null;

/*
 * ErrorCode
 */
  ErrorCode?: number | null;

/*
 * ErrorMessage
 */
  ErrorMessage?: string | null;

/*
 * ExecutionEndTime
 */
  ExecutionEndTime?: string | null;

/*
 * ExecutionMachine
 */
  ExecutionMachine?: string | null;

/*
 * ExecutionStartTime
 */
  ExecutionStartTime?: string | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * HeartBeat
 */
  HeartBeat?: string | null;

/*
 * Id
 */
  Id: number ;

/*
 * IsAutoDrop
 */
  IsAutoDrop?: boolean | null;

/*
 * ItemType
 */
  ItemType?: number | null;

/*
 * JobEntities_JobFk
 */
  JobEntities_JobFk?: IJobEntity[] | null;

/*
 * JobState
 */
  JobState?: number | null;

/*
 * Jobs
 */
  Jobs?: IJobEntity[] | null;

/*
 * KeepCount
 */
  KeepCount?: number | null;

/*
 * KeepDuration
 */
  KeepDuration?: number | null;

/*
 * LoggingLevel
 */
  LoggingLevel?: number | null;

/*
 * LoggingMessage
 */
  LoggingMessage?: string | null;

/*
 * LoggingMessagePresent
 */
  LoggingMessagePresent?: boolean | null;

/*
 * MachineName
 */
  MachineName?: string | null;

/*
 * Name
 */
  Name?: string | null;

/*
 * NotificationInfo
 */
  NotificationInfo?: string | null;

/*
 * Parameter
 */
  // Parameter?: IParameterEntity[] | null;

/*
 * ParameterList
 */
  ParameterList?: string | null;

/*
 * ParentId
 */
  ParentId?: number | null;

/*
 * Priority
 */
  Priority?: number | null;

/*
 * ProcessId
 */
  ProcessId?: number | null;

/*
 * ProgressInfo
 */
  ProgressInfo?: string | null;

/*
 * ProgressValue
 */
  ProgressValue?: number | null;

/*
 * RepeatCount
 */
  RepeatCount?: number | null;

/*
 * RepeatUnit
 */
  RepeatUnit?: number | null;

/*
 * RunInUserContext
 */
  RunInUserContext?: boolean | null;

/*
 * StartDate
 */
  StartDate?: string | null;

/*
 * StartTime
 */
  StartTime?: string | null;

/*
 * TaskType
 */
  TaskType?: string | null;

/*
 * UserEntity
 */
  UserEntity?: IUserEntity | null;

/*
 * UserFk
 */
  UserFk?: number | null;

/*
 * UserSecurityData
 */
  UserSecurityData?: string | null;
}
