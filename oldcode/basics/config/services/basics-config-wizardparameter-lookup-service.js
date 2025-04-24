/**
 * Created by sandu on 17.02.2016.
 */
(function(angular){
	'use strict';
	var moduleName = 'basics.config';
	angular.module(moduleName).factory('basicsConfigWizardParameterLookupService',basicsConfigWizardParameterLookupService);
	basicsConfigWizardParameterLookupService.$inject = ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator'];
	function basicsConfigWizardParameterLookupService (platformLookupDataServiceFactory,basicsLookupdataConfigGenerator){
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigWizardParameterLookupService',{
			valMember: 'Id',
			dispMember: 'Name',
			columns: [
				{
					id: 'Name',
					field: 'Name',
					name: 'Name',
					formatter: 'description',
					width: 300,
					name$tr$: 'basics.config.entityWizardParameterName'
				}
			],
			uuid: '103908ea1ef04f5d8ec0682593459e61'
		});
		var wizardParameterLookupDataServiceConfig = {
			httpRead: { route: globals.webApiBaseUrl + 'basics/config/wizardparameter/', endPointRead:'listTypeG'},
			filterParam: 'mainItemId'
		};
		return platformLookupDataServiceFactory.createInstance(wizardParameterLookupDataServiceConfig).service;
	}
})(angular);