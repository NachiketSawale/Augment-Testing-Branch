/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonStatusHistoryListController', [
		'$scope',
		'$injector',
		'platformGridControllerService','basicsCommonStatusHistoryDataServiceFactory','basicsCommonStatusHistoryUIStandardService',
		function ($scope,$injector,
			platformGridControllerService,
			statusHistoryDataServiceFactory,
			statusHistoryUIStandardService) {
			var gridConfig = {
				columns: []
			};
			var statusName = $scope.getContentValue('StatusName');
			var lookupTypeName = $scope.getContentValue('LookupTypeName');
			var displayMember = $scope.getContentValue('DisplayMember');

			var parentServiceName = $scope.getContentValue('parentService');
			var parentService = $injector.get(parentServiceName);
			var dataService = statusHistoryDataServiceFactory.getService(parentService, statusName);
			var cls = statusHistoryUIStandardService.getStandardConfigForListView().columns;
			for (var i = 0; i < cls.length - 1; i++) {
				if (statusHistoryUIStandardService.getStandardConfigForListView().columns[i].hasOwnProperty('formatterOptions')) {
					statusHistoryUIStandardService.getStandardConfigForListView().columns[i].formatterOptions.displayMember = displayMember;
					statusHistoryUIStandardService.getStandardConfigForListView().columns[i].formatterOptions.lookupType = lookupTypeName;
				}
			}
			platformGridControllerService.initListController($scope, statusHistoryUIStandardService, dataService, '', gridConfig);
		}
	]);

})(angular);
