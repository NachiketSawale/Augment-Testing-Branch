/*
 * Copyright(c) RIB Software GmbH
 */

import {
	inject,
	Injectable
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { PlatformConfigurationService } from '@libs/platform/common';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IModelAdministrationRootEntity,
	IModelAdministrationCompleteEntity,
	ModelAdministrationRootDataService
} from '../../root-info.model';
import { IPropertyKeyComparisonExclusionEntity } from '../model/entities/property-key-comparison-exclusion-entity.interface';

/**
 * The data service for the property key (attribute) entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyComparisonExclusionDataService
	extends DataServiceFlatLeaf<IPropertyKeyComparisonExclusionEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/administration/blacklist',
			readInfo: {
				endPoint: 'list'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPropertyKeyComparisonExclusionEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'ModelComparePropertykeyBlackList',
				parent: inject(ModelAdministrationRootDataService)
			}
		});
	}

	private readonly httpClient = inject(HttpClient);

	private readonly configSvc = inject(PlatformConfigurationService);

	/**
	 * Inserts all property keys having at least one out of a set of tags.
	 *
	 * @param tagIds The tag IDs.
	 * @param projectId An optional project ID, if the property key should just be added for a given project.
	 *
	 * @returns A promise that is resolved to the number of added records.
	 */
	public async addByTags(tagIds: number[], projectId?: number): Promise<number> {
		const response = lastValueFrom(await this.httpClient.post<{
			NewEntriesCount: number
		}>(`${this.configSvc.webApiBaseUrl}model/administration/blacklist/addByTags`, {
			PropertyKeyTagIds: tagIds,
			ProjectId: projectId
		}));

		return (await response).NewEntriesCount;
	}
}