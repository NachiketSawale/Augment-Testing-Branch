(function(angular){
	'use strict';

	angular.module('estimate.main').factory('estimateMainAllowanceAreaUIConfigService', ['platformUIStandardConfigService', 'platformSchemaService',
		'estimateMainTranslationService',
		function(platformUIStandardConfigService, platformSchemaService, estimateMainTranslationService){

			let layout = {
				'fid': 'estimate.main.allowanceArea',
				'version': '1.0.1',
				'showGrouping': false,
				'addValidationAutomatically' : true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [ 'code', 'djctotal', 'gctotal']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'djctotal':{
						readonly: true
					},
					'gctotal':{
						readonly: true
					}
				}
			};

			let BaseService = platformUIStandardConfigService;

			let attributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'EstAllowanceAreaDto',
				moduleSubModule: 'Estimate.Main'
			});

			if(attributeDomains && attributeDomains.properties && attributeDomains.properties.Code){
				attributeDomains.properties.Code.domain = 'description';
			}

			function DashboardUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			DashboardUIStandardService.prototype = Object.create(BaseService.prototype);
			DashboardUIStandardService.prototype.constructor = DashboardUIStandardService;

			return new BaseService(layout, attributeDomains.properties, estimateMainTranslationService);
		}]);
})(angular);