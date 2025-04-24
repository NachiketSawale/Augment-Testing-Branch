(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	var module = angular.module(moduleName);

	module.factory('transportplanningBundleMainService', BundleMainService);
	BundleMainService.$inject = [
		'basicsLookupdataLookupFilterService',
		'cloudDesktopSidebarService',
		'transportplanningBundleDataServiceContainerBuilder',
		'transportplanningBundlePinningContextExtension'];

	function BundleMainService(basicsLookupdataLookupFilterService,
							   cloudDesktopSidebarService,
							   ServiceBuilder,
							   pinningContextExtension) {

		var serviceContainer;

		var serviceInfo = {
			module: module,
			serviceName: 'transportplanningBundleMainService',
			entitySelection: {supportsMultiSelection: true}
		};
		var validationService = 'transportplanningBundleValidationService';
		var httpResource = {
			endRead: 'customfiltered',
			endDelete: 'deletebundles',
			usePostForRead: true
		};
		var entityRole = {
			root: {
				itemName: 'Bundles',
				moduleName: 'cloud.desktop.moduleDisplayNameBundle',
				responseDataEntitiesPropertyName: 'Main',
				descField: 'DescriptionInfo.Translated',
				useIdentification: true // will set each pinningItem -> pItem.id = {Id: pItem.id}
			}
		};
		var sidebarSearch = {
			options: {
				moduleName: moduleName,
				enhancedSearchEnabled: true,
				enhancedSearchVersion: '2.0',
				pattern: '',
				pageSize: 100,
				//useCurrentClient: true,
				includeNonActiveItems: false,
				showOptions: true,
				showProjectContext: true,
				withExecutionHints: false,
				pinningOptions: pinningContextExtension.createPinningOptions()
			},
			selectAfterSearchSucceeded: false
		};
		var presenter = {
			list: {
				handleCreateSucceeded: handleCreateSucceeded
			}
		};
		var actions = {
			create: 'flat',
			delete: {},
			canDeleteCallBackFunc: function (item) {
				return serviceContainer.service.isBundleDeleteable(item);
			}
		};

		var builder = new ServiceBuilder('flatRootItem');
		serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setValidationService(validationService)
			.setHttpResource(httpResource)
			.setEntityRole(entityRole)
			.setSidebarSearch(sidebarSearch)
			.setPresenter(presenter)
			.setActions(actions)
			.build();

		var service = serviceContainer.service;

		serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
			_.forEach(deleteParams.entities, function (entity){
				if(!angular.isDefined(entity.LoadingDevice.Id)){
					entity.LoadingDevice = null;
				}
			});
		};

		// add dataCache
		var dataCache = {};
		var orgClearCache = serviceContainer.service.clearCache;
		serviceContainer.service.clearCache = function () {
			if (_.isFunction(orgClearCache)) {
				orgClearCache.apply(this, arguments);
			}
			dataCache = {};
		};

		function handleCreateSucceeded(item) {
			item.ProjectFk = cloudDesktopSidebarService.filterRequest.projectContextId;
		}

		function registerLookupFilters() {
			var filters = [{
				key: 'transportplanning-bundle-trsRequisition-filter',

				fn: function (item) {
					var isRequisitionAccepted = service.isTrsRequisitionAccepted(item);
					var isSameProject = item.ProjectFk === service.getSelected().ProjectFk;
					return !isRequisitionAccepted && isSameProject;
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);
		}

		function searchItem(id) {
			cloudDesktopSidebarService.filterSearchFromPKeys([id], [{Token:'Id',Value: id}]);
		}

		registerLookupFilters();

		angular.extend(service, {
			searchItem: searchItem
		});

		return service;
	}
})(angular);