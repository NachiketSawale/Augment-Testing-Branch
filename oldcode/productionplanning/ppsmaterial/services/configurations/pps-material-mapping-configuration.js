(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.ppsmaterial';

	angular.module(moduleName).factory('productionplanningPpsMaterialMappingLayout', MaterialMappingLayout);
	MaterialMappingLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function MaterialMappingLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'productionplanning.ppsmaterial.productionplanningPpsMaterialMappingLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicData',
					attributes: ['mappingcode', 'description', 'basexternalsourcetypefk','basexternalsourcefk']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid:'entityHistory',
					noInfix: true
				}],
			overloads: {
				basexternalsourcetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.externalsourcetype', '', {showClearButton: true}),
				basexternalsourcefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.externalsource', 'Description', {showClearButton: true, filterKey: 'ppsmaterial-bas-external-resource-filter'})
			}
		};
	}
})(angular);