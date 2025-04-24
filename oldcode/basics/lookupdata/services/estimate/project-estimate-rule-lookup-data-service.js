(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	/**
	 * @ngdoc service
	 * @name projectEstimateRuleLookupDataService
	 * @function
	 * @description
	 * #
	 * lookup data service for project estimate rule.
	 */
	angular.module(moduleName).factory('projectEstimateRuleLookupDataService', [
		'$q','$http', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator','estimateMainService',
		function ($q,$http, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator,estimateMainService) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectEstimateRuleLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						width: 100
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						width: 150
					}
				],
				uuid:'9c3ddfadcbff425e83802337e0b5ddd4'
			});

			var lookupData = {};
			var lookupServiceOption = {
				httpRead: {route: globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/', endPointRead: 'list'},
				filterParam: 'projectFk'
			};

			var container = platformLookupDataServiceFactory.createInstance(lookupServiceOption);
			var service = container.service;
			var data = container.data;


			service.getPrjRuleAsync =  function getPrjRuleAsync(ids){
				let projectFk = estimateMainService.getSelectedProjectId();
				if(!projectFk || projectFk <= 0){
					let selectedProject = $injector.get('projectMainService').getSelected();
					projectFk = selectedProject ? selectedProject.Id : projectFk;
				}

				return $http.get(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/list?projectFk=' + projectFk).then(function(response){
					if(response && response.data){
						container.data.dataCache.update(projectFk,response.data);
						return response.data;
					}else{
						return [];
					}
				});
			};

			service.getItemById = function getItemById(value,options) {
				var result = container.data.getByFilter(function (item) {
					return item.Id === value;
				}, options);
				return result;
			};

			service.getItemByKey = function getItemByKey(value) {
				return service.getItemById(value);
			};

			service.getItemByIdAsync = function getItemByIdAsync(id) {

				if(!lookupData.estPrjRulesPromise) {
					lookupData.estPrjRulesPromise = service.getPrjRuleAsync(id);
				}
				return lookupData.estPrjRulesPromise.then(function (data) {
					lookupData.estPrjRulesPromise = null;

					if (data && data.length) {
						var result =_.filter(data,{'Id':id});
						if(result && result.length){
							return result[0];
						}else{
							return null;
						}

					}else{
						return null;
					}
				});
			};

			return service;
		}
	]);
})(angular);