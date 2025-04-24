(function () {
	'use strict';
	/* global _ */
	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);

	angModule.controller('ppsCommonCombineDocumentListController', PpsDocumentListController);

	PpsDocumentListController.$inject = [
		'$scope',
		'$injector',
		'platformGridAPI',
		'platformToolbarService',
		'platformGridControllerService',
		'platformRuntimeDataService',
		'ppsCommonDocumentCombineDataServiceFactory',
		'productionplanningCommonDocumentValidationService',
		'basicsCommonUploadDownloadControllerService',
		'basicsCommonPreviewDocumentExtensionService'];
	function PpsDocumentListController($scope,
	                                   $injector,
	                                   platformGridAPI,
	                                   platformToolbarService,
	                                   gridControllerService,
	                                   platformRuntimeDataService,
	                                   dataServiceFactory,
	                                   validationService,
	                                   basicsCommonUploadDownloadControllerService,
	                                   previewDocumentExtensionService) {

		function getToolItems() {
			var containerUUID = $scope.getContainerUUID();
			var removeItems = ['create', 't14', 'delete', 'upload', 'multipleupload', 'cancelUpload', 'previewedit'];
			if ($scope.getContentValue('hideDownload')) {
				removeItems.push('download');
			}
			return _.filter(platformToolbarService.getTools(containerUUID), function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});
		}

		function initToolItems() {
			$scope.tools.items = getToolItems();
			// don't remove it, beacuse of the framework problem, I need this to make tool items not show again
			$scope.setTools = function () {
			};
		}

		var gridConfig = {
			initCalled: false,
			columns: []
		};

		var currentModuleName = $scope.getContentValue('currentModule');
		var isReadonly = $scope.getContentValue('isReadonly');

		var serviceOptions = {
			containerId: currentModuleName
		};

		var dataService = dataServiceFactory.getService(serviceOptions);
		var uiSerivce = isReadonly ? $injector.get('productionplanningCommonDocumentUIReadonlyService') : $injector.get('productionplanningCommonDocumentCombineUIStandardService');
		validationService = validationService.getValidationService(dataService, currentModuleName);
		gridControllerService.initListController($scope, uiSerivce, dataService, validationService, gridConfig);
		basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
		if (isReadonly) {
			initToolItems();
		}
		$scope.FileInfoArray=[];
		function fileHasBeenUploaded(e, args){
			if(dataService.isDragOrSelect === 'drag'){
				var fileInfoData=args.data;
				if(!!fileInfoData.FileArchiveDocId&&!!fileInfoData.fileName&&!!fileInfoData.file){
					$scope.FileInfoArray.push(fileInfoData);
				}
			}
		}
		dataService.fileHasBeenUploadedBeforeCreatingDocument.register(fileHasBeenUploaded);
		// registerUploadFinished
		function onUploadFinished() {
			if(dataService.isDragOrSelect === 'drag'){
				if($scope.FileInfoArray.length > 0){
					var arrayBackup = _.clone($scope.FileInfoArray);
					dataService.multiCreateByUploadedFiles(arrayBackup);
					$scope.FileInfoArray=[];
				}
				dataService.isDragOrSelect = null;
			}
		}
		var uploadService = dataService.getUploadService();
		uploadService.registerUploadFinished(onUploadFinished);

		var onUpdateTools = function () {
			if ($scope.updateTools) {
				$scope.updateTools();
			}
		};
		dataService.onUpdateToolsEvent.register(onUpdateTools);

		function onCellChange(e, args) {
			const field = args.grid.getColumns()[args.cell].field;
			if (field === 'Origin') { // field Origin is editable means a precondition: args.item.Version <== 0
				if (args.item.Origin === 'DRW') {
					args.item.ProductDescriptionFk = null;
					args.item.EngDrawingFk = dataService.curParent.getSelected().EngDrawingDefFk; // use drawing of parent item as default
					platformRuntimeDataService.readonly(args.item, [{field: 'ProductDescriptionFk', readonly: true}, {field: 'EngDrawingFk', readonly: !_.isNil(args.item.EngDrawingFk)}]);
				} else if (args.item.Origin === 'PRODUCTTEMPLATE') {
					args.item.EngDrawingFk = null;
					args.item.ProductDescriptionFk = dataService.curParent.getSelected().ProductDescriptionFk; // use productDescription of parent item as default
					platformRuntimeDataService.readonly(args.item, [{field: 'ProductDescriptionFk', readonly: false}, {field: 'EngDrawingFk', readonly: true}]);
				}
				validationService.validateEngDrawingFk(args.item, args.item.EngDrawingFk, 'EngDrawingFk');
				validationService.validateProductDescriptionFk(args.item, args.item.ProductDescriptionFk, 'ProductDescriptionFk');
				dataService.gridRefresh();
			}
		}
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		previewDocumentExtensionService.registerGridClick($scope, dataService);

		$scope.$on('$destroy', function () {
			uploadService.unregisterUploadFinished(onUploadFinished);
			dataService.fileHasBeenUploadedBeforeCreatingDocument.unregister(fileHasBeenUploaded);
			dataService.onUpdateToolsEvent.unregister(onUpdateTools);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			previewDocumentExtensionService.unregisterGridClick($scope, dataService);
		});
	}
})();