/**
 * Created by anl on 1/4/2018.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningCommonDocumentListController', PpsDocumentListController);

	PpsDocumentListController.$inject = [
		'$scope',
		'$injector',
		'platformToolbarService',
		'platformGridControllerService',
		'productionplanningCommonDocumentDataServiceFactory',
		'productionplanningCommonDocumentValidationService',
		'basicsCommonUploadDownloadControllerService',
		'basicsCommonToolbarExtensionService',
		'basicsCommonPreviewDocumentExtensionService'];
	function PpsDocumentListController($scope,
									   $injector,
									   platformToolbarService,
									   gridControllerService,
									   dataServiceFactory,
									   validationService,
									   basicsCommonUploadDownloadControllerService,
									   basicsCommonToolbarExtensionService,
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

		// get environment variable from the module-container.json file
		var currentModuleName = $scope.getContentValue('currentModule');
		var parentService = $scope.getContentValue('parentService');
		var foreignKey = $scope.getContentValue('foreignKey');
		var isReadonly = $scope.getContentValue('isReadonly');
		var idProperty = $scope.getContentValue('idProperty');
		var endRead = $scope.getContentValue('endRead');
		var selectedItemId = $scope.getContentValue('selectedItemId');
		var instantPreview = $scope.getContentValue('instantPreview');

		//For dynamic dataservice e.g. Activity, Report
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
				dataService.previewDocument($scope, false, firstDocument, instantPreview);
			}
		};

		if (instantPreview) {
			dataService.registerListLoaded(instantPreviewFunction);
		}

		previewDocumentExtensionService.registerGridClick($scope, dataService);

		$scope.$on('$destroy', function () {
			uploadService.unregisterUploadFinished(onUploadFinished);
			dataService.fileHasBeenUploadedBeforeCreatingDocument.unregister(fileHasBeenUploaded);
			dataService.onUpdateToolsEvent.unregister(onUpdateTools);
			if (instantPreview) {
				dataService.unregisterListLoaded(instantPreviewFunction);
			}
			previewDocumentExtensionService.unregisterGridClick($scope, dataService);
		});
	}
})();