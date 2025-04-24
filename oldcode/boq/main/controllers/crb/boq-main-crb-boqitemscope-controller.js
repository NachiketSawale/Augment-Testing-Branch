(function () {
	/* global globals, _ */
	'use strict';

	var angularModule = angular.module('boq.main');

	angularModule.value('boqMainCrbCostgroupFkPropertyNames', ['CostgroupKagFk', 'CostgroupOglFk', 'CostgroupEglFk', 'CostgroupEtFk', 'CostgroupNglFk', 'CostgroupRglFk']); // VGR is not wanted by IMPLENIA

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 * @description
	 **/
	angularModule.controller('boqMainCrbBoqItemScopeController', ['$scope', 'boqMainService', 'boqMainCrbBoqItemScopeService',
		function ($scope, boqMainService, boqMainCrbBoqItemScopeService) {
			boqMainCrbBoqItemScopeService.initController($scope, boqMainService);
		}
	]);

	angularModule.factory('boqMainCrbBoqItemScopeService', ['platformGridControllerService', 'boqMainCrbBoqItemScopeUiService', 'boqMainCrbBoqItemScopeDataService', 'boqMainCrbBoqItemScopeValidationService', 'boqMainCrbService',
		function (platformGridControllerService, boqMainCrbBoqItemScopeUiService, boqMainCrbBoqItemScopeDataService, boqMainCrbBoqItemScopeValidationService, boqMainCrbService) {
			var dataService;

			return {
				initController: function ($scope, boqMainService) {
					dataService = boqMainCrbBoqItemScopeDataService.getService(boqMainService, $scope);
					platformGridControllerService.initListController($scope, boqMainCrbBoqItemScopeUiService, dataService, boqMainCrbBoqItemScopeValidationService, {});
					boqMainCrbBoqItemScopeUiService.setDataService(dataService);
					boqMainCrbBoqItemScopeValidationService.setDataService(dataService);

					boqMainCrbService.tryDisableContainer($scope, boqMainService, false);

					// Registers/Unregisters functions
					dataService.registerEntityDeleted(boqMainCrbBoqItemScopeValidationService.onBoqItemScopeDeleted);
					boqMainCrbService.crbCostgrpCatAssignsChanged.register(dataService.onCrbCostgrpCatAssignsChanged);
					$scope.$on('$destroy', function () {
						boqMainCrbService.crbCostgrpCatAssignsChanged.unregister(dataService.onCrbCostgrpCatAssignsChanged);
						dataService.unregisterEntityDeleted(boqMainCrbBoqItemScopeValidationService.onBoqItemScopeDeleted);
					});
				}
			};
		}
	]);

	angularModule.factory('boqMainCrbBoqItemScopeUiService', ['platformUIStandardConfigService', 'platformSchemaService', 'basicsCostGroupLookupConfigService', 'boqMainTranslationService', 'boqMainCrbCostgroupFkPropertyNames',
		function (PlatformUIStandardConfigService, platformSchemaService, basicsCostGroupLookupConfigService, boqMainTranslationService, boqMainCrbCostgroupFkPropertyNames) {
			var uiService;
			var dataService;

			function getOverloadItems() {
				var ret = {};
				_.forEach(boqMainCrbCostgroupFkPropertyNames, function (costgroupFkPropName) {
					ret[_.toLower(costgroupFkPropName)] = basicsCostGroupLookupConfigService.provideProjectConfig(
						{
							costGroupTypeGetter: function () {
								return dataService.getCostGroupType(costgroupFkPropName);
							},
							catalogIdGetter: function () {
								return dataService.getCostgroupCatId(costgroupFkPropName);
							},
							projectIdGetter: function () {
								return dataService.getProjectId();
							}
						});
				});

				return ret;
			}

			var domainSchema = platformSchemaService.getSchemaFromCache({moduleSubModule: 'Boq.Main', typeName: 'CrbBoqItemScopeDto'});
			var gridLayout =
				{
					fid: 'boq.main.crb.crbboqitemscope.grid.config',
					addValidationAutomatically: true,
					groups: [{
						'gid': 'basicData', 'attributes': _.map(boqMainCrbCostgroupFkPropertyNames, function (propName) {
							return propName.toLowerCase();
						})
					},
					{'gid': 'entityHistory', 'isHistory': true}],
					overloads: getOverloadItems()
				};

			uiService = new PlatformUIStandardConfigService(gridLayout, domainSchema.properties, boqMainTranslationService);
			uiService.setDataService = function (dataServiceParam) {
				dataService = dataServiceParam;
			};

			return uiService;
		}
	]);

	angularModule.factory('boqMainCrbBoqItemScopeDataService', ['$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'basicsCostGroupType', 'boqMainCrbCostgroupFkPropertyNames',
		function ($http, platformDataServiceFactory, platformRuntimeDataService, basicsCostGroupType, boqMainCrbCostgroupFkPropertyNames) {
			var thisService;
			var thisData;
			var boqMainService;
			var crbCostgrpCatAssigns;
			var baseRoute = globals.webApiBaseUrl + 'boq/main/crbboqitemscope/';

			function getCrbCostgrpCatAssign(costgroupFkPropName) {
				var ret = null;

				function getCostgroupCatFk(code) {
					return _.find(crbCostgrpCatAssigns, {'Code': code});
				}

				// VGR is not wanted by IMPLENIA
				switch (costgroupFkPropName) {
					case 'CostgroupKagFk': {
						ret = getCostgroupCatFk('001');
					}
						break;
					case 'CostgroupOglFk': {
						ret = getCostgroupCatFk('002');
					}
						break;
					case 'CostgroupEglFk': {
						ret = getCostgroupCatFk('003');
					}
						break;
					case 'CostgroupEtFk': {
						ret = getCostgroupCatFk('004');
					}
						break;
					case 'CostgroupNglFk': {
						ret = getCostgroupCatFk('007');
					}
						break;
					case 'CostgroupRglFk': {
						ret = getCostgroupCatFk('008');
					}
						break;
				}

				return ret;
			}

			function setReadonlyFields(boqItemScopes) {
				var readonlyItems = [];

				_.forEach(boqMainCrbCostgroupFkPropertyNames, function (costgroupFkPropName) {
					readonlyItems.push({field: costgroupFkPropName, readonly: !thisService.getCostgroupCatId(costgroupFkPropName)});
				});

				_.forEach(boqItemScopes, function (boqItemScope) {
					platformRuntimeDataService.readonly(boqItemScope, readonlyItems);
				});
			}

			return {
				getService: function (boqMainServiceParam) {
					if (boqMainService !== boqMainServiceParam) {
						thisService = null;
						boqMainService = boqMainServiceParam;
					}

					if (!thisService) {
						var serviceOptions =
							{
								flatLeafItem:
									{
										serviceName: 'boqMainCrbBoqItemScopeDataService',
										entityRole: {leaf: {itemName: 'CrbBoqItemScope', parentService: boqMainService}},
										actions:
											{
												delete: true, create: 'flat',
												canCreateCallBackFunc: function () {
													var currentBoqItem = boqMainService.getSelected();
													return currentBoqItem && currentBoqItem.IsPreliminary;
												}
											},
										httpRead:
											{
												route: baseRoute, endRead: 'list',
												initReadData: function (readData) {
													var currentBoqItem = boqMainService.getSelected();
													readData.filter = '?boqHeaderId=' + currentBoqItem.BoqHeaderFk + '&boqItemId=' + currentBoqItem.Id;
												}
											},
										httpCreate: {route: baseRoute, endCreate: 'create'},
										presenter: {
											list: {
												incorporateDataRead: function (boqItemScopes, data) {
													var rootBoqItem = boqMainService.getRootBoqItem();
													if (boqMainService.isCrbBoq() && rootBoqItem && (!crbCostgrpCatAssigns || _.some(crbCostgrpCatAssigns, function (ca) {
														return ca.BoqHeaderFk !== rootBoqItem.BoqHeaderFk;
													}))) {
														$http.get(globals.webApiBaseUrl + 'boq/main/crb/costgroupcat/' + 'getassigns?boqHeaderId=' + rootBoqItem.BoqHeaderFk)
															.then(function (response) {
																crbCostgrpCatAssigns = response.data;
																setReadonlyFields(boqItemScopes);
															});
													} else {
														setReadonlyFields(boqItemScopes);
													}

													return thisData.handleReadSucceeded(boqItemScopes, data);
												},
												handleCreateSucceeded: function (newBoqItemScope) {
													var currentBoqItem = boqMainService.getSelected();

													newBoqItemScope.BoqHeaderFk = currentBoqItem.BoqHeaderFk;
													newBoqItemScope.BoqItemFk = currentBoqItem.Id;

													setReadonlyFields([newBoqItemScope]);

													return newBoqItemScope;
												}
											}
										}
									}
							};
						var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
						thisService = serviceContainer.service;
						thisData = serviceContainer.data;

						thisService.getCostGroupType = function (costgroupFkPropName) {
							return getCrbCostgrpCatAssign(costgroupFkPropName).IsProjectCatalog ? basicsCostGroupType.projectCostGroup : basicsCostGroupType.licCostGroup;
						};

						thisService.getCostgroupCatId = function (costgroupFkPropName) {
							var crbCostgrpCatAssign = getCrbCostgrpCatAssign(costgroupFkPropName);
							return crbCostgrpCatAssign ? crbCostgrpCatAssign.BasCostgroupCatFk : undefined;
						};

						thisService.getProjectId = function () {
							return boqMainService.getSelectedProjectId();
						};

						thisService.onCrbCostgrpCatAssignsChanged = function () {
							crbCostgrpCatAssigns = undefined;
						};
					}

					return thisService;
				}
			};
		}
	]);

	angularModule.factory('boqMainCrbBoqItemScopeValidationService', ['$http', '$q', 'platformDataValidationService', 'platformRuntimeDataService', 'boqMainCrbCostgroupFkPropertyNames',
		function ($http, $q, platformValidationService, platformRuntimeDataService, boqMainCrbCostgroupFkPropertyNames) {
			var dataService;
			var validationService = {};

			function checkIsUnique(changedScope, propValue, propName, asyncMarker) {
				function isUnique(scope1, scope2) {
					var ret = true;
					_.forEach(boqMainCrbCostgroupFkPropertyNames, function (costgroupFkPropName) {
						if (ret) {
							ret = scope1[costgroupFkPropName] === scope2[costgroupFkPropName];
						}
					});
					return ret;
				}

				function finishValidation(equalScopes, aScope, propValue, propName, asyncMarker) {
					var result = (equalScopes.length > 1 && _.includes(equalScopes, aScope)) ? platformValidationService.createErrorObject('boq.main.errorCrbBoqitemScopeUnique') : true;
					platformRuntimeDataService.applyValidationResult(result, aScope, propName);
					return platformValidationService.finishAsyncValidation(result, aScope, propValue, propName, asyncMarker, validationService, dataService);
				}

				var allScopes = dataService.getList();
				var equalScopes = [];

				if (_.isObject(changedScope)) {
					changedScope[propName] = propValue;
				}

				_.forEach(allScopes, function (aScope1) {
					_.forEach(allScopes, function (aScope2) {
						if (aScope1 !== aScope2 && !_.includes(equalScopes, aScope1) && isUnique(aScope1, aScope2)) {
							equalScopes.push(aScope1);
						}
					});
				});

				_.forEach(Object.values(allScopes), function (aScope) {
					_.forEach(boqMainCrbCostgroupFkPropertyNames, function (costgroupFkPropName) {
						finishValidation(equalScopes, aScope, aScope[costgroupFkPropName], costgroupFkPropName, null);
					});
				});

				return _.isObject(changedScope) ? finishValidation(equalScopes, changedScope, propValue, propName, asyncMarker) : true;
			}

			_.forEach(boqMainCrbCostgroupFkPropertyNames, function (costgroupFkPropName) {
				validationService['asyncValidate' + costgroupFkPropName] = function (changedScope, propValue, propName) {
					var asyncMarker;
					asyncMarker = platformValidationService.registerAsyncCall(changedScope, propName, propValue, dataService);
					asyncMarker.myPromise = $q.when(true);

					var ret = checkIsUnique(changedScope, propValue, propName, asyncMarker);
					if (ret !== true) {
						asyncMarker.myPromise = $q.when(ret);
					}

					return asyncMarker.myPromise;
				};
			});

			validationService.onBoqItemScopeDeleted = function () {
				checkIsUnique();
			};

			validationService.setDataService = function (dataServiceParam) {
				dataService = dataServiceParam;
			};

			return validationService;
		}
	]);
})();
