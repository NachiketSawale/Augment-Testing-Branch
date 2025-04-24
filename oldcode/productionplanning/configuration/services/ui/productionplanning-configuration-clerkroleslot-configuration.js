(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationClerkRoleSlotLayout', Layout);
	Layout.$inject = ['basicsLookupdataConfigGenerator'];
	function Layout(basicsLookupdataConfigGenerator) {

		return {
			'fid': 'productionplanning.configuration.clerkroleslot.detailForm',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [{
				gid: 'baseGroup',
				attributes: [
					'columntitle', 'clerkrolefk', 'ppsentityfk', 'ppsentityreffk', 'isforengtask', 'isreadonly'
				]
			}, {
				gid: 'entityHistory',
				isHistory: true
			}],
			'overloads': {
				clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomClerkRoleLookupDataService',
					cacheEnable: true
				}),
				ppsentityfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'productionplanningConfigurationPpsentityLookupDataService',
					cacheEnable: true,
					filterKey: 'productionplanning-configuration-clerkrole-ppsentityfk-filter'
				}),
				ppsentityreffk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'productionplanningConfigurationPpsentityLookupDataService',
					cacheEnable: true,
					filterKey: 'productionplanning-configuration-clerkrole-ppsentityreffk-filter'
				})
			}
		};
	}
})(angular);