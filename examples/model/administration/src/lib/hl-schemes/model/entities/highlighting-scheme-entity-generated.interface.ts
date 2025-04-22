/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IHighlightingSchemeEntityGenerated extends IEntityBase {

	readonly Id: number;

	CompanyFk?: number;

	DescriptionInfo?: IDescriptionInfo;

	BackgroundColor?: number;

	SelectionColor?: number;

	IsDynamic: boolean;
}
