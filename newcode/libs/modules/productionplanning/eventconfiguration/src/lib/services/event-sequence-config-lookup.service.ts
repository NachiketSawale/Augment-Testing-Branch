import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { EventSequenceConfigEntity } from '../model/entities/event-sequence-config-entity.class';


@Injectable({
	providedIn: 'root'
})
export class PpsEventSequenceConfigLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<EventSequenceConfigEntity, TEntity> {

	public constructor() {
		super('EventSequence', {
			uuid: '7ac2a57f0703400a9f1e9cc817a35179',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [{
					id: 'Description',
					model: 'Description',
					type: FieldType.Description,
					label: { text: 'cloud.common.entityDescription' },
					sortable: true,
					visible: true,
					readonly: true
				}]
			}
		});
	}
}