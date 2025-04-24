import { inject, Injectable } from '@angular/core';
import { IResourceMasterResourceEntity, IResourceSkillEntity } from '@libs/resource/interfaces';
import { FieldType, IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ResourceMasterResourceDataService } from '@libs/resource/master';

@Injectable({
	providedIn: 'root'
})

/**
 * ResourceSkillLookupService is a lookup for resource skills
 */
export class ResourceSkillLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IResourceSkillEntity, T> {
	/**
	 * Used to inject resource type data service.
	 */
	private resourceMasterDataService = inject(ResourceMasterResourceDataService);

	public constructor() {
		super(
			{
				httpRead: {
					route: 'resource/skill/',
					endPointRead: 'byrestype',
					usePostForRead: false,
				},
				filterParam: true,
				prepareListFilter: () => {
					return '?parentResTypeId=' + this.filter();
				}
			},
			{
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab',
				idProperty: 'Description',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo',
				gridConfig: {
					columns: [
						{
							id: 'DescriptionInfo',
							model: 'DescriptionInfo',
							width: 300,
							type: FieldType.Translation,
							label: {
								text: 'Description',
								key: 'cloud.common.entityDescription'
							},
							sortable: true
						},
					]
				}
			});
	}
	/**
	 * Used to get id of resource type entity
	 * @returns {number}
	 */
	private filter(): number {
		let mainItemId = 0;
		const selected = this.resourceMasterDataService.getSelection()[0];
		if (selected) {
			mainItemId = selected.TypeFk as number;
		}
		return mainItemId;
	}
}