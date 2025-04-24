/**
 * Created by chi on 5/25/2017.
 */
(function(angular){
	'use strict';
	var modName = 'basics.materialcatalog',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('basicsMaterialCatalogPriceVersionLayout', basicsMaterialCatalogPriceVersionLayout);
	basicsMaterialCatalogPriceVersionLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function basicsMaterialCatalogPriceVersionLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'basics.materialCatalog.priceVesion.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['descriptioninfo', 'pricelistfk', 'validfrom', 'validto', 'datadate', 'weighting']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [cloudCommonModule],
				'extraWords': {
					PriceListFk: {location: modName, identifier: 'entityPriceList', initial: 'Price List'},
					ValidFrom: {location: modName, identifier: 'validFrom', initial: 'Valid From'},
					ValidTo: {location: modName, identifier: 'validTo', initial: 'Valid To'},
					DataDate: {location: modName, identifier: 'entityPriceVersionDataDate', initial: 'Record Date'},
					Weighting: {location: modName, identifier: 'entityWeighting', initial: 'Weighting'}
				}
			},
			'overloads': {
				'pricelistfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.pricelist', null, {required: true})
			}
		};
	}
})(angular);