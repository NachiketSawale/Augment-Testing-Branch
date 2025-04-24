
(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	let boqProjectModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqProjectService
	 * @function
	 *
	 * @description
	 * boqProjectService is a data service for managing boqs in the project main module.
	 */
	boqProjectModule.factory('estimateMainBoqHeaderService', ['$http','platformDataServiceFactory','PlatformMessenger', 'platformRuntimeDataService','$q', 'boqProjectReadonlyProcessor', '$injector','projectMainService','basicsLookupdataLookupDescriptorService',
		function ($http,platformDataServiceFactory,PlatformMessenger, platformRuntimeDataService, $q, boqProjectReadonlyProcessor, $injector,projectMainService,basicsLookupdataLookupDescriptorService) {
			let serviceContainer = {};
			let service = {};
			let filterBackups = false;
			let boqHeaderPromise ={};

			let boqProjectServiceOption = {
				hierarchicalRootItem: {
					module: boqProjectModule,
					serviceName: 'estimateMainBoqHeaderService',
					entityRole: {
						root: {
							itemName: 'estimateMainBoqHeader',
							codeField: 'Reference',
							descField: 'DescriptionInfo.Translated'
						}
					},
					httpCreate: {route: globals.webApiBaseUrl + 'boq/project/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'boq/project/',
						initReadData: function(readData) {
							readData.filter = '?projectId='+ $injector.get('estimateMainService').getProjectId()+ '&filterBackups=false';
						}
					},
					actions: {
						delete: true,
						create: 'flat'
					},
					dataProcessor: [
						boqProjectReadonlyProcessor,
						{
							processItem: function(projectBoq) {
								if (filterBackups) {
									platformRuntimeDataService.readonly(projectBoq, true);
								}
							}
						}
					],
					useItemFilter: true,
					entitySelection: {},
					setCellFocus: true,
					presenter: {
						list: {
							isInitialSorted: true, sortOptions: {initialSortColumn: {field: 'BoqRootItem.Reference', id: 'boqRootItem.reference'}, isAsc: true, doNumericComparison: true},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								serviceContainer.data.sortByColumn(readItems);
								let result = serviceContainer.data.handleReadSucceeded(readItems, data);
								return result;
							}
						}
					},
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(boqProjectServiceOption);
			service = serviceContainer.service;
			let data = serviceContainer.data;
			data.updateOnSelectionChanging = null;
			data.showHeaderAfterSelectionChanged = false;

			service.loadBoqHeader = function loadBoqHeader(prjId) {

				if(prjId && prjId === -1){
					let project = projectMainService.getSelected();
					if(project){
						prjId = project.Id;
					}
				}
				let defer = $q.defer();
				$http.get(globals.webApiBaseUrl+'boq/project/list?projectId='+prjId).then(function (response) {
					_.forEach(response.data, function(item){
						if(item.BoqRootItem && item.BoqHeader){
							item.BoqRootItem.IsGCBoq = item.BoqHeader.IsGCBoq;
						}
					});
					let datas = _.map(response.data,'BoqRootItem');
					data.itemList = _.orderBy(datas,'BoqHeaderFk');
					defer.resolve(data.itemList);
				});
				return defer.promise;
			};

			service.setItemFilter = function setItemFilter(predicate) {
				data.itemFilter = predicate;
				if (predicate === null) {
					data.itemFilterEnabled = false;
				}
			};
			
			
			service.getItemByKey = function (id) {
				return service.getItemById(id);
			};
			
			service.getItemById = function(id){
				let item = basicsLookupdataLookupDescriptorService.getLookupItem('estBoqHeaders', id);
				return item;
			};
			
			service.getItemByIdAsync = function(value,formatterOptions){
				let containerServiceName = formatterOptions.mainServiceName;
				if (!boqHeaderPromise[containerServiceName]) {
					boqHeaderPromise[containerServiceName] = getBoqHeadersByIds(formatterOptions);
				}
				return boqHeaderPromise[containerServiceName].then(function () {
					boqHeaderPromise = {};
					return  service.getItemById(value);
				});
			};

			function getBoqHeadersByIds (formatterOptions){
				let boqHeaderFks = [];
				if (formatterOptions.mainServiceName && $injector.get(formatterOptions.mainServiceName)) {
					let dataServiceList = $injector.get(formatterOptions.mainServiceName).getList();
					
					if(formatterOptions.mainServiceName ==='estimateMainLineItemSelStatementListService') {
						dataServiceList = dataServiceList.concat($injector.get('estimateProjectEstimateLineItemSelStatementListService').getList());
					}
					
					_.forEach(dataServiceList, function (d) {
						if (d.BoqHeaderFk) {
							boqHeaderFks.push(d.BoqHeaderFk);
						}
						if (d.BoqHeaderItemFk) {
							boqHeaderFks.push(d.BoqHeaderItemFk);
						}
						if (d.FromBoqHeaderFk) {
							boqHeaderFks.push(d.FromBoqHeaderFk);
						}
						if (d.ToBoqHeaderFk) {
							boqHeaderFks.push(d.ToBoqHeaderFk);
						}
					});
					boqHeaderFks = _.uniq(boqHeaderFks);
				}
				boqHeaderFks = _.filter(boqHeaderFks, function (d) {
					let item = basicsLookupdataLookupDescriptorService.getLookupItem('estBoqHeaders', d);
					if (!item) {
						return d;
					}
				});
				
				if (!boqHeaderFks.length) {
					return $q.when(true);
				}
				
				let deferred = $q.defer();
				$http.post(globals.webApiBaseUrl + 'boq/main/header/getboqheaders', boqHeaderFks).then(
					function (response) {
						let result = response && response.data ? response.data : [];
						basicsLookupdataLookupDescriptorService.updateData('estBoqHeaders', result);
						deferred.resolve(result);
					});
				return deferred.promise;
			}
			
			angular.extend(service, {
				reset: new PlatformMessenger()
			});

			return service;
		}
	]);
})();
