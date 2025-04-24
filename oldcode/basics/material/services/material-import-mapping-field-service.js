/**
 * Created by chk on 3/10/2017.
 */
(function(angular){
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'basics.material';
	angular.module(moduleName).constant('materialImportMappingFieldService',{
		Fields:[
			{
				PropertyName: 'MaterialCode',
				EntityName: 'Material',
				DomainName: 'description',
				Editor: 'none',
				DisplayName: 'basics.material.import.materialCode',
				ColumnNameReadOnly:true
			},
			{
				PropertyName: 'MatchCode',
				EntityName: 'Material',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.record.matchCode'
			},
			{
				PropertyName: 'Description1',
				EntityName: 'Material',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'cloud.common.entityDescription'
			},
			{
				PropertyName: 'Description2',
				EntityName: 'Material',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.record.furtherDescription'
			},
			{
				PropertyName: 'Specification',
				EntityName: 'Material',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.specification'
			},
			{
				PropertyName: 'ABCGroup',
				EntityName: 'MaterialABC',
				DomainName: 'integer',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.material.materialabc',
				DisplayMember: 'Description',
				DisplayName: 'basics.material.record.aBCGroup'
			},
			{
				PropertyName: 'Currency',
				EntityName: 'BasCurrency',
				DomainName: 'integer',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.currency',
				DisplayMember: 'Currency',
				DisplayName: 'cloud.common.entityCurrency'
			},
			{
				PropertyName: 'Uom',
				EntityName: 'Uom',
				DomainName: 'integer',
				Editor: 'customlookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.uom',
				DisplayMember: 'UOM',
				DisplayName: 'cloud.common.entityUoM',
				EditorDirective: 'basics-lookupdata-uom-lookup',
				FormatterOptions: {
					lookupType: 'uom',
					valueMember: 'Id',
					displayMember: 'Unit'
				}
			},
			{
				PropertyName: 'IsLive',
				EntityName: 'Material',
				DomainName: 'boolean',
				Editor: 'domain',
				DisplayName: 'basics.material.record.active'
			},
			{
				PropertyName: 'IsProduct',
				EntityName: 'Material',
				DomainName: 'boolean',
				Editor: 'domain',
				DisplayName: 'basics.material.record.isProduct'
			},
			{
				PropertyName: 'CostType',
				EntityName: 'EstCostType',
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.estcosttype',//estimate.lookup.costtype basics.customize.estcosttype
				DisplayMember: 'Description',
				DisplayName: 'basics.material.record.estCostTypeFk'
			},
			{
				PropertyName: 'RetailPrice',
				EntityName: 'Material',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.retailPrice'
			},
			{
				PropertyName: 'CostPriceGross',
				EntityName: 'Material',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.costPriceGross'
			},
			{
				PropertyName: 'ListPrice',
				EntityName: 'Material',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.listPrice'
			},
			{
				PropertyName: 'Discount',
				EntityName: 'Material',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.discount'
			},
			{
				PropertyName: 'Charges',
				EntityName: 'Material',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.charges'
			},
			{
				PropertyName: 'PriceCondition',
				EntityName: 'PriceCondition',
				DomainName: 'integer',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'prc.pricecondition',
				DisplayMember: 'description',
				DisplayName: 'cloud.common.entityPriceCondition'
			},
			{
				PropertyName: 'PriceConditionType',
				EntityName: 'MaterialPriceCondition',
				DomainName: 'description',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'prc.priceconditiontype',
				DisplayMember: 'code',
				DisplayName: 'basics.material.import.priceConditionType'
			},
			{
				PropertyName: 'PriceConditionValue',
				EntityName: 'MaterialPriceCondition',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.import.priceConditionValue'
			},
			{
				PropertyName: 'EstimatePrice',
				EntityName: 'Material',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.estimatePrice'

			},
			{
				PropertyName: 'DayworkRate',
				EntityName: 'Material',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.DayworkRate'

			},
			{
				PropertyName: 'PriceUnit',
				EntityName: 'Material',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'cloud.common.entityPriceUnit'
			},
			{
				PropertyName: 'LeadTime',
				EntityName: 'Material',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.materialSearchLookup.htmlTranslate.leadTimes'
			},
			{
				PropertyName: 'MinQuantity',
				EntityName: 'Material',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.record.minQuantity'
			},
			{
				PropertyName: 'PriceUnitUom',
				EntityName: 'Uom',
				DomainName: 'integer',
				Editor: 'customlookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.uom',
				DisplayMember: 'UOM',
				DisplayName: 'cloud.common.entityPriceUnitUoM',
				EditorDirective: 'basics-lookupdata-uom-lookup',
				FormatterOptions: {
					lookupType: 'uom',
					valueMember: 'Id',
					displayMember: 'Unit'
				}
			},
			{
				PropertyName: 'Factor',
				EntityName: 'Material',
				DomainName: 'factor',
				Editor: 'domain',
				DisplayName: 'cloud.common.entityFactor'
			},
			{
				PropertyName: 'SellUnit',
				EntityName: 'Material',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.sellUnit'
			},
			{
				PropertyName: 'MaterialDiscountGroup_Code',
				ValueName:'MaterialDiscountGroup_Id',
				EntityName: 'MaterialDiscountGroup',
				DomainName: 'lookup',
				DisplayName: 'basics.material.record.discountGroup',
				Editor: 'idlookup',
				EditorDirective: 'basics-material-material-discount-group-lookup',
				FormatterOptions: {
					lookupType: 'materialdiscountgroup',
					displayMember: 'Code'
				}
			},
			{
				PropertyName: 'WeightType',
				EntityName: 'Material',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.record.weightType'
			},
			{
				PropertyName: 'WeightNumber',
				EntityName: 'Material',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.record.weightNumber'
			},
			{
				PropertyName: 'Weight',
				EntityName: 'Material',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.record.weight'
			},
			{
				PropertyName: 'ExternalCode',
				EntityName: 'Material',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.record.externalCode'
			},
			{
				PropertyName: 'TaxCode',
				EntityName: 'Tax',
				DomainName: 'integer',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'masterdata.context.taxcode',
				DisplayMember: 'Code',
				DisplayName: 'cloud.common.entityTaxCode'
			},
			{
				PropertyName: 'NeutralMaterial_Code',
				ValueName:'NeutralMaterial_Id',
				EntityName: 'NeutralMaterial',
				DomainName: 'lookup',
				Editor: 'idlookup',
				DisplayName: 'basics.material.record.neutralMaterial',
				EditorDirective: 'basics-material-common-material-lookup',
				FormatterOptions: {
					lookupType: 'materialrecord',
					displayMember: 'Code'
				}

			},
			{
				PropertyName: 'BpdAgreement_Description',
				ValueName:'BpdAgreement_Id',
				EntityName: 'BpdAgreement',
				DomainName: 'lookup',
				DisplayName: 'basics.material.record.partnerAgreement',
				Editor: 'idlookup',
				EditorDirective: 'business-partner-main-agreement-lookup',
				FormatterOptions: {
					lookupType: 'Agreement',
					displayMember: 'Description'
				}

			},
			{
				PropertyName: 'Image',
				EntityName: 'Blobs',
				DomainName: 'description',
				Editor: 'none',
				readonly:true,
				DisplayName: 'basics.material.import.image',
				SelectLoad: true
			},
			{
				PropertyName: 'BlobSpecification',
				EntityName: 'Blobs',
				DomainName: 'description',
				Editor: 'none',
				DisplayName: 'basics.material.import.blobSpecification'
			},
			/*{
				PropertyName: 'DocumentFiles',
				EntityName: 'MaterialDocument',
				DomainName: 'description',
				Editor: 'none',
				readonly: true,
				DisplayName: 'basics.material.import.document'
			},*/
			{
				PropertyName: '3DModelFile',
				EntityName: 'ModelView',
				DomainName: 'description',
				Editor: 'none',
				readonly: true,
				DisplayName: 'basics.material.import.3DView',
				SelectLoad: true
			},
			{
				PropertyName: 'LeadTimeExtra',
				EntityName: 'Material',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'cloud.common.entityLeadTimeExtra'
			},
			{
				PropertyName: 'UserDefined1',
				EntityName: 'Userdefined1',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefined1'
			},
			{
				PropertyName: 'UserDefined2',
				EntityName: 'Userdefined2',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefined2'
			},
			{
				PropertyName: 'UserDefined3',
				EntityName: 'Userdefined3',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefined3'
			},
			{
				PropertyName: 'UserDefined4',
				EntityName: 'Userdefined4',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefined4'
			},
			{
				PropertyName: 'UserDefined5',
				EntityName: 'Userdefined5',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefined5'
			},
			{
				PropertyName: 'MdcBrand',
				EntityName: 'MdcBrand',
				DomainName: 'description',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.material.brand',
				DisplayMember: 'Description',
				DisplayName: 'basics.material.import.mdcBrand'
			},
			{
				PropertyName: 'ModelName',
				EntityName: 'ModelName',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.modelName'
			},
			{
				PropertyName: 'UserDefinedText1',
				EntityName: 'UserDefinedText1',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedText1'
			},
			{
				PropertyName: 'UserDefinedText2',
				EntityName: 'UserDefinedText2',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedText2'
			},
			{
				PropertyName: 'UserDefinedText3',
				EntityName: 'UserDefinedText3',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedText3'
			},
			{
				PropertyName: 'UserDefinedText4',
				EntityName: 'UserDefinedText4',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedText4'
			},
			{
				PropertyName: 'UserDefinedText5',
				EntityName: 'UserDefinedText5',
				DomainName: 'description',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedText5'
			},
			{
				PropertyName: 'UserDefinedDate1',
				EntityName: 'UserDefinedDate1',
				DomainName: 'date',
				IsDefaultNullForDomain: true,
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedDate1'
			},
			{
				PropertyName: 'UserDefinedDate2',
				EntityName: 'UserDefinedDate2',
				DomainName: 'date',
				IsDefaultNullForDomain: true,
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedDate2'
			},
			{
				PropertyName: 'UserDefinedDate3',
				EntityName: 'UserDefinedDate3',
				DomainName: 'date',
				IsDefaultNullForDomain: true,
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedDate3'
			},
			{
				PropertyName: 'UserDefinedDate4',
				EntityName: 'UserDefinedDate4',
				DomainName: 'date',
				IsDefaultNullForDomain: true,
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedDate4'
			},
			{
				PropertyName: 'UserDefinedDate5',
				EntityName: 'UserDefinedDate5',
				DomainName: 'date',
				IsDefaultNullForDomain: true,
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedDate5'
			},
			{
				PropertyName: 'UserDefinedNumber1',
				EntityName: 'UserDefinedNumber1',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedNumber1'
			},
			{
				PropertyName: 'UserDefinedNumber2',
				EntityName: 'UserDefinedNumber2',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedNumber2'
			},{
				PropertyName: 'UserDefinedNumber3',
				EntityName: 'UserDefinedNumber3',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedNumber3'
			},{
				PropertyName: 'UserDefinedNumber4',
				EntityName: 'UserDefinedNumber4',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedNumber4'
			},{
				PropertyName: 'UserDefinedNumber5',
				EntityName: 'UserDefinedNumber5',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.import.userdefinedNumber5'
			}, {
				PropertyName: 'MaterialTempCatalog_Code',
				ValueName:'MaterialTempCatalog_Id',
				EntityName: ' MaterialTempCatalog',
				DomainName: 'lookup',
				Editor: 'idlookup',
				DisplayName: 'basics.material.record.materialTemplateCatalog',
				EditorDirective: 'basics-material-material-catalog-dialog-lookup',
				NotUseDefaultValue: true,
				FormatterOptions: {
					lookupType: 'MaterialCatalog',
					displayMember: 'Code'
				}
			}, {
				PropertyName: 'MaterialTemp_Code',
				ValueName:'MaterialTemp_Id',
				EntityName: ' MaterialTemp',
				DomainName: 'lookup',
				Editor: 'idlookup',
				DisplayName: 'basics.material.record.materialTemplate',
				EditorDirective: 'basics-material-common-material-lookup',
				NotUseDefaultValue: true,
				FormatterOptions: {
					lookupType: 'MaterialRecord',
					displayMember: 'Code'
				}
			}, {
				PropertyName: 'MaterialTempType',
				EntityName: 'MaterialTempType',
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.materialtemplatetype',
				DisplayMember: 'Description',
				DisplayName: 'basics.material.record.materialTemplateType'
			},
			{
				PropertyName: 'DangerClass',
				EntityName: 'DangerClass',
				DomainName: 'integer',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.customize.dangerclass',
				DisplayMember: 'Code',
				DisplayName: 'cloud.common.entityDangerClass'
			},
			{
				PropertyName: 'PackageType',
				EntityName: 'PackageType',
				DomainName: 'integer',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.customize.packagingtypes',
				DisplayMember: 'Description',
				DisplayName: 'cloud.common.entityPackagingType'
			},
			{
				PropertyName: 'UomVolume',
				EntityName: 'Uom',
				DomainName: 'integer',
				Editor: 'customlookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.uom',
				DisplayMember: 'UOM',
				DisplayName: 'cloud.common.entityUomVolume',
				EditorDirective: 'basics-lookupdata-uom-lookup',
				FormatterOptions: {
					lookupType: 'uom',
					valueMember: 'Id',
					displayMember: 'Unit'
				}
			},
			{
				PropertyName: 'Volume',
				EntityName: 'Volume',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'cloud.common.entityVolume'
			},
			{
				PropertyName: 'UomWeight',
				EntityName: 'UomWeight',
				DomainName: 'integer',
				Editor: 'customlookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.uom',
				DisplayMember: 'UOM',
				DisplayName: 'basics.material.record.uomWeight',
				EditorDirective: 'basics-lookupdata-uom-lookup',
				FormatterOptions: {
					lookupType: 'uom',
					valueMember: 'Id',
					displayMember: 'Unit'
				}

			}, {
				PropertyName: 'MaterialType',
				EntityName: 'MaterialType',
				DomainName: 'integer',
				Editor: 'simplelookup',
				LookupQualifier: 'basics.customize.materialtype',
				DisplayMember: 'Description',
				DisplayName: 'basics.material.record.materialType'
			},
			{
				PropertyName: 'DocumentBlobSpecification',
				EntityName: 'Blobs',
				DomainName: 'description',
				Editor: 'none',
				DisplayName: 'basics.material.import.documentBlobSpecification'
			},
			{
				PropertyName: 'Co2Source',
				EntityName: 'Co2Source',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.record.entityCo2Source'
			},
			{
				PropertyName: 'Co2Project',
				EntityName: 'Co2Project',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.record.entityCo2Project'
			},
			{
				PropertyName: 'BasCo2SourceName',
				EntityName: 'BasCo2SourceName',
				DomainName: 'integer',
				Editor: 'customlookup',
				DisplayName: 'basics.material.record.entityBasCo2SourceFk',
				EditorDirective: 'basics-lookupdata-source-name-lookup',
				FormatterOptions: {
					lookupType: 'co2sourcename',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					version :3
				}
			},
		],
		PriceList:[
			{
				PropertyName: 'PriceVersion',
				EntityName: 'MatPriceVer',
				DomainName: 'description',
				Editor: 'none',
				DisplayName: 'basics.materialcatalog.priceVersions',
				ColumnNameReadOnly:true
			},
			{
				PropertyName: 'MaterialCode',
				EntityName: 'Material',
				DomainName: 'code',
				Editor: 'none',
				DisplayName: 'basics.material.import.materialCode',
				ColumnNameReadOnly:true
			},
			{
				PropertyName: 'Currency',
				EntityName: 'BasCurrency',
				DomainName: 'integer',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'basics.currency',
				DisplayMember: 'Currency',
				DisplayName: 'cloud.common.entityCurrency'
			},{
				PropertyName: 'RetailPrice',
				EntityName: 'MatPriceList',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.retailPrice'
			},
			{
				PropertyName: 'ListPrice',
				EntityName: 'MatPriceList',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.listPrice'
			},
			{
				PropertyName: 'Discount',
				EntityName: 'MatPriceList',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.discount'
			},
			{
				PropertyName: 'Charges',
				EntityName: 'MatPriceList',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.charges'
			},
			{
				PropertyName: 'LeadTime',
				EntityName: 'MatPriceList',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.materialSearchLookup.htmlTranslate.leadTimes'
			},
			{
				PropertyName: 'MinQuantity',
				EntityName: 'MatPriceList',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.record.minQuantity'
			},
			{
				PropertyName: 'SellUnit',
				EntityName: 'MatPriceList',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.record.sellUnit'
			},
			{
				PropertyName: 'TaxCode',
				EntityName: 'Tax',
				DomainName: 'integer',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'masterdata.context.taxcode',
				DisplayMember: 'Code',
				DisplayName: 'cloud.common.entityTaxCode'
			},
			{
				PropertyName: 'PriceCondition',
				EntityName: 'PriceCondition',
				DomainName: 'integer',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'prc.pricecondition',
				DisplayMember: 'description',
				DisplayName: 'cloud.common.entityPriceCondition'
			},
			{
				PropertyName: 'PriceConditionType',
				EntityName: 'MaterialPriceCondition',
				DomainName: 'description',
				Editor: 'simplelookup',
				NotUseDefaultValue: true,
				LookupQualifier: 'prc.priceconditiontype',
				DisplayMember: 'code',
				DisplayName: 'basics.material.import.priceConditionType'
			},
			{
				PropertyName: 'PriceConditionValue',
				EntityName: 'MaterialPriceCondition',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.import.priceConditionValue'
			},
			{
				PropertyName: 'EstimatePrice',
				EntityName: 'MatPriceList',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.estimatePrice'
			},
			{
				PropertyName: 'DayworkRate',
				EntityName: 'MatPriceList',
				DomainName: 'money',
				Editor: 'domain',
				DisplayName: 'basics.material.record.dayworkRate'
			},
			{
				PropertyName: 'Co2Source',
				EntityName: 'Co2Source',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.record.entityCo2Source'
			},
			{
				PropertyName: 'Co2Project',
				EntityName: 'Co2Project',
				DomainName: 'quantity',
				Editor: 'domain',
				DisplayName: 'basics.material.record.entityCo2Project'
			},
			{
				PropertyName: 'BasCo2SourceName',
				EntityName: 'BasCo2SourceName',
				DomainName: 'integer',
				Editor: 'customlookup',
				DisplayName: 'basics.material.record.entityBasCo2SourceFk',
				EditorDirective: 'basics-lookupdata-source-name-lookup',
				FormatterOptions: {
					lookupType: 'co2sourcename',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated',
					version :3
				}
			}
		]
	});
})(angular);