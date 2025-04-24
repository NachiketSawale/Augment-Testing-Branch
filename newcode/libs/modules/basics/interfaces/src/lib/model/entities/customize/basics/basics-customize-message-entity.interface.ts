/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMessageEntity extends IEntityBase, IEntityIdentification {
	MessageInfo?: IDescriptionInfo;
	ParameterCount: number;
	MessageseverityFk: number;
}
