import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { get } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonWicBoqRootItemLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqItemEntity, TEntity> {
	public constructor() {
		super(
			{
				httpRead: {
					route: 'boq/wic/boq/',
					endPointRead: 'boqrootitemsbywicgroupid',
					usePostForRead: false,
				},
				filterParam: true,
				prepareSearchFilter(request): object | string {
					const groupId = get(request.additionalParameters, 'groupId');
					return 'groupId=' + groupId;
				},
			},
			{
				uuid: '02ee9896d0ab4eab8c50170440d1fc10',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Reference',
				gridConfig: {
					uuid: '02ee9896d0ab4eab8c50170440d1fc10',
					columns: [
						{
							id: 'Reference',
							model: 'Reference',
							type: FieldType.Code,
							label: 'cloud.common.entityReference',
							sortable: true,
						},
						{
							id: 'BriefInfo',
							model: 'BriefInfo.Translated',
							type: FieldType.Description,
							label: 'cloud.common.entityBrief',
							sortable: true,
						},
					],
				},
			},
		);
	}
}