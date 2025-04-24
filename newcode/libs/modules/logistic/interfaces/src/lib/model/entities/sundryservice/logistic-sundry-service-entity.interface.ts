/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';


export interface ILogisticSundryServiceEntity extends IEntityIdentification, IEntityBase {

	 Code: string;
	 DescriptionInfo: IDescriptionInfo;
	 SundryServiceGroupFk: number;
	 Specification: string;
	 UoMFk: number;
}
