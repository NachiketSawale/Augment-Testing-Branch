/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
@Injectable({
	providedIn: 'root'
})
export class SchedulingScheduleLookup<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
	private mainItemId: number | null = null;
	public constructor() {
		super({
			httpRead: { route: 'scheduling/schedule/', endPointRead: 'list',usePostForRead:false },
				filterParam: true,
				prepareListFilter: () => {
					return this.getProjectFilter();
				}
			},
			{
			uuid: 'b38f233e296c48c6a3ab4cae6576b926',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Id', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true
					}
				]
			}
		});

	}
	/**
	 * Set main item id
	 * @param mainItemId main item id
	 */
	public setProjectId(mainItemId: number | null) {
		this.mainItemId = mainItemId;
	}

	/**
	 * Get main item filter
	 * @returns main item filter string
	 */
	private getProjectFilter(): string {
		return this.mainItemId ? `mainItemId=${this.mainItemId}` : 'mainItemId=0';
	}
}