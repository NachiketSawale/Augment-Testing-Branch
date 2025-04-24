/*
 * Copyright(c) RIB Software GmbH
 */

import { assign } from 'lodash';
import { inject, Injectable } from '@angular/core';

import { IDialog } from '../model/interfaces/dialog.interface';
import { UiCommonDialogFileDownloadService } from './dialog-file-download.service';
import { IDialogButtonBase } from '../model/interfaces/dialog-button-base.interface';
import { IDialogButtonEventInfo } from '../model/interfaces/dialog-button-event-info.interface';
import { IDialogFileDownloadButtonData } from '../model/interfaces/dialog-file-download-button-data.interface';

/**
 * Download button utility service for dialogs.
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonDialogDownloadButtonUtilityService {
    /**
     * File download service to handle file downloads in the browser.
     */
	private readonly fileDownloadSvc = inject(UiCommonDialogFileDownloadService);

    /**
     * Creates a download button configuration for a dialog, allowing users to download a file
     * generated from the dialog's data.
     *
     * @typeParam TData - The type of the data to be downloaded, extending `BlobPart`.
     * @typeParam TSrcDialog - The type of the source dialog implementing `IDialog<TDetails>`.
     * @typeParam TDetails - The type of the dialog details (optional).
     *
     * @param content - An object containing the data and metadata for the file to be downloaded.
     * @param process - A callback function to handle additional processing after the file is downloaded.
     *                  It receives the dialog event info and a message key as arguments.
     * @param config - Optional additional configuration for the button, which will be merged with the default configuration.
     *
     * @returns A button configuration object that can be used in a dialog.
     */
	public createDownloadButton<TData extends BlobPart, TSrcDialog extends IDialog<TDetails>, TDetails = void>(
		content: IDialogFileDownloadButtonData<TData, TSrcDialog, TDetails>,
		process: (info: IDialogButtonEventInfo<TSrcDialog, TDetails>, msgKey: string) => void,
		config?: Omit<IDialogButtonBase<TSrcDialog, TDetails>, 'id'>,
	): IDialogButtonBase<TSrcDialog, TDetails> {
		const button = {
			id: 'downloadClipboard',
			caption: 'cloud.common.DownloadErrorFile',
			isVisible: (info: IDialogButtonEventInfo<TSrcDialog, TDetails>) => {
				return true;
			},
			fn: ($event: MouseEvent, info: IDialogButtonEventInfo<TSrcDialog, TDetails>) => {
				const data = content.dataContent(info);
				this.fileDownloadSvc.downloadFile<TData>(data, content.name, content.type);
				process(info, 'cloud.common.DownloadClipboardSucess');
			},
		};

		return config ? assign(button, config) : button;
	}
}
