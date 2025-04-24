/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { IBasicsCommonHistoricalPriceForItemEntity } from '../models/basics-common-historical-price-for-item-entity.interface';
import { IBasicsHistoricalPriceForItemParam, IBasicsHistoricalPriceForItemParentData } from '../models/interfaces/historical-price-for-item-parameter.interface';

export abstract class BasicsCommonHistoricalPriceForItemDataService<T extends IBasicsCommonHistoricalPriceForItemEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceHierarchicalLeaf<T, PT, PU> {

	protected constructor(
		protected parentService: IEntitySelection<object>,
		protected headerParentService: IEntitySelection<object>,
	) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'basics/common/historicalprice',
			readInfo: {
				endPoint: 'prcitem',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'commonItemPrice',
				parent: parentService,
			},
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		return this.getLoadParameter();
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		//todo-Assign value to container but it doesn't seem to show up, maybe it's a framework issue
		return loaded as T[];
	}

	public override parentOf(element: T): T | null {
		if (element == null) {
			return null;
		}
		const parent = this.flatList().find((candidate) => candidate.PId === null);
		return parent === undefined ? null : parent;
	}

	public override childrenOf(element: T): T[] {
		return (element.Children as T[]) ?? [];
	}

	public reloadData(param: IBasicsHistoricalPriceForItemParam) {

	}

	public getParentItem(): IBasicsHistoricalPriceForItemParentData {
		return this.parentService.getSelectedEntity() as unknown as IBasicsHistoricalPriceForItemParentData;
	}

	protected getMainItemId(): number {
		return this.getParentItem().Id;
	}

	public getLoadParameter(param?:IBasicsHistoricalPriceForItemParam):IBasicsHistoricalPriceForItemParam {
		const parentSelected = this.parentService.getSelectedEntity() as IBasicsHistoricalPriceForItemParentData;
		const headerSelected = this.headerParentService.getSelectedEntity() as IBasicsHistoricalPriceForItemParentData;
		return {
			HeaderExchangeRate: headerSelected.ExchangeRate,
			headerCurrencyId: (headerSelected.CurrencyFk || headerSelected.BasCurrencyFk),
			headerProjectId: headerSelected.ProjectFk,
			matPriceListId: param?.queryFromMaterialCatalog ? -1 : null,//todo-maybe enhance fn ,-1 is default value when the query is initialized
			materialId: parentSelected?.Id ?? null,
			materialType: param!.priceVersionFk! > 0 ? -2 : param?.priceVersionFk,//todo-maybe enhance fn ,-2 is default value when the query is initialized
			prcItemIds: param?.prcItemIds,
			queryFromContract: param?.queryFromContract,
			queryFromMaterialCatalog: param?.queryFromMaterialCatalog,
			queryFromQuotation: param?.queryFromQuotation,
			queryNeutralMaterial: param?.queryNeutralMaterial,
		};
	}
}
