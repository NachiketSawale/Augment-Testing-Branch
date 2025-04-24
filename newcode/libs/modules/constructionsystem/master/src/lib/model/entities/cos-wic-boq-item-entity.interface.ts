/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICosWicBoqItemEntity extends IEntityBase {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * Reference
	 */
	Reference: string;

	/**
	 * BriefInfo
	 */
	BriefInfo: IDescriptionInfo; // todo: DescriptionTranslateTypeDto

	/**
	 * BoqHeaderFk
	 */
	BoqHeaderFk: number;
}
