import {
	FieldType,
	UiCommonLookupItemsDataService,
} from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { BasicsSharedCharacteristicTypeHelperService } from '../../services';
import { IIdentificationData, ServiceLocator } from '@libs/platform/common';
import { Observable } from 'rxjs';

export class CharacteristicDateEntity {
	public Id?:string;
	public Description?:string;
}
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCharacteristicDateComboboxService extends UiCommonLookupItemsDataService<CharacteristicDateEntity> {
	public constructor() {
		const items = ServiceLocator.injector.get(BasicsSharedCharacteristicTypeHelperService).dateList;
		super(
			items, {
			uuid: '1f4cee74e4f44b189d541B4f0501968e', /// uuid can not be empty,otherwise data will not show
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 150
					},
				]
			},
			showClearButton:true,
			showGrid: true
			// isDataUpdatedPopup: true, ///todo
		});
	}

	///
	public override getItemByKey(key: IIdentificationData): Observable<CharacteristicDateEntity> {
		//const value = key.id;///todo  moment case in angularjs
		///if (value._isAMomentObject) {
		// 							value = value._i;
		// 		}
		//   key.id = value;
			return super.getItemByKey(key);
		}
}