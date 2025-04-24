(function (angular) {

	'use strict';
	const moduleName = 'productionplanning.configuration';
	let angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationPlannedQuantitySlotLayout', Layout);
	Layout.$inject = ['basicsLookupdataConfigGenerator', 'ppsConfigurationResultLookupConfigService'];

	function Layout(basicsLookupdataConfigGenerator, ppsConfigurationResultLookupConfigService) {

		return {
			'fid': 'productionplanning.configuration.plannedquantityslot.detailForm',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [{
				gid: 'baseGroup',
				attributes: [
					'columnnameinfo', 'descriptioninfo', 'basuomfk', 'ppsplannedquantitytypefk', 'result',
					'mdcproductdescriptionfk'
				]
			}, {
				gid: 'userDefTextGroup',
				isUserDefText: true,
				attCount: 5,
				attName: 'userdefined',
				noInfix: true
			}, {
				gid: 'entityHistory',
				isHistory: true
			}],
			'overloads': {
				basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true,
					showClearButton: false
				}),
				'ppsplannedquantitytypefk':basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsplannedquantitytype', null, {
					showIcon: true
				}),
				result: ppsConfigurationResultLookupConfigService.provideResultLookupConfig(),

				mdcproductdescriptionfk: {
					detail: {
						type: 'directive',
						directive: 'material-product-description-lookup',
						options: {
							displayMember: 'Code',
							filterKey: 'mdc-product-template-material-filter'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'material-product-description-lookup',
							lookupOptions: {
								filterKey: 'mdc-product-template-material-filter',
								displayMember: 'Code',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Code',
							lookupType: 'MDCProductDescriptionTiny'
						}
					}
				}
			}
		};
	}
})(angular);