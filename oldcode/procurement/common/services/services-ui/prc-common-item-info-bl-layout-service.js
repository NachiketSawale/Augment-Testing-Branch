(function(angular){

	'use strict';

	var prcCommonModule = 'procurement.common';
	var cloudCommonModule = 'cloud.common';

	angular.module(prcCommonModule).factory('procurementCommonPrcItemInfoBlLayoutService', procurementPrcItemInfoBlLayoutService);

	procurementPrcItemInfoBlLayoutService.$inject = ['basicsLookupdataConfigGenerator'];

	function procurementPrcItemInfoBlLayoutService(basicsLookupdataConfigGenerator){
		return {
			fid: '',
			version: '',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['reference', 'brief', 'quantity', 'basuomfk', 'pricematerial', 'quantitymaterial']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			translationInfos:{
				extraModules: [prcCommonModule, cloudCommonModule],
				extraWords: {
					Reference:{
						location: cloudCommonModule,
						identifier: 'entityReference',
						initial: 'Reference'
					},
					Brief: {
						location: cloudCommonModule,
						identifier: 'entityBrief',
						initial: 'Brief'
					},
					Quantity:{
						location: cloudCommonModule,
						identifier: 'entityQuantity',
						initial: 'Quantity'
					},
					BasUomFk: {
						location: cloudCommonModule,
						identifier: 'entityUoM',
						initial: 'Uom'
					},
					PriceMaterial: {
						location: prcCommonModule,
						identifier: 'entityMaterialPrice',
						initial: 'Material Price'
					},
					QuantityMaterial: {
						location: prcCommonModule,
						identifier: 'entityMaterialQuantity',
						initial: 'Material Quantity'
					}
				}
			},
			overloads:{
				reference: {
					readonly: true
				},
				brief:{
					readonly: true
				},
				quantity:{
					readonly: true
				},
				basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					readonly: true
				}),
				pricematerial:{
					readonly: true
				},
				quantitymaterial:{
					readonly: true
				}
			}
		};
	}

})(angular);