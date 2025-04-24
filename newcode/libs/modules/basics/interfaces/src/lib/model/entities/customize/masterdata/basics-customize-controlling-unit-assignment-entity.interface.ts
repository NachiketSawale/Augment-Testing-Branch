/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeControllingUnitAssignmentEntity extends IEntityBase, IEntityIdentification {
	ContextFk: number;
	Assignment01Name: string;
	Assignment01Transfer: boolean;
	Controllinggroup1Fk: number;
	Assignment02Name: string;
	Assignment02Transfer: boolean;
	Controllinggroup2Fk: number;
	Assignment03Name: string;
	Assignment03Transfer: boolean;
	Controllinggroup3Fk: number;
	Assignment04Name: string;
	Assignment04Transfer: boolean;
	Controllinggroup4Fk: number;
	Assignment05Name: string;
	Assignment05Transfer: boolean;
	Controllinggroup5Fk: number;
	Assignment06Name: string;
	Assignment06Transfer: boolean;
	Controllinggroup6Fk: number;
	Assignment07Name: string;
	Assignment07Transfer: boolean;
	Controllinggroup7Fk: number;
	Assignment08Name: string;
	Assignment08Transfer: boolean;
	Controllinggroup8Fk: number;
	Assignment09Name: string;
	Assignment09Transfer: boolean;
	Controllinggroup9Fk: number;
	Assignment10Name: string;
	Assignment10Transfer: boolean;
	Controllinggroup10Fk: number;
	Nominaldimension1Name: string;
	Nominaldimension2Name: string;
	Nominaldimension3Name: string;
}
