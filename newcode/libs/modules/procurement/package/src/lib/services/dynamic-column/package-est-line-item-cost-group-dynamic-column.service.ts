import {Injectable} from '@angular/core';
import {IEstLineItemEntity} from '@libs/estimate/interfaces';
import {
	BasicSharedCostGroupDynamicColumnService,
	IBasicMainItem2CostGroup,
} from '@libs/basics/shared';
import {IPackageEstimateLineItemResponse} from '../../model/entities/package-estimate-line-item-response.interface';
import {find} from 'lodash';
import {ValidationResult} from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEstimateLineItemCostGroupDynamicColumnService<T extends IEstLineItemEntity>
	extends BasicSharedCostGroupDynamicColumnService<T> {
	public initialData(readData: object) {
		const read = readData as IPackageEstimateLineItemResponse;
		this.costGroupCat = read.CostGroupCats;
		this.mainItem2CostGroups = read.LineItem2CostGroups;
	}

	public getMatchedEntity(entities: T[], item2CostGroup: IBasicMainItem2CostGroup): T | null {
		const entity = find(entities, {Id: item2CostGroup.MainItemId, EstHeaderFk: item2CostGroup.RootItemId});
		if (entity) {
			return entity as T;
		}
		return null;
	}

	public validateColumn():  ValidationResult {
		return {valid: true, apply: true};
	}

	public provideUpdateData(): void {

	}
}