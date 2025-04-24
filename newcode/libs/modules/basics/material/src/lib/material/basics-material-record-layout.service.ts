/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { BasicsMaterialCommonLayoutService } from './basics-material-common-layout.service';

/**
 * Material record layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialRecordLayoutService {
	private readonly commonLayoutService = inject(BasicsMaterialCommonLayoutService);

	public async generateLayout(): Promise<ILayoutConfiguration<IMaterialEntity>> {
		return await this.commonLayoutService.generateLayout({
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'MaterialCatalogFk',
						'NeutralMaterialCatalogFk',
						'StockMaterialCatalogFk',
						'Code',
						'MatchCode',
						'DescriptionInfo1',
						'DescriptionInfo2',
						'BasCurrencyFk',
						'RetailPrice',
						'ListPrice',
						'Discount',
						'Charges',
						'Cost',
						'EstimatePrice',
						'CostPriceGross',
						'PriceUnit',
						'BasUomPriceUnitFk',
						'PriceExtra',
						'FactorPriceUnit',
						'SellUnit',
						'MaterialDiscountGroupFk',
						'WeightType',
						'WeightNumber',
						'Weight',
						'MdcTaxCodeFk',
						'UomFk',
						'MaterialGroupFk',
						'PrcPriceconditionFk',
						'AgreementFk',
						'MdcMaterialFk',
						'ExternalCode',
						'MdcMaterialabcFk',
						'LeadTime',
						'MinQuantity',
						'EstCostTypeFk',
						'LeadTimeExtra',
						'SpecificationInfo',
						'FactorHour',
						'IsLive',
						'IsProduct',
						'MdcBrandFk',
						'ModelName',
						'MaterialTempFk',
						'MaterialTempTypeFk',
						'BasUomWeightFk',
						'MaterialTypeFk',
						'DayworkRate',
						'MdcMaterialStockFk',
						'PriceExtraEstPrice',
						'PriceExtraDwRate',
						'EanGtin',
						'Supplier',
						'Co2Source',
						'BasCo2SourceFk',
						'Co2Project',
						'MaterialStatusFk',
					],
				},
				{
					gid: 'dangerousGoods',
					title: {
						key: 'cloud.common.entityDangerousGoods',
						text: 'Dangerous Goods',
					},
					attributes: ['DangerClassFk', 'PackageTypeFk', 'UomVolumeFk', 'Volume'],
				},
				{
					gid: 'userDefinedFields',
					title: {
						key: 'basics.material.record.entityUserDefinedFields',
						text: 'User-Defined Fields',
					},
					attributes: [
						'Userdefined1',
						'Userdefined2',
						'Userdefined3',
						'Userdefined4',
						'Userdefined5',
						'UserDefinedText1',
						'UserDefinedText2',
						'UserDefinedText3',
						'UserDefinedText4',
						'UserDefinedText5',
						'UserDefinedDate1',
						'UserDefinedDate2',
						'UserDefinedDate3',
						'UserDefinedDate4',
						'UserDefinedDate5',
						'UserDefinedNumber1',
						'UserDefinedNumber2',
						'UserDefinedNumber3',
						'UserDefinedNumber4',
						'UserDefinedNumber5',
					],
				},
			],
		});
	}
}
