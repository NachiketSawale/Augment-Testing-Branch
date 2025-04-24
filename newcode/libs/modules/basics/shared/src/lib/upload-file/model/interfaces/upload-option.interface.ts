/*
 * Copyright(c) RIB Software GmbH
 */
export interface IUploadOption {
	/**
	 * The maximum count of uploading files at the same time
	 */
	MaxUploadingFileCount: number;
	/**
	 * The maximum size of a single block. A file can be divided into several small single blocks, only one block is uploaded to the server each time.
	 */
	MaxUploadSingleBlockSize: string;
	/**
	 * If this is true (1), when user upload the document we will check the file size according to the table BAS_DOCUMENT_TYPE.MAX_BYTE. if the current uploading file exceed the limited file size, the upload will be aborted. The validation should be done before the file is uploading.
	 */
	CheckUploadSizeLimitation: boolean;
}
