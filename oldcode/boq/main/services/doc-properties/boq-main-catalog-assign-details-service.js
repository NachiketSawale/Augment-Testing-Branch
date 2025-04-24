/**
 * Created by bel on 6/13/2017.
 */

(function () {
	/* global globals, _ */
	'use strict';

	var moduleName = 'boq.main';
	angular.module(moduleName).factory('boqMainCatalogAssignDetailsService', ['$q', '$http', 'PlatformMessenger', 'platformDataServiceFactory', 'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDefinitionService', 'platformRuntimeDataService',
		function ($q, $http, PlatformMessenger, platformDataServiceFactory, basicsLookupdataLookupFilterService,
			basicsLookupdataLookupDefinitionService, platformRuntimeDataService) {
			var service = {};
			var currentCatalogDetail = null,
				data = [],
				itemsToSave = [],
				itemsToDelete = [],
				isReadOnly = true,
				dialogMode = 'default',
				isProjectFilter = true,
				_projectId = null;

			angular.extend(service, {
				editCatalogChanged: new PlatformMessenger(),
				catalogDetailsChanged: new PlatformMessenger(),// after list data loaded
				catalogDetailsModified: new PlatformMessenger(),// after list data loaded
				selectedCatalogDetailChanged: new PlatformMessenger(),
				listLoaded: new PlatformMessenger(),
				getCatalogAssignDetails: getCatalogAssignDetails,
				getCurrentCatalogDetail: getCurrentCatalogDetail,
				setCurrentCatalogDetail: setCurrentCatalogDetail,
				getList: getList,
				createItem: createItem,
				deleteItem: deleteItem,
				refreshGrid: refreshGrid,
				getPropertiesReadOnly: getPropertiesReadOnly,
				setPropertiesReadOnly: setPropertiesReadOnly,
				clearData: clearData,
				getItemsToDelete: getItemsToDelete,
				getDialogMode: getDialogMode,
				setDialogMode: setDialogMode,
				setProjectFilter: setProjectFilter,
				unregisterFilter: unregisterFilter
			});

			// Move implementation of setSelected and remove this serviceOption configuration
			var serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'boqMainCatalogAssignDetailsService',
					title: 'Title',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: { moduleSubModule: 'Boq.Main', typeName: 'BoqCatAssignDetailDto' }
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			container.data.itemList = [];
			angular.extend(service, container.service);

			var assignProjectFilter = [{
				key: 'boq-main-catalog-assign-project-filter',
				fn: function (item) {
					// return (isProjectFilter ? item.Id <= 6 : true); --> this is not maintainable!
					return isProjectFilter ? item.HasProjectRef === false : true;
				}
			}];

			basicsLookupdataLookupFilterService.registerFilter(assignProjectFilter);

			service.setProjectId = function (projectId) {
				_projectId = projectId;
			};
			service.getProjectId = function () {
				return _projectId;
			};

			init();
			return service;

			function getCatalogAssignDetails(catalogAssignId, catConfTypeId, readOnly) {
				// isReadOnly = !!catConfTypeId && !catalogAssignId;
				if (angular.isDefined(readOnly)) {
					isReadOnly = readOnly;
				}
				return $http.get(globals.webApiBaseUrl + 'boq/main/type/getboqcatalogassigndetails?catalogAssignId=' + catalogAssignId).then(function (response) {

					angular.forEach(response.data.catAssignDetailList, function (item) {
						platformRuntimeDataService.readonly(item, [
							{field: 'Code', readonly: isReadOnly || item.BoqCatalogFk !== 15},
							{field: 'DescriptionInfo', readonly: isReadOnly || item.BoqCatalogFk !== 15},
							{field: 'CatalogSourceFk', readonly: isReadOnly || item.BoqCatalogFk !== 15}
						]);
					});

					data = response.data.catAssignDetailList;
					service.catalogDetailsChanged.fire();
					return response.data;
				});
			}

			function getCurrentCatalogDetail() {
				return currentCatalogDetail;
			}

			function setCurrentCatalogDetail(catalogDetail) {
				currentCatalogDetail = catalogDetail;
			}

			function getList() {
				return data;
			}

			function setItemToSave(item) {
				var modified = _.find(itemsToSave, {Id: item.Id});
				if (!modified) {
					itemsToSave.push(item);
				}
			}

			function addItem(item) {
				data = data ? data : [];
				data.push(item);
				setItemToSave(item);
				service.refreshGrid();
			}

			function createItem() {
				// server create
				var httpRoute = globals.webApiBaseUrl + 'boq/main/type/createcatalogassigndetail';

				return $http.get(httpRoute).then(function (response) {
					var item = response.data;
					if (item && item.Id) {
						addItem(item);
						service.setCurrentCatalogDetail(item);
						service.catalogDetailsChanged.fire();
						service.catalogDetailsModified.fire();
					}
					return item;
				});
			}

			function deleteItem() {
				var selectedItem = service.getCurrentCatalogDetail();
				if (selectedItem && selectedItem.Version > 0) {
					itemsToDelete.push(selectedItem);
				}
				var index = _.findIndex(data, {'Id': selectedItem.Id});

				data = _.filter(data, function (d) {
					return d.Id !== selectedItem.Id;
				});

				itemsToSave = _.filter(itemsToSave, function (d) {
					return d.Id !== selectedItem.Id;
				});

				var item = index > 0 ? data[index - 1] : null;
				refreshGrid();
				service.setCurrentCatalogDetail(item);
				// updateSelection();

				service.catalogDetailsChanged.fire();
				service.catalogDetailsModified.fire();
			}

			function refreshGrid() {
				service.listLoaded.fire();
			}

			function getPropertiesReadOnly() {
				return isReadOnly;
			}

			function setPropertiesReadOnly(readonly) {
				var fireChangedEvent = isReadOnly !== readonly;

				isReadOnly = readonly;

				if (fireChangedEvent) {
					// fire event to change grid state
					service.catalogDetailsChanged.fire();
				}
			}

			function getItemsToDelete() {
				return itemsToDelete;
			}

			function getDialogMode() {
				return dialogMode;
			}

			function setDialogMode(modeName) {
				dialogMode = modeName;
			}

			function setProjectFilter(isFilter) {
				isProjectFilter = isFilter;
			}

			function unregisterFilter() {
				basicsLookupdataLookupFilterService.unregisterFilter(assignProjectFilter);
			}

			function clearData() {
				currentCatalogDetail = null;
				data = [];
				itemsToSave = [];
				itemsToDelete = [];
				isReadOnly = true;
				isProjectFilter = true;
				_projectId = null;
				service.catalogDetailsChanged.fire();
			}

			function init() {
				basicsLookupdataLookupDefinitionService.load([
					'boqMainCatalogAssignCatalogCombobox',
					'boqMainCatalogAssignCostgroupCombobox'
				]);
			}

		}]);
})();
