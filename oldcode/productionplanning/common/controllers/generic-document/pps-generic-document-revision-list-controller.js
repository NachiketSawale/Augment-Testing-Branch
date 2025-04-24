/**
 * Created by anl on 1/18/2023.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular, _ */

	let moduleName = 'productionplanning.common';
	let module = angular.module(moduleName);

	module.controller('ppsCommonGenericDocumentRevisionListController', GenericDocumentRevisionListController);

	GenericDocumentRevisionListController.$inject = [
		'$scope',
		'platformGridControllerService',
		'platformToolbarService',
		'ppsGenericDocumentRevisionDataServiceFactory',
		'ppsGenericDocumentRevisionUIStandardService',
		'basicsCommonUploadDownloadControllerService'];

	function GenericDocumentRevisionListController(
		$scope,
		gridControllerService,
		platformToolbarService,
		revisionDataServiceFactory,
		uiStandardService,
		basicsCommonUploadDownloadControllerService) {

		let serviceOptions = $scope.getContentValue('serviceOptions');
		let containerUUID = $scope.getContainerUUID();
		let dataService = revisionDataServiceFactory.getOrCreateService(serviceOptions);

		let gridConfig = { initCalled: false, columns: [] };

		const filterToolItems = (filterItems) => {
			return _.filter(platformToolbarService.getTools(containerUUID), function (item) {
				return item && filterItems.indexOf(item.id) === -1;
			});
		};

		const initToolItems = () => {
			$scope.tools.items = filterToolItems(['create']);
			// don't remove it, beacuse of the framework problem, I need this to make tool items not show again
			$scope.setTools = function () {
			};
		};

		gridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);
		basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
		initToolItems();


		const onSelectedRowsChanged = () => {
			$scope.tools.update();
		};
		dataService.registerSelectionChanged(onSelectedRowsChanged);

		$scope.$on('$destroy', () => {
			dataService.unregisterSelectionChanged(onSelectedRowsChanged);
		});
	}
})(angular);