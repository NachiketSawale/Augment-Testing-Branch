/*
 * Copyright(c) RIB Software GmbH
 */

import { IFileUploadServiceConfigs, IFileUploadServiceInitOptions } from '@libs/basics/shared';

export interface IDocumentServiceUploadOptions extends IFileUploadServiceInitOptions {
	/**
	 * Optional, by default it is 'createforuploadfile'.
	 */
	readonly endPoint?: string;
	/**
	 * Optional, whether check file with the same name already exist. By default, no duplicate check.
	 */
	readonly checkDuplicate?: ICheckDuplicate;
}

/**
 * Options for whether check file with the same name already exist.
 */
export interface ICheckDuplicate {
	/**
	 * Whether perform check on client side, by default it is false.
	 */
	readonly checkClientSide?: boolean;
	/**
	 * Whether perform check on server side. By default, it is false.
	 */
	readonly checkServerSide?: boolean | ICheckDuplicateServerSide;
}

/**
 * Options for performing check on server side
 */
export interface ICheckDuplicateServerSide {
	/**
	 * Optional, by default it is 'checkduplicateforuploadfile'.
	 */
	readonly endPoint?: string;
}

export interface IDocumentUploadServiceOptions {
	/**
	 * Upload configs.
	 */
	configs: IFileUploadServiceConfigs;
	/**
	 * Whether perform check on client side, by default it is false.
	 */
	readonly checkDuplicateClientSide?: boolean;
}
