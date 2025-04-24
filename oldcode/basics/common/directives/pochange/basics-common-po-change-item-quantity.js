/**
 * Created by xai on 8/2/2017.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name purchaseOrderChangeItemsLookupDirective
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a directive for puchase order change :Decrease Quantity
	 */
	angular.module('basics.common').directive('purchaseOrderChangeItemsQuantity', ['$timeout', 'basicsCommonPurchaseOrderChangeService', 'basicsLookupdataPopupService', 'platformLanguageService', 'globals', '_', '$', 'accounting',
		function ($timeout, basicsCommonPurchaseOrderChangeService, basicsLookupdataPopupService, platformLanguageService, globals, _, $, accounting) {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {
					ngModel: '=',
					entity: '='
				},
				templateUrl: globals.appBaseUrl + 'basics.common/partials/pochange/po-change-items-quantity.html',
				link: function ($scope, elem, attrs, ctrl) {
					//                    $scope.ngModel = $scope.$parent.entity.Quantity;
					var initQty = $scope.entity.Quantity;
					$scope.ngModel = basicsCommonPurchaseOrderChangeService.getItemNewQty();
					var quantity = $scope.ngModel;
					var popupInstance = null;
					var multiplerNum = -1;
					$scope.titleMsg = null;
					var msg = null;

					$scope.$watch('ngModel', function () {
						//                        quantity=$scope.ngModel;
						basicsCommonPurchaseOrderChangeService.setItemNewQty($scope.ngModel);
						if ($scope.entity !== null) {
							$scope.entity.QuantityAskedfor = $scope.ngModel;
						}
						//                       console.log($scope.ngModel);
					});

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
								tempMultiplier = minQuantity / sellUnit;
								if (parseInt(tempMultiplier) === tempMultiplier) {
									result = minQuantity;
									msg = getMsgNumber(result) + '=SpQ ' + sellUnit + '*' + parseInt(tempMultiplier) + ', MoQ:' + minQuantity;
								} else {
									result = (Math.floor(tempMultiplier) + 1) * sellUnit;
									msg = getMsgNumber(result) + '=SpQ ' + sellUnit + '*' + (Math.floor(tempMultiplier) + 1) + ', MoQ:' + minQuantity;
								}
							} else {
								tempMultiplier = userInputValue / sellUnit;
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
					};

					$scope.onKeyUp = function (event) {
						$timeout(onChanged(), 100);
					};
					$scope.increaseQty = function () {
						$scope.ngModel = quantity;
						var minQuantity = $scope.$parent.entity.MinQuantity;
						var sellUnit = $scope.$parent.entity.SellUnit;
						if ($scope.ngModel >= minQuantity) {
							if ($scope.ngModel < initQty && addFloat($scope.ngModel, $scope.$parent.entity.SellUnit) <= initQty) {
								$scope.ngModel = addFloat($scope.ngModel, $scope.$parent.entity.SellUnit);
							} else {
								$scope.ngModel = initQty;
							}
						} else {
							$scope.ngModel = minQuantity;
						}
						quantity = $scope.ngModel;
						$scope.titleMsg = null;
					};

					$scope.decreaseQty = function () {
						$scope.ngModel = quantity;
						var minQuantity = $scope.$parent.entity.MinQuantity;
						var sellUnit = $scope.$parent.entity.SellUnit;
						if (minQuantity === 0) {
							if (substractFloat($scope.ngModel, sellUnit) >= sellUnit) {
								$scope.ngModel = substractFloat($scope.ngModel, sellUnit);

								ctrl.$setViewValue($scope.ngModel);
								quantity = $scope.ngModel;
								$scope.titleMsg = null;
							}
						} else {
							if ($scope.ngModel <= initQty && substractFloat($scope.ngModel, sellUnit) >= minQuantity) {
								$scope.ngModel = substractFloat($scope.ngModel, sellUnit);
							} else if ($scope.ngModel <= minQuantity) {
								$scope.ngModel = minQuantity;
							} else {
								$scope.ngModel = initQty;
							}
							ctrl.$setViewValue($scope.ngModel);
							quantity = $scope.ngModel;
							$scope.titleMsg = null;
						}
					};

					function onChanged() {
						$scope.titleMsg = null;

						multiplerNum = -1;
						var materialEntity = $scope.$parent.entity;
						var sellUnit = materialEntity.SellUnit;
						var minQuantity = materialEntity.MinQuantity;
						var userInputValue = $scope.ngModel;

						quantity = getQuantity(sellUnit, minQuantity, userInputValue);
						if (msg !== null) {
							$scope.titleMsg = msg;
						}
						if ($scope.titleMsg !== null && ($scope.titleMsg + '').length >= 32) {
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
						if (popupInstance !== null) {
							popupInstance.close();
						}
						if ($scope.titleMsg !== null) {
							popupInstance = basicsLookupdataPopupService.showPopup(options);
						}
					}

					$scope.onEnterKeyDown = function () {
						if (popupInstance !== null) {
							popupInstance.close();
						}
						/*                        var minQuantity = $scope.$parent.entity.MinQuantity;
                        var sellUnit = $scope.$parent.entity.SellUnit;
                        if($scope.ngModel>=minQuantity){
                            if($scope.ngModel<initQty && !($scope.ngModel%sellUnit)){
                                $scope.ngModel =  $scope.ngModel;
                            }
                            else{
                                $scope.ngModel=initQty;
                            }
                        }
                        else{
                            $scope.ngModel=minQuantity;
                        } */
						$scope.ngModel = quantity;
						//                       ctrl.$setViewValue(quantity);
					};

					$scope.onBlur = function () {
						if (popupInstance !== null) {
							popupInstance.close();
						}
						var minQuantity = $scope.$parent.entity.MinQuantity;
						var sellUnit = $scope.$parent.entity.SellUnit;
						if (quantity > initQty) {
							quantity = initQty;
						}
						/* quantity= $scope.ngModel */
						$scope.ngModel = quantity;
						// ctrl.$setViewValue(quantity);
					};

					$scope.$on('$destroy', function () {
						if (popupInstance !== null) {
							popupInstance.close();
						}
					});
				}
			};
		}
	])
		.directive('newQuantityConverter',
			['platformLanguageService', 'accounting', '$', '_',
				function (platformLanguageService, accounting, $, _) {
					return {
						require: 'ngModel',
						restrict: 'A',
						scope: false,
						link: function ($scope, elem, attrs, ctrl) {

							var lang = platformLanguageService.getLanguageInfo();

							var options = {
								'thousand': lang.numeric.thousand,
								'decimal': lang.numeric.decimal,
								'precision': 3
							};

							var uom = '';
							var inFocus = false;
							$(elem).focus(function () {
								inFocus = true;
								ctrl.$setViewValue(ctrl.$formatters[0](parseFloat(parseFloat(ctrl.$modelValue + '').toFixed(3))));
								ctrl.$render();
							});

							$(elem).blur(function () {
								inFocus = false;
								ctrl.$setViewValue(ctrl.$formatters[0](parseFloat(parseFloat(ctrl.$modelValue + '').toFixed(3))));
								// ctrl.$setViewValue(ctrl.$formatters[0](ctrl.$modelValue));
								ctrl.$render();
							});

							ctrl.$formatters.unshift(function (modelValue) {
								if (inFocus === true) {
									// return parseFloat(modelValue).toFixed(3);
									// return $scope.ngModel;
									return parseFloat($scope.ngModel + '').toFixed(3);
								}

								// var trans = !_.isNull(modelValue) && !_.isUndefined(modelValue) ? accounting.formatNumber(parseFloat(modelValue).toFixed(3), options.precision, options.thousand, options.decimal) : '';

								var trans = !_.isNull(modelValue) && !_.isUndefined(modelValue) ? accounting.formatNumber(modelValue, options.precision, options.thousand, options.decimal) : '';

								if (uom) {
									trans += ' ' + uom;
								}

								return trans;
							});

							ctrl.$parsers.push(function (viewValue) {
								if (viewValue && _.isString(viewValue)) {
									viewValue = viewValue.replace(uom, '');
									var split = viewValue.replace(/,/g, options.decimal).replace(/\./g, options.decimal).split(options.decimal);
									var last = split.pop();

									viewValue = split.length ? split.join('').concat(options.decimal, last) : last;
									var result = accounting.unformat(viewValue, options.decimal);
									return result;
								}
								return viewValue;
							});

							$scope.$on('$destroy', function () {
								$(elem).unbind('focus');
								$(elem).unbind('blur');
							});
						}
					};
				}]);

})(angular);
