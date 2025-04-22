/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDescriptionInfo } from '@libs/platform/common';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';

interface IBoqItemLookup {
	Reference: string;
	BriefInfo: IDescriptionInfo;
	BoqHeaderFk?:number;
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractSourceBoqLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBoqItemLookup, T> {
	private readonly parentDataService = inject(ProcurementContractHeaderDataService);

	public constructor() {
		super(
			{
				httpRead: { route: 'procurement/common/wizard/', endPointRead: 'getrootboqitemsbyfilter', usePostForRead: true },
				filterParam: true,
				prepareListFilter: (context) => {
					const conHeaderFk = this.parentDataService.getSelectedEntity()!.Id;
					return {
						PKey1: -1, //may need to enhance the server side call
						PKey2: conHeaderFk,
					};
				},
			},
			{
				uuid: '49b49742451d430ca63453b7d9d03487',
				valueMember: 'Id',
				displayMember: 'Reference',
				gridConfig: {
					columns: [
						{
							id: 'reference',
							model: 'Reference',
							type: FieldType.Code,
							label: { text: 'Reference No.', key: 'boq.main.Reference' },
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'briefInfo',
							model: 'BriefInfo',
							type: FieldType.Translation,
							label: { text: 'Outline Specification', key: 'boq.main.BriefInfo' },
							sortable: true,
							visible: true,
							readonly: true,
						},
					],
				},
			},
		);
	}
}
