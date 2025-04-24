/**
 * Created by clv on 10/23/2017.
 */
(function (angular, globals) {
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	'use strict';
	var moduleName = 'procurement.package';
	var module = angular.module(moduleName);
	angular.module(moduleName).factory('procurementPackageItemAssignmentDataService', procurementPackageItemAssignmentDataService);
	procurementPackageItemAssignmentDataService.$inject = ['_', '$injector', '$http', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService', 'basicsCommonMandatoryProcessor', 'procurementPackageItemAssignmentReadonlyProcessor',
		'procurementContextService', 'procurementPackageDataService'];

	function procurementPackageItemAssignmentDataService(_, $injector, $http, platformDataServiceFactory, basicsLookupdataLookupDescriptorService,
		basicsLookupdataLookupFilterService, basicsCommonMandatoryProcessor, procurementPackageItemAssignmentReadonlyProcessor,
		procurementContextService, procurementPackageDataService) {

		var serviceOption = {
			hierarchicalNodeItem: {
				module: module,
				serviceName: 'procurementPackageItemAssignmentDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/common/prcitemassignment/',
					endRead: 'tree'
				},
				httpCreate: {
					route: globals.webApiBaseUrl + 'procurement/common/prcitemassignment/',
					endCreate: 'createnew'
				},
				httpUpdate: {
					route: globals.webApiBaseUrl + 'procurement/common/prcitemassignment/',
				},
				httpDelete: {
					route: globals.webApiBaseUrl + 'procurement/common/prcitemassignment/',
				},
				presenter: {
					tree: {
						parentProp: 'PrcItemAssignmentFk',
						childProp: 'PrcItemAssignments',
						incorporateDataRead: incorporateDataRead,
						initCreationData: initCreationData
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PrcItemAssignment',
						parentService: procurementPackageDataService,
						doesRequireLoadAlways: true
					}
				},
				dataProcessor: [procurementPackageItemAssignmentReadonlyProcessor],
				actions: {
					create: 'flat',
					delete: true,
					canDeleteCallBackFunc: function (item) {
						var isProtectContractedPackageItemAssignment = procurementPackageDataService.isProtectContractedPackageItemAssignment();
						if (isProtectContractedPackageItemAssignment && item && item.Version > 0) {
							if (item.IsContracted) {
								return false;
							}
							var parentItem = procurementPackageDataService.getSelected();
							if (parentItem) {
								var pakStatus = basicsLookupdataLookupDescriptorService.getData('PackageStatus');
								var status = _.find(pakStatus, {Id: parentItem.PackageStatusFk});
								if (status) {
									return !status.IsContracted;
								}
							}
						}
						return true;
					}
				}
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		var service = serviceContainer.service;
		var data = serviceContainer.data;

		data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PrcItemAssignmentDto',
			moduleSubModule: 'Procurement.Common',
			validationService: $injector.get('procurementPackageItemAssignmentValidationService')(service.name, service),
			mustValidateFields: ['EstHeaderFk', 'EstLineItemFk', 'BoqItemFk', 'EstResourceFk', 'PrcItemFk']
		});

		data.doPrepareDelete = function doPrepareDeleteInList(deleteParams, data) {
			var entity = getFirstEntity(deleteParams);
			deleteParams.index = entity ? data.itemList.indexOf(entity) : -1;

			var procurementPackageItemAssignmentValidationStatusService = $injector.get('procurementPackageItemAssignmentValidationStatusService');
			procurementPackageItemAssignmentValidationStatusService.validateAsDeleteEntities(deleteParams.entities);
		};

		function getFirstEntity(deleteParams) {
			var res = deleteParams.entity || null;
			if (!res && deleteParams.entities && deleteParams.entities.length > 0) {
				res = deleteParams.entities[0];
			}

			return res;
		}

		service.loadSubItemsList = loadSubItemsList;
		service.name = 'package.item.assignment';

		var filters = [
			{
				key: 'package-item-assignment-est-header-filter',
				serverSide: true,
				serverKey: 'package-item-assignment-est-header-filter',
				fn: function () {
					var parentItem = service.parentService().getSelected();
					return {
						projectId: parentItem && angular.isDefined(parentItem) ? parentItem.ProjectFk : null
					};
				}
			},
			{
				key: 'package-item-assignment-est-lineitem-filter',
				serverSide: true,
				serverKey: 'package-item-assignment-est-lineitem-filter',
				fn: function (entity) {
					return {
						estHeaderId: entity.EstHeaderFk
					};
				}
			},
			{
				key: 'package-item-assignment-est-resource-filter',
				serverSide: true,
				serverKey: 'package-item-assignment-est-resource-filter',
				fn: function (entity) {
					var list = service.getList();
					var resourceIds = _.map(_.filter(list, function (value) {
						return value.EstResourceFk && value.BoqItemFk !== null && angular.isDefined(value.BoqItemFk);
					}), function (value) {
						return value.EstResourceFk;
					});
					return {
						estHeaderFk: entity.EstHeaderFk,
						estLineItemFk: entity.EstLineItemFk,
						notIncludedResourceIds: _.uniq(resourceIds)
					};
				}
			},
			{
				key: 'prc-item-assignment-item-filter',
				serverSide: true,
				serverKey: 'prc-item-assignment-item-filter',
				fn: function () {
					var subPackageDataService = $injector.get('procurementPackagePackage2HeaderService');
					var subPackage = subPackageDataService.getSelected();
					if (subPackage) {
						return {PrcHeaderFk: subPackage.PrcHeaderFk};
					}
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		service.relCalculationItemBudget = function () {
			var packageService = $injector.get('procurementPackageDataService');
			var packageEntity = packageService.getSelected();
			var packageId = packageEntity.Id;
			var reqUrl = 'procurement/common/prcitemassignment/relCalculationItemBudget?packageId=' + packageId;
			$http.get(globals.webApiBaseUrl + reqUrl).then(function () {
				var procurementCommonPrcItemDataService = $injector.get('procurementCommonPrcItemDataService');
				var procurementCommonTotalDataService = $injector.get('procurementCommonTotalDataService');
				var totalDataService = procurementCommonTotalDataService.getService(packageService);
				procurementCommonPrcItemDataService.getService().load();
				totalDataService.load();
			});
		};
		const procurementCommonFilterJobVersionToolService = $injector.get('procurementCommonFilterJobVersionToolService');

		return service;

		// ///////////////////
		function incorporateDataRead(readData, data) {
			let highlightJobIds = [];
			readData = procurementCommonFilterJobVersionToolService.filterIncorporateDataRead(service, readData, highlightJobIds);
			basicsLookupdataLookupDescriptorService.attachData(readData);
			procurementCommonFilterJobVersionToolService.initFilterDataMenu(service, procurementPackageDataService, highlightJobIds);
			return serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
		}

		function initCreationData(creationData) {
			var prcBoqMainService = $injector.get('prcBoqMainService');
			var boqMainService = prcBoqMainService.getService(procurementContextService.getMainService());
			var selectedBoqItem = boqMainService.getSelected();
			creationData.MainItemId = service.parentService().getSelected().Id;
			creationData.PrcPackageFk=creationData.MainItemId;
			if (selectedBoqItem && selectedBoqItem.BoqLineTypeFk === 0) {
				creationData.BoqHeaderId = selectedBoqItem.BoqHeaderFk;
				creationData.BoqItemId = selectedBoqItem.Id;
			}
		}

		function loadSubItemsList() {
			serviceContainer.data.doesRequireLoadAlways = true;
			serviceContainer.data.loadSubItemList();
			serviceContainer.data.doesRequireLoadAlways = false;
		}
	}
})(angular, globals);