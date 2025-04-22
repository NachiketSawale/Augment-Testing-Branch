/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationDocumentEntity } from './evaluation-document-entity.interface';

/**
 * Create for evaluation uploaded file response.
 */
export interface ICreateDocsForUploadFileResult {
	/**
	 * Invalid files names.
	 */
	InvalidFileList: string[];
	/**
	 * Document entities created.
	 */
	Documents: IEvaluationDocumentEntity[];
	/**
	 * Options.
	 */
	Options: ICreateForUploadFileOptions;
}

/**
 * Create for uploaded file options.
 */
export interface ICreateForUploadFileOptions {
	/**
	 * A flag, indicates its parent is saved or not.
	 */
	IsParentNotSaved?: boolean;
}
