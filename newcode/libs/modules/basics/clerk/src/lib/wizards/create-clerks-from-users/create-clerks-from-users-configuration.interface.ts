/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsClerkOutUserVEntity } from '@libs/basics/interfaces';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';

export interface ICreateClerksFromUsersConfiguration {
	selection: IBasicsClerkOutUserVEntity[];
	result: IBasicsClerkEntity[];
}