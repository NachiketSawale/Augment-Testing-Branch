/**
 * Created by wui on 3/25/2016.
 */

(function(angular){
	'use strict';

	/* global globals */
	var moduleName = 'constructionsystem.main';

	// todo: (roberson) it's just a backup and will be deleted later, because not used any more
	angular.module(moduleName).factory('constructionsystemMainLineItemDataService',[
		'$http',
		'$injector',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'constructionSystemMainInstanceService',
		'basicsLookupdataLookupDescriptorService',
		'constructionSystemMainJobDataService',
		'estimateMainSortCode01LookupDataService',
		'estimateMainSortCode02LookupDataService',
		'estimateMainSortCode03LookupDataService',
		'estimateMainSortCode04LookupDataService',
		'estimateMainSortCode05LookupDataService',
		'estimateMainSortCode06LookupDataService',
		'estimateMainSortCode07LookupDataService',
		'estimateMainSortCode08LookupDataService',
		'estimateMainSortCode09LookupDataService',
		'estimateMainSortCode10LookupDataService',
		function($http,
			$injector,
			PlatformMessenger,
			platformDataServiceFactory,
			constructionSystemMainInstanceService,
			basicsLookupdataLookupDescriptorService,
			constructionSystemMainJobDataService,
			estimateMainSortCode01LookupDataService,
			estimateMainSortCode02LookupDataService,
			estimateMainSortCode03LookupDataService,
			estimateMainSortCode04LookupDataService,
			estimateMainSortCode05LookupDataService,
			estimateMainSortCode06LookupDataService,
			estimateMainSortCode07LookupDataService,
			estimateMainSortCode08LookupDataService,
			estimateMainSortCode09LookupDataService,
			estimateMainSortCode10LookupDataService) {
			var serviceOptions = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionsystemMainLineItemDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'constructionsystem/main/lineitem/'
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						node: {
							itemName: 'LineItem',
							parentService: constructionSystemMainInstanceService,
							descField: 'DescriptionInfo.Description',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
						}

					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			serviceContainer.service.refresh = function () {
				if (constructionSystemMainInstanceService.getSelected()) {
					serviceContainer.service.load();
				}
			};

			constructionSystemMainJobDataService.onCalculationDone.register(function(args) {
				var selectedInstance = constructionSystemMainInstanceService.getSelected();
				if (selectedInstance && selectedInstance.Id === args.instance.Id) {
					serviceContainer.service.load();
				}
			});

			serviceContainer.data.initReadData = function (readData) {
				var instance = constructionSystemMainInstanceService.getSelected();
				if (instance) {
					readData.filter += '?insHeaderId=' + instance.InstanceHeaderFk + '&instanceId=' + instance.Id;
				}
				return readData;
			};

			function updateSortCode(service, options, items) {
				var list = service.getListSync();
				var newList = list.concat(items);
				service.setCache(options, newList);
			}

			function incorporateDataRead(readData, data) {
				basicsLookupdataLookupDescriptorService.updateData('estlineitemfk', readData.LookupLineItems);
				basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', readData.LookupAssemblies);
				basicsLookupdataLookupDescriptorService.updateData('estboqitems', readData.LookupBoqItems);
				basicsLookupdataLookupDescriptorService.updateData('estlineitemactivity', readData.LookupActivities);
				basicsLookupdataLookupDescriptorService.updateData('prjcontrollingunit', readData.LookupControllingUnits);
				basicsLookupdataLookupDescriptorService.updateData('packageSchedulingLookupService', readData.LookupSchedules);
				updateSortCode(estimateMainSortCode01LookupDataService, {lookupType: 'sortcode01'}, readData.ProjectSortCode01s);
				updateSortCode(estimateMainSortCode02LookupDataService, {lookupType: 'sortcode02'}, readData.ProjectSortCode02s);
				updateSortCode(estimateMainSortCode03LookupDataService, {lookupType: 'sortcode03'}, readData.ProjectSortCode03s);
				updateSortCode(estimateMainSortCode04LookupDataService, {lookupType: 'sortcode04'}, readData.ProjectSortCode04s);
				updateSortCode(estimateMainSortCode05LookupDataService, {lookupType: 'sortcode05'}, readData.ProjectSortCode05s);
				updateSortCode(estimateMainSortCode06LookupDataService, {lookupType: 'sortcode06'}, readData.ProjectSortCode06s);
				updateSortCode(estimateMainSortCode07LookupDataService, {lookupType: 'sortcode07'}, readData.ProjectSortCode07s);
				updateSortCode(estimateMainSortCode08LookupDataService, {lookupType: 'sortcode08'}, readData.ProjectSortCode08s);
				updateSortCode(estimateMainSortCode09LookupDataService, {lookupType: 'sortcode09'}, readData.ProjectSortCode09s);
				updateSortCode(estimateMainSortCode10LookupDataService, {lookupType: 'sortcode10'}, readData.ProjectSortCode10s);

				$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
					basicsCostGroupAssignmentService.process(readData, serviceContainer.service, {
						mainDataName: 'LineItems',
						attachDataName: 'LineItem2CostGroups',
						dataLookupType: 'LineItem2CostGroups',
						identityGetter: function identityGetter(entity){
							return {
								EstHeaderFk: entity.RootItemId,
								Id: entity.MainItemId
							};
						}
					});
				}]);

				return serviceContainer.data.handleReadSucceeded(readData.LineItems, data);
			}

			// add the onCostGroupCatalogsLoaded messenger
			serviceContainer.service.onCostGroupCatalogsLoaded = new PlatformMessenger();

			return serviceContainer.service;
		}
	]);

})(angular);
