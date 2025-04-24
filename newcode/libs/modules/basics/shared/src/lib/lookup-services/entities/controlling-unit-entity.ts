/*
 * Copyright(c) RIB Software GmbH
 */
import {IDescriptionInfo} from '@libs/platform/common';
/**
 * Controlling Unit
 */
export interface IControllingUnitEntity {
	Controllingunits: IControllingUnitEntity[];
	ControllingunitFk: IControllingUnitEntity;
	Code: string;
	Quantity: number;
	DescriptionInfo: IDescriptionInfo;
	Isaccountingelement: boolean;
	PrjProjectFk: number;
}