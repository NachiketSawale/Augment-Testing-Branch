(function () {

	'use strict';
	let moduleName = 'qto.main';

	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 *
	 **/
	angModule.controller('qtoBoqSplitQuantityController', [
		'$scope',
		'$injector',
		'boqMainSplitQuantityControllerFactory',
		'platformGridAPI',
		'qtoMainHeaderDataService',
		'$timeout',
		'qtoBoqStructureService',
		function ($scope, $injector, controllerServiceFactory, platformGridAPI, qtoMainHeaderDataService, $timeout, qtoBoqStructureService) {

			controllerServiceFactory.initController($scope, qtoBoqStructureService, moduleName);

			let splitQuantityService = $injector.get('boqMainSplitQuantityServiceFactory').getService(qtoBoqStructureService, 'qto.main');

			function adjustGQColumns() {
				if(!qtoMainHeaderDataService.getGqIsAvailable()){
					return;
				}

				$timeout(function() {
					var gridColumns = platformGridAPI.columns.getColumns($scope.gridId);
					if (!gridColumns) {
						return;
					}

					var gqColumns = [{
						id: 'gqQuantity',
						field: 'GuessedQuantity',
						name: 'GQ Quantity',
						width: 120,
						toolTip: 'GQ Quantity',
						name$tr$: 'qto.main.GuessedQuantity',
						formatter: 'quantity',
						type: 'quantity'
					}]

					gridColumns = gridColumns.concat(gqColumns);
					platformGridAPI.columns.configuration($scope.gridId, gridColumns);

					$timeout(function() {
						platformGridAPI.configuration.refresh($scope.gridId);
					});
				});
			}

			qtoBoqStructureService.registerListLoaded(adjustGQColumns);

			function onListLoaded(){
				let splitItems = splitQuantityService.getList();
				let selectedBoq = qtoBoqStructureService.getSelected();

				if(!qtoMainHeaderDataService.getGqIsAvailable() || !selectedBoq || splitItems.length < 1){
					return;
				}

				_.forEach(splitItems, (item) => {
					item.GuessedQuantity = 0;
				})

				qtoMainHeaderDataService.getGQQuantities(qtoMainHeaderDataService.getSelected(), selectedBoq).then(function(gqQuantities){
					if(_.isArray(gqQuantities) && gqQuantities.length > 0){
						_.forEach(splitItems, (item) => {
							let boqGQQuantities = _.filter(gqQuantities, (quantity) => { return quantity.BoqSplitQuantityFk && quantity.BoqSplitQuantityFk === item.Id; });
							item.GuessedQuantity = _.sum(_.map(boqGQQuantities, 'GQQuantity'));
						});
					}

					platformGridAPI.configuration.refresh($scope.gridId);
				})
			}

			splitQuantityService.registerListLoaded(onListLoaded);

			adjustGQColumns();

			$scope.$on('$destroy', function () {
				qtoBoqStructureService.unregisterListLoaded(adjustGQColumns);
				splitQuantityService.unregisterListLoaded(onListLoaded);
			});
		}
	]);
})();
