/**
 * Created by lav on 4/8/2020.
 */
/* globals angular */
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).constant('trsGoodsTypes', {
		Generic: 1,
		Product: 2,
		Bundle: 3,
		Plant: 4,
		Resource: 5,
		Material: 6,
		lookupInfo: {
			1: {
				lookup: {}
			},
			2: {
				column: 'PpsProductFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						readonly: true,
						lookupDirective: 'product-type-goods-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatterOptions: {
						lookupType: 'CommonProduct',
						displayMember: 'Code',
						version: 3
					}
				},
				uomFkPropertyName: 'BasUomBillFk',
				weightUomPropertyName: 'BasUomWeightFk',
				lengthUomPropertyName: 'BasUomLengthFk',
				widthUomPropertyName: 'BasUomWidthFk',
				heightUomPropertyName: 'BasUomHeightFk',
				productsDescriptionPropertyName: 'DescriptionInfo.Translated',
				prjStockPropertyName: 'PrjStockFk',
				prjStockLocationPropertyName: 'PrjStockLocationFk',
				productTemplateCodesPropertyName: 'ProductTemplate.Code',
				productTemplateDescriptionsPropertyName: 'ProductTemplate.DescriptionInfo.Translated',
				minProductionDatePropertyName: 'ProdtionSetDate',
				maxProductionDatePropertyName: 'DeliveryDate',
			},
			3: {
				column: 'TrsProductBundleFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'transportplanning-bundle-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatterOptions: {
						lookupType: 'TrsBundleLookup',
						displayMember: 'Code'
					}
				},
				processFn: function (entity) {
					entity.Quantity = 1;
				},
				weightPropertyName: 'Weight',
				weightUomPropertyName: 'BasUomWeightFk',
				lengthPropertyName: 'Length',
				lengthUomPropertyName: 'BasUomLengthFk',
				widthPropertyName: 'Width',
				widthUomPropertyName: 'BasUomWidthFk',
				heightPropertyName: 'Height',
				heightUomPropertyName: 'BasUomHeightFk',
				minProductStatusPropertyName: 'ProductCollectionInfo.ProductsStatusMinId',
				maxProductStatusPropertyName: 'ProductCollectionInfo.ProductsStatusMaxId',
				productsDescriptionPropertyName: 'ProductCollectionInfo.ProductsDescription',
				productsMaxLengthPropertyName: 'ProductCollectionInfo.ProductsMaxLength',
				productsMaxWidthPropertyName: 'ProductCollectionInfo.ProductsMaxWidth',
				productsAreaSumPropertyName: 'ProductCollectionInfo.ProductsAreaSum',
				productsHeightSumPropertyName: 'ProductCollectionInfo.ProductsHeightSum',
				productsWeightSumPropertyName: 'ProductCollectionInfo.ProductsWeightSum',
				productsActualWeightSumPropertyName: 'ProductCollectionInfo.ProductsActualWeightSum',
				prjStockPropertyName: 'ProductCollectionInfo.PrjStockFk',
				prjStockLocationPropertyName: 'ProductCollectionInfo.PrjStockLocationFk',
				productTemplateCodesPropertyName: 'ProductCollectionInfo.ProductTemplateCodes',
				productTemplateDescriptionsPropertyName: 'ProductCollectionInfo.ProductTemplateDescriptions',
				minProductionDatePropertyName: 'ProductCollectionInfo.MinProductionDate',
				maxProductionDatePropertyName: 'ProductCollectionInfo.MaxProductionDate',
			},
			4: {
				column: 'EtmPlantFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'resource-equipment-plant-lookup-dialog-new',
						descriptionMember: 'DescriptionInfo.Translated',
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								args.entity.selectedGood = args.selectedItem;
							}
						}]
					},
					formatterOptions: {
						lookupType: 'equipmentPlant',
						displayMember: 'Code',
						version: 3
					}
				},
				uomFkPropertyName: 'UoMFk',
				dangerClassPropertyName: 'DangerClassFk',
				dangerQuantityPropertyName: 'DangerCapacity',
				dangerUomProperty: 'UomDcFk'
			},
			5: {
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
			6: {
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
				uomFkPropertyName: 'BasUomFk',
				weightPropertyName: 'Weight',
				weightUomPropertyName: 'BasUomWeightFk',
				// dangerClassPropertyName: 'DangerClassFk',
				// dangerQuantityPropertyName: 'Volume',
				// dangerUomProperty: 'UomVolumeFk'
			}
		}
	});
})(angular);

