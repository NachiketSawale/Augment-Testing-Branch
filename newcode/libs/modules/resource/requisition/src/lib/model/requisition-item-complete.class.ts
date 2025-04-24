/*
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { IRequisitionitemEntity } from '@libs/resource/interfaces';

export class RequisitionItemComplete implements CompleteIdentification<IRequisitionitemEntity> {

	/**
	 * RequisitionItemId
	 */
	public RequisitionItemId: number = 0;

	/**
	 * RequisitionItems
	 */
	public RequisitionItems?: IRequisitionitemEntity[] | null = [];
}
