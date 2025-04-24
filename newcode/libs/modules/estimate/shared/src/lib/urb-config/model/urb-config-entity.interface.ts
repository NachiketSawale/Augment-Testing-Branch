/*
 * Copyright(c) RIB Software GmbH
 */

/*
 * boq urp config
 */
import { IEntityBase } from '@libs/platform/common';
import { EventEmitter } from '@angular/core';
import { IEstShareUrbConfigUrb2CostCode } from './urb-config-urb-cost-code.interface';

export interface IUrbConfigEntity {
	ProjectId?: number;

	BoqHeaderId?: number | null;

	EstHeaderId?: number | null;

	EstUppConfigTypeFk?: number | null;

	EstUppConfigFk?: number | null;

	IsEditUppType: boolean;

	UppConfigDesc: string;

	OpenFromEstBoq: boolean;

	IsForCustomization: boolean;

	OpenFromCreateBid: boolean;

	IsDefaultUpp?: boolean | null;

	IsUpdUpp?: boolean | null;

	EntityChange: EventEmitter<null>;

	EstUpp2CostCodeDetails?: IEstShareUrbConfigUrb2CostCode[] | null;

	EstUppConfig?:object | null
}


/*
 * Urp to CostCode/ProjectCostCode mapping
 */
export interface IUrb2CostCode extends IEntityBase {
	Id: number;
	EstUppConfigFk: number;
	LineType?: number | null;
	MdcCostCodeFk?: number | null;
	Project2MdcCstCdeFk? : number | null;
	UppId: number;
}