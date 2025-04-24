/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IEstLineItemEntity, IPlant2EstimateEntity, IPrj2EstPltLookupData } from '@libs/estimate/interfaces';
import { PlatformConfigurationService } from '@libs/platform/common';
import { Observable } from 'rxjs';
interface SearchResponse {
	dtos: IEstLineItemEntity[];
}
@Injectable({
	providedIn: 'root'
})
export class EstimateMainPlantAssemblyTemplateGroupService {

	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	protected queryPath = this.configurationService.webApiBaseUrl + 'project/plantassembly/getplantassemblygrouplist';
	private assemblyTemplateCache: { [key: number]: IPlant2EstimateEntity[] } = {};

	public getListByprojectId(projectId: number, lgmJobFk: number | null, refresh: boolean = false): Observable<IPlant2EstimateEntity[]> {
		return new Observable((observer) => {
			// Checks cache first unless a refresh is requested.
			if (this.assemblyTemplateCache[projectId] && !refresh) {
				observer.next(this.assemblyTemplateCache[projectId]);
				observer.complete();
			} else {
				// Prepares the request data.
				const data: IPrj2EstPltLookupData = {
					ProjectId: projectId,
					LgmJobFk: lgmJobFk
				};
				// Makes an HTTP POST request to fetch assembly categories.
				this.http.post<IPlant2EstimateEntity[]>(this.queryPath, data).subscribe({
					next: (res) => {
						// Updates the cache with the new data.
						this.assemblyTemplateCache[projectId] = res;
						observer.next(res);
						observer.complete();
					},
					error: (err) => {
						// Propagates any errors.
						observer.error(err);
					},
				});
			}
		});
	}

	public search(ProjectId: number, LgmJobFk: number | null, filter: string, filterByCatStructure: string, itemsPerPage: number): Observable<IEstLineItemEntity[]> {
		// Create searchInfo object and copy parameters
		const searchInfo = {
			ProjectId: ProjectId,
			LgmJobFk: LgmJobFk,
			Filter: filter,
			FilterByCatStructure: filterByCatStructure,
			ItemsPerPage: itemsPerPage
		};

		return new Observable((observer) => {
			this.http.post<SearchResponse>(this.configurationService.webApiBaseUrl + 'estimate/assemblies/getplantassemblysearchlist', searchInfo).subscribe((res: SearchResponse) => {
				const dtos = res.dtos;
				observer.next(dtos);
				observer.complete();
			});
		});
	}
}
