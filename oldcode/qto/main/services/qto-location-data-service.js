/**
 * Created by lnb on 2/25/2015.
 */
(function (angular) {
	/* globals  globals, _ */
	'use strict';
	let moduleName = 'qto.main';
	let qtoMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectLocationMainService
	 * @function
	 *
	 * @description
	 * projectLocationMainService is the data service for all location related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	qtoMainModule.factory('qtoMainLocationDataService', ['$http', '$q', '$log', '$injector', 'qtoMainHeaderDataService',
		'qtoMainDetailService', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataLookupDescriptorService', 'projectLocationMainImageProcessor', 'platformDataServiceDataProcessorExtension',
		'platformModalService','qtoMainBoqFilterService','platformRuntimeDataService', 'cloudCommonGridService',
		function ($http, $q, $log, $injector, qtoMainHeaderDataService, qtoMainDetailService, platformDataServiceFactory, ServiceDataProcessArraysExtension,
			basicsLookupdataLookupDescriptorService, projectLocationMainImageProcessor, dataServiceDataProcessor,
			platformModalService,qtoMainBoqFilterService,platformRuntimeDataService, cloudCommonGridService) {

			let service = {};
			let container = {};
			let locationServiceInfo = {// new SubItemBase(globals.webApiBaseUrl + 'project/location/', 'Locations', projectMainService, locationCRUDInfo);
				hierarchicalLeafItem: {
					module: qtoMainModule,
					serviceName: 'qtoMainLocationDataService',
					entityNameTranslationID: 'qto.main.PrjLocation',
					httpCreate: { route: globals.webApiBaseUrl + 'project/location/' },
					httpRead: {
						route: globals.webApiBaseUrl + 'project/location/',
						initReadData: function initReadData(readData) {
							let qtoHeader = qtoMainHeaderDataService.getSelected();
							readData.filter = '?projectId=' + (qtoHeader ? qtoHeader.ProjectFk : -1);
						}
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['Locations']), projectLocationMainImageProcessor],
					presenter: {
						tree: {
							parentProp: 'LocationParentFk', childProp: 'Locations',
							incorporateDataRead: function (readData, data) {
								// set the create item button
								let itemTrees = readData || [];
								// let selectItem = service.getSelected();
								let itemList = [];
								cloudCommonGridService.flatten(itemTrees, itemList, 'Locations');

								let qtoHeader = qtoMainHeaderDataService.getSelected();
								let qtoStatusItem = $injector.get('qtoHeaderReadOnlyProcessor').getItemStatus(qtoHeader);
								let isReadOnly = false;
								if (qtoStatusItem) {
									isReadOnly = qtoStatusItem.IsReadOnly;
								}
								if(isReadOnly) {
									service.canCreateChild = function () {
										return false;
									};
									service.canCreate = function () {
										return false;
									};
									service.canDelete = function () {
										return false;
									};

									// set the item as readonly
									_.forEach(itemList, function (item) {
										service.updateReadOnly(item, ['DescriptionInfo', 'Code', 'Quantity', 'QuantityPercent', 'Sorting', 'UoMFk'], true);
									});
								}

								if(itemList && itemList.length > 0){
									// keep the filter in location
									let filterLocations = qtoMainDetailService.filterLocations;
									if(filterLocations && filterLocations.length > 0){
										_.each(itemList, function(item){
											let index = filterLocations.indexOf(item.Id);
											if(index !== -1){
												item.IsMarked = true;
											}
										});
									}
								}

								// set version qto as readonly
								$injector.get('qtoMainCommonService').setContainerReadOnly(qtoHeader.IsBackup, '9fe0906f463f4ad19d9987dbb58c0704');

								return container.data.handleReadSucceeded(itemTrees, data);
							},
							initCreationData: function initCreationData(creationData) {
								creationData.Id = qtoMainHeaderDataService.getSelected().ProjectFk;
								let parentId = creationData.parentId;
								delete creationData.MainItemId;
								delete creationData.parentId;
								if(!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
									creationData.PKey1 = parentId;
								}
							}
						}
					},
					toolBar: {
						id: 'filterLocation',
						costgroupName: 'LocationFk',
						iconClass: 'tlb-icons ico-filter-boq'
					},
					entityRole: {
						leaf: {
							itemName: 'Locations',
							parentService: qtoMainHeaderDataService,
							parentFilter: 'projectId',
							doesRequireLoadAlways: true
						}
					},
					translation: {
						uid: 'qtoMainLocationDataService',
						title: 'qto.main.locations.title',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'LocationDto',
							moduleSubModule: 'qto.main'
						}
					}
				}
			};

			/* qtoMainDetailService.registerSelectionChanged(function () {
				service.gridRefresh();
			}); */

			container = platformDataServiceFactory.createNewComplete(locationServiceInfo);
			service = container.service;

			qtoMainBoqFilterService.addMarkersChanged(service,  locationServiceInfo.hierarchicalLeafItem.presenter.tree,locationServiceInfo.hierarchicalLeafItem.toolBar,'setFilterLocations');

			service.getFilterKeys = function getFilterKeys() {
				return _.filter(service.getList(), {isFilter: true}).map(function (item) {
					return item.Id;
				});
			};

			let onEntityCreated = function onEntityCreated(e, item) {
				basicsLookupdataLookupDescriptorService.attachData({'qtoProjectLocationLookupDataService': [item]});
			};

			// set entity's parent filter status
			let setParentFilters = function setParentFilters(entity, items) {
				let parent = _.find(items, {Id: entity.LocationParentFk});
				if (angular.isDefined(parent)) {
					let isFilter = !!_.find(parent.Locations, {isFilter: true});
					if (isFilter !== parent.isFilter) {
						parent.isFilter = isFilter;
						setParentFilters(parent, items);
						dataServiceDataProcessor.doProcessItem(parent, container.data);
					}
				}
			};

			// set entity's children filter status
			let setChildFilters = function setChildFilters(entity) {
				let index = 0;
				for (index; index < entity.Locations.length; index++) {
					let child = entity.Locations[index];
					child.isFilter = entity.isFilter;
					setChildFilters(child);
					dataServiceDataProcessor.doProcessItem(child, container.data);
				}
			};

			// when new item created, attach it to lookup resource
			service.registerEntityCreated(onEntityCreated);

			// do location assignment to qto detail.
			service.assignLocation = function copyLocation(options, entity) {
				if (qtoMainDetailService.getSelected()) {
					qtoMainDetailService.getSelected().PrjLocationFk = entity.Id;
					qtoMainDetailService.markCurrentItemAsModified(qtoMainDetailService.getSelected());
					basicsLookupdataLookupDescriptorService.attachData({'qtoProjectLocationLookupDataService': [entity]});
					qtoMainDetailService.gridRefresh();
				}
			};

			// set filters to locations.
			service.filterLocation = function filterLocation(options, entity) {
				container.data.disableWatchSelected(container.data);
				entity.isFilter = !entity.isFilter;
				let items = service.getList();

				setParentFilters(entity, items);
				setChildFilters(entity);
				dataServiceDataProcessor.doProcessItem(entity, container.data);

				service.gridRefresh();
				container.data.enableWatchSelected(entity, container.data);
				let filterKeys = _.filter(items, {isFilter: true}).map(function (item) {
					return item.Id;
				});
				// set filter keys and call update.
				qtoMainDetailService.setFilterLocations(filterKeys);
				let promise = qtoMainHeaderDataService.update();
				if (promise) {
					promise.then(function () {
						qtoMainDetailService.load();// reload items in qto detail
					});
				} else {
					qtoMainDetailService.load();// reload items in qto detail
				}
			};


			let allChildIds = [];
			let getAllChildItems = function (parentLocationItems) {
				_.forEach(parentLocationItems, function (parentLocationItem) {
					allChildIds = allChildIds.concat(parentLocationItem.Id);
					_.forEach(parentLocationItem.Locations, function (item) {
						allChildIds = allChildIds.concat(item.Id);
						if (item.HasChildren) {
							getAllChildItems(item.Locations);
						}
					});
				});
			};

			// override onDeleteDone
			let baseOnDeleteDone = container.data.onDeleteDone;
			container.data.onDeleteDone = function onDeleteDoneInList(deleteParams, data) {
				let deleteItem = service.getSelected(),
					parentItem = [];

				parentItem = parentItem.concat(deleteItem);

				// eslint-disable-next-line no-prototype-builtins
				if (deleteItem && deleteItem.hasOwnProperty('Id')) {
					let modalOptions = {
						headerTextKey: 'qto.main.locations.deleteLocationHeaderTitle',
						bodyTextKey: 'qto.main.locations.deleteLocationErrorTitle',
						showOkButton: true,
						iconClass: 'ico-info'
					};
					allChildIds = [];
					getAllChildItems(parentItem);

					service.getResult(allChildIds).then(function (reponse) {
						if (reponse) {
							platformModalService.showDialog(modalOptions);
						}
						else {
							baseOnDeleteDone(deleteParams, data);
							// baseOnDeleteDone.apply(container.data, arguments);
						}
					});
				}
			};

			service.getResult = function (allChildIds) {
				let defer = $q.defer();
				$http.post(globals.webApiBaseUrl + 'qto/main/detail/isExistLocationUse', allChildIds).then(function (response) {
					defer.resolve(response.data);
				});
				return defer.promise;
			};

			service.getLocationReadonlySystemOption = function () {
				let defer = $q.defer();
				$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/islocationinqtoreadonly').then(function (response) {
					defer.resolve(response.data);
				});
				return defer.promise;
			};

			service.updateReadOnly = function (item, fieldList, value) {
				_.forEach(fieldList, function (field) {
					platformRuntimeDataService.readonly(item, [
						{field: field, readonly: value}
					]);
				});
			};

			return service;

		}]);
})(angular);