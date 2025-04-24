/**
 * Created by xsi on 2016-09-14.
 */
(function () {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('constructionsystem.main').controller('constructionSystemMainLeadingStructuresController',
		['$scope','platformGridAPI', 'constructionsystemMainInitFilterService','$injector','constructionSystemMainClipboardService','dragLeadingToInstanceOption',
			'constructionSystemMainInstanceService',
			function ($scope,platformGridAPI, initService,$injector,constructionSystemMainClipboardService,dragLeadingToInstanceOption, constructionSystemMainInstanceService) {
				var dataServiceName = 'constructionSystemMain' + $scope.getContentValue('defaultView') + 'Service';
				var dataService=$injector.get(dataServiceName);
				var uiConfig=dataService.uiConfig;
				dragLeadingToInstanceOption.addLeadingService($scope.getContentValue('defaultView'));

				if(dataService.loadDataOnlyOnce){
					var projectId = constructionSystemMainInstanceService.getSelectedProjectId();
					dataService.loadDataOnlyOnce(projectId);
				}

				initService.initController($scope, dataService, uiConfig,
					{dragDropService: constructionSystemMainClipboardService,type:dataServiceName});

				// noinspection JSUnusedLocalSymbols
				function setMultiSelectItems(e,arg){
					var gridItems = platformGridAPI.rows.getRows($scope.gridId);
					var arr = [];
					if (arg) {
						angular.forEach(arg.rows, function (item) {
							var elem = gridItems[item];
							if (elem) {
								arr.push(elem);
							}
						});
					}
					dataService.multipleSelectedItems = arr;
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged',setMultiSelectItems);

				$scope.$on('$destroy',function(){
					platformGridAPI.events.unregister($scope.gridId,'onSelectedRowsChanged',setMultiSelectItems);
				});
			}]);
})();
