/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IBasicsCustomizeSiteEntity, IBasicsCustomizeSiteTypeEntity } from '@libs/basics/interfaces';
import { PlatformConfigurationService } from '@libs/platform/common';
import { get } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SiteTypeHelperService {

	private http = inject(HttpClient);
	private configurationService = inject(PlatformConfigurationService);

	private _siteTypes: IBasicsCustomizeSiteTypeEntity[] = [];
	public get siteTypes(): IBasicsCustomizeSiteTypeEntity[] {
		return this._siteTypes;
	}

	public async loadSiteTypes() {
		const res = await firstValueFrom(this.http.get(this.configurationService.webApiBaseUrl + 'basics/lookupdata/master/getlist?lookup=sitetype'));
		this._siteTypes = res as IBasicsCustomizeSiteTypeEntity[];
	}

	// public loadSiteTypes() {
	// 	return this.http.get(this.configurationService.webApiBaseUrl + 'basics/lookupdata/master/getlist?lookup=sitetype').subscribe(
	// 		(res) => {
	// 			this._siteTypes = res as IBasicsCustomizeSiteTypeEntity[];
	// 		});
	// }

	private flattenSite(input: IBasicsCustomizeSiteEntity[], output: IBasicsCustomizeSiteEntity[]) {
		input.forEach(entity => {
			output.push(entity);
			if (entity.ChildItems && entity.ChildItems.length > 0) {
				this.flattenSite(entity.ChildItems, output);
			}
		});
	}

	public isFactoryOrIncludeFactory(site: IBasicsCustomizeSiteEntity) {
		const flatList: IBasicsCustomizeSiteEntity[] = [];
		this.flattenSite([site], flatList);

		const result = this._siteTypes.some(t => t.IsFactory
			&& flatList.some(s => get(s, 'SiteTypeFk') === t.Id)
		);
		// if(result === false){
		// 	console.log(site);
		// }
		return result;
	}
}