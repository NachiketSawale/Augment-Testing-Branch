
(function (angular) {
	'use strict';
	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleParameterComplexInputgroupLookupService',
		['$http', '$injector', 'PlatformMessenger', 'platformCreateUuid', 'platformGridAPI','estimateRuleCommonService',
			function ($http, $injector, PlatformMessenger,  platformCreateUuid, platformGridAPI,estimateRuleCommonService) {

				let service= {
					dataService : {}
				};

				service.initController = function initController(scope, lookupControllerFactory, opt, popupInstance, coloumns) {
					let displayData = '';
					if (opt.itemName === 'ProjectRuleParams') {
						let prjId = $injector.get('projectMainService').getIfSelectedIdElse(null);
						estimateRuleCommonService.GetAllPrjRuleParametersByCode(scope.entity.Code,prjId).then(function (response) {
							let ruleParams = response.ruleParams;
							let rules = response.rules;

							for (let i = 0; i < rules.length; i++) {
								if (ruleParams[i].PrjEstRuleFk === rules[i].Id) {
									rules[i].ParamCode = ruleParams[i].Code;
									rules[i].ParamDesc = ruleParams[i].DescriptionInfo;
									rules[i].UomFk =  ruleParams[i].UomFk;
									rules[i].ValueType =  ruleParams[i].ValueType;
									rules[i].IsLookup =  ruleParams[i].IsLookup;
								}
							}
							displayData = rules;
							dataService.updateData(displayData);
						});
					} else if (opt.itemName === 'EstRuleParams') {
						estimateRuleCommonService.GetAllRuleAndRuleParamByCode(scope.entity.Code).then(function (response) {
							let ruleParams = response.ruleParams;
							let rules = response.rules;

							for (let i = 0; i < rules.length; i++) {
								if (ruleParams[i].EstRuleFk === rules[i].Id) {
									rules[i].ParamCode = ruleParams[i].Code;
									rules[i].ParamDesc = ruleParams[i].DescriptionInfo;
									rules[i].UomFk =  ruleParams[i].UomFk;
									rules[i].ValueType =  ruleParams[i].ValueType;
									rules[i].IsLookup =  ruleParams[i].IsLookup;
								}
							}
							displayData = rules;
							dataService.updateData(displayData);
						});
					}


					let gridId = platformCreateUuid();
					scope.displayItem = displayData;
					let gridOptions = {
						gridId: gridId,
						columns: coloumns,
						idProperty: 'Id'
					};

					service.dataService = lookupControllerFactory.create({grid: true}, scope, gridOptions);
					let dataService = service.dataService;

					dataService.getList = function getList() {
						return displayData;
					};

					dataService.scope = scope;
					dataService.opt = opt;

					// resize the content by interaction
					popupInstance.onResizeStop.register(function () {
						platformGridAPI.grids.resize(gridOptions.gridId);
					});


					scope.$on('$destroy', function () {
					});
				};
				return service;
			}]);
})(angular);
