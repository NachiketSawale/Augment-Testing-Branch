/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';


export interface IRfqRequisitionEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	RfqHeaderFk: number;
	ReqHeaderFk: number;
	PrcHeaderFk: number;
	PrcHeaderEntity?: IPrcHeaderEntity | null;
	ProjectFk?: number;
	PackageFk?: number;
	ChildItems?: IRfqRequisitionEntity[] | null;
	HasChildren: boolean;
	Pid?: number;
}