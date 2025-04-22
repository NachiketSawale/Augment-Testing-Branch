/*
 * Copyright(c) RIB Software GmbH
 */
import { IGridConfigDialogColumnsEntity } from '@libs/ui/common';

export interface IEntityContainerGridColumnConfigData extends IGridConfigDialogColumnsEntity {
	/**
	 * Unique identifier.
	 */
	Id: string;

	/**
	 * Is column visible or hidden.
	 */
	hidden: boolean;

	//TODO: Add the additional column properties which are specific to modules like Uom, fraction....
}
