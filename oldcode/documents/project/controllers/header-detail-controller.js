(function (angular) {
	'use strict';

	angular.module('documents.project').controller('documentsProjectDocumentDetailController',
		[
			'$scope',
			'documentsProjectDocumentDataService',
			'documentProjectHeaderUIStandardService',
			'platformDetailControllerService',
			'basicsLookupdataLookupDescriptorService',
			'documentsProjectDocumentModuleContext',
			'documentProjectCommonConfigControllerService',
			'platformTranslateService',
			'documentProjectHeaderValidationService',
			'_',
			'basicsPermissionServiceFactory',
			function ($scope,
				documentsProjectDocumentDataService,
				UIStandardService,
				platformDetailControllerService,
				basicsLookupdataLookupDescriptorService,
				documentsProjectDocumentModuleContext,
				documentProjectCommonConfigControllerService,
				platformTranslateService,
				documentProjectHeaderValidationService,
				_,
				basicsPermissionServiceFactory
			) {

				var permissionDescriptor = '4eaa47c530984b87853c6f2e4e4fc67e';
				var documentProjectPermissionService = basicsPermissionServiceFactory.getService('documentProjectPermissionDescriptor');

				// load the DocumentType
				basicsLookupdataLookupDescriptorService.loadData(['DocumentType','DocumentStatus']);

				var config = documentsProjectDocumentModuleContext.getConfig();

				documentsProjectDocumentDataService.setIsContainerConnected(true);
				var documentDataService = documentsProjectDocumentDataService.getService(config);

				// get UI service
				// var formColumns = UIStandardService.getUIStandardService(config.moduleName);

				platformDetailControllerService.initDetailController($scope, documentDataService, documentProjectHeaderValidationService,UIStandardService, platformTranslateService);

				var tools = [];
				var createBtn = null;
				var deleteBtn = null;
				function initDetail($scope,dataService){
					if(tools.length === 0){
						tools = documentProjectCommonConfigControllerService.initialUploadController($scope,dataService);
					}
					if (tools.length > 0) {
						$scope.formContainerOptions.customButtons = _.filter(tools, function(tool){
							if(tool.id !=='upload'){return tool;}
						});
						var containerScope = $scope.$parent;

						while (containerScope && ! Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
							containerScope = containerScope.$parent;
						}
						if (containerScope && containerScope.tools) {
							containerScope.tools.update();
						}

					}
				}

				function showToolItems(enabled) {
					angular.forEach($scope.tools.items, function (item) {
						if (item.id === 'upload') {
							item.disabled = !enabled;
						}
						else if (item.id === 'previewedit') {
							item.disabled = !enabled;
						}
						else if (item.id === 'preview') {
							item.disabled = !enabled;
						}
					});
				}

				initDetail($scope,documentDataService);
				documentDataService.registerSelectionChanged(function () {
					initDetail($scope,documentDataService);
					if($scope.tools === null ||  $scope.tools === undefined){
						return;
					}
					if(createBtn === null){
						createBtn = _.filter($scope.tools.items, function (item) {
							return  item.id === 'create';
						});
					}

					if(deleteBtn === null){
						deleteBtn = _.filter($scope.tools.items, function (item) {
							return  item.id === 'delete';
						});
					}
					var entity = documentDataService.getSelected();
					if(entity && entity.PermissionObjectInfo){
						documentProjectPermissionService.setPermissionObjectInfo(entity.PermissionObjectInfo)
							.then(function (){
								documentProjectPermissionService.resetSystemContext();
								var hasWrite = documentProjectPermissionService.hasWrite(permissionDescriptor);
								var hasDelete = documentProjectPermissionService.hasDelete(permissionDescriptor);
								var hasCreate = documentProjectPermissionService.hasCreate(permissionDescriptor);
								if (!hasCreate){
									var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
										return item.id === 'create';
									});
									if(createBtnIdx !== -1){
										$scope.tools.items.splice(createBtnIdx, 1);
									}
								}
								if (!hasDelete) {

									var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
										return item.id === 'delete';
									});
									if(deleteBtnIdx !== -1){
										$scope.tools.items.splice(deleteBtnIdx, 1);
									}
								}
								if(entity === null || entity === undefined){
									showToolItems(false);
									return;
								}
								if(entity && (!hasWrite || !hasCreate)){
									showToolItems(false);
								}else{
									showToolItems($scope.isDisabled);
								}
							});
					}else{
						var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
							return item.id === 'delete';
						});
						if(deleteBtnIdx === -1 && deleteBtn !== null){
							$scope.tools.items.unshift(deleteBtn[0]);
						}
						var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
							return item.id === 'create';
						});
						if(createBtnIdx === -1 && createBtn !== null){
							$scope.tools.items.unshift(createBtn[0]);
						}
						if(entity === null || entity === undefined){
							showToolItems(false);
							return;
						}else{
							showToolItems( $scope.isDisabled);
						}
					}

				});
				$scope.isDisabled = function(){
					return documentDataService.isReadOnly && documentDataService.isReadOnly();

				};

				$scope.$on('$destroy', function () {
					documentsProjectDocumentDataService.setIsContainerConnected(false);
				});
			}]);
})(angular);
