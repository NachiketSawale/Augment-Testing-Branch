import { FieldType, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { ServiceLocator, Translatable } from '@libs/platform/common';
import { ConstructionSystemMainInstanceStatusService } from '../construction-system-main-instance-status.service';
import { Injectable } from '@angular/core';

export interface ICosInstanceStatusEntity {
	/**
	 * The unique ID that identifies the item.
	 */
	readonly Id: number;

	/**
	 * The human-readable name of the item.
	 */
	readonly DisplayName: Translatable;

	/**
	 * Icon class name required for input select.
	 */
	readonly IconCSS?: string;
}
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainStatusLookupService extends UiCommonLookupItemsDataService<ICosInstanceStatusEntity> {
	public constructor() {
		const items = ServiceLocator.injector.get(ConstructionSystemMainInstanceStatusService).createStatusCssIconObjects();
		super(items, {
			uuid: 'cf7712c2546d4f4cbd197712304e2427',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DisplayName',
			showDescription: false,
			gridConfig: {
				columns: [
					{
						id: 'displayName',
						model: 'DisplayName',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 150,
					},
				],
			},
			showClearButton: true,
			showGrid: true,
		});
	}
}
