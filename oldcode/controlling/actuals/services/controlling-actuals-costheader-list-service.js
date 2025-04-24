/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'controlling.actuals';
	let actualsModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 *
	 * @name controllingActualsCostHeaderListService
	 * @function
	 *
	 * @description
	 * controllingActualsCostHeaderListService is the data service for all currency related functionality.
	 */

	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).factory('controllingActualsCostHeaderListService', ['_', 'moment', 'globals', '$http', '$q', '$injector', 'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService', 'ServiceDataProcessArraysExtension', 'basicsLookupdataLookupFilterService', 'platformContextService', 'basicsCommonMandatoryProcessor',
		'actualsNumberGenerationSettingsService',
		'ServiceDataProcessDatesExtension',
		'platformDataValidationService',
		'platformRuntimeDataService',
		'projectMainPinnableEntityService',
		'estimateProjectRateBookConfigDataService',
		'controllingActualsPinnableEntityService',
		'$translate',
		'cloudDesktopPinningContextService',
		function (_, moment, globals, $http, $q, $injector, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, ServiceDataProcessArraysExtension,
			basicsLookupdataLookupFilterService, platformContextService, basicsCommonMandatoryProcessor,
			actualsNumberGenerationSettingsService,
			ServiceDataProcessDatesExtension,
			platformDataValidationService,
			platformRuntimeDataService,
			projectMainPinnableEntityService,
			estimateProjectRateBookConfigDataService,
			controllingActualsPinnableEntityService,
			$translate,
			cloudDesktopPinningContextService) {
			let selectedCostHeaderId = null,
				selectedCostHeaderItem = null;
			let serviceContainer = {};
			/* companyLedgerContext = null;
			var validationService = null; */

			// The instance of the main service - to be filled with functionality below
			let controllingActualsCostHeaderListServiceOptions = {
				flatRootItem: {
					module: actualsModule,
					serviceName: 'controllingActualsCostHeaderListService',
					entityNameTranslationID: 'controlling.actuals.project',
					httpCreate: {
						route: globals.webApiBaseUrl + 'controlling/actuals/costheader/',
						endCreate: 'create'
					},
					httpRead: {
						useLocalResources: true,
						route: globals.webApiBaseUrl + 'controlling/actuals/costheader/',
						usePostForRead: true,
						endRead: 'list'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'controlling/actuals/costheader/',
						endDelete: 'delete'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'controlling/actuals/',
						endUpdate: 'update'
					},
					entityRole: {
						root: {
							codeField: 'Code',
							itemName: 'controllingActualsCostHeader',
							moduleName: 'cloud.desktop.moduleDisplayNameControllingActuals',
							handleUpdateDone: function (updateData, response, data) {
								if (updateData.controllingActualsCostHeader && !updateData.controllingActualsCostHeader.Version) {
									platformRuntimeDataService.readonly(response.ControllingActualsCostHeader, [{
										field: 'Code',
										readonly: false
									}]);
								}
								if (response.ControllingActualsCostHeader) {
									response.controllingActualsCostHeader = response.ControllingActualsCostHeader;
								}
								data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
						}
					},
					entitySelection: {supportsMultiSelection: false},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								let res = serviceContainer.data.handleReadSucceeded(readData, data);
								if (_.get(readData, 'selectedPrj')) {
									let projectId = _.get(readData, 'selectedPrj.Id');
									// var estHeader = _.get(_.first(_.get(readData, 'prjEstComposites')), 'EstHeader');
									// project favorites are used, we set pinning context
									setCosHeaderToPinningContext(projectId);
									// isLoadByPrjFavorites = false;
								}
								return res;
							},
							initCreationData: function initCreationData(creationData) {
								let context = cloudDesktopPinningContextService.getContext();
								let item =_.find(context, {'token': 'project.main'});
								creationData.ProjectFk = item ? item.id : -1;
							}
						}
					},
					// TODO: add dto scheme information (see #136030)
					/* translation: {
						uid: 'controllingActualsCostHeaderListService',
						title: 'controlling.actuals.costHeaderContainer',
						columns: []
					}, */

					dataProcessor: [{
						processItem: function (item){
							service.addRepeatCheckKey(item);
						},
						revertProcessItem: function (item) {
							if (!angular.isArray(item)) {
								item = [item];
							}
							angular.forEach(item, function (entity) {
								if (entity.Version === 0) {
									let hasToGenerate = actualsNumberGenerationSettingsService.hasToGenerateForRubricCategory();
									if (hasToGenerate) {
										entity.Code = '';
									}
								}
							});
						}
					}, new ServiceDataProcessDatesExtension(['CompanyYearFkStartDate', 'CompanyYearFkEndDate', 'CompanyPeriodFkStartDate', 'CompanyPeriodFkEndDate'])],
					sidebarSearch: {
						options: {
							moduleName: 'controlling.actuals',
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true,
							pinningOptions: {
								isActive: true,
								showPinningContext: [{token: 'project.main', show: true}],
								setContextCallback: setCurrentPinningContext
							}
						}
					},
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(controllingActualsCostHeaderListServiceOptions);
			let service = serviceContainer.service;

			/* Data */
			angular.extend(serviceContainer.data, {});

			/* Service */
			angular.extend(serviceContainer.service, {

				getSelectedCostHeaderId: getSelectedCostHeaderId,
				getSelectedCostHeaderItem: getSelectedCostHeaderItem,

			});

			function setCurrentPinningContext() {
				let curHeaderItem = serviceContainer.service.getSelected();
				if (curHeaderItem) {
					setCosHeaderToPinningContext(curHeaderItem).then(function () {
						service.load();
					});
				}

			}

			// pinning context (project, costHeader)
			function setCosHeaderToPinningContext(curHeaderItem) {
				// var projectFk = projectId;

				// if project changed then clear original master data filter and then reload
				if (projectMainPinnableEntityService.getPinned() !== curHeaderItem.ProjectFk) {
					estimateProjectRateBookConfigDataService.clearData();
					estimateProjectRateBookConfigDataService.initData(curHeaderItem.ProjectFk);
				}

				if ((projectMainPinnableEntityService.getPinned() !== curHeaderItem.ProjectFk) || (controllingActualsPinnableEntityService.getPinned() !== curHeaderItem.Id)) {
					let ids = {};
					controllingActualsPinnableEntityService.appendId(ids, curHeaderItem.Id);
					projectMainPinnableEntityService.appendId(ids, curHeaderItem.ProjectFk);
					// selectedProjectFk = projectFk;
					return controllingActualsPinnableEntityService.pin(ids, serviceContainer.service).then(function () {
						return true;
					});
				} else {
					return $q.when(false);
				}
			}

			function getSelectedCostHeaderId() {
				selectedCostHeaderItem = serviceContainer.service.getSelected();
				if (selectedCostHeaderItem && selectedCostHeaderItem.Id > 0) {
					selectedCostHeaderId = selectedCostHeaderItem.Id;
				}
				return (selectedCostHeaderId !== null) ? selectedCostHeaderId : -1;
			}

			function getSelectedCostHeaderItem() {
				selectedCostHeaderItem = serviceContainer.service.getSelected();
				return (selectedCostHeaderItem !== null) ? selectedCostHeaderItem : null;
			}

			service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CompanyCostHeaderDto',
				moduleSubModule: 'Controlling.Actuals',
				validationService: 'controllingActualsValidationService',
				mustValidateFields: ['Code', 'CompanyYearFk', 'CompanyPeriodFk']
			});

			let onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function (newData, data) {
				return onCreateSucceeded(newData, data).then(function () {
					let hasToGenerate = actualsNumberGenerationSettingsService.hasToGenerateForRubricCategory();
					let code = newData.Code;

					if ((code === null || code === '' || hasToGenerate) && newData.Version === 0) {
						actualsNumberGenerationSettingsService.assertLoaded().then(function () {
							platformRuntimeDataService.readonly(newData, [{
								field: 'Code',
								readonly: actualsNumberGenerationSettingsService.hasToGenerateForRubricCategory()
							}]);
							newData.Code = actualsNumberGenerationSettingsService.provideNumberDefaultText(code);
							let currentItem = serviceContainer.service.getSelected();
							let result = {apply: true, valid: true};
							if (newData.Code === '') {
								result.valid = false;
								result.error = $translate.instant('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
							}
							platformDataValidationService.finishValidation(result, currentItem, currentItem.Code, 'Code', service, service);
							platformRuntimeDataService.applyValidationResult(result, currentItem, 'Code');
							service.fireItemModified(currentItem);
							serviceContainer.service.markCurrentItemAsModified();
							service.gridRefresh();

						});
					}
				});
			};

			service.addRepeatCheckKey = function (entity){
				// key: CompanyFk_ProjectFk_ValueTypeFk_CompanyYearFk_CompanyPeriodFk
				entity.RepeatCheckKey = entity.CompanyFk + '_' + (entity.ProjectFk || 0) + '_' + (entity.ValueTypeFk || 0) + '_' + (entity.CompanyYearFk || 0) + '_' + (entity.CompanyPeriodFk || 0);
			};

			// serviceContainer.service.load();
			return serviceContainer.service;
		}]);
})(angular);

