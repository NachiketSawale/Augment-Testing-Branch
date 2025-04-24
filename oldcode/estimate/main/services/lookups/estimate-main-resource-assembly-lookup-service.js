/**
 * Created by wul on 5/6/2019.
 */
(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResourceAssemblyLookupService', ['$q', '$http', '$injector', 'estimateMainResourceFrom','estimateMainWizardContext', 'estimateMainFilterService', 'estimateAssembliesFilterService',
		function ($q, $http, $injector,estimateMainResourceFrom, estimateMainWizardContext, estimateMainFilterService, estimateAssembliesFilterService) {
			let service = {};

			let assemblies = [],
				estimateScope = 0;

			service.setEstimateScope = function (estScope) {
				estimateScope = estScope;
			};

			service.getEstimateScope = function () {
				return estimateScope;
			};

			service.clear = function clear(){
				assemblies = [];
			};

			service.getList = function getList(){
				return assemblies;
			};

			service.getEstimateAssemblies = function getEstimateAssembly() {
				if(assemblies && assemblies.length > 0){
					return $q.when(assemblies);
				}

				return service.reloadAssemblies();
			};

			service.reloadAssemblies = function () {
				// let estHeaderFk = 0,
				//     projectFk = 0,
				//     currentEstLineItemFk = 0;
				// let estHeaderContext = _.find($injector('cloudDesktopPinningContextService').getContext(), {token: moduleName});
				// estHeaderFk = estHeaderContext ? estHeaderContext.id : 0;
				// projectFk = $injector('estimateMainService').getSelectedProjectId();

				let wizardConifg = estimateMainWizardContext.getConfig();
				let filterRequest =
                    wizardConifg === estimateMainResourceFrom.EstimateAssemblyResource ? estimateAssembliesFilterService.getFilterRequest() : estimateMainFilterService.getFilterRequest();

				let filterData = {
					filterRequest: filterRequest,
					ResourceFrom: wizardConifg,
					EstimateScope: 0
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getresourceassembly', filterData).then(function (response) {
					assemblies = [];
					if(response.data){
						_.forEach(response.data, function (item) {
							if(!_.find(assemblies, {JobCode:item.JobCode, Code: item.Code})){
								assemblies.push(item);
							}
						});
					}

					return assemblies;
				});
			};

			service.getAssemblyById = function (id) {
				return _.find(assemblies, {Id: id});
			};

			let currentCode = '';
			service.setCurrentCode = function(code){
				currentCode = code;
			};

			service.getFilterList = function () {
				if(assemblies && assemblies.length > 0){
					return $q.when(_.filter(assemblies, {Code: currentCode}));
				}

				return service.reloadAssemblies().then(function (result) {
					return $q.when(_.filter(result, {Code: currentCode}));
				});
			};

			return service;
		}]);
})();
