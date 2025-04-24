import { IDescriptionInfo } from '@libs/platform/common';

export interface IPpsCostGroupEntity {
	Id: number; // is mapped to ID of PPS_EVENT2COSTGRP or ENG_DRAWING2COSTGRP
	MainItemId?: number | null; // is mapped to PPS_EVENT_FK of PPS_EVENT2COSTGRP or ENG_DRAWING_FK of ENG_DRAWING2COSTGRP, 
	CostGroupCatFk?: number | null;
	Code: string; // is mapped to Code of BAS_COSTGROUP_CAT(according to business, there are 2 types PrjCostGroupCat and LicCostGroupCat)
	DescriptionInfo?: IDescriptionInfo | null; // is maped to DescriptionInfo of BAS_COSTGROUP_CAT

	CostGroupFk?: number | null;
}
/* remark1: PPS_EVENT2COSTGRP is used for stored records of cost groups of ppsItem/ppsHeader/product/ppsActivity/engTask/trsBundle/trPackage
            ENG_DRAWING2COSTGRP is used for stored records of cost groups of drawing
*/
/* remark2: only field Code, DescriptionInfo and CostGroupFk will be shown on cost group container
*/