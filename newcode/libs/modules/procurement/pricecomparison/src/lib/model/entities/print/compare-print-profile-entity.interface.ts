/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IComparePrintGenericProfile } from './compare-print-generic-profile.interface';
import { IComparePrintRfqProfile } from './compare-print-rfq-profile.interface';

export interface IComparePrintProfileEntity extends IEntityBase {
	Id: number;
	RfqHeaderFk?: number;
	FrmUserFk?: number;
	FrmAccessRoleFk?: number;
	IsSystem: boolean;
	IsDefault: boolean;
	Description?: string | null;
	PropertyConfig: string | IComparePrintGenericProfile | IComparePrintRfqProfile;
	ProfileType: number;
	IsCurrentView?: boolean;
	DisplayText: string;
}