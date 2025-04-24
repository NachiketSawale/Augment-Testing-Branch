/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IPpsHeaderEntityGenerated extends IEntityBase {
	Id: number;

	PrjProjectFk: number;
	
	EstHeaderFk?: number | null;
	
	OrdHeaderFk?: number | null;

	BasFilearchivedocFk?: number | null;

	BasClerkPrpFk: number;

	MdlModelFk?: number | null;

	HeaderGroupFk?: number | null;

	BasSiteFk: number;

	HeaderStatusFk: number;

	PrjLocationFk?: number | null;
	
	Code: string;
	
	DescriptionInfo: IDescriptionInfo;
  
	Userdefined1?: string | null;

	Userdefined2?: string | null;

	Userdefined3?: string | null;

	Userdefined4?: string | null;

	Userdefined5?: string | null;

	IsActive: boolean;

	IsLive: boolean;

	LgmJobFk: number;

	EngHeaderFk?: number | null;

	HeaderTypeFk: number;

	EngDrawingFk?: number | null;

	Color?: number | null;

	Probability?: number | null;

	Threshold?: number | null;


	/* additional properties */

	HasToGenerateHeaderCode: boolean;

	DeliveryAddressRemark: string | undefined | null;

	PermissionObjectInfo: string;

	JobCode: string;

	JobDescription: string;
}
