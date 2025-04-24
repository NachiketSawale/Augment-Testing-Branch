/**
 * Created by jim on 2/14/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module('procurement.requisition').controller('requisitionValidateAndUpdateItemQuantityController',
		['$scope', '$http','$translate','platformModalService','procurementRequisitionHeaderDataService',
			function ($scope,$http,$translate,platformModalService,procurementRequisitionHeaderDataService) {

				$scope.setChecked=function(value){
					angular.forEach($scope.Options,function (item) {
						if(item.isChecked===true){
							item.isChecked = false;
						}
						if(item.value===value){
							item.isChecked = true;

						}
					});
				};

				$scope.validateAndUpdateItemQuantity=function()
				{
					var selectedItem=getSelectedPrcItem();
					if(procurementRequisitionHeaderDataService.getSelected()===null)
					{
						platformModalService.showMsgBox('Please select a leading record.', 'Info', 'ico-info');
						$scope.modalOptions.ok();
						return;
					}
					if(selectedItem!==null)
					{
						var httpCreationRequest = globals.webApiBaseUrl + 'procurement/requisition/requisition/ValidateAndUpdateItemQuantity';
						var data = {
							RequisitionId:procurementRequisitionHeaderDataService.getSelected().Id,
							ValidateAndUpdateScope:selectedItem.value
						};
						$http.post(httpCreationRequest, data).then(function(result){
							if((result !== null) &&(result.data !== null)) {
								if(result.data===0){
									platformModalService.showMsgBox($translate.instant('cloud.common.hasBeenUpdatedSuccessfully', { itemCount: 0 }), 'Info', 'ico-info');
								}else if(result.data===1){
									platformModalService.showMsgBox($translate.instant('cloud.common.hasBeenUpdatedSuccessfully', { itemCount: 1 }), 'Info', 'ico-info');
								}else if(result.data>1){
									platformModalService.showMsgBox($translate.instant('cloud.common.hasBeenUpdatedSuccessfully', { itemCount: result.data }), 'Info', 'ico-info');
								}
								$scope.modalOptions.ok();
							}
						},function(){
							platformModalService.showMsgBox('Some exception happened.', 'Info', 'ico-info');
						});
					}
				};

				function getSelectedPrcItem(){
					var result=null;
					for(var i=0; i<$scope.Options.length; i++)
					{
						if($scope.Options[i].isChecked===true)
						{
							result=$scope.Options[i];
							break;
						}
					}
					return result;
				}

				$scope.Options=[
					{value:'currentLeadingRecord',text:$translate.instant('cloud.common.forCurrentLeadingRecord'),isChecked:true},
					{value:'currentPackage',text:$translate.instant('cloud.common.forCurrentPackage'),isChecked:false},
					{value:'currentProject',text:$translate.instant('cloud.common.forCurrentProject'),isChecked:false}
				];

				$scope.modalOptions = angular.extend($scope.modalOptions, {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('procurement.common.wizard.validateAndUpdateItemQuantity')
				});
			}
		]);
})(angular);
