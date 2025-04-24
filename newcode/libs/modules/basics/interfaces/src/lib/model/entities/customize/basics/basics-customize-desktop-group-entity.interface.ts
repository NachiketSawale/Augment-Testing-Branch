/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDesktopGroupEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
}
