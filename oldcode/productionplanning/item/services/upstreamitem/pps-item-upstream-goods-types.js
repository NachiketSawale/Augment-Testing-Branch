/**
 * Created by lav on 4/8/2020.
 */
/* globals angular */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).constant('upstreamGoodsTypes', {
		Material: 1,
		Resource: 2,
		Plant: 3,
		Product: 4,
		Unknown:5,
		Formwork: 6,
		Process:7,
		CostCode:8,
		CostCodeTT:9,
		lookupInfo: {
			1: {
				column: 'MdcMaterialFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-material-material-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatterOptions: {
						lookupType: 'MaterialCommodity',
						displayMember: 'Code'
					}
				},
				uomFkPropertyName: 'BasUomFk'
			},
			2: {
				column: 'ResResourceFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'transportplanning-package-resource-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatterOptions: {
						lookupType: 'ResourceMasterResource',
						displayMember: 'Code',
						version: 3
					}
				},
				uomFkPropertyName: 'UomBasisFk'
			},
			3: {
				column: 'EtmPlantFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'resource-equipment-plant-lookup-dialog-new',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatterOptions: {
						lookupType: 'equipmentPlant',
						displayMember: 'Code',
						version: 3
					}
				},
				uomFkPropertyName: 'UoMFk'
			},
			4: {
				column: 'PpsProductFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'productionplanning-common-product-lookup-new',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatterOptions: {
						lookupType: 'CommonProduct',
						displayMember: 'Code',
						version: 3
					}
				},
				uomFkPropertyName: 'BasUomBillFk'
			},
			5: {
				lookup: {}
			},
			6: {
				column: 'PpsFormworkTypeFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'productionplanning-formworktype-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatterOptions: {
						lookupType: 'FormworkType',
						valueMember: 'Id',
						displayMember: 'DescriptionInfo.Translated',
						version: 3
					}
				}
			},
			7: {
					column: 'ProcessTemplateFk',
					lookup: {
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'pps-process-template-combobox',
							descriptionMember: 'DescriptionInfo.Translated'
						},
						formatterOptions: {
							lookupType: 'ProcessTemplate',
							displayMember: 'DescriptionInfo.Translated',
							version: 3
						}
					}
			},
			8: {
				column: 'MdcCostCodeFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-cost-codes-lookup',
						descriptionMember: 'Code'
					},
					formatterOptions: {
						lookupType: 'costcode',
						displayMember: 'Code',
						version: 3,
					}
				}
			},
			9: {
				column: 'MdcCostCodeTtFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-cost-codes-lookup',
						descriptionMember: 'Code'
					},
					formatterOptions: {
						lookupType: 'costcode',
						displayMember: 'Code',
						version: 3,
					}
				}
			},
		}
	});
})(angular);

