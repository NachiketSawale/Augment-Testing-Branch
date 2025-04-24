/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { RadioSelect } from '../enums/scheduling-radio-select.enum';
export interface IPackageUpdateSchedulingWizard {
	MainItemId: number;
	ProjectId: number;
	IsUpdateAll: boolean;
}

export interface IPackageUpdateSchedulingRequest {
	PackageFk: number;
	ProjectFk: number;
	ActivityFk?: number;
	ScheduleFk?: number;
	scheduleInfo: string;
}

export interface Entity {
	ScheduleFk?: number;
}

export interface Config {
	model: string;
}

export interface IBody {
	bodyTitle: string;
	bodyToScheduling: string;
	bodyFromScheduling: string;
	currentPackage: string;
	currentProject: string;
	currentScheduling: string;
	radioSelect: RadioSelect;
}

export interface ISetStatus {
	isInit: boolean;
	isExecuting: boolean;
	isFailed: boolean;
	isSucceed: boolean;
}

export interface IPackageUpdateSchedulingOptions {
	request: IPackageUpdateSchedulingRequest;
	title: string;
	executingMessage: string;
	executeFailedMessage: string;
	executeSuccessedMessage: string;
	entity: Entity;
	config: Config;
	hasActivity: boolean;
	disabledMsg: string;
	body: IBody;
}

/**
 * injection token of Package Update Scheduling  Result component
 */
export const PACKAGE_UPDATE_SCHEDULING_RESULT_TOKEN = new InjectionToken<IPackageUpdateSchedulingRequest>('packageUpdateSchedulingRequestToken');
