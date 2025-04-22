/*
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidBoqListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of the boqs belonging to bids
	 **/
	angular.module(moduleName).controller('salesBidBoqListController',
		['_', '$scope', 'platformContainerControllerService', '$injector', 'modelViewerStandardFilterService',
			function (_, $scope, platformContainerControllerService, $injector, modelViewerStandardFilterService) {
				platformContainerControllerService.initController($scope, moduleName, 'C394FFFC7B2B49C68A175614117084D0');

				var info = $injector.get('salesBidContainerInformationService').getContainerInfoByGuid('C394FFFC7B2B49C68A175614117084D0');

				if(angular.isDefined(info) && (info !== null) && !_.isEmpty(info)){
					var dataServiceName = info.dataServiceName;
					var salesBidBoqService = $injector.get(dataServiceName);
					var salesBidBoqStructureService = $injector.get('salesBidBoqStructureService');

					var reactOnBoqImportSucceeded = function() {
						salesBidBoqService.load();
					};

					salesBidBoqStructureService.onImportSucceeded.register(reactOnBoqImportSucceeded);

					modelViewerStandardFilterService.attachMainEntityFilter($scope, dataServiceName);

					$scope.$on('$destroy', function () {
						salesBidBoqStructureService.onImportSucceeded.unregister(reactOnBoqImportSucceeded);
					});
				}
			}
		]);

})(angular);
