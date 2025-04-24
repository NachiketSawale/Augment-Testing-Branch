import { IConHeader2BoqWicCatBoqEntity } from '../model/entities/con-header-boq-wic-cat-boq.interface';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
/**
 * Procurement con header boq wic to cat lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementConHeader2BoqWicCatBoqLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IConHeader2BoqWicCatBoqEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		super('ConHeader2BoqWicCatBoq', {
			uuid: '',
			valueMember: 'Id',
			displayMember: 'BoqWicCatBoqFk'
		});
	}
}