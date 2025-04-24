import {Injectable} from '@angular/core';
import {
	FieldType,
	UiCommonLookupItemsDataService,
} from '@libs/ui/common';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import {IReqHeaderEntity} from '../../model/entities/reqheader-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionBoqHeaderLookupService extends UiCommonLookupItemsDataService<IPrcBoqExtendedEntity, IReqHeaderEntity> {
	// todo chi: common boq service is not available
	// private readonly boqService = inject();
	public constructor() {
		super([], { // todo chi: the array should be boq data list
			valueMember: 'Id',
			displayMember: 'BoqRootItem.Reference',
			uuid: '911680ea1cd444b8ab3b7c0684d2a1a6',
			gridConfig: {
				columns: [
					{
						id: 'Reference',
						model: 'BoqRootItem.Reference',
						width: 200,
						label: 'cloud.common.entityReference',
						type: FieldType.Description,
						sortable: true,
						visible: true
					},
					{
						id: 'BriefInfo',
						width: 250,
						model: 'BoqRootItem.BriefInfo.Translated',
						label: 'cloud.common.entityBrief',
						type: FieldType.Description,
						sortable: true,
						visible: true
					}
				],
			}
		});
	}
}