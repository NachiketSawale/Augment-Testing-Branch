/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';
import { IFileInfo } from '@libs/basics/shared';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';

/**
 * Create for uploaded files request.
 */
export interface ICreateForUploadFileRequest {
	/**
	 * Identification data.
	 */
	IdentData: IEntityIdentification;
	/**
	 * Extract zip or not.
	 */
	ExtractZipOrNot: boolean;
	/**
	 * Uploaded files.
	 */
	UploadedFileDataList: IUploadedFileInfo[];
	/**
	 * Document section type.
	 */
	SectionType: string;
}

/**
 * Check uploaded files already exist or not request.
 */
export interface ICheckDuplicateForUploadFileRequest {
	/**
	 * Identification data.
	 */
	IdentData: IEntityIdentification;
	/**
	 * Extract zip or not.
	 */
	ExtractZipOrNot: boolean;
	/**
	 * Uploaded files.
	 */
	UploadedFileDataList: IUploadedFileInfo[];
}

/**
 * Uploaded file info.
 */
export interface IUploadedFileInfo extends IFileInfo {
	/**
	 * Last modified.
	 */
	LastModified?: string | null;
	/**
	 * Is exist.
	 */
	IsExist?: boolean;
}

/**
 * Create for uploaded file response.
 */
export interface ICreateForUploadFileResponse<T extends IDocumentBaseEntity> {
	/**
	 * Invalid files names.
	 */
	InvalidFileList: string[];
	/**
	 * Document entities created.
	 */
	Documents?: T[];
	/**
	 * Options.
	 */
	Options?: ICreateForUploadFileOptions;
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
