/**
 * Created by wui on 12/24/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionsystemMasterLineItemDataService', [
		'platformDataServiceFactory',
		'constructionsystemMasterScriptDataService',
		'constructionSystemMasterHeaderService',
		'basicsLookupdataLookupDescriptorService',
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
		function (
			platformDataServiceFactory,
			constructionsystemMasterScriptDataService,
			constructionSystemMasterHeaderService,
			basicsLookupdataLookupDescriptorService,
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

			var serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionsystemMasterLineItemDataService',
					entityRole: {
						root: {
							itemName: 'LineItem',
							parentService: constructionSystemMasterHeaderService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			var service = serviceContainer.service;

			constructionsystemMasterScriptDataService.onScriptResultUpdated.register(refresh);

			var considerDisabledDirect = false;

			function updateSortCode(service, options, items) {
				var list = service.getListSync();
				var newList = list.concat(items);
				service.setCache(options, newList);
			}

			function refresh() {
				clear();
				var data = constructionsystemMasterScriptDataService.getExecutionResult();
				basicsLookupdataLookupDescriptorService.updateData('estlineitemfk', data.LookupLineItems);
				basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', data.LookupAssemblies);
				basicsLookupdataLookupDescriptorService.updateData('estboqitems', data.LookupBoqItems);
				basicsLookupdataLookupDescriptorService.updateData('estlineitemactivity', data.LookupActivities);
				basicsLookupdataLookupDescriptorService.updateData('prjcontrollingunit', data.LookupControllingUnits);
				basicsLookupdataLookupDescriptorService.updateData('packageSchedulingLookupService', data.LookupSchedules);
				updateSortCode(estimateMainSortCode01LookupDataService, {lookupType: 'sortcode01'}, data.ProjectSortCode01s);
				updateSortCode(estimateMainSortCode02LookupDataService, {lookupType: 'sortcode02'}, data.ProjectSortCode02s);
				updateSortCode(estimateMainSortCode03LookupDataService, {lookupType: 'sortcode03'}, data.ProjectSortCode03s);
				updateSortCode(estimateMainSortCode04LookupDataService, {lookupType: 'sortcode04'}, data.ProjectSortCode04s);
				updateSortCode(estimateMainSortCode05LookupDataService, {lookupType: 'sortcode05'}, data.ProjectSortCode05s);
				updateSortCode(estimateMainSortCode06LookupDataService, {lookupType: 'sortcode06'}, data.ProjectSortCode06s);
				updateSortCode(estimateMainSortCode07LookupDataService, {lookupType: 'sortcode07'}, data.ProjectSortCode07s);
				updateSortCode(estimateMainSortCode08LookupDataService, {lookupType: 'sortcode08'}, data.ProjectSortCode08s);
				updateSortCode(estimateMainSortCode09LookupDataService, {lookupType: 'sortcode09'}, data.ProjectSortCode09s);
				updateSortCode(estimateMainSortCode10LookupDataService, {lookupType: 'sortcode10'}, data.ProjectSortCode10s);

				if (angular.isArray(data.LineItems)) {
					serviceContainer.data.itemList = data.LineItems;
					serviceContainer.data.listLoaded.fire();

					if (data.LineItems.length) {
						serviceContainer.service.setSelected(data.LineItems[0]);
					}
				}
				else {
					serviceContainer.data.listLoaded.fire();
				}

				if(data.DoConsiderDisabledDirect){
					considerDisabledDirect = data.DoConsiderDisabledDirect;
				}
			}

			function clear() {
				serviceContainer.data.itemList = [];
			}

			refresh();

			service.getConsiderDisabledDirect = function getConsiderDisabledDirect(){
				return considerDisabledDirect;
			};

			return service;
		}
	]);

})(angular);