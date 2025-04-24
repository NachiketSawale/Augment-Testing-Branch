/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectDocumentStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	IsReadOnly: boolean;
	Isinternalonly: boolean;
	Isvirtual: boolean;
	IsLive: boolean;
	RubricCategoryFk: number;
	AccessrightDescriptorFk: number;
	Code: string;
	IsDefaultNewRevision: boolean;
	IsDefaultDeleteRevision: boolean;
}
