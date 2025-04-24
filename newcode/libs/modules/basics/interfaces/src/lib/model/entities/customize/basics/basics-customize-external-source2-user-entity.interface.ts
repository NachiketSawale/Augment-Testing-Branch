/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeExternalSource2UserEntity extends IEntityBase, IEntityIdentification {
	ExternalsourceFk: number;
	UserFk: number;
	Username: string;
	Password: number;
	CommentText: string;
	EncryptiontypeFk: number;
}
