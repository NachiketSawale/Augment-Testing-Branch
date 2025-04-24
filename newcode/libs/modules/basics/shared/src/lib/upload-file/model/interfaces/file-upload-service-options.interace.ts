/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsUploadAction } from '../enums/upload-action.enum';
import { BasicsUploadSectionType } from '../enums/upload-section-type.enum';
import { BasicsUploadServiceKey } from '../enums/upload-service-key.enum';

export interface IFileUploadServiceConfigs {
	/**
	 *  upload section type
	 */
	readonly sectionType: BasicsUploadSectionType;
	/**
	 *  upload action.
	 */
	readonly action?: BasicsUploadAction;
}

export interface IFileUploadServiceInitOptions {
	/**
	 * key to identify upload service. Please make sure it is unique.
	 */
	uploadServiceKey: BasicsUploadServiceKey;
	/**
	 * Upload configs.
	 */
	configs: IFileUploadServiceConfigs;
}
