/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICosWicBoqWicCatEntity extends IEntityBase {

	/**
	 * Id
	 */
	Id: number;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;  //TODO: DescriptionTranslateTypeDto
}
