(function () {

	/* global _ */
	'use strict';
	const moduleName = 'productionplanning.ppsmaterial';
	const angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('productionplanningPpsmaterialRecordListController', ListController);

	ListController.$inject = ['$scope',
		'$injector',
		'platformGridControllerService',
		'platformGridAPI',
		'platformTranslateService',
		'productionplanningPpsMaterialUIStandardService',
		'productionplanningPpsMaterialRecordMainService',
		'productionplanningPpsMaterialValidationService',
		'productionplanningPpsMaterialEntityPropertychangedExtension'];
	function ListController($scope,
		$injector,
		gridControllerService,
		platformGridAPI,
		platformTranslateService,
		uiStandardServ,
		dataService,
		validationService,
		ppsMaterialExtension) {
		platformTranslateService.translateGridConfig(uiStandardServ.getStandardConfigForListView().columns);

		const gridContainerGuid = $scope.getContentValue('uuid');
		const characteristic2SectionId = 60;

		const gridConfig = {
			columns: [],
		};
		// set the all column readonly
		/* angular.forEach(uiStandardServ.getStandardConfigForListView().columns,function(entity){
			 //angular.forEach(uiStandardService.getStandardConfigForListView().columns,function(entity){
			 entity.editor = null;
			 entity.readonly = true;

		 }); */
		gridControllerService.initListController($scope, uiStandardServ, dataService, validationService, gridConfig);

		const onCellChange = function (e, args) {
			const field = args.grid.getColumns()[args.cell].field;
			if(_.startsWith(field, 'PpsMaterial.') || field === 'IsProduct'){
				ppsMaterialExtension.onPpsMaterialPropertyChanged(args.item, field);
			}
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		const setCellEditable = function (e, args) {
			// only set columns of PpsMaterial or characteristic editable
			return _.startsWith(args.column.field, 'PpsMaterial.') || _.startsWith(args.column.field, 'charactercolumn') || args.column.field ==='IsProduct';
		};
		platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

		// extend characteristic2
		const characteristic2Config = {
			sectionId: characteristic2SectionId,
			gridContainerId: gridContainerGuid,
			gridConfig: gridConfig,
			dataService: dataService,
			containerInfoService: 'productionplanningPpsmaterialContainerInformationService',
			additionalCellChangeCallBackFn: null,
		};
		const characteristic2ColumnEventsHelper = $injector.get('PpsCommonCharacteristic2ColumnEventsHelper');
		characteristic2ColumnEventsHelper.register(characteristic2Config);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			characteristic2ColumnEventsHelper.unregister(characteristic2Config.gridContainerId, characteristic2Config.sectionId);
		});
	}
})();
