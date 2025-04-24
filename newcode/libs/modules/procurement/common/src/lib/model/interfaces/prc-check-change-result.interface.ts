/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementPackageChangeType } from '../enums/procurement-package-change-type.enum';

export interface IPrcCheckChangeResult {
	Id: number;
	SessionID: number;
	IsChanged: boolean;
	NewBaselineUpdate?: Date;
	NewBaselinePath: string;
	NewBaselinePhase?: number;
	ChangeType: ProcurementPackageChangeType;
	Files: string[];
	ErrorMsg: string
}