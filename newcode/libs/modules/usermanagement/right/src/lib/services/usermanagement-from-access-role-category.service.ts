/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PlatformConfigurationService } from '@libs/platform/common';
import { EntityRuntimeData } from '@libs/platform/data-access';

import { FieldType, IFormConfig } from '@libs/ui/common';

import { IAccessRoleCategory, IAccessRoleCategoryEntity, IAccessRoleCategoryEntry, IUpdateCategoryBulk } from '../roles/model/entities/role-category.interface';

/**
 * This service used for get the from access role category list
 */
@Injectable({
	providedIn: 'root',
})
export class UsermanagementFromAccessRoleCategoryService {
	/**
	 * inject HttpClient
	 */

	private http = inject(HttpClient);
	/**
	 * Inject PlatformConfigurationService
	 */
	private configService = inject(PlatformConfigurationService);
	/**
	 * This function is used for call the access category list
	 *
	 * @returns {Observable<IAccessRoleCategory[]>}
	 */
	public getRoleCategoryList(): Observable<IAccessRoleCategory[]> {
		return this.http.post<IAccessRoleCategory[]>(this.configService.webApiBaseUrl + 'basics/customize/frmaccessrolecategory/list', {});
	}

	/**
	 * This function used for prepared the from config data to render in assign category wizard form dialog section
	 *
	 * @param {number} roleCount
	 * @param {IAccessRoleCategory} categories
	 * @returns { IAccessRoleCategoryEntity,IAccessRoleCategoryEntry[],IFormConfig<IAccessRoleCategoryEntity>,EntityRuntimeData<...>} return the formconfig data
	 */
	public preparedFromConfig(roleCount: number, categories: IAccessRoleCategory[]) {
		const itemSource = categories.map((item) => {
			return {
				id: item.Id,
				displayName: item.Name,
			};
		});
		const entities: IAccessRoleCategoryEntry[] = [
			{
				item: {
					roleCount: roleCount,
					category: itemSource[1].id,
				},
			},
		];

		const roleFormRuntimeInfo: EntityRuntimeData<IAccessRoleCategoryEntity> = {
			readOnlyFields: [
				{
					field: 'roleCount',
					readOnly: true,
				},
			],
			validationResults: [],
			entityIsReadOnly: false,
		};
		const entity: IAccessRoleCategoryEntity = entities[0].item;
		const formConfig: IFormConfig<IAccessRoleCategoryEntity> = {
			formId: 'dba9fb9cb13f4cd0b5dd7e9895d7db1b',
			showGrouping: false,
			rows: [
				{
					id: 'RolesCount',
					label: { key: 'usermanagement.right.dialogAssignCategory.labelRolesCount' },
					type: FieldType.Description,
					readonly: true,
					model: 'roleCount',
				},
				{
					id: 'category',
					label: { key: 'usermanagement.right.dialogAssignCategory.newCategory' },
					type: FieldType.Select,
					model: 'category',
					itemsSource: {
						items: itemSource,
					},
				},
			],
		};
		return { entity: entity, entities: entities, formConfig: formConfig, runTimeInfo: roleFormRuntimeInfo };
	}

	/**
	 * This function update the role category using api call
	 *
	 * @param {IUpdateCategoryBulk} payloda selcted category and roles id
	 * @returns Observable<boolean>
	 */
	public updateCategoryBulk(payloda: IUpdateCategoryBulk): Observable<boolean> {
		return this.http.post<boolean>(this.configService.webApiBaseUrl + 'usermanagement/main/role/updateCategoryBulk', payloda);
	}
}
