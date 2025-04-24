/*
 * Copyright(c) RIB Software GmbH
 */


import { IUniqueFieldDto } from './../model/profile-lookup.interface';

export interface IBasicsSharedUniqueFieldProfileService {
	/**
	 * get dynamic unique fields
	 */
	getDynamicUniqueFields(): Promise<IUniqueFieldDto[]>;
}