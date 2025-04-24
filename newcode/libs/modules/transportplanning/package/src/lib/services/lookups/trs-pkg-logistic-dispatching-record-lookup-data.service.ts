import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ITransportPackageEntity } from '../../model/models';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class TrsPkgLogisticDispatchingRecordLookupDataService<IEntity extends object> extends UiCommonLookupEndpointDataService<ITransportPackageEntity, IEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'logistic/dispatching/record/', endPointRead: 'listbyparent', usePostForRead: true },
			},
			{
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'RecordNo',
				showGrid: true,
				gridConfig: {
					columns: [
						{
							id: 'recordNo',
							type: FieldType.Code,
							label: { text: 'Code', key: 'cloud.common.entityCode' },
							width: 100,
							visible: true,
							sortable: true,
						},
						{
							id: 'Description',
							type: FieldType.Description,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							width: 150,
							visible: true,
							sortable: true,
						},
					],
				},
				uuid: 'e9430722c9e6426ea4545c51abddbd5e',
			},
		);
	}
}
