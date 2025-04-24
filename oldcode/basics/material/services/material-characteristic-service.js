(function (angular) {
	'use strict';
	/* jshint -W072 */
	/* global globals, _ */
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialCharacteristicService',
		['platformDataServiceFactory', 'basicsMaterialRecordService', 'basicsLookupdataLookupDescriptorService',
			'basicsLookupdataLookupApi', 'basicsLookupdataLookupFilterService',
			'$http', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService','basicsCommonReadDataInterceptor', 'basicsCommonReadOnlyProcessor',
			function (dataServiceFactory, parentService, basicsLookupdataLookupDescriptorService,
				basicsLookupdataLookupApi, basicsLookupdataLookupFilterService,
				$http, lookupDataService, lookupDescriptorService,readDataInterceptor, basicsCommonReadOnlyProcessor) {
				var service = {};
				var self = this;
				var serviceContainer = null;

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						httpCreate: {route: globals.webApiBaseUrl + 'basics/material/characteristic/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/material/characteristic/'
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);

									var dataRead = serviceContainer.data.handleReadSucceeded(readData, data);
									angular.forEach(readData, function (item) {
										service.setDisableInputStatus(item.Property);
									});

									return dataRead;
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'MaterialCharacteristic',
								parentService: parentService
							}
						},
						translation: {
							uid: 'basicsMaterialCharacteristicService',
							title: 'basics.material.characteristic.title',
							columns: [{
								header: 'basics.material.characteristic.property',
								field: 'PropertyInfo'
							}, {
								header: 'basics.material.characteristic.char',
								field: 'CharacteristicInfo'
							}],
							dtoScheme: { typeName: 'MaterialCharacteristicDto', moduleSubModule: 'Basics.Material' }
						},
						dataProcessor: [{processItem: readonlyProcessItem}],
						actions: {
							delete: {},
							create: 'flat',
							canCreateCallBackFunc: function () {
								return !parentService.isReadonlyMaterial();
							},
							canDeleteCallBackFunc: function () {
								return !parentService.isReadonlyMaterial();
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

				service = serviceContainer.service;
				readDataInterceptor.init(service, serviceContainer.data);

				service.setDisableInputStatus = function (property) {
					var propertyItem;
					var material = parentService.getSelected();
					if (property && material) {
						propertyItem = _.find(self.materialGroupChars, function (k) {
							return k.MaterialGroupFk === material.MaterialGroupFk && k.Property && k.Property.toLowerCase() === property.toLowerCase();
						});
					}

					var status = propertyItem ? !!propertyItem.Hasfixedvalues : false;
					basicsLookupdataLookupApi.disableInput('basics-material-material-characteristic-characteristic', status);
				};

				var materialFilter = [{
					key: 'material-property-filter',
					fn: function (item) {
						var material = parentService.getSelected();
						return item.MaterialGroupFk === material.MaterialGroupFk;
					}
				}];

				basicsLookupdataLookupFilterService.registerFilter(materialFilter);

				var onSelectionChanged = function onSelectionChanged() {
					var currentItem = service.getSelected();
					if (currentItem) {
						service.setDisableInputStatus(currentItem.Property);
					}
				};
				service.registerSelectionChanged(onSelectionChanged);

				service.createItems = function autoCreateItems(newItem, groupId) {
					var creationParams = {};
					creationParams.MainItemId = newItem.Id;
					creationParams.GroupId = groupId;
					$http.post(serviceContainer.data.httpCreateRoute + 'createitems', creationParams).then(function (response) {
						if (serviceContainer.data.onCreateSucceeded && response.data) {
							var toCreateItems = response.data;
							angular.forEach(toCreateItems, function (newItem) {
								var propertyItem = _.find(service.getList(), {Property: newItem.Property});
								if (!propertyItem) {
									serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data, {});
								}
							});
						}
					});
				};

				var onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
					service.setCreatedItems(completeData.MaterialCharacteristics);
				};

				var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
					uiStandardService: 'basicsMaterialCharacteristicStandardConfigurationService',
					readOnlyFields: []
				});
				function readonlyProcessItem(item) {
					if (!item) {
						return;
					}
					if (parentService.isReadonlyMaterial()) {
						readonlyProcessorService.setRowReadonlyFromLayout(item, true);
					}
				}

				parentService.completeEntityCreateed.register(onCompleteEntityCreated);

				var init = function init() {
					lookupDataService.getList('materialgroupchar').then(function (data) {
						if (!data) {
							return;
						}
						self.materialGroupChars = data;
						lookupDescriptorService.updateData('materialgroupchar', data);
					});
				};

				init();

				return service;
			}]);
})(angular);