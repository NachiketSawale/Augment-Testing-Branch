/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';

interface IViewerSettingsGlobalConfigResponseEntity {
	readonly CanDoServerSideRendering: boolean;
	readonly CanEditGlobal: boolean;
}

/**
 * Stores global configuration for viewer settings.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationViewerSettingsConfigService {

	private readonly configSvc = inject(PlatformConfigurationService);

	private readonly http = inject(HttpClient);

	/**
	 * Initializes the service asynchronously.
	 */
	public async initConfig(): Promise<void> {
		if (this.configRequestPromise) {
			return this.configRequestPromise;
		}

		const promise = firstValueFrom(this.http.get<IViewerSettingsGlobalConfigResponseEntity>(this.configSvc.webApiBaseUrl + 'model/administration/viewersettings/globalconfig'));
		this.configRequestPromise = promise.then();

		this.config = await promise;
	}

	private configRequestPromise?: Promise<void>;

	private config?: IViewerSettingsGlobalConfigResponseEntity;

	/**
	 * Indicates whether the current user can use server-side rendering to display models.
	 */
	public get canDoServerSideRendering(): boolean {
		return Boolean(this.config?.CanDoServerSideRendering);
	}

	/**
	 * Indicates whether the current user is allowed edit the global settings profile.
	 */
	public get canEditGlobal(): boolean {
		return Boolean(this.config?.CanEditGlobal);
	}
}