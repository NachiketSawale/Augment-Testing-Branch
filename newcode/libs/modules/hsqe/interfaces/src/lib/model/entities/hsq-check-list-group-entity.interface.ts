/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListGroupEntityGenerated } from './hsq-check-list-group-entity-generated.interface';

export interface IHsqCheckListGroupEntity extends IHsqCheckListGroupEntityGenerated {
	/**
	 * is checked
	 */
	IsChecked: boolean;

	/**
	 * image
	 */
	image: string;
}
