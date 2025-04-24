/*
 * Copyright (c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { LazyInjectionToken } from '@libs/platform/common';
import { ISimpleFileUploadConfig } from './simple-file-upload-config.interface';

/**
 * Provides an easy-to-use interface to upload files of arbitrary size to the server.
 * Check out the full documentation of the Simple Upload Framework on the wiki.
 */
export interface ISimpleUploadService {

	/**
	 * This function uploads a file to the back-end, using a chunked upload according to
	 * a configuration object.
	 *
	 * @typeParam T The expected result type.
	 *
	 * @param file file object A reference to the file to upload.
	 * @param config The configuration for the upload process.
	 * @returns An observable that returns the result of the operation.
	 */
	uploadFile<T>(file: File, config: ISimpleFileUploadConfig): Observable<T>;
}

/**
 * The lazy injection token for the simple upload service.
 */
export const SIMPLE_UPLOAD_SERVICE_TOKEN = new LazyInjectionToken<ISimpleUploadService>('basics.common.SimpleUploadService');
