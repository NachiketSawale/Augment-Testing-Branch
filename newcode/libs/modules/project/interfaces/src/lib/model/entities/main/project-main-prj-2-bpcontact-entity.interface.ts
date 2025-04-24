/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IProjectMainPrj2BPContactEntityGenerated } from './project-main-prj-2-bpcontact-entity-generated.interface';

export interface IProjectMainPrj2BPContactEntity extends IProjectMainPrj2BPContactEntityGenerated{

	TelephoneNumberFk: number | null;
	TelephoneNumber2Fk: number | null;
	TelephoneNumberMobileFk: number | null;
	FirstName: string;
	FamilyName: string;
	Email: string;
	SubsidiaryFk: number | null;
}
