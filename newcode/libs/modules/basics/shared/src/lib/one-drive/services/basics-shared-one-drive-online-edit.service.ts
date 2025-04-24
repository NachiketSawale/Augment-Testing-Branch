/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IOneDriveSynchronizeResponseEntity } from './interfaces/one-drive-synchronize-response-entity.interface';
import { IOneDriveShareLinkResponseEntity } from './interfaces/one-drive-share-link-response-entity.interface';


/**
 * OneDrive management service.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedOneDriveOnlineEditService {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	private webApiBaseUrl: string = this.configService.webApiBaseUrl;

	private enableOnlineEdit?: boolean = false;
	private getOnlineEditEnableOptionPromise?: Promise<boolean>;

	public async getOnlineEditEnableOption() {
		if (this.getOnlineEditEnableOptionPromise) {
			return this.getOnlineEditEnableOptionPromise;
		}
		try {
			const systemOptionUrl = this.webApiBaseUrl + 'basics/common/systemoption/enableonlineedit';
			const promise = firstValueFrom(this.http.get<boolean>(systemOptionUrl));
			this.getOnlineEditEnableOptionPromise = promise.then();
			this.enableOnlineEdit = await promise;
			return this.enableOnlineEdit;
		} catch (error) {
			console.error('Error while getting enable online edit option: ' + error);
			return false;
		}
	}

	public onlineEditOfficeDocument(fileArchiveDocId: number) {
		const getUrl = this.webApiBaseUrl + 'onedrive/getsharelink?fileArchiveDocId=' + fileArchiveDocId;
		this.http.get<IOneDriveShareLinkResponseEntity>(getUrl).subscribe(
			{
				next: (res) => {
					if (res.CanOnlineEdit && res.ShareLink) {
						window.open(res.ShareLink, '_blank');
					} else {
						this.messageBoxService.showMsgBox('Failed to retrieve OneDrive share link.', 'cloud.desktop.oneDrive.title', 'ico-error');
					}
				},
				error: (error) => {
					console.error('Error while opening document to online edit: ' + error);
				}
			}
		);
	}

	public async synchronizeOfficeDocument(fileArchiveDocId: number): Promise<IOneDriveSynchronizeResponseEntity | null> {
		try {
			const getUrl = this.webApiBaseUrl + 'onedrive/synchronize?fileArchiveDocId=' + fileArchiveDocId;
			return await firstValueFrom(this.http.get<IOneDriveSynchronizeResponseEntity>(getUrl));
		} catch (error) {
			console.error('Error while synchronizing document: ' + error);
			return null;
		}
	}


}