/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';
import { BasicsMaterialMaterialCatalogDataService } from '../material-catalog/basics-material-material-catalog-data.service';
import { BasicsSharedHistoricalPriceForItemDataService, IBasicsSharedHistoricalPriceForItemParam, IBasicsSharedHistoricalPriceForItemParentData } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { maxBy, minBy } from 'lodash';

/**
 * HistoricalPriceForItem service in Material
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialHistoricalPriceForItemDataService extends BasicsSharedHistoricalPriceForItemDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(BasicsMaterialRecordDataService);
		const headerService = inject(BasicsMaterialMaterialCatalogDataService);
		super(parentService, headerService);
	}

	public override setCodeDesc(): string {
		const parentSelected = this.parentService.getSelectedEntity() as IMaterialEntity;
		if (parentSelected) {
			return parentSelected.Code + '-' + parentSelected.DescriptionInfo1?.Description;
		}
		return '';
	}

	public override setPriceRange() {
		const materialHistoricals = this.getList();
		const minUnitRate = minBy(materialHistoricals, e => e.UnitRate);
		const maxUnitRate = maxBy(materialHistoricals, e => e.UnitRate);
		//todo-https://rib-40.atlassian.net/browse/DEV-37543 If this ticket is closed, minUnitRate and maxUnitRate call the format method
		return minUnitRate + '~' + maxUnitRate;
	}

	public override getLoadParameter(param?:IBasicsSharedHistoricalPriceForItemParam): IBasicsSharedHistoricalPriceForItemParam {
		const materialSelected = this.parentService.getSelectedEntity() as IBasicsSharedHistoricalPriceForItemParentData;
		return {
			HeaderExchangeRate: null,
			headerCurrencyId: (materialSelected.CurrencyFk || materialSelected.BasCurrencyFk),
			headerProjectId: materialSelected.ProjectFk,
			matPriceListId: -1,
			materialId: materialSelected.Id,
			materialType: -1,
			prcItemIds: [],
			projectId: materialSelected.ProjectFk ?? null,
			queryFromContract: param ? param.queryFromContract : true,
			queryFromMaterialCatalog: param ? param.queryFromMaterialCatalog : true,
			queryFromQuotation: param ? param.queryFromQuotation : true,
			queryNeutralMaterial: param ? param.queryNeutralMaterial : true,
			startDate: param ? param.startDate : undefined,
			endDate: param ? param.endDate : undefined
		};
	}
}
