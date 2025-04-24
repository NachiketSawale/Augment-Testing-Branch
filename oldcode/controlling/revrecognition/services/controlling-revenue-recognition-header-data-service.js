/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.revrecognition';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name controllingRevenueRecognitionHeaderDataService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('controllingRevenueRecognitionHeaderDataService', ['_', '$injector', '$q', 'globals','cloudDesktopSidebarService', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService', 'controllingRevenueRecognitionHeaderReadonlyProcessor', 'ServiceDataProcessDatesExtension', 'cloudDesktopPinningContextService','platformModalService',
		function (_, $injector, $q, globals,cloudDesktopSidebarService, platformDataServiceFactory, basicsCommonMandatoryProcessor, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService, prrReadonlyProcessor, ServiceDataProcessDatesExtension, cloudDesktopPinningContextService,platformModalService) {
			var service = {};
			var sidebarSearchOptions = {
				moduleName: moduleName,  // required for filter initialization
				enhancedSearchEnabled: true,
				pattern: '',
				pageSize: 100,
				useCurrentClient: null,
				includeNonActiveItems: null,
				showOptions: false,
				showProjectContext: false,
				pinningOptions: {
					isActive: true,
					showPinningContext: [{token: 'project.main', show: true}],
					setContextCallback: function (prjService) {
						cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'PrjProjectFk');
					}
				},
				enhancedSearchVersion: '2.0',
				withExecutionHints: false
			};

			var serviceOptions = {
				flatRootItem: {
					module: module,
					serviceName: 'controllingRevenueRecognitionHeaderDataService',
					entityNameTranslationID: 'controlling.RevenueRecognition.mainEntityNameEntityName',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'controlling/RevenueRecognition/',
						usePostForRead: true
					},
					dataProcessor: [prrReadonlyProcessor, new ServiceDataProcessDatesExtension(['CompanyPeriodFkStartDate', 'CompanyPeriodFkEndDate', 'HeaderDate'])],
					entityRole: {
						root: {
							itemName: 'PrrHeader',
							moduleName: 'cloud.desktop.moduleDisplayNameControllingRevenueRecognition',
							useIdentification: false,
							responseDataEntitiesPropertyName: 'Main'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function onReadSucceeded(readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								};
								return serviceContainer.data.handleReadSucceeded(result, data);
							},
							initCreationData: function initCreationData(creationData) {
								var pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
								if (pinProjectEntity) {
									creationData.PrjProjectFk = pinProjectEntity.id;
								}
							}
						}
					},
					sidebarSearch: {
						options: sidebarSearchOptions,
						moduleName: moduleName
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			service = serviceContainer.service;

			var baseCreateItem = service.createItem;
			service.createItem = function createItem() {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'controlling.revrecognition/templates/create-revrecognition-dialog.html'
				}).then(function (result) {
					if (result) {
						baseCreateItem();
					}
				});
			};

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PrrHeaderDto',
				moduleSubModule: 'Controlling.RevRecognition',
				validationService: 'controllingRevenueRecognitionValidationService',
				mustValidateFields: ['CompanyYearFk', 'CompanyPeriodFk', 'PrjProjectFk']
			});

			var filters = [{
				key: 'company-year-filter',
				serverSide: true,
				fn: function (entity) {
					return 'CompanyFk='+entity.CompanyFk;
				}
			}, {
				key: 'company-period-filter',
				serverSide: true,
				fn: function (entity) {
					return 'CompanyYearFk=' + entity.CompanyYearFk;
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			basicsLookupdataLookupDescriptorService.loadData(['RevenueRecognitionStatus']);


			service.getModuleState = function () {
				var readonlyStatus = false;
				var headerItem = service.getSelected();
				if (!!headerItem && headerItem.IsReadonlyStatus !== undefined && headerItem.IsReadonlyStatus) {
					readonlyStatus = true;
				}
				return readonlyStatus;
			};

			service.getHeaderEditAble = function () {
				return !service.getModuleState();
			};

			service.getItemStatus = function () {
				var item = service.getSelected();
				var state = {IsReadOnly: true};
				if (item) {
					var readonlyStatus = service.getModuleState();
					state.IsReadOnly = readonlyStatus;
				}
				return state;
			};

			service.navigateTo = function navigateTo(itemIds /* , triggerfield */) {
				cloudDesktopSidebarService.filterSearchFromPKeys(itemIds);
			};

			return service;
		}]);
})();
