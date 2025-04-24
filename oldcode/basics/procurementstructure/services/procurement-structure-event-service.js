(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementEventService',
		['platformDataServiceFactory', 'basicsProcurementStructureService',
			'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService', '$http', '$translate', 'platformModalService',
			function (dataServiceFactory, parentService, basicsLookupdataLookupDescriptorService, runtimeDataService, basicsLookupdataLookupFilterService, $http, $translate, platformModalService) {

				var eventTypeIds = [], currentItemSorting = 0;

				var responsibleFilter = [
					{
						key: 'procurement-structure-event-event-type-filter',
						fn: function (dataItem, entity) {
							getEventTypeLTCurrentEvent(entity);
							if (eventTypeIds.indexOf(dataItem.Id) !== -1) {
								return true;
							}
						}
					},
					{
						key: 'structure-event-start-basics-filter',
						fn: function (dataItem, entity) {
							if (entity.EndBasis === 2) {
								return dataItem.Id !== 2;
							} else {
								return true;
							}
						}
					},
					{
						key: 'structure-event-end-basics-filter',
						fn: function (dataItem, entity) {
							if (entity.StartBasis === 2) {
								return dataItem.Id !== 2;
							} else {
								return true;
							}
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(responsibleFilter);

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						httpCreate: {route: globals.webApiBaseUrl + 'basics/procurementstructure/event/', endCreate: 'createevent'},
						httpRead: {route: globals.webApiBaseUrl + 'basics/procurementstructure/event/'},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead,
								initCreationData: initCreationData
							}
						},
						entityRole: {
							leaf: {
								itemName: 'PrcStructureEvent',
								parentService: parentService
							}
						}
					}
				};

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

				var service = serviceContainer.service;

				service.updateReadOnlyDetail = function (entity) {
					eventTypeRelatedReadOnlyAndValue(entity, entity.PrcEventTypeFk);
				};
				service.updateReadOnly = function (item, model, value) {
					runtimeDataService.readonly(item, [
						{field: model, readonly: value}
					]);
					service.gridRefresh();
				};

				function eventTypeRelatedReadOnlyAndValue(entity, eventTypeFk) {
					var event = basicsLookupdataLookupDescriptorService.getLookupItem('prceventtype', eventTypeFk);
					if (event) {
						entity.StartNoOfDays = !event.HasStartDate ? 0 : entity.StartNoOfDays;
						entity.StartBasis = !event.HasStartDate ? 1 : entity.StartBasis;
						entity.PrcSystemEventTypeStartFk = !event.HasStartDate ? null : entity.PrcSystemEventTypeStartFk;
						entity.PrcEventTypeStartFk = !event.HasStartDate ? null : entity.PrcEventTypeStartFk;
						service.updateReadOnly(entity, 'StartNoOfDays', !event.HasStartDate);
						service.updateReadOnly(entity, 'StartBasis', !event.HasStartDate);
						service.updateReadOnly(entity, 'PrcSystemEventTypeStartFk', !event.HasStartDate);
						service.updateReadOnly(entity, 'PrcEventTypeStartFk', !event.HasStartDate);

						service.updateReadOnly(entity, 'AddLeadTimeToStart', entity.StartBasis === 1);
						service.updateReadOnly(entity, 'AddLeadTimeToEnd', entity.EndBasis === 1);

						if (event.HasStartDate) {
							setRelatedReadonlyForStartOrEndBasis(entity, entity.StartBasis, 'StartBasis');//set start basis relative readonly
						}
						setRelatedReadonlyForStartOrEndBasis(entity, entity.EndBasis, 'EndBasis');// set end basis related readonly
					}
				}

				function setRelatedReadonlyForStartOrEndBasis(entity, value, model) {
					if (model === 'StartBasis') {
						switch (value) {
							case 1:
							case 2:
								service.updateReadOnly(entity, 'PrcSystemEventTypeStartFk', true);
								service.updateReadOnly(entity, 'PrcEventTypeStartFk', true);
								break;
							case 3:
							case 4:
								service.updateReadOnly(entity, 'PrcSystemEventTypeStartFk', false);
								service.updateReadOnly(entity, 'PrcEventTypeStartFk', true);
								break;
							case 5:
							case 6:
							case 7:
							case 8:
								service.updateReadOnly(entity, 'PrcEventTypeStartFk', false);
								service.updateReadOnly(entity, 'PrcSystemEventTypeStartFk', true);
								break;
						}
					} else if (model === 'EndBasis') {
						switch (value) {
							case 1:
							case 2:
								service.updateReadOnly(entity, 'PrcSystemEventTypeEndFk', true);
								service.updateReadOnly(entity, 'PrcEventTypeEndFk', true);
								break;
							case 3:
							case 4:
								service.updateReadOnly(entity, 'PrcSystemEventTypeEndFk', false);
								service.updateReadOnly(entity, 'PrcEventTypeEndFk', true);
								break;
							case 5:
							case 6:
							case 7:
							case 8:
								service.updateReadOnly(entity, 'PrcSystemEventTypeEndFk', true);
								service.updateReadOnly(entity, 'PrcEventTypeEndFk', false);
								break;
						}
					}
				}

				function eventTypeRelatedIsMandatory(entity) {
					if (entity.PrcEventTypeFk === null || angular.isUndefined(entity.PrcEventTypeFk)) {
						return true;
					}
					var event = basicsLookupdataLookupDescriptorService.getLookupItem('prceventtype', entity.PrcEventTypeFk);

					return !event.HasStartDate;
				}

				service.eventTypeRelatedReadOnlyAndValue = eventTypeRelatedReadOnlyAndValue;

				service.eventTypeRelatedIsMandatory = eventTypeRelatedIsMandatory;

				//load prcEventType first
				basicsLookupdataLookupDescriptorService.loadData('PrcEventType');

				//add deep copy function
				service.createCopy = function createCopy() {
					var parentItem = parentService.getSelected();
					parentService.update().then(function () {
						if (parentItem !== null) {
							$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/event/deepcopy?mainItemId=' + parentItem.Id)
								.then(function (response) {
									if (response.data) {
										service.load();
									}
									else {
										var modalOptions = {
											bodyText: $translate.instant('basics.procurementstructure.event.deepCopyInfo'),
											iconClass: 'ico-info'
										};
										platformModalService.showDialog(modalOptions);
									}
								});
						}
					});

				};

				return service;

				function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData);
					var dataRead = serviceContainer.data.handleReadSucceeded(readData.Main, data);
					var items = readData.Main || [];
					angular.forEach(items, function (entity) {
						service.updateReadOnlyDetail(entity);
					});

					return dataRead;
				}

				function initCreationData(creationData/*, data*/) {
					var parentItem = parentService.getSelected();
					var maxSorting = 0;
					angular.forEach(service.getList(), function (item) {
						if (item.Sorting > maxSorting) {
							maxSorting = item.Sorting;
						}
					});
					creationData.EventSorting = maxSorting + 1;
					creationData.MainItemId = parentItem.Id;
				}

				function getEventTypeLTCurrentEvent(entity) {
					if (currentItemSorting !== entity.Sorting) {
						eventTypeIds = [];
						angular.forEach(service.getList(), function (item) {
							if (item.Sorting < entity.Sorting) {
								eventTypeIds.push(item.PrcEventTypeFk);
							}
						});
					}
					currentItemSorting = entity.Sorting;
				}

			}]);
})(angular);