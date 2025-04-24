/**
 * Created by sandu on 28.01.2016.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsConfigWizardXGroupPValueService
	 * @function
	 *
	 * @description
	 * data service for all WizardXGroupPValue related functionality.
	 */
	configModule.factory('basicsConfigWizardXGroupPValueService', basicsConfigWizardXGroupPValueService);

	basicsConfigWizardXGroupPValueService.$inject = ['basicsConfigWizardXGroupService', 'platformDataServiceFactory', 'basicsConfigWizardXGroupPValueValidationProcessor', '$http', '$log', 'basicsConfigGenWizardInstanceDataService', '$rootScope'];

	function basicsConfigWizardXGroupPValueService(basicsConfigWizardXGroupService, platformDataServiceFactory, basicsConfigWizardXGroupPValueValidationProcessor, $http, $log, WizardInstanceDataService, $rootScope) {
		var serviceFactoryOptions = {
			flatLeafItem: {
				module: configModule,
				serviceName: 'basicsConfigWizardXGroupPValueService',
				entityNameTranslationID: 'basics.config.wizardXGroupPValuesContainerTitle',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/config/wizard2grouppv/'},
				actions: {},
				entityRole: {
					leaf: {
						itemName: 'Wizard2GroupPValue',
						parentService: basicsConfigWizardXGroupService
					}
				},
				entitySelection: {},
				modification: {multi: true},
				presenter: {
					list: {}
				}
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

		var parameterMap = new Map();

		function mapWizardParam(parameter) {
			parameterMap.clear();
			_.each(parameter, function (param) {
				var parameterToMap = [];
				if(!parameterMap.has(param.WizardFk)) {
					parameterToMap.push(param);
					parameterMap.set(param.WizardFk, parameterToMap);
				}else{
					var storedParam = parameterMap.get(param.WizardFk);
					storedParam.push(param);
				}
			});
		}

		serviceContainer.service.getWizardParameter = function (wizardId) {
			return parameterMap.get(wizardId);
		};

		serviceContainer.service.loadWizardParameterTypeG = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/config/wizardparameter/listallparametertypeg'
			}).then(function (response) {
				mapWizardParam(response.data);
				return response.data;
			}, function (error) {
				$log.error(error);
			});
		};

		serviceContainer.service.adjustParameters = function () {
			var wizard2Group = basicsConfigWizardXGroupService.getSelected();
			if (wizard2Group) {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/config/wizard/listWizardsCompleteByWizardId',
					params: {wizardId: wizard2Group.WizardFk}
				}).then(function (response) {
					var parameters = [];
					var x = 0;
					var parameterValues = response.data;
					_.each(parameterValues, function (parameterValue) {
						if (parameterValue.Type === 'P') {
							var data = {
								Id: --x,
								Domain: parameterValue.Domain,
								Value: parameterValue.Value,
								Version: -1,
								Sorting: 0,
								ReportFk: null,
								Wizard2GroupFk: wizard2Group.Id,
								WizardParameterFk: parameterValue.WizardParameterFk,
								InsertedAt: '',
								InsertedBy: 0
							};
							parameters.push(data);
						}
					});

					serviceContainer.service.setList(serviceContainer.service.getList().concat(parameters));
				}, function (error) {
					$log.error(error);
				});
			}
		};

		serviceContainer.service.setWizardParamter = function (args) {
			var selected = basicsConfigWizardXGroupService.getSelected();
			if (selected.Version === 0) {
				var wizardParameter = serviceContainer.service.getWizardParameter(args);
				if (wizardParameter) {
					var parameters = [];
					_.each(wizardParameter, function (param) {
						var data = {
							Domain: param.Domain,
							Value: param.Value,
							Wizard2GroupFk: selected.Id,
							WizardParameterFk: param.Id
						};
						parameters.push(data);
					});
					var parametersCreated = [];
					$http.post(globals.webApiBaseUrl + 'basics/config/wizard2grouppv/createvalues/', parameters).then(function (data) {
						parametersCreated = data.data;
						if (!serviceContainer.service.getList().length) {
							serviceContainer.data.currentParentItem = selected;
							serviceContainer.service.setList(parametersCreated);
							_.each(parametersCreated, function (item) {
								serviceContainer.service.markCurrentItemAsModified(item);
							});
						}
					}, function (error) {
						$log.error(error);
					});
				}
			}
		};

		$rootScope.$on('selectedWizardChanged', function (e, args) {
			serviceContainer.service.setWizardParamter(args);
		});

		WizardInstanceDataService.registerEntityCreated(function entityAdded(args, entity) {
			var instanceParameter = _.find(serviceContainer.service.getList(), {WizardParameterFk: 10});
			if (instanceParameter) {
				instanceParameter.Value = entity.Id;
				serviceContainer.service.markItemAsModified(instanceParameter);
			}
		});

		serviceContainer.data.newEntityValidator = basicsConfigWizardXGroupPValueValidationProcessor;
		return serviceContainer.service;
	}
})(angular);