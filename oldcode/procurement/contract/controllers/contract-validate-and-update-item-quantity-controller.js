/**
 * Created by jim on 2/14/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.contract').controller('contractValidateAndUpdateItemQuantityController',
		['$scope', '$http','$translate','platformModalService','procurementContractHeaderDataService',
			function ($scope,$http,$translate,platformModalService,procurementContractHeaderDataService) {

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
					if(procurementContractHeaderDataService.getSelected()===null)
					{
						platformModalService.showMsgBox('Please select a leading record.', 'Info', 'ico-info');
						$scope.modalOptions.ok();
						return;
					}
					if(selectedItem !== null)
					{
						var httpCreationRequest = globals.webApiBaseUrl + 'procurement/contract/header/ValidateAndUpdateItemQuantity';
						var data = {
							ContractId:procurementContractHeaderDataService.getSelected().Id,
							ValidateAndUpdateScope:selectedItem.value
						};
						$http.post(httpCreationRequest, data).then(function(result){
							if((result !== null) &&(result.data !== null)) {
								if(result.data===0){
									platformModalService.showMsgBox('Quantity of 0 item has been updated successfully', 'Info', 'ico-info');
								}else if(result.data===1){
									platformModalService.showMsgBox('Quantity of 1 item has been updated successfully.', 'Info', 'ico-info');
								}else if(result.data>1){
									platformModalService.showMsgBox('Quantity of '+result.data+' items have been updated successfully.', 'Info', 'ico-info');
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
					{value:'currentLeadingRecord',text:$translate.instant('procurement.common.wizard.forCurrentLeadingRecord'),isChecked:true},
					{value:'currentPackage',text:$translate.instant('procurement.common.wizard.forCurrentPackage'),isChecked:false},
					{value:'currentProject',text:$translate.instant('procurement.common.wizard.forCurrentProject'),isChecked:false}
				];

				$scope.modalOptions = angular.extend($scope.modalOptions, {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('procurement.common.wizard.validateAndUpdateItemQuantity')
				});
			}
		]);
})(angular);
