/**
 * Created by lja on 07/21/2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonCertificatesController
	 * @require $scope
	 * @description controller for certificates
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonCertificatesController',
		['$scope', 'procurementContextService', 'platformGridControllerService', 'procurementCommonCertificateNewDataService',
			'procurementCommonCertificatesValidationService', 'procurementCommonCertificateUIStandardService', 'procurementCommonHelperService',
			function ($scope, moduleContext, gridControllerService, dataServiceFactory, validationService, gridColumns, procurementCommonHelperService) {

				var gridConfig = {initCalled: false, columns: []}, // add rowChangeCallBack just for work around to enable update the can create and can delete
					parentService = moduleContext.getMainService(),
					dataService = dataServiceFactory.getService(parentService);

				validationService = validationService(dataService);

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				var certificateItemService=dataServiceFactory.getService();
				function updateTools(){
					$scope.tools.update();
				}

				if(certificateItemService.updateToolsEvent){
					certificateItemService.updateToolsEvent.register(updateTools);
				}

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); // bind listener
				certificateItemService.setToolItems($scope.tools.items);
				$scope.$on('$destroy', function () {
					moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); // unbind listener
					if(certificateItemService.updateToolsEvent){
						certificateItemService.updateToolsEvent.unregister(updateTools);
					}
				});
			}]);
})(angular);