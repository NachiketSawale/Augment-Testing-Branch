/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IMaterialGroupLookupEntity } from '@libs/basics/interfaces';
import { PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PpsMaterialGroupHelperService {

	private http = inject(HttpClient);
	private configurationService = inject(PlatformConfigurationService);

	private _flatMdcGroups: IMaterialGroupLookupEntity[] = [];
	public get flatMdcGroups(): IMaterialGroupLookupEntity[] {
		return this._flatMdcGroups;
	}

	public async loadMaterialGroups() {
		const res = await firstValueFrom(this.http.get(this.configurationService.webApiBaseUrl + 'basics/materialcatalog/group/pps/grouptree'));
		const mdcGroups = res as IMaterialGroupLookupEntity[];
		this.flatten(mdcGroups, this._flatMdcGroups);
	}

	// public loadMaterialGroups() {
	// 	return this.http.get(this.configurationService.webApiBaseUrl + 'basics/materialcatalog/group/pps/grouptree').subscribe(
	// 		(res) => {
	// 			const mdcGroups = res as IMaterialGroupLookupEntity[];
	// 			this.flatten(mdcGroups, this._flatMdcGroups);
	// 		});
	// }

	public flatten(input: IMaterialGroupLookupEntity[], output: IMaterialGroupLookupEntity[]) {
		input.forEach(entity => {
			output.push(entity);
			if (entity.ChildItems && entity.ChildItems.length > 0) {
				this.flatten(entity.ChildItems, output);
			}
		});
	}

}