/**
 * Created by waz on 3/6/2018.
 */
(function () {
	'use strict';

	var moduleName = 'productionplanning.common';
	var module = angular.module(moduleName);


	module.controller('productionplanningCommonDocumentRevisionListController', RevisionListController);

	RevisionListController.$inject = [
		'$injector',
		'$scope',
		'platformGridControllerService',
		'platformToolbarService',
		'productionplanningCommonDocumentDataServiceRevisionFactory',
		'productionplanningCommonDocumentRevisionUIStandardService',
		'productionplanningCommonDocumentRevisionValidationServiceFactory',
		'basicsCommonUploadDownloadControllerService'];
	function RevisionListController($injector,
									$scope,
									gridControllerService,
									platformToolbarService,
									dataServiceFactory,
									uiStandardService,
									validationServiceFactory,
									basicsCommonUploadDownloadControllerService) {

		var containerId = $scope.getContentValue('uuid');
		var parentContainerId = $scope.getContentValue('parentUuid');
		var grandfatherService = $scope.getContentValue('grandfathertService');
		var foreignKey = $scope.getContentValue('foreignKey');
		var isReadonly = $scope.getContentValue('isReadonly');
		var idProperty = $scope.getContentValue('idProperty');
		var usingForCombine = $scope.getContentValue('usingForCombine');

		//For dynamic dataservice e.g. Activity, Report
		var grandParentGUID = $scope.getContentValue('grandParentGUID');
		var containerInfo = $scope.getContentValue('containerInfo');

		if (!angular.isDefined(grandfatherService)) {
			if(containerInfo){
				var containerInfoService = $injector.get(containerInfo);
				grandfatherService = containerInfoService.getContainerInfoByGuid(grandParentGUID).dataServiceName;
			}
		}
		else{
			grandfatherService = $injector.get(grandfatherService);
		}

		if(!grandfatherService){
			var grandfathertServiceFactory = $scope.getContentValue('grandfathertServiceFactory');
			if (grandfathertServiceFactory && grandfathertServiceFactory.factoryName &&
				grandfathertServiceFactory.options && grandfathertServiceFactory.serviceGetter) {
				var srvGetter = $injector.get(grandfathertServiceFactory.factoryName)[grandfathertServiceFactory.serviceGetter];
				grandfathertServiceFactory = srvGetter.call(this, grandfathertServiceFactory.options);
			}
		}


		function filterToolItems(filterItems) {
			var containerUUID = $scope.getContainerUUID();
			return _.filter(platformToolbarService.getTools(containerUUID), function (item) {
				return item && filterItems.indexOf(item.id) === -1;
			});
		}

		function initToolItems() {
			$scope.tools.items = isReadonly ?
				filterToolItems(['create', 'delete', 't14', 'upload', 'cancelUpload']) :
				filterToolItems(['create', 'delete']);
			// don't remove it, beacuse of the framework problem, I need this to make tool items not show again
			$scope.setTools = function () {
			};
		}

		var gridConfig = {};
		var serviceOptions = {
			containerId: containerId,
			parentContainerId: parentContainerId,
			grandfatherService: grandfatherService,
			foreignKey: foreignKey,
			isReadonly: isReadonly,
			idProperty: idProperty,
			usingForCombine: usingForCombine
		};


		var dataService = dataServiceFactory.getService(serviceOptions);
		var validationService = validationServiceFactory.getService(containerId, dataService);
		var uiSerivce = isReadonly ?
			$injector.get('productionplanningCommonDocumentRevisionUIReadonlyService') :
			$injector.get('productionplanningCommonDocumentRevisionUIStandardService');
		gridControllerService.initListController(
			$scope,
			uiSerivce,
			dataService,
			validationService,
			gridConfig);
		basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
		initToolItems();
	}
})();