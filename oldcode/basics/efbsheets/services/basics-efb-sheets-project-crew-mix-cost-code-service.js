/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	/* global globals */

	let moduleName = 'basics.efbsheets';
	let efbSheetModule = angular.module(moduleName);
	let serviceName = 'basicsEfbsheetsProjectCrewMixCostCodeService';

	/**
	 * @ngdoc service
	 * @name basicsEfbsheetsProjectCrewMixCostCodeService
	 * @function
	 *
	 * @description
	 * basicsEfbsheetsProjectCrewMixCostCodeService is the data service for all project CrewMixes2CostCodes related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	efbSheetModule.factory('basicsEfbsheetsProjectCrewMixCostCodeService', ['_', '$http', '$injector', '$translate', 'estimateMainJobCostcodesLookupService', 'platformDataServiceFactory', 'basicsEfbsheetsProjectMainService',
		'basicsCommonMandatoryProcessor', 'platformDialogService', 'PlatformMessenger',
		function (_, $http, $injector, $translate, estimateMainJobCostcodesLookupService, platformDataServiceFactory,
			basicsEfbsheetsProjectMainService, basicsCommonMandatoryProcessor, platformDialogService, PlatformMessenger) {

			let canCrewmix2CostCode = function canCrewmix2CostCode() {
				let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();

				if (selectedCrewMix) {
					return true;
				} else {
					return false;
				}
			};

			let efbSheetCrewmix2CostCodeOption = {
				flatNodeItem: {
					module: moduleName,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.efbsheets.crewMix2CostCodes',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/efbsheets/prjcrewmixcostcodes/', endCreate: 'create' },
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/efbsheets/prjcrewmixcostcodes/',// endRead:''
						initReadData: function initReadData(readData) {
							let selectedItem = basicsEfbsheetsProjectMainService.getSelected();
							readData.estCrewMixFk = selectedItem.Id;
						},
						usePostForRead: true
					},
					httpUpdate: { route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/', endUpdate: 'update' },
					actions: { create: 'flat', canCreateCallBackFunc: canCrewmix2CostCode, delete: {}, canDeleteCallBackFunc: canCrewmix2CostCode },
					entitySelection: {},
					setCellFocus: true,
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selectedItem = basicsEfbsheetsProjectMainService.getSelected();
								estimateMainJobCostcodesLookupService.setSelectedProjectId(selectedItem.Id);
								let projectItem = $injector.get('projectMainService').getSelected();
								$injector.get('estimateMainLookupService').setSelectedProjectId(projectItem.Id);
								let selectedCrewmix2CostCodeItem = serviceContainer.service.getSelected();

								if (selectedCrewmix2CostCodeItem && selectedCrewmix2CostCodeItem.Id > 0) {
									creationData.estCrewMixFk = selectedCrewmix2CostCodeItem.EstCrewMixFk;
								}
								else if (selectedItem && selectedItem.Id > 0) {
									creationData.estCrewMixFk = selectedItem.Id;
								}
							},
							handleCreateSucceeded: function (newData) {
								return newData;
							},
							incorporateDataRead: function (readData, data) {
								service.setDataList(readData);
								serviceContainer.data.handleReadSucceeded(readData, data);
								service.gridRefresh();
							}
						}
					},
					entityRole: { node: { itemName: 'PrjCrewMix2CostCode', moduleName: 'Crew Mixes', parentService: basicsEfbsheetsProjectMainService } },
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: null,
							showOptions: false,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(efbSheetCrewmix2CostCodeOption);
			let service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PrjCrewMix2CostCodeDto',
				moduleSubModule: 'Basics.EfbSheets',
				validationService: 'basicsEfbsheetsValidationService'
			});

			service.hasToLoadOnSelectionChange = function hasToLoadOnSelectionChange(crewmix) {
				if (crewmix) {
					serviceContainer.data.doNotLoadOnSelectionChange = false;
				}
			};

			let baseOnDeleteDone = serviceContainer.data.onDeleteDone;

			serviceContainer.data.onDeleteDone = function (deleteParams, data, response) {
				baseOnDeleteDone(deleteParams, data, response); // remove the deleted item form list

				let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();
				$injector.get('basicsEfbsheetsCommonService').calculateCrewmixesAndChilds(selectedCrewMix, 'CostCode');

				basicsEfbsheetsProjectMainService.markItemAsModified(selectedCrewMix);
				//$injector.get('basicsEfbsheetCrewMixCostCodeDetailService').refreshData(selectedCrewMix,true);

				service.gridRefresh(); // Refresh UI to clear validation marks
			};

			service.isEnableTools = function isEnableTools() {
				let selectedCrewMix = basicsEfbsheetsProjectMainService.getSelected();

				if (selectedCrewMix) {
					return true;
				} else {
					return false;
				}
			};

			let dataList = [];

			angular.extend(service, {
				refreshGrid: refreshGrid,
				gridRefresh: refreshGrid,
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				listLoaded: new PlatformMessenger(),
			});

			function refreshGrid(dataList) {
				service.listLoaded.fire(dataList);
			}

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			service.resetDataList = function () {
				dataList = [];
				service.setDataList(dataList);
			};

			service.setDataList = function (data) {
				addItems(data);
			};

			function addItems(items) {
				if (items === null) {
					dataList = null;
					return;
				}
				dataList = dataList ? dataList : [];
				angular.forEach(items, function (item) {
					let matchItem = _.find(dataList, { Id: item.Id });
					if (!matchItem) {
						dataList.push(item);
					}
				});
				service.refreshGrid(dataList);
			}

			service.updateCostCodes = function updateCostCodes() {
				let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
				let updateData = modTrackServ.getModifications(service);
				updateData.EstCrewMix = basicsEfbsheetsProjectMainService.getSelected();
				updateData.EstCrewMixes = basicsEfbsheetsProjectMainService.getSelectedEntities();
				updateData.MainItemId = updateData.EstCrewMix.Id;
				updateData.PrjCrewMix2CostCode = serviceContainer.data.getList();

				let updatePromise = $http.post(globals.webApiBaseUrl + 'basics/efbsheets/prjcrewmixcostcodes/update', updateData);

				return updatePromise.then(function () {

					$injector.get('estimateMainLookupService').clearCache();
					// $injector.get('estimateMainLookupService').setSelectedProjectId(selectedProjectItem.Id);
					$injector.get('estimateMainLookupService').getPrjCostCodesTree().then(function (result) {

						let list = [];
						$injector.get('cloudCommonGridService').flatten(result, list, 'ProjectCostCodes');
						// $injector.get('basicsLookupdataLookupDescriptorService').updateData('costcode', list);

						updatePromise = null;
						let title = $translate.instant('basics.efbsheets.crewMixToCostCodes'),
							msg = $translate.instant('basics.efbsheets.crewMixToCostCodesSuccess');
						platformDialogService.showMsgBox(msg, title, 'info').then(function (response) {
							if (response.ok === true) {
								service.gridRefresh();
							}
						});
					});
				});
			};

			return serviceContainer.service;
		}]);

})(angular);