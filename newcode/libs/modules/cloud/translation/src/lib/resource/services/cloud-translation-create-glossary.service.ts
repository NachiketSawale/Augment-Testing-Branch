/*
 * Copyright(c) RIB Software GmbH
 */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { IAssignmentConfigResponse, INewGlossaryConfigResponse, INormalizationConfigResponse } from '../model/cloud-translation-resource-mutistep.interface';
import { IResourceEntity } from '../model/entities/resource-entity.interface';

/**
 * Cloud Translation Resource Create Glossary Service
 */
@Injectable({
	providedIn: 'root',
})
export class CloudTranslationResourceCreateGlossaryService {
	/**
	 * inject HttpClient
	 */
	private readonly http = inject(HttpClient);

	/**
	 * inject PlatformConfigurationService
	 */
	private configService = inject(PlatformConfigurationService);

	/**
	 * get the Glossary list
	 *
	 * @param {{ ResourceId: string | number }} payload resource item id
	 * @returns {Observable<IResourceEntity[]>} return the observable of array of IResourceEntity
	 */
	public getGlossaryList(payload: { ResourceId: string | number }): Observable<IResourceEntity[]> {
		return this.http.post<IResourceEntity[]>(this.configService.webApiBaseUrl + 'cloud/Translation/resource/glossary/find', payload);
	}

	/**
	 * get Referencing Resources ids
	 *
	 * @param {IResourceEntity} resource selcted item
	 * @returns {Observable<{ children: number[] }>} return the observable of childer item ids
	 */
	public getReferencingResources(resource: IResourceEntity): Observable<{ children: number[] }> {
		return this.http.post<{ children: number[] }>(this.configService.webApiBaseUrl + 'cloud/Translation/resource/glossary/children', { ResourceId: resource.Id });
	}

	/**
	 * call the removeGlossary api call
	 *
	 * @param {number} resourceId selected item id
	 */
	public removeGlossary(resourceId: number) {
		return this.http.post(this.configService.webApiBaseUrl + 'cloud/Translation/resource/glossary/remove', { ResourceId: resourceId });
	}

	/**
	 * Get Normalize Create api call
	 *
	 * @return { Observable<INewGlossaryConfigResponse>} return the Observable of INewGlossaryConfigResponse
	 */
	public getNormalizeCreate(): Observable<INewGlossaryConfigResponse> {
		return this.http.get<INewGlossaryConfigResponse>(this.configService.webApiBaseUrl + 'cloud/Translation/resource/glossary/normalizecreate');
	}

	/**
	 * Get Normalize Assignment api call data
	 *
	 * @returns {Observable<IAssignmentConfigResponse>} return the Observable of IAssignmentConfigResponse
	 */
	public getNormalizeAssignment(): Observable<IAssignmentConfigResponse> {
		return this.http.get<IAssignmentConfigResponse>(this.configService.webApiBaseUrl + 'cloud/Translation/resource/glossary/normalizeassignment');
	}

	/**
	 * Get Normalize New api call data
	 *
	 * @param {number[]} resourceId selected item ids
	 * @returns {Observable<INormalizationConfigResponse>} return the Observable of INormalizationConfigResponse
	 */
	public getNormalizeNew(resourceId: number[]): Observable<INormalizationConfigResponse> {
		const payload = { excludeIds: resourceId };
		return this.http.post<INormalizationConfigResponse>(this.configService.webApiBaseUrl + 'cloud/Translation/resource/glossary/normalizenew', payload);
	}
}
