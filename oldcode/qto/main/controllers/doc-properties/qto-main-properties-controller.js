
(function() {
	/* global _ */
	'use strict';

	angular.module ('qto.main').controller ('qtoMainPropertiesController',
		['$scope','$translate','qtoMainPropertiesDialogService','$injector','QtoType',
			function ($scope, $translate,qtoMainPropertiesDialogService,$injector,qtoType) {
				$scope.dataItem = $scope.options.dataItem;
				$scope.modalOptions = {
					closeButtonText: $translate.instant ('cloud.common.cancel'),
					actionButtonText: $translate.instant ('cloud.common.ok'),
					headerText: $translate.instant ('cloud.common.documentProperties')
				};

				$scope.onOK = function () {
					$scope.$close({ok: true, data: $scope.dataItem});
				};

				$scope.onCancel = function () {
					$scope.$close({});
				};
				
				$scope.change = function(model){
					if(model ==='Import'){
						$injector.get('qtoAddressRangeImportDetailDataService').setListReadOnly.fire(!$scope.dataItem.QtoAddressRangeImportDto.IsActive);
					}else{
						$injector.get('qtoAddressRangeDialogDetailDataService').setListReadOnly.fire(!$scope.dataItem.QtoAddressRangeDialogDto.IsActive);
					}
				};
				

				$scope.isONormQto  = function isONormQto(){
					let selectedQtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					return selectedQtoHeader.QtoTypeFk === qtoType.OnormQTO || qtoMainPropertiesDialogService.isDisable;
				};

				$scope.modalOptions.cancel = function () {
					$scope.$close(false);
				};

				$scope.commentFromChange = function (value){
					if(value ==='CommentSystemLevel'){
						$scope.dataItem.QtoConfigDto.CommentRubricLevel = false;
					}else if(value ==='CommentRubricLevel'){
						$scope.dataItem.QtoConfigDto.CommentSystemLevel = false;
					}
					qtoMainPropertiesDialogService.validationOkBtn.fire();
				};

				$scope.toggleOpen = function (n) {
					if(n === 'addressRanges'){
						$scope.showAddressRanageGroup = !$scope.showAddressRanageGroup;
					}else if(n==='qtoConfig'){
						$scope.showQtoConfigGroup = !$scope.showQtoConfigGroup;
					}
				};
				$scope.showAddressRanageGroup = true;
				$scope.showQtoConfigGroup = true;
				
				function validationOkBtn(){
					let disFromQtoComment = !($scope.dataItem.QtoConfigDto.CommentRubricLevel || $scope.dataItem.QtoConfigDto.CommentSystemLevel || $scope.dataItem.QtoConfigDto.CommentPrjLevel);
					let dialogDetailService = $injector.get('qtoAddressRangeDialogDetailDataService');
					let importDetailService = $injector.get('qtoAddressRangeImportDetailDataService');
					
					let  dialogDetails = dialogDetailService.getList();
					dialogDetails = dialogDetails.concat(importDetailService.getList());
					let hasErrorInfo= false;
					_.forEach(dialogDetails,function(d){
						if(d.__rt$data && d.__rt$data.errors){
							_.forEach(d.__rt$data.errors, function(error){
								if(error && !_.isEmpty(error)){
									hasErrorInfo = true;
								}
							});
						}
						if(!d.SheetArea && !d.LineArea && !d.IndexArea){
							hasErrorInfo = true;
						}
					});
					
					$scope.disableOk = hasErrorInfo || disFromQtoComment;
				}
				
				qtoMainPropertiesDialogService.validationOkBtn.register(validationOkBtn);
				$scope.$on ('$destroy', function () {
					qtoMainPropertiesDialogService.validationOkBtn.unregister(validationOkBtn);
				});
			}]
	);
})(angular);


