/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(){
	'use strict';

	angular.module('estimate.main').directive('estimateMainCreateBidBoqUnitAssign', ['_', function (_){
		return {
			restrict: 'A',
			// templateUrl: globals.appBaseUrl + 'estimate.main/templates/config-dialog/estimate-main-est-upp2-costcode-detail.html',
			template:
                '<div><input type="checkbox" ng-model="entity.CopyLineItemRete" ng-click="updateSelection(0)" checked="checked" class="ng-pristine ng-valid ng-empty ng-touched" style="margin:4px 11px 0 0" />{{::"estimate.main.bidCreationWizard.lineItemRate" | translate}}</div>' +
                '<div ng-repeat="priceColumn in entity.PriceColumns">' +
                '   <div style="margin-top:6px">' +
                '       <input type="checkbox" ng-model="priceColumn.checked" ng-click="updateSelection($index+1)" class="ng-pristine ng-valid ng-empty ng-touched" style="margin:4px 11px 0 0" />' +
                '       {{priceColumn.Description}}' +
                '   </div>' +
                '</div>',
			controller: ['$scope', '$injector', function ($scope, $injector) {
				$scope.entity = $scope.entity || {};

				let dynamicColumns = $injector.get('basicsCommonUserDefinedColumnConfigService').getDynamicColumnConfig();

				$scope.entity.PriceColumns = $scope.entity.PriceColumns || [];
				_.forEach(dynamicColumns, function (item){
					if(_.find($scope.entity.PriceColumns, {Id:item.Id})){
						return;
					}
					$scope.entity.PriceColumns.push({
						Id: item.Id,
						Description: item.DescriptionInfo.Translated || item.DescriptionInfo.Description,
						checked: false
					});
				});

				$scope.updateSelection = function(position) {
					if(position === 0){
						$scope.entity.CopyLineItemRete = !$scope.entity.CopyLineItemRete;
						if($scope.$parent.$parent.UpdateOptions){
							$scope.$parent.$parent.UpdateOptions.CopyLineItemRete = $scope.entity.CopyLineItemRete;
						}
					}else {
						angular.forEach($scope.entity.PriceColumns, function (priceColumn, index) {
							if (position - 1 === index) {
								priceColumn.checked = !priceColumn.checked;
								if($scope.$parent.$parent.UpdateOptions && $scope.$parent.$parent.UpdateOptions.PriceColumns){
									let data = _.find($scope.$parent.$parent.UpdateOptions.PriceColumns,{Description:priceColumn.Description});
									if(data){
										data.checked = priceColumn.checked;
									}
								}
							}
						});
					}
				};

				$scope.$on('$destroy', function () {
				});

			}]
		};
	}]);

})();