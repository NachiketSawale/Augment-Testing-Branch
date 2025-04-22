/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, lastValueFrom } from 'rxjs';

import { PlatformConfigurationService, PlatformModuleManagerService } from '@libs/platform/common';

import { IWizard } from '@libs/platform/common';
import { ISidebarWizard } from '../model/interfaces/wizard/sidebar-wizard.interface';
import { ISidebarWizardItem } from '../model/interfaces/wizard/sidebar-wizard-item.interface';
import { ISidebarWizardComplete } from '../model/interfaces/wizard/sidebar-wizard-complete.interface';

/**
 * Provides the filtered response of wizards data received.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarWizardsService {
	/**
	 * All wizards registered in the system
	 */
	public wizardList: IWizard[] = [];

	/**
	 * Service performing http requests.
	 */
	private http = inject(HttpClient);

	/**
	 * Module manager service holding module data.
	 */
	private platformModuleManagerService = inject(PlatformModuleManagerService);

	private configurationService = inject(PlatformConfigurationService);

	/**
	 * This function fetches the wizards data from APi and fetches all wizards registered in
	 * the system then returns the filtered APi response depending upon the UUID's present in
	 * the wizards registered in the system.
	 *
	 * @returns {Observable<ISidebarWizard[]>} Filtered APi response
	 */
	public loadWizards$(): Observable<ISidebarWizard[]> {
		const moduleName = <string>this.platformModuleManagerService.activeModule?.internalModuleName;
		const params = new HttpParams().set('module', moduleName);
		return this.http.get<ISidebarWizard[]>(this.configurationService.webApiBaseUrl + 'basics/config/sidebar/load', {params: params}).pipe(
			map((response) => {
				this.wizardList = this.platformModuleManagerService.listWizards();
				const filteredData = this.getFilteredResponse(response);
				return filteredData;
			})
		);
	}

	/**
	 * Returns the customized wizard parameter with their values for a given wizard2Groupitem
	 *
	 * @param wizard2GroupId
	 */
	public loadWizardComplete(wizard2GroupId: number): Promise<ISidebarWizardComplete[]> {
		return lastValueFrom(this.http.get<ISidebarWizardComplete[]>(this.configurationService.webApiBaseUrl + 'basics/config/wizard/listWizardsCompleteByWizard2GroupId', {params: {wizard2GroupId: wizard2GroupId}}));
	}

	/**
	 * This function filters the response of the APi based on the wizardGuid's from APi
	 * and the UUID's from wizards registered in the system.
	 *
	 * @param {ISidebarWizard[]} response Response from 'sidebar/load' api.
	 * @returns {ISidebarWizard[]} Filtered response.
	 */
	private getFilteredResponse(response: ISidebarWizard[]): ISidebarWizard[] {
		response.forEach((wizardGroup) => {
			wizardGroup.wizards = wizardGroup.wizards.reduce((result: ISidebarWizardItem[], wizard) => {
				wizard.wizardGuid = wizard.wizardGuid.toLowerCase();

				if (this.wizardList.find(item => {
					if (item.uuid === wizard.wizardGuid) {
						return true;
					} else if (item.uuid.toLowerCase() === wizard.wizardGuid) {
						console.error('wizard-sidebar: please provide a lowercase uuid for wizard:', item);
						return true;
					}
					return false;
				})) {
					result.push(wizard);
				}
				return result;
			}, []);
		});

		return response.reduce((result: ISidebarWizard[], wizardGroup) => {
			if(wizardGroup.wizards.length > 0) {
				result.push(wizardGroup);
			}

			return result;
		}, []);
	}
}
