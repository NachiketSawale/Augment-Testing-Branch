/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosGroupEntityGenerated } from './cos-group-entity-generated.interface';

export interface ICosGroupEntity extends ICosGroupEntityGenerated {
	/**
	 * is checked
	 */
	IsChecked: boolean;

	/**
	 * image
	 */
	image: string;
}
