
(function () {
	'use strict';
	var moduleName = 'productionplanning.processconfiguration';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningProcessConfigurationPhaseDetailDialogController', ProductionplanningProcessConfigurationPhaseDetailDialogController);

	ProductionplanningProcessConfigurationPhaseDetailDialogController.$inject = [
		'$scope',
		'$injector',
		'platformToolbarService',
		'platformGridControllerService',
		'productionplanningCommonDocumentDataServiceFactory',
		'productionplanningCommonDocumentValidationService',
		'basicsCommonUploadDownloadControllerService',
		'platformGridAPI'];
	function ProductionplanningProcessConfigurationPhaseDetailDialogController($scope,
									   $injector,
									   platformToolbarService,
									   gridControllerService,
									   dataServiceFactory,
									   validationService,
									   basicsCommonUploadDownloadControllerService,
										platformGridAPI) {
		function getToolItems() {
			var containerUUID = $scope.getContainerUUID();
			var removeItems = ['create', 't14', 'delete', 'upload', 'multipleupload', 'cancelUpload', 'previewedit', 't12', 'gridSearchAll', 'gridSearchColumn'];
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

		// #region init hardcoded info

		$scope.gridId = 'dc5cf4c591c44e43b807bd2afb7bc789';
		$scope.setTools = (tools) => {
			$scope.tools = tools || [];
			if ($scope.tools.items && $scope.tools.items.length > 0) {
				let itemsToDelete = ['create', 'delete', 't12', 'gridSearchAll', 'gridSearchColumn', 't14', 'upload', 'multipleupload', 'cancelUpload', 'previewedit'];
				$scope.tools.items = $scope.tools.items.filter(item => !itemsToDelete.includes(item.id));
				let gridSettingsItems = $scope.tools.items.filter(item => item.id === 't200')[0].list.items;
				gridSettingsItems = gridSettingsItems.filter(subItem => subItem.id !== 't155');

				// grid layout will be shown and can be edited but will not be saved, yet...
				delete gridSettingsItems.find(subItem => subItem.id === 't111').permission;

			}
			$scope.tools.update = () => {
				return true;
			};
		};
		$scope.getContentValue = function (propName) { return $scope[propName];};
		$scope.removeToolByClass = (itemsToRemove) => {
			return true;
		};
		Object.assign($scope, {id: 'productionplanning.common.ppsdocument.drawingDocumentListForItem',
			template: 'app/components/base/grid-partial.html',
			title: 'productionplanning.item.document.drawingDocumentListTitle',
			controller: 'productionplanningCommonDocumentListController',
			currentModule: 'productionplanning.productionplace',
			parentService: 'productionplanningProcessConfigurationPhaseDetailDialogDocumentsDataService',
			idProperty: 'ProductDescriptionFk',
			foreignKey: 'ProductDescriptionFk',
			uuid: 'bbe50daeeab64b9fa20d33550fc01101',
			permission: '5640a72648e24f21bf3985624c4d0fdf',
			hideDownload: false});

		// #endregion done

		// get environment variable from the module-container.json file
		var currentModuleName = $scope.getContentValue('currentModule');
		var parentService = $scope.getContentValue('parentService');
		var foreignKey = $scope.getContentValue('foreignKey');
		var isReadonly = $scope.getContentValue('isReadonly');
		var idProperty = $scope.getContentValue('idProperty');
		var endRead = $scope.getContentValue('endRead');
		var selectedItemId = $scope.getContentValue('selectedItemId');
		var instantPreview = $scope.getContentValue('instantPreview');

		// For dynamic dataservice e.g. Activity, Report
		var parentGUID = $scope.getContentValue('parentGUID');
		var containerInfo = $scope.getContentValue('containerInfo');
		var getParentServiceParams = $scope.getContentValue('getParentServiceParams');
		if (!angular.isDefined(parentService) && !!containerInfo) {
			var containerInfoService = $injector.get(containerInfo);
			if (parentGUID) {
				parentService = containerInfoService.getContainerInfoByGuid(parentGUID).dataServiceName;
			} else if (getParentServiceParams) {
				parentService = containerInfoService.getParentServiceByParams(getParentServiceParams);
			}
		}
		if(!parentService){
			var parentServiceFactory = $scope.getContentValue('parentServiceFactory');
			if (parentServiceFactory && parentServiceFactory.factoryName &&
				parentServiceFactory.options && parentServiceFactory.serviceGetter) {
				var srvGetter = $injector.get(parentServiceFactory.factoryName)[parentServiceFactory.serviceGetter];
				parentService = srvGetter.call(this, parentServiceFactory.options);
			}
		}

		var serviceOptions = {
			containerId: currentModuleName,
			parentService: parentService,
			foreignKey: foreignKey,
			isReadonly: isReadonly,
			idProperty: idProperty,
			endRead: endRead,
			selectedItemId:selectedItemId,
			useLocalResource:$scope.getContentValue('useLocalResource')
		};

		var dataService = dataServiceFactory.getService(serviceOptions);
		var uiSerivce = isReadonly ? $injector.get('productionplanningCommonDocumentUIReadonlyService') : $injector.get('productionplanningCommonDocumentUIStandardService');
		validationService = validationService.EditValidation(dataService);
		dataService.deselect(); // otherwise the documents of previous demand will be show if any document was selected
		if (platformGridAPI.grids.exist($scope.gridId)) {
			platformGridAPI.grids.unregister($scope.gridId);
		}
		gridControllerService.initListController($scope, uiSerivce, dataService, validationService, gridConfig);
		basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
		if (isReadonly) {
			initToolItems();
		}





		// register fileHasBeenUploaded

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
			// remark: when user drag and drop a file to upload&create,
			// dataService.isDragOrSelect is set with value 'drag' on method onFileSelected() of upload-download-controller-service.

		}
		var uploadService = dataService.getUploadService();
		uploadService.registerUploadFinished(onUploadFinished);

		var onUpdateTools = function () {
			if ($scope.updateTools) {
				$scope.updateTools();
			}
		};
		dataService.onUpdateToolsEvent.register(onUpdateTools);

		var instantPreviewFunction = function() {
			if (!_.isEmpty(dataService.getList())) {
				const firstDocument = dataService.getList()[0];
				dataService.previewDocument($scope, false, firstDocument, true);
			}
		};

		if (instantPreview) {
			dataService.registerListLoaded(instantPreviewFunction);
		}

		$scope.$on('$destroy', function () {
			uploadService.unregisterUploadFinished(onUploadFinished);
			dataService.fileHasBeenUploadedBeforeCreatingDocument.unregister(fileHasBeenUploaded);
			dataService.onUpdateToolsEvent.unregister(onUpdateTools);
			if (instantPreview) {
				dataService.unregisterListLoaded(instantPreviewFunction);
			}
		});
	}
})();