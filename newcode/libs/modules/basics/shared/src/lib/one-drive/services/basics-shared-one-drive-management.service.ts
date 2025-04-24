/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';


/**
 * OneDrive management service.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedOneDriveManagementService {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	private webApiBaseUrl: string = this.configService.webApiBaseUrl;
	private enableOneDrive: boolean = false;
	private initSidebarEnableOptionPromise?: Promise<boolean>;

	/**
	 * Show or hide OneDrive in sidebar when initialization.
	 */
	public async initOneDriveButton() {
		await this.initSidebarEnableOption();
		// sidebarService.setOneDriveButtonVisible(this.enableOneDrive); //todo
	}

	private async initSidebarEnableOption() {
		if (this.initSidebarEnableOptionPromise) {
			return this.initSidebarEnableOptionPromise;
		}
		try {
			const systemOptionUrl = this.webApiBaseUrl + 'basics/common/systemoption/isshowonedrivebuttoninsidebar';
			const promise = firstValueFrom(this.http.get<boolean>(systemOptionUrl));
			this.initSidebarEnableOptionPromise = promise.then();
			this.enableOneDrive = await promise;
			return this.enableOneDrive;
		} catch (error) {
			console.error('Error while getting sidebar enable option - show one drive button is sidebar: ' + error);
			return false;
		}
	}


}