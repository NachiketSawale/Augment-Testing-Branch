(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,$ */
	var moduleName = 'procurement.ticketsystem';
	angular.module(moduleName).directive('procurementTicketSystemCartQuantityInput',
		['basicsLookupdataPopupService', 'platformLanguageService', 'accounting', function (basicsLookupdataPopupService, platformLanguageService, accounting) {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {
					ngModel: '=',
					uom: '='
				},
				templateUrl: globals.appBaseUrl + 'procurement.ticketsystem/templates/cart-quantity-input.html',
				link: function ($scope, elem, attrs, ctrl) {
					// eslint-disable-next-line no-unused-vars
					var quantity = $scope.ngModel;

					var popupInstance = null;
					// eslint-disable-next-line no-unused-vars
					var multiplerNum = -1;
					$scope.titleMsg = null;
					var msg = null;

					// elem.find('input').bind('change', onChanged);

					function getMsgNumber(num) {
						var lang = platformLanguageService.getLanguageInfo();
						var options = {
							'thousand': lang.numeric.thousand,
							'decimal': lang.numeric.decimal,
							'precision': 2
						};
						return !_.isNull(num) && !_.isUndefined(num) ? accounting.formatNumber(num, options.precision, options.thousand, options.decimal) : '';
					}

					function getQuantity(sellUnit, minQuantity, userInputValue) {

						msg = null;
						var tempMultiplier = 0;
						if (userInputValue < 0) {
							userInputValue = 0;
						}
						var result = 0;
						if (sellUnit === 0) {
							if (userInputValue < minQuantity) {
								result = minQuantity;
								msg = 'MoQ:' + minQuantity;
							} else {
								result = userInputValue;
							}
						} else {
							if (userInputValue < minQuantity) {
								tempMultiplier = minQuantity * 1.0 / sellUnit;
								if (parseInt(tempMultiplier) === tempMultiplier) {
									result = minQuantity;
									msg = getMsgNumber(result) + '=SpQ ' + sellUnit + '*' + parseInt(tempMultiplier) + ', MoQ:' + minQuantity;
								} else {
									result = (Math.floor(tempMultiplier) + 1) * sellUnit;
									msg = getMsgNumber(result) + '=SpQ ' + sellUnit + '*' + (Math.floor(tempMultiplier) + 1) + ', MoQ:' + minQuantity;
								}
							} else {
								tempMultiplier = userInputValue * 1.0 / sellUnit;
								if (parseInt(tempMultiplier) === tempMultiplier) {
									result = userInputValue;
								} else {
									result = (Math.floor(tempMultiplier) + 1) * sellUnit;
									msg = getMsgNumber(result) + '=SpQ ' + sellUnit + '*' + (Math.floor(tempMultiplier) + 1);
								}
							}
						}
						return result;
					}

					function addFloat(a, b) {
						var num1 = parseInt(a * 10000);
						var num2 = parseInt(b * 10000);
						var num3 = num1 + num2;
						return num3 / 10000;
					}


					function substractFloat(a, b) {
						var num1 = parseInt(a * 10000);
						var num2 = parseInt(b * 10000);
						var num3 = num1 - num2;
						return num3 / 10000;
					}


					$scope.increaseQty = function () {
						var sellUnit = $scope.$parent.entity.SellUnit;
						if(sellUnit===0){
							sellUnit=1;
						}
						$scope.ngModel = addFloat(parseInt($scope.ngModel * 1.0/sellUnit)*sellUnit, $scope.$parent.entity.SellUnit);

						ctrl.$setViewValue($scope.ngModel);
						quantity = $scope.ngModel;
						$scope.titleMsg = null;
					};

					$scope.decreaseQty = function () {
						var minQuantity = $scope.$parent.entity.MinQuantity;
						var sellUnit = $scope.$parent.entity.SellUnit;
						if(sellUnit===0){
							sellUnit=1;
						}
						if (minQuantity === 0) {
							if($scope.ngModel%sellUnit===0){
								if (substractFloat($scope.ngModel, sellUnit) >= sellUnit) {
									$scope.ngModel = substractFloat($scope.ngModel, sellUnit);

									ctrl.$setViewValue($scope.ngModel);
									quantity = $scope.ngModel;
									$scope.titleMsg = null;
								}
							}else{
								if (substractFloat((parseInt($scope.ngModel * 1.0/sellUnit)+1)*sellUnit, sellUnit) >= sellUnit) {
									$scope.ngModel = substractFloat((parseInt($scope.ngModel * 1.0/sellUnit)+1)*sellUnit, sellUnit);

									ctrl.$setViewValue($scope.ngModel);
									quantity = $scope.ngModel;
									$scope.titleMsg = null;
								}
							}
						}
						else {
							if($scope.ngModel%sellUnit===0){
								if (substractFloat($scope.ngModel, sellUnit) >= minQuantity) {
									$scope.ngModel = substractFloat($scope.ngModel, sellUnit);

									ctrl.$setViewValue($scope.ngModel);
									quantity = $scope.ngModel;
									$scope.titleMsg = null;
								}
							}else{
								if (substractFloat((parseInt($scope.ngModel * 1.0/sellUnit)+1)*sellUnit, sellUnit) >= minQuantity) {
									$scope.ngModel = substractFloat((parseInt($scope.ngModel * 1.0/sellUnit)+1)*sellUnit, sellUnit);

									ctrl.$setViewValue($scope.ngModel);
									quantity = $scope.ngModel;
									$scope.titleMsg = null;
								}
							}
						}
					};


					$scope.onKeyDown = function (event) {

						var key = window.event ? window.event.keyCode : event.which;
						if (!((key > 95 && key < 106) ||
							(key > 47 && key < 60) ||
							(key === 110 && $scope.ngModel.toString().indexOf('.') < 0) ||
							(key === 190 && $scope.ngModel.toString().indexOf('.') < 0) ||
							key === 8 || key === 9 || key === 46 || key === 37 || key === 39)) {
							if (window.event) {  // IE
								window.event.returnValue = false;
							} else {  // FireFox
								event.preventDefault();
							}
						}
						if (key === 13) {
							event.target.blur();
						}
					};

					$scope.onKeyup = function () {
						onChanged();
					};

					function onChanged() {
						$scope.titleMsg = null;

						multiplerNum = -1;
						var materialEntity = $scope.$parent.entity;
						var sellUnit = materialEntity.SellUnit;
						var minQuantity = materialEntity.MinQuantity;
						var userInputValue = $scope.ngModel;

						quantity = getQuantity(sellUnit, minQuantity, userInputValue);
						if (!_.isNil(msg)) {
							$scope.titleMsg = msg;
						}
						if (!_.isNil($scope.titleMsg) && ($scope.titleMsg + '').length >= 32) {
							$scope.titleMsg = ($scope.titleMsg + '').substr(0, 32) + '...';
						}
						var options = {
							// element, popup window will open under this element.
							focusedElement: $(event.target),
							// element, stop closing popup window if event 'click' occurs in this element and its content.
							relatedTarget: $(event.target),
							// string, popup content template.
							template: '<div style="width:100%;height:100%;">' + $scope.titleMsg + '</div>',

							// controller: function () {
							//
							// },
							// decimal, optional, popup window width.
							width: 180,
							// decimal, optional, popup window height.
							height: 20,
							plainMode: true
						};
						if (!_.isNil(popupInstance)) {
							popupInstance.close();
						}
						if (!_.isNil($scope.titleMsg)) {
							popupInstance = basicsLookupdataPopupService.showPopup(options);
						}
					}

					$scope.onEnterKeyDown = function () {
						if (!_.isNil(popupInstance)) {
							popupInstance.close();
						}
					};

					var update = false;
					$scope.onChange = function () {
						update = true;
					};

					$scope.onBlur = function () {
						if (update && attrs.ngChange) {
							// $scope.model = quantity;
							$scope.model = $scope.ngModel;
							ctrl.$setViewValue($scope.model);
							ctrl.$commitViewValue();
							$scope.$parent.$eval(attrs.ngChange);// if set quantity will trigger update two times
						}
						update = false;
						if (!_.isNil(popupInstance)) {
							popupInstance.close();
						}
					};

					$scope.$on('$destroy', function () {
						if (!_.isNil(popupInstance)) {
							popupInstance.close();
						}
					});
				}
			};
		}]);

})(angular);