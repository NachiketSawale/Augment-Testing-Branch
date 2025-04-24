/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsSharedUniqueFieldProfileService } from '../services/basics-unique-field-serivce.interface';

/**
 * Unique Field Option
 */
export interface IUniqueFieldOption {
	identityName: string;
	dynamicUniqueFieldService: IBasicsSharedUniqueFieldProfileService;
}


/**
 * Unique Field dto.
 */
export interface IUniqueFieldDto {
	id: number;
	isSelect: boolean;
	fieldName: string;
	model: string;
}

