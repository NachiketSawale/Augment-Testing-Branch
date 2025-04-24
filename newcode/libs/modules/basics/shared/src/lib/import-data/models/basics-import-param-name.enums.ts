/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * parameter names used in import.
 */
export enum BasicsSharedImportParamName {
	moduleName = 'moduleName',
	SectionType = 'SectionType',
	action = 'action',
	extractZip = 'extractZip',

	UploadEnableFileArchive = 'Upload:EnableFileArchive',
	UploadKey = 'Upload:Key',

	filename = 'filename',
	file = 'file',
	chunkSize = '_chunkSize',
	totalSize = '_totalSize',
	currentChunkSize = '_currentChunkSize',
	chunkNumber = '_chunkNumber',
}
