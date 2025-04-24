import { Injectable } from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';
import { createLookup, FieldType, UiCommonLookupDataFactoryService, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPPSEventEntity } from '../model/event/pps-event-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningSharedPpsEventLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPPSEventEntity, TEntity> {

	public constructor() {
		super('PpsEvent', {
			valueMember: 'Id',
			displayMember: 'DisplayTxt',
			uuid: '1f9f5c1debb249068b43712a3d8f3bbb',
			gridConfig: {
				columns: [
					{
						id: 'EventCode',
						model: 'EventCode',
						type: FieldType.Description,
						label: { text: 'EventCode', key: 'cloud.common.event.eventCode' },
						width: 100,
						sortable: true,
						visible: true
					},
					{
						id: 'EventType',
						model: 'EventTypeFk',
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataService: ServiceLocator.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EventType', {
								uuid: '46482201ce454a16b97af9f08472a62a',
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Translated',
								showClearButton: true
							})
						}),
						label: { text: 'EventType', key: 'cloud.common.event.eventTypeFk' },
						width: 100,
						sortable: true,
						visible: true
					}
				],
			}
		});
	}
}