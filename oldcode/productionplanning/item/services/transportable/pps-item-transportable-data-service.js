(function (angular) {
	'use strict';
	/*global globlas, _*/

	var moduleName = 'productionplanning.item';
	var itemModule = angular.module(moduleName);
	itemModule.factory('ppsItemTransportableDataService', [
		'platformDataServiceFactory', 'productionplanningItemDataService',
		'basicsLookupdataLookupDescriptorService', 'ServiceDataProcessArraysExtension',
		'ppsItemTransportableProcessor', 'ppsCommonTransportInfoHelperService',
		'$injector', 'basicsLookupdataLookupDescriptorService',
		'$translate', '$http',
		'platformSchemaService', 'platformModalService',
		'transportplanningPackageDataServiceBundleDocumentsExtension',
		function (platformDataServiceFactory, ppsItemDataService,
					 LookupDescriptorService, ArraysExtension,
					 transportableProcessor, ppsCommonTransportInfoHelperService,
					 $injector, basicsLookupdataLookupDescriptorService,
					 $translate, $http,
					 platformSchemaService, platformModalService,
					 bundleDocumentsExtension) {
			var service = {};
			var serviceInfo = {
				hierarchicalLeafItem: {
					module: itemModule,
					serviceName: 'ppsItemTransportableDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/item/',
						endRead: 'getTransportables'
					},
					entityRole: {
						leaf: {
							itemName: 'Transportable',
							parentService: ppsItemDataService,
							parentFilter: 'itemId'
						}
					},
					actions: {},
					dataProcessor: [new ArraysExtension(['Children']), transportableProcessor, $injector.get('ppsItemTransportableSlotReadonlyProcessor')],
					presenter: {
						tree: {
							parentProp: 'ParentId',
							childProp: 'Children',
							incorporateDataRead: function (readData, data) {
								LookupDescriptorService.attachData(readData);
								service.processTransportInfo(readData.Main);
								return container.data.handleReadSucceeded(readData.Main, data);
							}
						}
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			ppsCommonTransportInfoHelperService.registerItemModified(container, {});
			service = container.service;

			service.canSelectedTransport = function () {
				if(ppsItemDataService.getSelected()?.IsForPreliminary === true){
					return false;
				}
				var entities = service.getSelectedEntities();
				return entities.length > 0 && entities.every(function (entity) {
					return !entity.ParentId;
				});
			};

			service.createTransport = function () {
				var plannedDeliveryTime = Date.now();
				var wizardSrv = $injector.get('transportplanningRequisitionWizardService');
				var ppsItem = $injector.get('productionplanningItemDataService').getSelected();
				var ppsHeader = basicsLookupdataLookupDescriptorService.getLookupItem('PpsHeader', ppsItem.PPSHeaderFk);
				var title = $translate.instant('transportplanning.requisition.wizard.wizardCreateTransport');
				var selectedItem = service.getSelected(); //
				var createRteOption = {
					projectId: ppsHeader.PrjProjectFk,
					jobId: ppsItem.LgmJobFk,
					Customizing4Transportable: {
						bundleId: selectedItem.BundleId,
						productId: selectedItem.ProductId
					},
					hideFields: ['DescriptionInfo', 'PlannedStart', 'PlannedFinish', 'IntervalHours'],
					readonlyFields: ['ProjectFk', 'LgmJobFk', 'ProjectDefFk', 'JobDefFk']
				};
				var routeProcessor = function (data) {
					data.IntervalHours = 2;
					data.HasDefaultDstWaypoint = !!data.JobDefFk;
					data.PlannedDelivery = plannedDeliveryTime;
					var dateProcessor = $injector.get('platformDataServiceProcessDatesBySchemeExtension').createProcessorFromScheme(
						platformSchemaService.getSchemaFromCache({
							typeName: 'TrsRouteDto',
							moduleSubModule: 'TransportPlanning.Transport'
						}));
					dateProcessor.processItem(data);
					$injector.get('platformRuntimeDataService').readonly(data, [{
						field: 'PlannedDelivery',
						readonly: !data.HasDefaultDstWaypoint
					}]);
				};
				var okHandler = function handleOK(data) {
					data.EarliestStart = data.LatestStart = data.PlannedStart;
					data.EarliestFinish = data.LatestFinish = data.PlannedFinish;
					$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createByTransportables', {
						TrsRoute: data,
						IntervalHours: data.IntervalHours,
						BundleIds: getSelectedIds('BundleId'),
						ProductIds: getSelectedIds('ProductId'),
						UpstreamItemIds: getSelectedIds('UpstreamItemId'),
					}).then(function (response) { // succeed
						var result = response.data;
						if(result.isSucceed) {
							service.load(); // reload
						}
						// var message = !result.isSucceed ? result.errMsg : $translate.instant('transportplanning.requisition.wizard.createTrsRouteSuccess', {code: result.dto.Code});
						// var dialogOption = {
						// 	windowClass : 'msgbox',
						// 	iconClass: result.isSucceed ? 'info' : 'ico-error',
						// 	headerTextKey: title,
						// 	bodyTextKey: message
						// };
						// platformModalService.showDialog(dialogOption);
					}, function (response) { // network failed
						platformModalService.showDialog({
							windowClass : 'msgbox',
							iconClass: 'ico-error',
							headerTextKey: title,
							bodyTextKey: response.data
						});
					});
				};
				getPlannedDeliveryTime().then(function (time) {
					if(time) {
						plannedDeliveryTime = time;
						createRteOption.plannedDelivery = time;
					}
					wizardSrv.showDialogToCreateTrsRoute(title, createRteOption, routeProcessor, okHandler);
				});
			};

			function getPlannedDeliveryTime() {
				var entities = service.getSelectedEntities();
				var involvedItems = [];
				entities.forEach(function (ent) {
					if(ent.InvolvedPpsItems) {
						ent.InvolvedPpsItems.forEach(function (itemId) {
							if(involvedItems.indexOf(itemId) < 0) {
								involvedItems[involvedItems.length] = itemId;
							}
						});
					}
				});

				return $http.post(globals.webApiBaseUrl + 'productionplanning/item/getMaxPlannedDelivery', {itemIds: involvedItems}).then(function (response) {
					return response.data;
				});
			}

			function getSelectedIds(field) {
				var entities = service.getSelectedEntities();
				return entities.filter(function (e) {
					return !!e[field];
				}).map(function (e) {
					return e[field];
				});
			}

			bundleDocumentsExtension.addBundleDocumentsFunction(service);

			return service;
		}
	]);
})(angular);
