(function (angular) {
	'use strict';
	/* global angular, _ */
	var moduleName = 'transportplanning.package';
	var module = angular.module(moduleName);

	module.controller('transportplanningTransportWaypointPackageListController', controller);
	controller.$inject = [
		'$injector',
		'$scope',
		'platformGridAPI',
		'platformGridControllerService',
		'transportplanningPackageReadonlyDataServiceFactory',
		'transportplanningPackageUIStandardService'];

	function controller($injector,
						$scope,
						platformGridAPI,
						gridControllerService,
						dataServiceFactory,
						uiStandardService) {

		function createUiService(uiStandardService) {
			var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			// //set order of columns trsroutefk,transportrtestatus(after columns status,code)
			// var srcCol = _.find(columns, {id: "trswaypointsrcfk"});
			// var dstCol = _.find(columns, {id: "trswaypointdstfk"});
			// _.remove(columns, {id: "trswaypointsrcfk"});
			// _.remove(columns, {id: "trswaypointdstfk"});
			// columns.splice(0, 0, dstCol);
			// columns.splice(0, 0, srcCol);

			columns.splice(0,0,{
					id: 'actionIcon',
					field: 'Action',
					name: 'Action',
					name$tr$: 'basics.customize.action',
					formatter: 'imageselect',
					formatterOptions: {
					serviceName: 'transportplanningTransportWaypointPackageActionImageProcessor'
				}
			});
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
		$injector.get('transportplanningTransportWaypointPackageActionImageProcessor').setIcons();
		var uiService = createUiService(uiStandardService);

		var serviceOption = $scope.getContentValue('serviceOption');
		var dataServ = dataServiceFactory.getService(serviceOption);

		var gridConfig = {initCalled: false, columns: []};
		gridControllerService.initListController($scope, uiService, dataServ, null, gridConfig);

	}
})(angular);