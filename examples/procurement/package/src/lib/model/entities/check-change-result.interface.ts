/*
 * Copyright(c) RIB Software GmbH
 */

import { PackageChangeType } from '../enums/package-change-type.enum';

export interface ICheckChangeResult {
	IsChanged: boolean;
	SessionID?: string ;
	Id: number;
	NewBaselineUpdate?: Date ;
	NewBaselinePath?: string ;
	NewBaselinePhase: number;
	ChangeType?: PackageChangeType ;
	Files?: string[] ;
	ErrorMsg?: string ;
}
