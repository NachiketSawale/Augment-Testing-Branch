import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { IExcelProfile } from '../models/interfaces/excel-profile.interface';
import { map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class BasicsExportFormatService {
	private configService = inject(PlatformConfigurationService);
	private http = inject(PlatformHttpService);

	private validExcelProfileContexts: string[] = [];

	public addValidExcelProfileContexts(validExcelProfileContextsParam?: string[]) {
		this.validExcelProfileContexts = ['General'];
		if (validExcelProfileContextsParam) {
			this.validExcelProfileContexts = this.validExcelProfileContexts.concat(validExcelProfileContextsParam);
		}
	}

	public loadExcelProfiles() {
		return this.http.get$<IExcelProfile[]>('basics/common/excelprofile/profiles').pipe(
			map((response) => {
				if (response) {
					response = response.filter((excelProfile) => {
						return excelProfile.IsLive && this.validExcelProfileContexts.includes(excelProfile.ProfileContext);
					});
				} else {
					response = [];
				}
				return response;
			}),
		);
	}
}
