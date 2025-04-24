/**
 * Created by lid on 7/14/2017.
 */
(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('productionplanningCommonEventListController', ProductionplanningCommonEventListController);

	ProductionplanningCommonEventListController.$inject = ['$scope', '$injector', 'platformGridControllerService', 'productionplanningCommonEventMainServiceFactory',
		'productionplanningCommonEventUIStandardServiceFactory', 'productionplanningCommonEventValidationService', 'platformGridAPI',
		'ppsCommonCustomColumnsServiceFactory', 'platformDateshiftHelperService',
		'ppsCommonLoggingHelper', 'basicsCommonToolbarExtensionService', 'productionplanningCommonActivityDateshiftService',
	'ppsUIUtilService'];

	function ProductionplanningCommonEventListController(
		$scope, $injector, gridControllerService, dataServiceFactory,
		uiStandardServiceFactory, validationService, platformGridAPI,
		customColumnsServiceFactory, platformDateshiftHelperService,
		ppsCommonLoggingHelper, basicsCommonToolbarExtensionService, activityDateshiftService,
		ppsUIUtilService) {
		var gridConfig = {initCalled: false, columns: []};

		// get environment variable from the module-container.json file
		var currentModuleName = $scope.getContentValue('currentModule');
		var parentServiceName = $scope.getContentValue('parentService');
		var parentFilterProperty = $scope.getContentValue('parentFilterProperty');
		var foreignKey = $scope.getContentValue('foreignKey');
		var parentService = $injector.get(parentServiceName);
		var parentServiceFactoryName = $scope.getContentValue('parentServiceFactory');
		if (parentServiceFactoryName !== undefined) {
			var parentCurrentModuleName = $scope.getContentValue('parentCurrentModule');
			var parentForeignKey = $scope.getContentValue('parentForeignKey');
			var parentServiceFactory = $injector.get(parentServiceFactoryName);
			if (!parentForeignKey) {
				parentService = parentServiceFactory.getService(parentCurrentModuleName, parentService);
			} else {
				parentService = parentServiceFactory.getService(parentForeignKey, parentCurrentModuleName, parentService);
			}
		}
		var customColumnsMdoule = $scope.getContentValue('customColumnsMdoule');

		var dateshiftConfig = {
			dateshiftId: 'productionplanning.common'
		};

		var dataService = dataServiceFactory.getService(foreignKey, currentModuleName, parentService, parentFilterProperty);
		validationService = validationService.getValidationService(dataService, currentModuleName, dateshiftConfig);

		// extend validation for logging
		var schemaOption = {
			typeName: 'EventDto',
			moduleSubModule: 'ProductionPlanning.Common'
		};
		var uiStandardService = uiStandardServiceFactory.getService(foreignKey); // for logging, UI service must created before calling extendValidationIfNeeded
		if(foreignKey === 'ProductFk' || foreignKey === 'ItemFk') {
			ppsUIUtilService.extendUIService(uiStandardService, {addColumns: [{id: 'SequenceOrder',
					field: 'SequenceOrder',
					name: '*SequenceOrder',
					name$tr$: 'productionplanning.common.event.SequenceOrder',
					sortable: true,
					readonly: true}]});
		}
		ppsCommonLoggingHelper.extendValidationIfNeeded(dataService, validationService, schemaOption);
		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		// button for create log
		ppsCommonLoggingHelper.addManualLoggingBtn($scope, 16, uiStandardService,
			dataService, schemaOption, $injector.get('productionplanningCommonTranslationService'));

		// dateshift registration
		let initDateshiftConfig = { tools : [ { id: 'fullshift', value: true } ], configId: 'productionplanning.common' };
		activityDateshiftService.initializeDateShiftController(moduleName, dataService, $scope, initDateshiftConfig);

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		function onCellChange(e, args) {
			if (!_.isNil(customColumnsMdoule) && !_.isNil(parentService)) {
				var col = args.grid.getColumns()[args.cell].field;
				var customColumnsService = customColumnsServiceFactory.getService(customColumnsMdoule);
				if (!_.isNil(customColumnsService)) {
					customColumnsService.syncValuesToEntity(parentService, args.item, col);
				}
			}
		}

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})();
