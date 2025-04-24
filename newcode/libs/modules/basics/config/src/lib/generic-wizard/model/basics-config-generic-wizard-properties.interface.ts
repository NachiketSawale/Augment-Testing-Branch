/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Properties that have to be included in the generic wizard.
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * Properties that will be loaded in the generic wizard containers.
 */
export interface IGenericWizardProperties extends IEntityBase {

	/**
	 * Id of the property.
	 */
	Id: number;

	/**
	 * Label info of the property.
	 */
	LabelInfo: IDescriptionInfo;

	/**
	 * Tool tip info of the property.
	 */
	ToolTipInfo: IDescriptionInfo;

	/**
	 * Id of the container the property belongs to.
	 */
	GenericWizardContainerFk: number;

	/**
	 * Id of the instance the property belongs to.
	 */
	GenericWizardInstanceFk: number;

	/**
	 * This id is used to filter properties from the grid/form container.
	 */
	PropertyId: string;

	/**
	 * Boolean property to set the property field as readonly.
	 */
	IsReadOnly: boolean;

	/**
	 * Sets the width of the field, in a grid container.
	 */
	Width: number | null;

	/**
	 * Sorts the field in a form/row.
	 */
	Sorting: number;

	/**
	 * Boolean property to pin the field.
	 */
	IsPinned: boolean;
}