(function (angular) {

	'use strict';
	/* global angular */
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportWaypointListController', transportplanningTransportWaypointListController);

	transportplanningTransportWaypointListController.$inject = ['$scope', 'platformGridAPI',
		'platformGridControllerService',
		'transportplanningTransportWaypointDataService',
		'transportplanningTransportWaypointUIStandardService',
		'transportplanningTransportWaypointValidationService',
		'transportplanningTransportMapDataService',
		'transportplanningTransportUtilService',
		'basicsCommonToolbarExtensionService'];

	function transportplanningTransportWaypointListController($scope, platformGridAPI,
															  platformGridControllerService,
															  dataService,
															  uiStandardService,
															  validationService,
															  transportMapDataService,
															  utilService,
															  basicsCommonToolbarExtensionService) {

		var gridConfig = {
			initCalled: false,
			columns: []
		};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		var recalcDistance = {
			id: 'recalcDistance',
			caption: 'transportplanning.transport.recalculateDist',
			type: 'item',
			iconClass: 'tlb-icons ico-recalc-distance',
			fn: dataService.recalculateRoutes,
			disabled: function () {
				return !dataService.canRecalculate();
			}
		};

		var setDefaultBtn = {
			id: 'setDefault',
			caption: 'transportplanning.transport.setDefault',
			type: 'dropdown-btn',
			iconClass: 'tlb-icons ico-2dqto-calibrate',
			list: {
				showImage: true,
				listCssClass: 'dropdown-menu-right',
				items: [{
					id: 'setDefaultSource',
					caption: 'transportplanning.transport.setDefaultSource',
					type: 'item',
					iconClass: 'control-icons ico-transport-delivery',
					fn: function () {
						setDefault('IsDefaultSrc');
					}
				}, {
					id: 'setDefaultDestination',
					caption: 'transportplanning.transport.setDefaultDestination',
					type: 'item',
					iconClass: 'control-icons ico-transport-return',
					fn: function () {
						setDefault('IsDefaultDst');
					}
				}]
			},
			disabled: function () {
				return _.isEmpty(dataService.getSelected());
			}
		};

		var moveUpBtn = {
			id: 'moveUp',
			sort: 10,
			caption: 'cloud.common.toolbarMoveUp',
			type: 'item',
			iconClass: 'tlb-icons ico-grid-row-up',
			fn: function () {
				dataService.moveUp();
			},
			disabled: function () {
				return !dataService.getSelected();
			}
		};

		var moveDownBtn = {
			id: 'moveDown',
			sort: 10,
			cpation: 'cloud.common.toolbarMoveDown',
			type: 'item',
			iconClass: 'tlb-icons ico-grid-row-down',
			fn: function () {
				dataService.moveDown();
			},
			disabled: function () {
				return !dataService.getSelected();
			}
		};

		basicsCommonToolbarExtensionService.insertBefore($scope, [recalcDistance, setDefaultBtn, moveUpBtn, moveDownBtn]);

		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			dataService.handleFieldChanged(args.item, col);
		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		function onListLoaded(items) {
			//remark: "items is undefined or null" means doing unListLoaded
			if(items){
				var waypoints = _.cloneDeep(items);
				//process waypoints data->convert PlannedTime/ActualTime/InsertedAt/UpdatedAt from Moment to string
				_.each(waypoints,function (w) {
					if(w.PlannedTime){
						w.PlannedTime = w.PlannedTime._i;
					}
					if(w.ActualTime){
						w.ActualTime = w.ActualTime._i;
					}
					if(w.InsertedAt){
						w.InsertedAt = w.InsertedAt._i;
					}
					if(w.UpdatedAt){
						w.UpdatedAt = w.UpdatedAt._i;
					}
				});

				//set waypoints for the selected route
				dataService.parentService().getSelected().Waypoints = waypoints;
				//set route info for the map
				if (utilService.hasShowContainer('transportplanning.transport.routemap')) {
					if(waypoints && waypoints.length >= 1){
						transportMapDataService.setShowRoutes(waypoints);
					}
				}
			}
		}
		dataService.registerListLoaded(onListLoaded);

		function setDefault(field) {
			var selectedItem = dataService.getSelected();
			selectedItem[field] = true;
			dataService.handleFieldChanged(selectedItem, field);
			dataService.markItemAsModified(selectedItem);
		}

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			dataService.unregisterListLoaded(onListLoaded);
		});

	}
})(angular);