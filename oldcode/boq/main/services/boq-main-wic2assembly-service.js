(function () {
	/* global globals, _ */
	'use strict';
	const module = angular.module('boq.main');

	/**
	 * @ngdoc service
	 * @name boqMainWic2AssemblyService
	 * @function
	 * @description
	 * boqMainWic2AssemblyService is a data service for managing boq wic to assembly assignments
	 */
	module.factory('boqMainWic2AssemblyServiceFactory', ['$q', '$injector', 'PlatformMessenger', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'boqMainWic2AssemblyProcessorService', 'ServiceDataProcessArraysExtension', 'boqMainWic2AssemblyValidationProcessorService', 'basicsLookupdataLookupFilterService', 'boqMainCommonService',
		function($q, $injector, PlatformMessenger, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, boqMainWic2AssemblyProcessorService, ServiceDataProcessArraysExtension, boqMainWic2AssemblyValidationProcessorService, basicsLookupdataLookupFilterService, boqMainCommonService) {
			let factory = {};

			factory.createWic2AssemblyService = function(boqMainServiceParam) {
				let boqMainService = boqMainServiceParam;

				var wicCatBoqServiceOption = {
					flatNodeItem: {
						module: module,
						serviceName: 'boqMainWic2AssemblyService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'boq/main/wic2assembly/',
							usePostForRead: true
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'boq/main/wic2assembly/',
							endRead: 'list',
							usePostForRead: false,
							initReadData: initReadData
						},
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: canCreateCallBackFunc,
							canDeleteCallBackFunc: canCreateCallBackFunc
						},
						entityRole: {
							node: {itemName: 'BoqMainWic2Assembly', parentService: boqMainService}
						},
						presenter: {
							list: {
								initCreationData: initCreationData,
								incorporateDataRead: incorporateDataRead
							}
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['boqMainWic2Assembly']), boqMainWic2AssemblyProcessorService],
						translation: {
							uid: 'boqMainWic2AssemblyService',
							title: 'boq.main.Wic2AssemblyListTitle',
							columns: [{ header: 'boq.main.WorkContentInfo', field: 'WorkContentInfo' }],
							dtoScheme: { moduleSubModule: 'Boq.Main', typeName: 'BoqWic2assemblyDto' }
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(wicCatBoqServiceOption);
				var service = serviceContainer.service;
				var data = serviceContainer.data;

				service.onCostGroupCatalogsLoaded = new PlatformMessenger();

				var filters = [
					{
						key: 'boq-main-wic2assembly-unique-assembly-filter',
						fn: function (item, entity) {
							entity = service.getSelected() || {};
							var boqMainWic2List = angular.copy(service.getList()) || [];
							var indexOfSelectedItem = _.findIndex(boqMainWic2List, entity);
							if (indexOfSelectedItem !== -1) {
								boqMainWic2List.splice(indexOfSelectedItem, 1);
							}
							var boqMainWic2ListIds = _.map(boqMainWic2List, 'EstLineItemFk');
							return boqMainWic2ListIds.indexOf(item.Id) === -1;
						}
					}
				];

				data.newEntityValidator = boqMainWic2AssemblyValidationProcessorService;

				angular.extend(service, {
					createItems: createItems,
					registerFilters: registerFilters,
					unregisterFilters: unregisterFilters,
					canCreateDelete: canCreateCallBackFunc,
					setListByLineType: setListByLineType,
					onBoqSelectedLineTypeChanged: onBoqSelectedLineTypeChanged,
					onBoqItemLineTypeChanged: new PlatformMessenger(),
					setSelectedAssemblyLookupItem: setSelectedAssemblyLookupItem
				});

				function canCreateCallBackFunc() {
					var boq = boqMainService.getSelected();
					return boq && boq.Id && [0,200,201,202,203].includes(boq.BoqLineTypeFk) ? boqMainService.isWicBoq() : false;
				}

				function initReadData(readData) {
					var selectItem = boqMainService.getSelected();
					if (selectItem) {
						if (!boqMainService.isWicBoq()) {
							readData.UseMasterDataFilter = true;
						}
						readData.BoqHeaderFk = selectItem.BoqHeaderFk;
						readData.BoqItemFks = [selectItem.Id];
					}
					if (boqMainCommonService.isTextElement(selectItem)) {
						readData.BoqItemFks = [selectItem.BoqItemFk];
					}
					readData.ProjectId = boqMainService.getSelectedProjectId();
				}

				function initCreationData(creationData) {

					var selectItem = boqMainService.getSelected();
					if (selectItem) {
						creationData.BoqHeaderFk = selectItem.BoqHeaderFk;
						creationData.BoqItemFk = selectItem.Id;
					}
				}

				function incorporateDataRead(responseData, data) {
					basicsLookupdataLookupDescriptorService.attachData(responseData || {});
					var boqMainWic2AssemblyValidationService = $injector.get('boqMainWic2AssemblyValidationService');
					boqMainWic2AssemblyValidationService.removeEstLineItemFkFromErrorsList();

					$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
						basicsCostGroupAssignmentService.process(responseData, service, {
							mainDataName: 'dtos',
							attachDataName: 'WicAssembly2CostGroups',
							dataLookupType: 'WicAssembly2CostGroups',
							isReadonly: true,
							identityGetter: function identityGetter(entity) {
								return {
									EstHeaderFk: entity.RootItemId,
									EstLineItemFk: entity.MainItemId
								};
							}
						});
					}]);

					return data.handleReadSucceeded(responseData.dtos, data);
				}

				function createItems(resourceType, items) {
					var boqMainWic2AssemblyValidationService = $injector.get('boqMainWic2AssemblyValidationService');
					basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', items);

					function createItem(resourceType, items) {
						var item = _.first(items);
						if (item) {
							if (resourceType === 4) {
								createBoqWic2Assembly(item).then(function (data) {
									boqMainWic2AssemblyValidationService.removeEstLineItemFkFromErrorList(data.boqWic2Assembly);
									setAssemblyInfo(data.boqWic2Assembly, data.item);
									items.shift();
									createItem(resourceType, items);
								});
							}
						} else {
							service.markItemAsModified(service.getSelected());
						}
					}

					function createBoqWic2Assembly(item) {
						var defer = $q.defer();
						service.createItem().then(function (boqWic2Assembly) {
							defer.resolve({
								boqWic2Assembly: boqWic2Assembly,
								item: item
							});
						});
						return defer.promise;
					}

					function setAssemblyInfo(boqWic2Assembly, item) {
						angular.extend(boqWic2Assembly, {
							EstHeaderFk: item.EstHeaderFk,
							EstLineItemFk: item.Id,
							EstAssemblyCatFk: item.EstAssemblyCatFk,
							BasUomFk: item.BasUomFk
						});
						boqMainWic2AssemblyProcessorService.processItem(boqWic2Assembly);
						service.markItemAsModified(boqWic2Assembly);
					}

					var selectedBoqWic2Assembly = service.getSelected();
					var selectedItem = _.first(items); // first selected code from lookup

					if (service.isSelection(selectedBoqWic2Assembly)) {
						boqMainWic2AssemblyValidationService.removeEstLineItemFkFromErrorList(selectedBoqWic2Assembly);
						setAssemblyInfo(selectedBoqWic2Assembly, selectedItem);
						items.shift();
						createItem(resourceType, items);
					}
				}

				function setListByLineType(boq) {
					if (boq && boq.Id && ([0, 200, 201, 202, 203].indexOf(boq.BoqLineTypeFk) === -1)) {
						if (boqMainService.isWicBoq()) {
							service.deleteEntities(service.getList());
						}
					}
				}

				function onBoqSelectedLineTypeChanged(boqEntity, previousLineType, selectedLineType) {
					var oldBoqLineTypeValue = (previousLineType && previousLineType.Id) ? previousLineType.Id : 0;

					if (selectedLineType && boqMainService.isWicBoq() && [0, 200, 201, 202, 203].indexOf(selectedLineType.Id) === -1) {
						var platformModalService = $injector.get('platformModalService');
						var dialogOptions = {
							headerTextKey: 'boq.main.confirmationToDeleteWic2AssemblyTitle',
							bodyTextKey: 'boq.main.confirmationToDeleteWic2AssemblyBody'
						};

						if (!_.isEmpty(service.getList())) {
							platformModalService.showYesNoDialog(dialogOptions.bodyTextKey, dialogOptions.headerTextKey).then(function (result) {
								if (result.yes) {
									service.deleteEntities(service.getList());
								} else {
									boqEntity.BoqLineTypeFk = oldBoqLineTypeValue;
									boqMainService.gridRefresh();
								}
							}, function () {
								boqEntity.BoqLineTypeFk = oldBoqLineTypeValue;
								boqMainService.gridRefresh();
							});
						}
					}
				}

				function setSelectedAssemblyLookupItem(selectedItem) {
					var entity = service.getSelected();
					$injector.get('estimateMainCommonService').setSelectedLookupItem(selectedItem);

					entity.EstAssemblyCatFk = selectedItem.EstAssemblyCatFk;
				}

				function registerFilters() {
					basicsLookupdataLookupFilterService.registerFilter(filters);
				}

				function unregisterFilters() {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				}

				return service;
			};

			return factory;
		}
	]);

	// The default instatiation
	module.factory('boqMainWic2AssemblyService', ['boqMainWic2AssemblyServiceFactory', 'boqMainService',
		function(boqMainWic2AssemblyServiceFactory, boqMainService) {
			return boqMainWic2AssemblyServiceFactory.createWic2AssemblyService(boqMainService);
		}
	]);
})();
