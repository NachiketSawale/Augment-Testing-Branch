/**
 * Created by wui on 12/29/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionsystemMasterResourceDataService', ['platformDataServiceFactory',
		'constructionsystemMasterLineItemDataService',
		'constructionSystemMasterHeaderService',
		'ServiceDataProcessArraysExtension',
		'estimateMainResourceImageProcessor',
		'estimateMainResourceProcessor',
		'cloudCommonGridService', '_',
		function (
			platformDataServiceFactory,
			constructionsystemMasterLineItemDataService,
			constructionSystemMasterHeaderService,
			ServiceDataProcessArraysExtension,
			estimateMainResourceImageProcessor,
			estimateMainResourceProcessor,
			cloudCommonGridService, _) {

			var serviceOption = {
				hierarchicalRootItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionsystemMasterResourceDataService',
					entityRole: {
						root: {
							itemName: 'Resource',
							parentService: constructionsystemMasterLineItemDataService
						}
					},
					presenter: {
						tree: {
							parentProp: 'EstResourceFk',
							childProp: 'EstResources',
							childSort : true,
							isInitialSorted:true,
							sortOptions: {
								initialSortColumn: {field: 'Code', id: 'code'},
								isAsc: true
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								data.sortByColumn(readItems);
								return data.handleReadSucceeded(readItems, data);
							}
						}
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['EstResources']), estimateMainResourceImageProcessor, estimateMainResourceProcessor]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			var service = serviceContainer.service;

			service.sortTree = function sortTree(items) {
				serviceContainer.data.sortByColumn(items);
			};

			service.setList = function setList(data) {
				data = data ? data : [];
				// service.sortTree(data);
				serviceContainer.data.itemTree = data;
				var flatResList = [];
				cloudCommonGridService.flatten(data, flatResList, 'EstResources');

				_.forEach(flatResList, function(item){
					item.EstResourceTypeFkExtend = item.EstResourceTypeFk;
				});
				estimateMainResourceImageProcessor.processItems(flatResList);
				// estimateMainResourceProcessor.processItems(flatResList, false);
				serviceContainer.data.itemList = flatResList;
			};

			constructionsystemMasterLineItemDataService.registerSelectionChanged(refresh);

			refresh();

			function clear(){
				service.setList([]);
			}

			function refresh() {
				clear();

				var lineItem = constructionsystemMasterLineItemDataService.getSelected();
				if (lineItem && angular.isArray(lineItem.EstResources)) {
					service.setList(lineItem.EstResources);
				}

				serviceContainer.data.listLoaded.fire();
			}

			return service;
		}
	]);

})(angular);