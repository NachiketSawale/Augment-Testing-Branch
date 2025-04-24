/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { get, cloneDeep } from 'lodash';
import { IBasicsSharedUniqueFieldProfileService, IUniqueFieldDto } from '../index';
import { Observable } from 'rxjs';
import { IEntityContext, PlatformTranslateService } from '@libs/platform/common';

export interface IUniqueFieldProfileEntity {
	Id: number;
	ProfileName: string;
	ProfileAccessLevel: string;
	UniqueFields: IUniqueFieldDto[];
}

/**
 * Unique Field Profile Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedUniqueFieldProfileLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IUniqueFieldProfileEntity, TEntity> {
	private translateService = inject(PlatformTranslateService);
	private defaultProfileTxt = this.translateService.instant('basics.common.dialog.saveProfile.newProfileName').text;
	private dynamicUniqueFields: IUniqueFieldDto[] | null = null;

	public constructor() {
		super(
			{
				httpRead: {
					route: 'basics/common/uniquefieldsprofile/',
					usePostForRead: false,
					endPointRead: 'get',
				},
			},
			{
				uuid: 'ffe8c1f718cd4257947dea0519e9a96a',
				idProperty: 'Id',
				valueMember: 'ProfileName',
				displayMember: 'ProfileName',
				gridConfig: {
					columns: [
						{
							id: 'profileName',
							model: 'ProfileName',
							type: FieldType.Description,
							label: {text: 'Profile Name', key: 'basics.common.dialog.saveProfile.labelProfileName'},
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'accessLevel',
							model: 'ProfileAccessLevel',
							type: FieldType.Description,
							label: {text: 'Access Level', key: 'basics.common.dialog.saveProfile.labelAccessLevel'},
							sortable: true,
							visible: true,
							readonly: true,
						},
					],
				},
			},
		);
		this.cache.enabled = false;
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		const identityName = get(request.additionalParameters, 'identityName');
		return 'identityName=' + identityName;
	}


	public override getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Observable<ILookupSearchResponse<IUniqueFieldProfileEntity>> {
		const dynamicUniqueFieldService = get(request.additionalParameters, 'dynamicUniqueFieldService') as unknown as IBasicsSharedUniqueFieldProfileService;
		const defaultProfileFields = [{
			id: -1,
			isSelect: true,
			fieldName: 'Description',
			model: 'DescriptionInfo'
		}, {
			id: -2,
			isSelect: true,
			fieldName: 'Uom Item',
			model: 'BasUomTargetFk'
		}, {
			id: -3,
			isSelect: false,
			fieldName: 'Controlling Unit',
			model: 'MdcControllingUnitFk'
		}];
		return new Observable((observer) => {

			this.getCurrentDynamicUniqueFields(defaultProfileFields, dynamicUniqueFieldService).pipe().subscribe(profileFields => {
				const defaultProfile: IUniqueFieldProfileEntity = {
					Id: 0,
					ProfileName: this.defaultProfileTxt,
					ProfileAccessLevel: '',
					UniqueFields: profileFields
				};
				super.getSearchList(request, context).subscribe(response => {
					response.items.unshift(defaultProfile);
					response.items.forEach(item => {
						const fieldsInDb = item.UniqueFields;
						const copyFields = cloneDeep(profileFields);
						fieldsInDb.forEach(field => {
							const found = copyFields.find(copyField => copyField.model === field.model);
							if (found && field.isSelect) {
								found.isSelect = field.isSelect;
							}
						});
						item.UniqueFields = copyFields;
					});
					observer.next(new LookupSearchResponse(response.items));
				});
			});
		});
	}

	private getCurrentDynamicUniqueFields(defaultProfileFields: IUniqueFieldDto[], dynamicUniqueFieldService: IBasicsSharedUniqueFieldProfileService) {
		return new Observable<IUniqueFieldDto[]>(o => {
			if (this.dynamicUniqueFields) {
				o.next(defaultProfileFields.concat(this.dynamicUniqueFields));
				o.complete();
			} else {
				dynamicUniqueFieldService.getDynamicUniqueFields().then(result => {
					this.dynamicUniqueFields = result;
					o.next(defaultProfileFields.concat(this.dynamicUniqueFields));
					o.complete();
				});
			}
		});
	}


	public override processItems(list: IUniqueFieldProfileEntity[]) {
		list.forEach((item, index) => {
			item.Id = index + 1;
		});
	}
}
