(function (angular) {
	/* globals _ */
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('constructionsystemMainColumnConfigController',[
		'$scope','platformCreateUuid','$translate','estimateMainDialogProcessService',
		'constructionsystemMainColumnConfigDetailDataService','$injector','$timeout',
		'$q','$modalInstance','constructionsystemMainColumnConfigUIStandardService',
		'estimateMainEstConfigDataService', 'constructionsystemMainDialogUIConfigService',
		'constructionsystemMainColumnConfigDataService',// TODO:REmove estimateMainDialogUIConfigService when fix found
		function ($scope,platformCreateUuid,$translate,estimateMainDialogProcessor,
			constructionsystemMainColumnConfigDetailDataService,$injector,$timeout,
			$q,$modalInstance,constructionsystemMainColumnConfigUIStandardService,
			estimateMainEstConfigDataService,constructionsystemMainDialogUIConfigService,
			constructionsystemMainColumnConfigDataService) {

			var uniqueId = platformCreateUuid();
			var editType = '';

			$scope.getContainerUUID = function () {
				return uniqueId;
			};

			// eslint-disable-next-line no-unused-vars
			function getHeaderTextKey(){
				// eslint-disable-next-line no-unused-vars
				var dialogConfig = estimateMainDialogProcessor.getDialogConfig();

				return 'basics.customize.columnconfigtype';
			}

			function updateItem(item){
				angular.extend($scope.currentItem , item);
				processItem();
			}

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('constructionsystem.main.column.title'),

				ok : function (result) {
					var dialogConfig = estimateMainDialogProcessor.getDialogConfig();

					var isValid = true;
					var updateData = $scope.currentItem;

					isValid = constructionsystemMainColumnConfigDataService.provideUpdateData(updateData);

					if(!isValid){
						return;
					}

					updateData.IsForCustomization = (!(dialogConfig.editType === 'estimate' || dialogConfig.editType === 'assemblies'));

					if (updateData.IsForCustomization === false){

						if (dialogConfig.editType === 'estimate'){
							// Set estimate LineItem Layout
							var isColumnConfigActive = updateData.EstConfig.IsColumnConfig;
							var estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
							if (isColumnConfigActive){
								var cols = $injector.get('estimateMainDynamicColumnService').generateDynamicColumns(updateData.EstColumnConfigComplete.estColumnConfigDetailsToSave);
								estMainStandardDynamicService.attachData({'estConfig': cols});
							}else{
								estMainStandardDynamicService.detachData('estConfig');
							}

							var setLayoutFn = function setLayoutFn(){
								// Show loading indicator
								estMainStandardDynamicService.showLoadingOverlay();

								var defer = $q.defer();
								$timeout(function(){
									estMainStandardDynamicService.fireRefreshConfigLayout();
									estMainStandardDynamicService.hideLoadingOverlay();
									defer.resolve(true);
								}, 400); // backdrop overlay has animation of 300, so we wait 300 and more
								return defer.promise;
							};

							setLayoutFn();
						}
					}

					$modalInstance.close(result);

					/* estDialogDataService.update(updateData).then(function(completeData){
						clear();
						if(dialogConfig.editType==='estimate') {
							//when dialog opened from estimate then 'reloadColumnConfigAndData' called
							var columnconfigfk = completeData.EstConfig ? completeData.EstConfig.Id : null;
							$injector.get('estimateMainService').setSelectedEstHeaderColumnConfigFk(columnconfigfk);
							$injector.get('estimateMainDynamicColumnService').reloadDynamicColumnAndData(completeData.EstConfig.IsColumnConfig);

							estDialogDataService.onDataLoaded.fire(completeData);
							/!*
								defect 76675, synchronize the label name of dynamic columns between Estimate Configuration
								Dialog and Grid Layout Dialog in Line Items Container
							 *!/
							if(completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estColumnConfigDetailsToSave){
								constructionsystemMainColumnConfigDetailDataService.setColumnConfigDetailsToViewConfig('681223e37d524ce0b9bfa2294e18d650', completeData.EstColumnConfigComplete.estColumnConfigDetailsToSave);
							}

						}
						else if(dialogConfig.editType === 'assemblies'){
							var colconfigfk = completeData.EstConfig ? completeData.EstConfig.Id : null;
							$injector.get('estimateMainService').setSelectedEstHeaderColumnConfigFk(colconfigfk);
						}
						// refresh Data Records in customizing module
						else {
							var customizeDataService = $injector.get('basicsCustomizeInstanceDataService');
							if (customizeDataService){
								customizeDataService.load();
							}
						}
					}); */


					constructionsystemMainColumnConfigDetailDataService.setSelected(null);

				},

				close : function () {
					clear();

					constructionsystemMainColumnConfigDetailDataService.setSelected(null);

					$modalInstance.dismiss('cancel');
				}
			};

			$scope.formContainerOptions = {
				formOptions: {
					// configure: constructionsystemMainColumnConfigUIStandardService.getFormConfig(),
					configure: constructionsystemMainDialogUIConfigService.getFormConfig(),
					validationMethod: function(){return true;}// todo:temp
				}
			};

			$scope.change = function change(item, model) {
				if(model === 'estConfigTypeFk') {
					estimateMainEstConfigDataService.loadComplete(item.estConfigTypeFk).then(function (data) {

						constructionsystemMainColumnConfigDataService.setData(data);


						// To do:change the datasource of combox droplist by contextId
						if (editType !== 'estimate') {
							var estColumnConfigTypeService = $injector.get('estimateMainColumnConfigTypeService');
							estColumnConfigTypeService.loadData().then(function (){
								// var colConfigTypeData = estColumnConfigTypeService.getList();
								estColumnConfigTypeService.getList().then(function(data){
									var colConfigTypeData = data;
									var columnCofigTypeRow =  _.find($scope.formContainerOptions.formOptions.configure.rows, {rid: 'estColConfigType'});
									columnCofigTypeRow.options.items = colConfigTypeData;
								});
							});

							var estTotalsConfigTypeService = $injector.get('estimateMainTotalsConfigTypeService');
							estTotalsConfigTypeService.loadData().then(function () {
								// var toConfigTypeData = estTotalsConfigTypeService.getList();
								estTotalsConfigTypeService.getList().then(function(data){
									var toConfigTypeData = data;
									var totalsConfigTypeRow = _.find($scope.formContainerOptions.formOptions.configure.rows, {rid: 'estTolConfigType'});
									totalsConfigTypeRow.options.items = toConfigTypeData;
								});
							});
						}
					});
				}
				else if(model === 'estColConfigTypeFk'){
					constructionsystemMainColumnConfigDetailDataService.clear();
					constructionsystemMainColumnConfigDataService.load(item.estColConfigTypeFk);
				}
				else if(model === 'isEditEstType'){
					if(item.isEditEstType){
						item.estConfigTypeFk = 0;
						// set the IsUpdEstConfig = false for create a new EstConfig
						estimateMainEstConfigDataService.setIsUpdEstConfig(false);
						processItem();
					}
				}
				else if(model === 'isEditColConfigType'){
					constructionsystemMainColumnConfigDataService.isEditColConfigTypeChanged(item);
					if(item.isEditColConfigType){
						constructionsystemMainColumnConfigDataService.setIsUpdColumnConfig(false);
						item.estColConfigTypeFk = 0;
						processItem();
					}
				}

			};

			function processItem(){
				estimateMainDialogProcessor.processItem($scope.currentItem, $scope.formContainerOptions.formOptions.configure.rows);
			}

			$scope.currentItem = {};

			// clear all
			function clear(){
				// clear detail
				constructionsystemMainColumnConfigDataService.clear();

				$scope.currentItem = {};
			}

			// eslint-disable-next-line no-unused-vars
			function updateData(item){
				constructionsystemMainColumnConfigDataService.setData(item);
			}
			function changeUpdateStatus(isValid){
				$scope.okBtnDisabled = !isValid;
			}

			constructionsystemMainColumnConfigDetailDataService.selectionChanged.register(updateItem);
			constructionsystemMainColumnConfigDetailDataService.onColumnConfigStatusChange.register(changeUpdateStatus);

			$scope.$on('$destroy', function () {

				constructionsystemMainColumnConfigDetailDataService.selectionChanged.unregister(updateItem);



				constructionsystemMainColumnConfigDetailDataService.onColumnConfigStatusChange.unregister(changeUpdateStatus);

				estimateMainDialogProcessor.clearConfig();
				$scope.currentItem = {};
			});
		}]);
})(angular);
