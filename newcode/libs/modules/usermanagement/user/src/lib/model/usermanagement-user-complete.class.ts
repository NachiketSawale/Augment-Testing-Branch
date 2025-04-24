/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IUserEntity } from '@libs/usermanagement/interfaces';

export class UsermanagementUserComplete implements CompleteIdentification<IUserEntity>{

	public MainItemId: number = 0;

	public User: IUserEntity | null = null;
}
