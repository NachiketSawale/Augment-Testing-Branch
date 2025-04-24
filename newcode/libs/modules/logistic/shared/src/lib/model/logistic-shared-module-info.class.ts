/*
 * Copyright(c) RIB Software GmbH
 */

import {IApplicationModuleInfo} from '@libs/platform/common';

export class LogisticSharedModuleInfoClass implements IApplicationModuleInfo {

	public static instance = new LogisticSharedModuleInfoClass();

	public readonly internalModuleName = 'logistic.shared';

	private constructor( ) {

	}
}