/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMaterialTemplateTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMaterialTemplateTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMaterialTemplateTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMaterialTemplateTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/materialtemplatetype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3259a2a0742245c6b7871c97308cf650',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeMaterialTemplateTypeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsTemplate',
						model: 'IsTemplate',
						type: FieldType.Boolean,
						label: { text: 'IsTemplate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MatchCode',
						model: 'MatchCode',
						type: FieldType.Boolean,
						label: { text: 'MatchCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description1',
						model: 'Description1',
						type: FieldType.Boolean,
						label: { text: 'Description1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description2',
						model: 'Description2',
						type: FieldType.Boolean,
						label: { text: 'Description2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Specification',
						model: 'Specification',
						type: FieldType.Boolean,
						label: { text: 'Specification' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MaterialABC',
						model: 'MaterialABC',
						type: FieldType.Boolean,
						label: { text: 'MaterialABC' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Currency',
						model: 'Currency',
						type: FieldType.Boolean,
						label: { text: 'Currency' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Uom',
						model: 'Uom',
						type: FieldType.Boolean,
						label: { text: 'Uom' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RetailPrice',
						model: 'RetailPrice',
						type: FieldType.Boolean,
						label: { text: 'RetailPrice' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ListPrice',
						model: 'ListPrice',
						type: FieldType.Boolean,
						label: { text: 'ListPrice' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Discount',
						model: 'Discount',
						type: FieldType.Boolean,
						label: { text: 'Discount' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Charges',
						model: 'Charges',
						type: FieldType.Boolean,
						label: { text: 'Charges' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PriceCondition',
						model: 'PriceCondition',
						type: FieldType.Boolean,
						label: { text: 'PriceCondition' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EstimatePrice',
						model: 'EstimatePrice',
						type: FieldType.Boolean,
						label: { text: 'EstimatePrice' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PriceUnit',
						model: 'PriceUnit',
						type: FieldType.Boolean,
						label: { text: 'PriceUnit' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomPriceUnit',
						model: 'UomPriceUnit',
						type: FieldType.Boolean,
						label: { text: 'UomPriceUnit' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FactorPriceUnit',
						model: 'FactorPriceUnit',
						type: FieldType.Boolean,
						label: { text: 'FactorPriceUnit' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SellUnit',
						model: 'SellUnit',
						type: FieldType.Boolean,
						label: { text: 'SellUnit' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MaterialDiscountGrp',
						model: 'MaterialDiscountGrp',
						type: FieldType.Boolean,
						label: { text: 'MaterialDiscountGrp' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'WeightType',
						model: 'WeightType',
						type: FieldType.Boolean,
						label: { text: 'WeightType' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'WeightNumber',
						model: 'WeightNumber',
						type: FieldType.Boolean,
						label: { text: 'WeightNumber' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Weight',
						model: 'Weight',
						type: FieldType.Boolean,
						label: { text: 'Weight' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ExternalCode',
						model: 'ExternalCode',
						type: FieldType.Boolean,
						label: { text: 'ExternalCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TaxCode',
						model: 'TaxCode',
						type: FieldType.Boolean,
						label: { text: 'TaxCode' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Blobs',
						model: 'Blobs',
						type: FieldType.Boolean,
						label: { text: 'Blobs' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BlobsSpecification',
						model: 'BlobsSpecification',
						type: FieldType.Boolean,
						label: { text: 'BlobsSpecification' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Material',
						model: 'Material',
						type: FieldType.Boolean,
						label: { text: 'Material' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Agreement',
						model: 'Agreement',
						type: FieldType.Boolean,
						label: { text: 'Agreement' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'LeadTime',
						model: 'LeadTime',
						type: FieldType.Boolean,
						label: { text: 'LeadTime' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MinQuantity',
						model: 'MinQuantity',
						type: FieldType.Boolean,
						label: { text: 'MinQuantity' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CostType',
						model: 'CostType',
						type: FieldType.Boolean,
						label: { text: 'CostType' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'LeadTimeExtra',
						model: 'LeadTimeExtra',
						type: FieldType.Boolean,
						label: { text: 'LeadTimeExtra' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined1',
						model: 'UserDefined1',
						type: FieldType.Boolean,
						label: { text: 'UserDefined1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined2',
						model: 'UserDefined2',
						type: FieldType.Boolean,
						label: { text: 'UserDefined2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined3',
						model: 'UserDefined3',
						type: FieldType.Boolean,
						label: { text: 'UserDefined3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined4',
						model: 'UserDefined4',
						type: FieldType.Boolean,
						label: { text: 'UserDefined4' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefined5',
						model: 'UserDefined5',
						type: FieldType.Boolean,
						label: { text: 'UserDefined5' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'FactorHour',
						model: 'FactorHour',
						type: FieldType.Boolean,
						label: { text: 'FactorHour' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UpdIsLive',
						model: 'UpdIsLive',
						type: FieldType.Boolean,
						label: { text: 'UpdIsLive' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsProduct',
						model: 'IsProduct',
						type: FieldType.Boolean,
						label: { text: 'IsProduct' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Brand',
						model: 'Brand',
						type: FieldType.Boolean,
						label: { text: 'Brand' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ModelName',
						model: 'ModelName',
						type: FieldType.Boolean,
						label: { text: 'ModelName' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedText1',
						model: 'UserDefinedText1',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedText1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedText2',
						model: 'UserDefinedText2',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedText2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedText3',
						model: 'UserDefinedText3',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedText3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedText4',
						model: 'UserDefinedText4',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedText4' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedText5',
						model: 'UserDefinedText5',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedText5' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate1',
						model: 'UserDefinedDate1',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedDate1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate2',
						model: 'UserDefinedDate2',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedDate2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate3',
						model: 'UserDefinedDate3',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedDate3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate4',
						model: 'UserDefinedDate4',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedDate4' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedDate5',
						model: 'UserDefinedDate5',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedDate5' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber1',
						model: 'UserDefinedNumber1',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedNumber1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber2',
						model: 'UserDefinedNumber2',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedNumber2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber3',
						model: 'UserDefinedNumber3',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedNumber3' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber4',
						model: 'UserDefinedNumber4',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedNumber4' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefinedNumber5',
						model: 'UserDefinedNumber5',
						type: FieldType.Boolean,
						label: { text: 'UserDefinedNumber5' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DangerClass',
						model: 'DangerClass',
						type: FieldType.Boolean,
						label: { text: 'DangerClass' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PackageType',
						model: 'PackageType',
						type: FieldType.Boolean,
						label: { text: 'PackageType' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomVolume',
						model: 'UomVolume',
						type: FieldType.Boolean,
						label: { text: 'UomVolume' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Volume',
						model: 'Volume',
						type: FieldType.Boolean,
						label: { text: 'Volume' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'InheritCodeFk',
						model: 'InheritCodeFk',
						type: FieldType.Quantity,
						label: { text: 'InheritCodeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UpdateUomWeight',
						model: 'UpdateUomWeight',
						type: FieldType.Boolean,
						label: { text: 'UpdateUomWeight' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
