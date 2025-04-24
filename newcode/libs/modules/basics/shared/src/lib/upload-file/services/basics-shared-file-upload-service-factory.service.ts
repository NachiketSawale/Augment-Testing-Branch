/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector, runInInjectionContext } from '@angular/core';
import { IFileUploadServiceInitOptions } from '../model/interfaces/file-upload-service-options.interace';
import { BasicsSharedFileUploadService } from './basics-shared-file-upload.service';
import { BasicsUploadServiceKey } from '../model/enums/upload-service-key.enum';

export class BasicsSharedFileUploadServiceFactory {
	private static serviceCache = new Map<BasicsUploadServiceKey, BasicsSharedFileUploadService>();

	public static getService(injector: Injector, options: IFileUploadServiceInitOptions) {
		const cacheName = options.uploadServiceKey;
		if (!this.getServiceFromCache(cacheName)) {
			const instance = runInInjectionContext(injector, () => new BasicsSharedFileUploadService());
			this.serviceCache.set(cacheName, instance);
		}
		return this.getServiceFromCache(cacheName);
	}

	private static getServiceFromCache(uploadServiceKey: BasicsUploadServiceKey) {
		return this.serviceCache.get(uploadServiceKey);
	}

	public static removeService(uploadServiceKey: BasicsUploadServiceKey) {
		return this.serviceCache.delete(uploadServiceKey);
	}
}
