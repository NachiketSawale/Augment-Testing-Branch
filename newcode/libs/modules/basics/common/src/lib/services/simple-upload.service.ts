/*
 * Copyright (c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { map, range } from 'lodash';
import { Observable } from 'rxjs';
import { LazyInjectable, PlatformHttpService } from '@libs/platform/common';
import { ISimpleFileUploadConfig, ISimpleUploadService, SIMPLE_UPLOAD_SERVICE_TOKEN } from '@libs/basics/interfaces';
import { IChunkIndex } from '../models/chunk-index.interface';

/**
 * Provides an easy-to-use interface to upload files of arbitrary size to the server.
 * Check out the full documentation of the Simple Upload Framework on the wiki.
 */
@LazyInjectable({
	token: SIMPLE_UPLOAD_SERVICE_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root',
})
export class SimpleUploadService implements ISimpleUploadService {

	private readonly platformHttpService = inject(PlatformHttpService);

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
	public uploadFile<T>(file: File, config: ISimpleFileUploadConfig): Observable<T> {
		const effectiveConfig: ISimpleFileUploadConfig =
			{
				chunkSize: 1024 * 1024 * 5,
				customRequest: null,
				concurrentUploadCount: 5,
				...(config ?? {})
			};

		const observerObj = new Observable<T>((observer) => {
			this.beginUploadApiCall(effectiveConfig).subscribe((responseData: string) => {
				const uploadUuid: string = responseData;
				this.prepareFileToByte<T>(file, effectiveConfig, uploadUuid).subscribe((data: T) => {
					observer.next(data);
				});
			});
		});
		return observerObj;
	}

	/**
	 * This function responsible for beginUpload api call and get uploadUuid from server .
	 *
	 * @param effectiveConfig this object have  required think like base path or model id .
	 * @returns} this function is return unique ID (unique ID)  as string when beginUpload api call successfully
	 */
	private beginUploadApiCall(effectiveConfig: ISimpleFileUploadConfig): Observable<string> {
		return this.platformHttpService.post$<string>(effectiveConfig.basePath + 'beginupload', effectiveConfig.customRequest, {responseType: 'text' as 'json'});
	}

	/**
	 * This function responsible for the object is prepare convert  File To Byte.
	 *
	 * @param file this is File Object when Get From Inpute Type File DOM.
	 * @param effectiveConfig this object have  required think like base path or model id .
	 * @param uploadUuid this String is uploadUuid get from server.
	 * @returns this Observable return IFileUploadServerSideResponse object
	 */
	private prepareFileToByte<T>(file: File, effectiveConfig: ISimpleFileUploadConfig, uploadUuid: string): Observable<T> {
		let chunkCount: number;
		let chunks: IChunkIndex[] = [];

		const observerObj = new Observable<T>((observer) => {
			file.arrayBuffer().then(async (buffer: ArrayBuffer) => {
				chunkCount = buffer.byteLength / Number(effectiveConfig.chunkSize) + (buffer.byteLength % Number(effectiveConfig.chunkSize) > 0 ? 1 : 0);

				chunks = map(range(0, chunkCount), (str: number) => this.prepareGenerateSlice(str, buffer, effectiveConfig));

				this.startUploadChunks(chunks, buffer, effectiveConfig, uploadUuid).then((data) => {
					this.endUploadApiCall<T>(uploadUuid, effectiveConfig).subscribe((data: T) => {
						observer.next(data);
					});
				});
			});
		});
		return observerObj;
	}

	/**
	 * This function responsible for genrate or prepare the IChunkIndex object.
	 *
	 * @param chunkIndex this is Array Index Number.
	 * @param buffer this object have  File Buffer Data.
	 * @param effectiveConfig this object have  required think like base path or model id .
	 * @returns} this function return IChunkIndex object
	 */
	private prepareGenerateSlice(chunkIndex: number, buffer: ArrayBuffer, effectiveConfig: ISimpleFileUploadConfig): IChunkIndex {
		const startIndex = chunkIndex * Number(effectiveConfig.chunkSize);
		return {
			chunkIndex: chunkIndex,
			startIndex: startIndex,
			endIndex: Math.min(startIndex + Number(effectiveConfig.chunkSize), buffer.byteLength),
		};
	}

	/**
	 * This function responsible for start upload chunks and  return Promise
	 *
	 * @param chunks this is array of IChunkIndex object.
	 * @param buffer this object have  File Buffer Data.
	 * @param effectiveConfig this object have  required think like base path or model id .
	 * @param uploadUuid this String is uploadUuid get from server.
	 * @returns this Promise return string value is done, when  recursion function excution end time
	 */
	private startUploadChunks(chunks: IChunkIndex[], buffer: ArrayBuffer, effectiveConfig: ISimpleFileUploadConfig, uploadUuid: string): Promise<string> {
		return new Promise((resolve) => {
			map(
				range(0, effectiveConfig.concurrentUploadCount),
				this.uploadChunks(chunks, buffer, effectiveConfig, uploadUuid).then((data) => {
					resolve(data);
				}),
			);
		});
	}

	/**
	 * This function responsible for return Promise.the function recursion call means multiple api call upto end of array then pass done in promise.
	 *
	 * @param chunks this is array of IChunkIndex object.
	 * @param buffer this object have  File Buffer Data.
	 * @param effectiveConfig this object have  required think like base path or model id .
	 * @param uploadUuid this String is uploadUuid get from server.
	 * @returns this Promise return string value is done, when  recursion function excution end time
	 */
	private uploadChunks(chunks: IChunkIndex[], buffer: ArrayBuffer, effectiveConfig: ISimpleFileUploadConfig, uploadUuid: string): Promise<string> {
		return new Promise((resolve) => {
			const chunk = chunks.shift();
			if (chunk) {
				const slice = buffer.slice(chunk.startIndex, chunk.endIndex);

				const binarySlice = new Uint8Array(slice);

				this.uploadNextChunk(chunk, effectiveConfig, uploadUuid, binarySlice).subscribe((data) => {
					return resolve(this.uploadChunks(chunks, buffer, effectiveConfig, uploadUuid));
				});
			} else {
				return resolve('done');
			}
		});
	}

	/**
	 * This function responsible for the upload api call.
	 *
	 * @param chunks this is array of IChunkIndex object.
	 * @param binarySlice this object have  Uint8Array binary  Data.
	 * @param effectiveConfig this object have  required think like base path or model id .
	 * @param uploadUuid this String is uploadUuid get from server.
	 * @returns this Observable return void .
	 */
	private uploadNextChunk(chunk: IChunkIndex, effectiveConfig: ISimpleFileUploadConfig, uploadUuid: string, binarySlice: Uint8Array): Observable<void> {
		const buffer: ArrayBuffer = binarySlice.buffer;

		return this.platformHttpService.post$<void>(effectiveConfig.basePath + `upload/${uploadUuid}/${chunk.chunkIndex}`, buffer);
	}

	/**
	 * This function responsible for the endupload api call.
	 *
	 * @param effectiveConfig this object have  required think like base path or model id .
	 * @param uploadUuid this String is uploadUuid get from server.
	 * @returns this Observable return IFileUploadServerSideResponse object
	 */
	private endUploadApiCall<T>(uploadUuid: string, effectiveConfig: ISimpleFileUploadConfig): Observable<T> {
		return this.platformHttpService.post$<T>(effectiveConfig.basePath + `endupload/${uploadUuid}`, {});
	}
}
