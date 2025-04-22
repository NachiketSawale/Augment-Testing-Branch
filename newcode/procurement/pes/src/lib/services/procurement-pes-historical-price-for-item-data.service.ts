/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedHistoricalPriceForItemDataService, IBasicsSharedHistoricalPriceForItemEntity, IBasicsSharedHistoricalPriceForItemParam, IBasicsSharedHistoricalPriceForItemParentData } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementPesItemDataService } from './procurement-pes-item-data.service';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';

/**
 * HistoricalPriceForItem service in pes
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesHistoricalPriceForItemDataService extends BasicsSharedHistoricalPriceForItemDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>> {

	public constructor(public pesItemService:ProcurementPesItemDataService,public pesHeaderService:ProcurementPesHeaderDataService) {
		super(pesItemService, pesHeaderService);
	}

	public override getLoadParameter(param?:IBasicsSharedHistoricalPriceForItemParam): IBasicsSharedHistoricalPriceForItemParam {
		const pesItemSelected = this.pesItemService.getSelectedEntity() as IBasicsSharedHistoricalPriceForItemParentData;
		const pesHeaderSelected = this.pesHeaderService.getSelectedEntity() as IBasicsSharedHistoricalPriceForItemParentData;
		return {
			HeaderExchangeRate: pesHeaderSelected.ExchangeRate,
			headerCurrencyId: (pesHeaderSelected.CurrencyFk || pesHeaderSelected.BasCurrencyFk),
			headerProjectId: pesHeaderSelected.ProjectFk,
			matPriceListId: -1,
			materialId: pesItemSelected?.MdcMaterialFk ?? undefined,
			materialType: -1,
			prcItemIds: [],
			projectId: pesHeaderSelected.ProjectFk ?? null,
			queryFromContract: param ? param.queryFromContract : true,
			queryFromMaterialCatalog: param ? param.queryFromMaterialCatalog : true,
			queryFromQuotation: param ? param.queryFromQuotation : true,
			queryNeutralMaterial: param ? param.queryNeutralMaterial : true,
			startDate: param ? param.startDate : undefined,
			endDate: param ? param.endDate : undefined
		};
	}

	public override childrenOf(element: IBasicsSharedHistoricalPriceForItemEntity): IBasicsSharedHistoricalPriceForItemEntity[] {
		return element.Children ?? [];
	}

	public override parentOf(element: IBasicsSharedHistoricalPriceForItemEntity): IBasicsSharedHistoricalPriceForItemEntity | null {
		if (element.PId == null) {
			return null;
		}

		const parentId = element.PId;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}
}