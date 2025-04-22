/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {UiCommonMessageBoxService} from '@libs/ui/common';
import {lastValueFrom} from 'rxjs';
import {BasicsShareFileDownloadService} from '@libs/basics/shared';
import {IEntitySelection} from '@libs/platform/data-access';
import {IContactEntity, IPrepareDownloadResponse} from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ExportVcfFileService {

	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private messageBoxService = inject(UiCommonMessageBoxService);
	protected fileDownLoadService = inject(BasicsShareFileDownloadService);

	public async exportVCF(dataService: IEntitySelection<IContactEntity>) {
		const currentItem = dataService.getSelection()[0];
		if (currentItem) {
			const response = await lastValueFrom(this.http.post<IPrepareDownloadResponse>(this.configService.webApiBaseUrl + 'businesspartner/contact/preparedownload?id=' + (currentItem.Id || ''), null));
			if (response) {
				if (response.Success && response.FileName) {
					this.fileDownLoadService.download([], [], response.FileName, response.Path);
				}
			}
		} else {
			this.messageBoxService.showMsgBox('businesspartner.contact.selectAContact', 'cloud.common.informationDialogHeader', 'ico-info');
		}
	}
}