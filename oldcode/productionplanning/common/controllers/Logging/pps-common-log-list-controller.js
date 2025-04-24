/**
 * Created by zwz on 4/28/2020.
 */
(function () {
	'use strict';
	/*global angular*/

	/**
	 * @ngdoc controller
	 * @name ppsCommonLogListController
	 * @requires
	 * @description
	 * #
	 * Controller for general log list controller
	 */
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('ppsCommonLogListController', ctrl);
	ctrl.$inject = ['$scope', 
		'platformGridControllerService',
		'ppsCommonLogDataServiceFactory',
		'ppsCommonLogUIStandardService'];
	function ctrl($scope, 
				  platformGridControllerService,
				  dataServiceFactory,
				  uiStandardService) {
		var gridConfig = {initCalled: false, columns: []};

		// get environment variable from the module-container.json file
		var serviceOptions = $scope.getContentValue('serviceOptions');
		var dataService = dataServiceFactory.getOrCreateService(serviceOptions);
		platformGridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);

		function onParentItemUpdateDone(){
			dataService.read();
		}
		dataService.parentService().registerUpdateDone(onParentItemUpdateDone);
		// remark: at the moment, registerUpdateDone() is only used for log of transport module. transportplanningTransportMainService has fire the PlatformMessenger container.data.updateDone in the callback handleUpdateDone().

		$scope.$on('$destroy', function(){
			dataService.parentService().unregisterUpdateDone(onParentItemUpdateDone);
		});
	}
})();