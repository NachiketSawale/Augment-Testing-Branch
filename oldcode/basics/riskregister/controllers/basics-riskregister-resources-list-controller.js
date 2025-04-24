(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).controller('basicsRiskRegisterResourcesListController', [
		'$scope', '$translate', 'platformGridControllerService',
		'platformGridAPI','basicsRiskregisterResourcesDataService',
		'basicsRiskregisterResourceConfigurationService',
		function ($scope, $translate,platformGridControllerService,
		          platformGridAPI,basicsRiskregisterResourcesDataService,
		          basicsRiskregisterResourceConfigurationService) {

			var myGridConfig = {
				initCalled: false,
				columns: [],
				parentProp: 'RiskResourceFk',
				childProp: 'RiskResource',
				cellChangeCallBack: function cellChangeCallBack(arg) {
					var column = arg.grid.getColumns()[arg.cell].field;
					basicsRiskregisterResourcesDataService.fieldChange(arg.item, column);
					basicsRiskregisterResourcesDataService.markItemAsModified(arg.item);
				},
				type: 'resources'
			};

			platformGridControllerService.initListController($scope, basicsRiskregisterResourceConfigurationService, basicsRiskregisterResourcesDataService, null, myGridConfig);

		}
	]);
})(angular);
