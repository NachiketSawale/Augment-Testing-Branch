/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDescriptionInfo } from '@libs/platform/common';
import { get } from 'lodash';


/*
 * Change
 * TODO - Not sure BoQ module will provide this lookup or not. If it did need to reuse that lookup.
 */

export interface IPrcRootBoqItemEntity {
	Id: number;
	Reference: string;
	BriefInfo: IDescriptionInfo;
}

@Injectable({
	providedIn: 'root'
})
export class ProcurementSharePrcRootBoQItemLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IPrcRootBoqItemEntity, TEntity> {


	public constructor() {
		super({
			httpRead: {
				route: 'procurement/common/wizard/',
				endPointRead: 'getrootboqitemsbyfilter',
				usePostForRead: true
			},
			filterParam: true,
			prepareListFilter: (context) => {
				return {
					PKey1: -1, //todo-may need to enhance the server side call
					PKey2: get(context?.entity, 'ConHeaderFk')
				};
			},
			prepareSearchFilter: request => {
				return {
					PKey1: get(request.additionalParameters, 'PKey1'),
					PKey2: get(request.additionalParameters, 'PKey2')
				};
			}
		}, {
			uuid: '2340fe19bb0744f6a6ee700da9cf9e71',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Reference',
			descriptionMember: 'BriefInfo.Translated',
			showDescription: true,
			gridConfig: {
				uuid: '2340fe19bb0744f6a6ee700da9cf9e71',
				columns: [
					{
						id: 'reference',
						model: 'Reference',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'brief',
						model: 'BriefInfo.Translated',
						type: FieldType.Description,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					}]
			}
		});
	}
}