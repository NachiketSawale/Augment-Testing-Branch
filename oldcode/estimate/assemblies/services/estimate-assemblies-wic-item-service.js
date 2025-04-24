/**
 * Created by benny on 17.08.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.assemblies',
		angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateAssembliesWicItemService
	 * @function
	 *
	 * @description
	 * estimateAssembliesWicItemService is the data service for Assemblies2WicItem related functionality.
	 */
	angModule.factory('estimateAssembliesWicItemService', ['platformDataServiceFactory', 'estimateAssembliesService', 'basicsLookupdataLookupFilterService', 'estimateAssembliesWicItemProcessor',
		function (platformDataServiceFactory, estimateAssembliesService, basicsLookupdataLookupFilterService, estimateAssembliesWicItemProcessor) {

			// let service = {};
			let serviceContainer = platformDataServiceFactory.createNewComplete({
				flatNodeItem: {
					module: angModule,
					serviceName: 'estimateAssembliesWicItemService',
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/assemblies/wicitem/', endCreate: 'createnew'},
					httpRead: {route: globals.webApiBaseUrl + 'estimate/assemblies/wicitem/'},
					useItemFilter: true,
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selectedItem = estimateAssembliesService.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.Id = selectedItem.Id;
									creationData.estHeaderFk = selectedItem.EstHeaderFk;
								}
							}
						}
					},
					dataProcessor: [ estimateAssembliesWicItemProcessor ],
					entityRole: {
						node: {itemName: 'EstAssemblyWicItem', parentService: estimateAssembliesService}
					}
				}
			});

			let service = serviceContainer.service;

			let lookupFilter = [
				{
					key: 'estimate-assembly-wic-item-filter',
					serverSide: true,
					fn: function () {
						let item = service.getSelected();
						let filterId = -1;
						if(item && item.EstAssemblyWicItem)
						{
							filterId = item.EstAssemblyWicItem.BoqHeaderFk;
						}
						return 'BoqHeaderFk=' + (filterId);
					}
				}
			];

			service.registerLookupFilter =function registerLookupFilter() {
				basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
			};

			service.unregisterLookupFilter = function unregisterLookupFilter() {
				basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);
			};

			return service;
		}]);
})();
