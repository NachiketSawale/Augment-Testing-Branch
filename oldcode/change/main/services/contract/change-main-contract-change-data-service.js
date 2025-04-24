(function (angular) {
	/* global globals,_ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name changeMainContractChangeDataService
	 */
	var moduleName = 'change.main';
	var changeMainModule = angular.module(moduleName);
	changeMainModule.factory('changeMainContractChangeDataService', ['$translate', 'platformDataServiceFactory', '$http',
		'platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceFieldReadonlyProcessorFactory', 'platformDataServiceActionExtension', 'platformModalService',
		'cloudDesktopSidebarService', 'basicsCommonMandatoryProcessor', 'changeMainConstantValues', 'basicsCompanyNumberGenerationInfoService', 'procurementContractHeaderDataService', 'basicsLookupdataLookupFilterService',

		function ($translate, platformDataServiceFactory, $http,
			platformDataServiceProcessDatesBySchemeExtension, platformDataServiceFieldReadonlyProcessorFactory, platformDataServiceActionExtension, platformModalService,
			cloudDesktopSidebarService, basicsCommonMandatoryProcessor, changeMainConstantValues, basicsCompanyNumberGenerationInfoService, parentService, basicsLookupdataLookupFilterService) {

			basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('changeMainNumberInfoService', changeMainConstantValues.rubricId).load();
			let factoryOptions = {
				flatLeafItem: {
					module: changeMainModule,
					serviceName: 'changeMainContractChangeDataService',
					entityNameTranslationID: 'procurement.contract.projectChangeTitle',
					httpRead: {
						route: globals.webApiBaseUrl + 'change/main/', endRead: 'byProjectInContract', endDelete: 'multidelete', usePostForRead: true,
						initReadData: function initReadData(readData) {
							let parentItem = parentService.getSelected();
							readData.PKey1 = _.isNil(parentItem.ProjectFk) ? -1 : parentItem.ProjectFk;
							readData.PKey2 = parentItem.PrcHeaderEntity.ConfigurationFk;
							readData.PKey3 = parentItem.ContractHeaderFk;
						}
					},
					httpCreate: {route: globals.webApiBaseUrl + 'change/main/', endCreate: 'createByContract'},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ChangeDto',
						moduleSubModule: 'Change.Main'
					}), platformDataServiceFieldReadonlyProcessorFactory.createProcessor([{
						field: 'RubricCategoryFk', evaluate: function (item) {
							return item.Version >= 1;
						}
					}, {
						field: 'Code', evaluate: function (item) {
							if (item.Version === 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('changeMainNumberInfoService', changeMainConstantValues.rubricId).hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
								item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('changeMainNumberInfoService', changeMainConstantValues.rubricId).provideNumberDefaultText(item.RubricCategoryFk, item.Code);
								return true;
							} else {
								return false;
							}
						}
					}])
					],
					actions: {
						delete: true, create: 'flat'
					},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let parentItem = parentService.getSelected();
								if (parentItem) {
									creationData.PKey1 = parentItem.ProjectFk;
									creationData.PKey2 = parentItem.PrcHeaderEntity.ConfigurationFk;
									creationData.PKey3 = parentItem.ContractHeaderFk !== null ? parentItem.ContractHeaderFk : parentItem.Id;
								}
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'Change',
							parentService: parentService,
							doesRequireLoadAlways: false
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			let service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'changeMainValidationService'
			}, changeMainConstantValues.schemes.change));

			service.createItem = function createChangeOrder(creationOptions) {
				let parentItem = parentService.getSelected();
				if (parentItem && parentItem.ProjectFk) {
					return platformDataServiceActionExtension.createItem(creationOptions, serviceContainer.data);
				} else {
					let title = $translate.instant('cloud.common.buttonCreate') + ' ' + $translate.instant('cloud.common.errorMessage');
					let warningMessage = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('cloud.common.entityProjectNo')});
					platformModalService.showMsgBox(warningMessage, title, 'warning');
					return false;
				}
			};

			let basDeleteItem = serviceContainer.service.deleteEntities;
			service.deleteEntities = function deleteItem(entity) {
				if (entity && entity[0].Id) {
					$http.get(globals.webApiBaseUrl + 'procurement/contract/header/tochange?changeId=' + entity[0].Id + '&projectId=' + entity[0].ProjectFk)
						.then(function (response) {
							if (response.data && response.data.length > 0) {
								let title = $translate.instant('cloud.common.delete') + ' ' + $translate.instant('cloud.common.errorMessage');
								let warningMessage = $translate.instant('procurement.contract.notDeleteChange');
								platformModalService.showMsgBox(warningMessage, title, 'warning');
							} else {
								return basDeleteItem(entity);
							}
						});
				}
			};

			function loadChangesForNavigation(item, triggerField) {
				let changeId = item[triggerField];
				if (changeId) {
					service.load().then(function () {
						let change = service.getItemById(changeId);
						service.setSelected(change);
					});
				}
			}

			service.navigateToChange = function navigateToChange(item, triggerField) {
				if (!_.isNil(item.ProjectFk)) {
					cloudDesktopSidebarService.setCurrentProjectToPinnningContext(null, 'ProjectFk', item).then(function () {
						loadChangesForNavigation(item, triggerField);
					});
				} else {
					loadChangesForNavigation(item, triggerField);
				}
			};

			let filters = [{
				key: 'change-main-rubric-category-by-rubric-filter',
				fn: function (rc) {
					return rc.RubricFk === 14;
				}
			}, {
				key: 'change-main-type-by-rubric-category-filter',
				fn: function (item, entity) {
					return entity.Version === 0 || item.RubricCategoryFk === entity.RubricCategoryFk;
				}
			}, {
				key: 'change-main-by-rubric-category-filter',
				fn: function (item, entity) {
					return item.RubricCategoryFk === entity.RubricCategoryFk;
				}
			}, {
				key: 'change-main-rubric-category-by-rubric-and-islive-filter',
				fn: function (rc) {
					return rc.RubricFk === 14 && rc.isLive === true;
				}
			}];
			_.each(filters, function (filter) {
				if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
					basicsLookupdataLookupFilterService.registerFilter(filter);
				}
			});
			return service;

		}]);
})(angular);
