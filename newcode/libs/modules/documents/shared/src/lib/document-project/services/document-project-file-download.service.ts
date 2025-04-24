/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsShareFileDownloadService, IDownloadIdentificationData } from '@libs/basics/shared';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DocumentProjectFileDownloadService extends  BasicsShareFileDownloadService {
	public historyChanged$ = new Subject<number | null>();

	public async downloadDocument(fileArchiveDocIds?: number[], downloadIdentificationData?: IDownloadIdentificationData) {
		const filePaths = await this.documentFilePath(fileArchiveDocIds);
		if (filePaths?.some(f => f.Reason?.length)) {
			await this.showNoFileDialog(filePaths);
			return;
		}
		const data: IDownloadIdentificationData = {
			FileArchiveDocIds: fileArchiveDocIds ?? [],
			DatengutFiles: downloadIdentificationData?.DatengutFiles,
			FileName: downloadIdentificationData?.FileName,
			Path: downloadIdentificationData?.Path,
			projectDocIds: downloadIdentificationData?.projectDocIds,
			operationType: downloadIdentificationData?.operationType
		};
		//prepare the download, Encrypt the parameters
		const result = await this.http.post<string>('documents/project/document/preparedownload', data, {
			responseType: 'text' as 'json'
		});
		this.historyChanged$.next(null);
		if (result) {
			this.postDownload(this.configService.webApiBaseUrl + 'basics/common/document/download', result);
		}
	}
}