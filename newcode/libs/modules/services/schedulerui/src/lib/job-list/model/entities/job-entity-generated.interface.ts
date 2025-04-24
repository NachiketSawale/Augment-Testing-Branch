/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IJobEntity } from './job-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IParameterList } from './parameter-list.interface';

//TODO: this interface will remove or change
//Depends on job parameter editor ticket
export interface IParameterEntity {
	ReadOnly?: boolean;
}

//TODO: this interface will remove or change
//Depends on Dev-6193 task
export interface ILog {
	actionList: IActionList[];
}

//TODO: this interface will remove or change
//Depends on Dev-6193 task
export interface IActionList {
	toolTip?: string;
	icon?: string;
	readonly?: boolean;
}

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
	 * Id
	 */
	Id?: number | null;

	/*
	 * IsAutoDrop
	 */
	IsAutoDrop?: boolean | null;

	/*
	 * IsRepetitive
	 */
	IsRepetitive?: boolean | null;

	/*
	 * ItemType
	 */
	ItemType?: number | null;

	/*
	 * JobEntities_JobFk
	 */
	//JobEntities_JobFk?: IJobEntity[] | null;

	/*
	 * JobEntity_JobFk
	 */
	//JobEntity_JobFk?: IJobEntity | null;

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
	 * ParameterList
	 */
	ParameterList?: string | null;

	//TODO : type will change.
	//Depends on job parameter editor ticket
	/*
	 * Parameter
	 */
	Parameter?: IParameterList[] | null;

	//TODO : type will change.
	//Depends on Dev-6193 task

	/**
	 * Log
	 */
	Log?: ILog;

	/*
	 * ParentId
	 */
	ParentId?: number | null;

	/*
	 * Priority
	 */
	Priority?: number | null;

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
	 * UserFk
	 */
	UserFk?: number | null;

	/*
	 * UserSecurityData
	 */
	UserSecurityData?: string | null;
}
