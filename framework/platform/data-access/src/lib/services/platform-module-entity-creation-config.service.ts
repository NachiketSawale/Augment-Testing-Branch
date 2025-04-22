/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom} from 'rxjs';
import * as _ from 'lodash';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ICreateDynamicFieldsSettings } from '../model/data-service/interface/entity-create-dialog-setting.interface';

/**
 * A service for loading and managing dynamic entity creation configurations from the backend.
 * Provides methods to access entity creation settings based on the module name.
 */
@Injectable({
	providedIn: 'root'
})
export class PlatformModuleEntityCreationConfigService {
	private readonly configurationService = inject(PlatformConfigurationService);
	private data: { [key: string]: ICreateDynamicFieldsSettings } = {};
	protected http = inject(HttpClient);
	private moduleName?: string;
	public setModuleName(modName: string) {
		this.moduleName = modName;
	}

	private getStorageName(): string {
		if (!this.moduleName) {
			throw new Error('Module name is not set.');
		}
		return _.replace(this.moduleName, '.', '_');
	}

	// TODO: clear data after timeout, set timeout for http calls and concurrency guard need to be provided
	public async load(modName: string): Promise<ICreateDynamicFieldsSettings | undefined> {
		this.setModuleName(modName);
		const storeName = this.getStorageName();

		if (this.data[storeName]) {
			return this.data[storeName];
		}
		try {
			const response = await firstValueFrom(this.http.get(this.configurationService.webApiBaseUrl + 'basics/config/entitycreation/load/?module=' + modName)) as ICreateDynamicFieldsSettings ;
			if (response) {
				this.data[storeName] = response;
				return response;
			} else {
				console.warn('No configuration data found for module: ${modName}');
				return ;
			}
		} catch (error) {
			console.error('Failed to load data', error);
			throw error;
		}
	}

	private getModule(): ICreateDynamicFieldsSettings | undefined {
		const storeName = this.getStorageName();
		return this.data[storeName];
	}

	public getEntity(): ICreateDynamicFieldsSettings  | null {
		const configuredModule = this.getModule();

		if (!configuredModule) {
			return null;
		}

		return configuredModule || undefined;
	}
}







