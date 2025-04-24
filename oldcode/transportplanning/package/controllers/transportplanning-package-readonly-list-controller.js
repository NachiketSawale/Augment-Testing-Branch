(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	var module = angular.module(moduleName);

	module.controller('transportplanningPackageReadonlyListController', controller);
	controller.$inject = [
		'$injector',
		'$scope',
		'_',
		'platformGridAPI',
		'platformGridControllerService',
		'transportplanningPackageReadonlyDataServiceFactory',
		'transportplanningPackageUIStandardService'];

	function controller($injector,
		$scope,
		_,
		platformGridAPI,
		gridControllerService,
		dataServiceFactory,
		uiStandardService) {

		function createUiService(uiStandardService) {
			var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			//set order of columns trsroutefk,transportrtestatus(after columns status,code)
			var found = _.find(columns, {id: 'trsroutefk'});
			var found2 = _.find(columns, {id: 'transportrtestatus'});
			_.remove(columns, {id: 'trsroutefk'});
			_.remove(columns, {id: 'transportrtestatus'});
			columns.splice(2, 0, found);
			columns.splice(3, 0, found2);
			_.remove(columns, {id: 'trswaypointsrcfk'});
			_.remove(columns, {id: 'trswaypointdstfk'});
			//set columns readonly
			_.forEach(columns, function (o) {
				o.editor = null;
			});
			return {
				getStandardConfigForListView: function () {
					return {
						columns: columns
					};
				}
			};
		}
		var uiService = createUiService(uiStandardService);

		var serviceOption = $scope.getContentValue('serviceOption');
		var dataServ = dataServiceFactory.getService(serviceOption);

		var gridConfig = {initCalled: false, columns: []};
		gridControllerService.initListController($scope, uiService, dataServ, null, gridConfig);

	}
})(angular);