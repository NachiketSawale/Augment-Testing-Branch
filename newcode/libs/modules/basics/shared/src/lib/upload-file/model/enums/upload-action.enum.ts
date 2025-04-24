/*
 * Copyright(c) RIB Software GmbH
 */
/**
 *  the difference upload action has difference upload logic in backend
 */
export enum BasicsUploadAction {
	/**
	 * Upload.
	 * This is the default action.
	 */
	Upload = 'Upload',
	/**
	 * Upload and compress.
	 */
	UploadWithCompress = 'UploadWithCompress',
}
