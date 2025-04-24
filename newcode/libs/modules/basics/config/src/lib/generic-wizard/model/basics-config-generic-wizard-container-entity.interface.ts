/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * Generic wizard container entity
 */
export interface IGenericWizardContainerEntity extends IEntityBase {
	/**
	 * Id of the wizard container
	 */
	Id: number;

	/**
	 * Title of the wizard container
	 */
	TitleInfo : IDescriptionInfo;

	/**
	 * CommentInfo
	 */
	CommentInfo : IDescriptionInfo;

	/**
	 * GenericWizardStepFk
	 */
	GenericWizardStepFk : number;

	/**
	 * GenericWizardInstanceFk
	 */
	GenericWizardInstanceFk : number;

	/**
	 * FilearchivedocFk
	 */
	FilearchivedocFk : number;

	/**
	 * ContainerUuid
	 */
	ContainerUuid : string;

	/**
	 * Sorting
	 */
	Sorting : number;

	/**
	 * CanInsert
	 */
	CanInsert : boolean;

	/**
	 * IsGrid
	 */
	IsGrid : boolean;

	/**
	 * Remark
	 */
	Remark : string;
}