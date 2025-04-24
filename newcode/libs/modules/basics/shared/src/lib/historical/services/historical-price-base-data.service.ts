/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { IBasicsSharedHistoricalPriceForItemParam, IBasicsSharedHistoricalPriceForItemParentData } from '../model/interfaces/historical-price-for-item-parameter.interface';

export class BasicsSharedHistoricalPriceBaseDataService<T extends IEntityIdentification, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceHierarchicalLeaf<T, PT, PU> {
	public constructor(
		protected parentService: IEntitySelection<object>,
		protected headerParentService: IEntitySelection<object>,
		protected endPoint: string,
		protected item: string,
	) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'basics/common/historicalprice',
			readInfo: {
				endPoint: endPoint,
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: item,
				parent: parentService,
			},
		};
		super(options);
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		return loaded as T[];
	}

	public async reloadData(param: IBasicsSharedHistoricalPriceForItemParam) {
		const parentItem = this.getParentItem();
		if (parentItem) {
			await this.loadSubEntities({ id: 0, pKey1: parentItem.Id });
		}
	}

	public getParentItem(): IBasicsSharedHistoricalPriceForItemParentData {
		return this.parentService.getSelectedEntity() as unknown as IBasicsSharedHistoricalPriceForItemParentData;
	}

	public setPriceRange() {
		return '';
	}
}
