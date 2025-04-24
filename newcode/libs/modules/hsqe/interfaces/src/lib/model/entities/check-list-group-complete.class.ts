/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IHsqCheckListGroupEntity } from './hsq-check-list-group-entity.interface';

export class CheckListGroupComplete implements CompleteIdentification<IHsqCheckListGroupEntity> {
	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * CheckList Group
	 */
	public Group : IHsqCheckListGroupEntity | null = null;
}
