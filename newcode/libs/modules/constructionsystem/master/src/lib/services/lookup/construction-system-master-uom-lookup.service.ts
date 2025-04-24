import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { IBasicsUomEntity } from '@libs/basics/interfaces';
import { Injectable } from '@angular/core';
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterUomLookupService<TEntity extends object = object> extends BasicsSharedUomLookupService<TEntity> {
	/**
	 * filter list by isLive is true
	 * @param list
	 */
	public override filterList(list: IBasicsUomEntity[]): IBasicsUomEntity[] {
		return list.filter((item) => {
			return this.isItemLive(item);
		});
	}
}
