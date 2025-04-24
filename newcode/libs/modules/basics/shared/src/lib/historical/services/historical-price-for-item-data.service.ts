/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { IBasicsSharedHistoricalPriceForItemEntity } from '../model/entities/historical-price-for-item-entity.interface';
import { IBasicsSharedHistoricalPriceForItemParam, IBasicsSharedHistoricalPriceForItemParentData } from '../model/interfaces/historical-price-for-item-parameter.interface';
import { BasicsSharedHistoricalPriceBaseDataService } from './historical-price-base-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';

export class BasicsSharedHistoricalPriceForItemDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends BasicsSharedHistoricalPriceBaseDataService<IBasicsSharedHistoricalPriceForItemEntity, PT, PU> {
	public constructor(
		protected override parentService: IEntitySelection<object>,
		protected override headerParentService: IEntitySelection<object>,
	) {
		super(parentService, headerParentService, 'prcitem', 'commonItemPrice');
	}

	protected override provideLoadPayload(): object {
		return this.getLoadParameter();
	}

	public getLoadParameter(param?: IBasicsSharedHistoricalPriceForItemParam): IBasicsSharedHistoricalPriceForItemParam {
		const parentSelected = this.parentService.getSelectedEntity() as IBasicsSharedHistoricalPriceForItemParentData;
		const headerSelected = this.headerParentService.getSelectedEntity() as IBasicsSharedHistoricalPriceForItemParentData;
		return {
			HeaderExchangeRate: headerSelected.ExchangeRate,
			headerCurrencyId: headerSelected.CurrencyFk || headerSelected.BasCurrencyFk,
			headerProjectId: headerSelected.ProjectFk,
			matPriceListId: -1, //todo-maybe enhance fn ,-1 is default value when the query is initialized
			materialId: parentSelected?.Id ?? null,
			materialType: -2, // todo-maybe enhance fn ,-2 is default value when the query is initialized
			prcItemIds: [parentSelected.Id],
			queryFromContract: param ? param.queryFromContract : false,
			queryFromMaterialCatalog: param ? param.queryFromMaterialCatalog : false,
			queryFromQuotation: param ? param.queryFromQuotation : false,
			queryNeutralMaterial: param ? param.queryNeutralMaterial : false,
			startDate: param ? param.startDate : undefined,
			endDate: param ? param.endDate : undefined,
		};
	}

	public setCodeDesc() {
		return '';
	}

	public override childrenOf(element: IBasicsSharedHistoricalPriceForItemEntity): IBasicsSharedHistoricalPriceForItemEntity[] {
		return element.Children ?? [];
	}

	public override parentOf(element: IBasicsSharedHistoricalPriceForItemEntity): IBasicsSharedHistoricalPriceForItemEntity | null {
		if (element.MaterialId == null) {
			return null;
		}

		const parentId = element.MaterialId;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override isParentFn(parentKey: IMaterialEntity, entity: IBasicsSharedHistoricalPriceForItemEntity): boolean {
		return entity.PId === parentKey.Id;
	}
}
