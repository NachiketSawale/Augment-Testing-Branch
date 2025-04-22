/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

/**
 * File download service to handle file downloads in the browser.
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonDialogFileDownloadService {
	/**
	 * Triggers the download of a file by creating a Blob from the provided data and simulating a click on an anchor element.
	 * This method creates a temporary object URL for the Blob and uses an anchor element
	 * with the `download` attribute to initiate the download. The object URL is revoked
	 * immediately after the download is triggered to free up resources.
	 *
	 * @typeParam TData - The type of the data to be downloaded, extending `BlobPart`.
	 * 
	 * @param data - The content of the file to be downloaded.
	 * @param filename - The name of the file to be downloaded. Defaults to 'download.json'.
	 * @param type - The MIME type of the file. Defaults to 'text/json'.
	 * 
	 */
	public downloadFile<TData extends BlobPart>(
		data: TData, 
		filename: string = 'download.json', 
		type: string = 'text/json'
	): void {
		const blob = new Blob([data], { type: type });
		const url = window.URL.createObjectURL(blob);
		const aLink = document.createElement('a');

		// Use the `download` attribute for the filename and `href` for the blob URL
		aLink.href = url;
		aLink.download = filename;

		// Programmatically trigger the download by simulating a click
		aLink.click();

		// Clean up and revoke the object URL after download is triggered
		window.URL.revokeObjectURL(url);
	}
}
