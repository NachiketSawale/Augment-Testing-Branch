/**
 * Created by jim on 3/3/2017.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,$ */
	var moduleName='procurement.ticketsystem';
	angular.module(moduleName).directive('procurementItemQuantityInput',
		['basicsLookupdataPopupService','procurementCommonItemQuantityValidationFlagService','platformLanguageService', 'accounting','_',
			function (basicsLookupdataPopupService,procurementCommonItemQuantityValidationFlagService,platformLanguageService,accounting,_) {
				return {
					restrict: 'EA',
					require: 'ngModel',
					scope: {
						entity: '=',
						uom: '='
					},
					controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
						$scope.config = $scope.$parent.$eval($attrs.config);
					}],
					templateUrl: globals.appBaseUrl + 'procurement.ticketsystem/templates/procurement-item-quantity-input.html',

					// template:'<div data-entity="entity" data-config="config" data-platform-control-validation><input class="domain-type-remark grid-control ng-pristine ng-valid ng-scope ng-touched" type="text"  title="{{titleMsg}}" ' +
					// ' data-ng-model="model" data-ng-blur="onBlur()" data-cloud-desktop-on-key-enter="onEnterKeyDown()" data-ng-keydown="onKeyDown($event)" ng-keyup="onKeyup($event)" ' +
					// ' data-ng-change="onChange($event)" ng-model-options="{  debounce: 100}"  /> </div>',
					link: function ($scope, $element, attrs, ctrl) {
						var beChanged=false;
						var quantity=null;
						var popupInstance = null;
						// eslint-disable-next-line no-unused-vars
						var multiplerNum = -1;
						var msg = null;

						$scope.titleMsg = null;
						$scope.model = null;

						function getMsgNumber(num)
						{
							var lang = platformLanguageService.getLanguageInfo();
							var options = {
								'thousand': lang.numeric.thousand,
								'decimal': lang.numeric.decimal,
								'precision': 3
							};
							return !_.isNull(num) && !_.isUndefined(num) ? accounting.formatNumber(num, options.precision, options.thousand, options.decimal) : '';
						}

						function modifyDecimal()
						{
							var userInputValue=$.trim($element.find('input').val());// ignore errors
							if(userInputValue!==''&&userInputValue.indexOf('.')>=0&&userInputValue.substr(userInputValue.indexOf('.')+1).length>3){
								var newValueString=userInputValue.substring(0,userInputValue.indexOf('.')+4);
								$scope.model=parseFloat(newValueString);
								$element.find('input').val(newValueString);
							}
						}

						function getQuantity(sellUnit, minQuantity, userInputValue) {
							msg=null;
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
										msg = getMsgNumber(result) + '=SpQ ' + sellUnit + '*' + parseInt(tempMultiplier) +  ', MoQ:' + minQuantity;
									} else {
										result = (Math.floor(tempMultiplier) + 1) * sellUnit;
										msg = getMsgNumber(result) + '=SpQ ' + sellUnit + '*' + (Math.floor(tempMultiplier) + 1) +', MoQ:' + minQuantity;
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
							return result.toFixed(3);
						}


						$scope.onKeyDown=function (event){
							var key=window.event?window.event.keyCode:event.which;
							if(!((((key>95&&key<106)||
							(key>47&&key<60)||
							(key===110&&$scope.model.toString().indexOf('.')<0)||
							(key===190&&$scope.model.toString().indexOf('.')<0))&&

							(($scope.model!==null&&$scope.model.toString().indexOf('.')<0)||
							($scope.model!==null&&$scope.model.toString().indexOf('.')>=0&&((key>95&&key<106)||(key>47&&key<60))&&
							$scope.model.toString().substr($scope.model.toString().indexOf('.')+1).length<=3)))||
							key===8||key===9||key===46||key===37||key===39)){
								if(window.event){  // IE
									window.event.returnValue=false;
								}else{  // FireFox
									event.preventDefault();
								}
							}
						};

						$scope.onKeyPress=function(){
						};

						$scope.onKeyup=function (){
						};



						$scope.onChange = function onChanged() {
							modifyDecimal();
							$scope.titleMsg = null;
							if (popupInstance !== null) {
								popupInstance.close();
							}
							if(procurementCommonItemQuantityValidationFlagService.validateOrNot===true&&procurementCommonItemQuantityValidationFlagService.itemId!==null&&
							procurementCommonItemQuantityValidationFlagService.sellUnit!==null&&procurementCommonItemQuantityValidationFlagService.minQuantity!==null){
								multiplerNum = -1;
								var sellUnit = procurementCommonItemQuantityValidationFlagService.sellUnit;
								var minQuantity = procurementCommonItemQuantityValidationFlagService.minQuantity;
								var userInputFloatValue=0;
								if($.trim($element.find('input').val())!==''){
									userInputFloatValue=parseFloat($.trim($element.find('input').val()));
								}
								quantity = getQuantity(sellUnit, minQuantity, userInputFloatValue);
								if (msg !== null) {
									$scope.titleMsg = msg;
								}
								if ($scope.titleMsg !== null && ($scope.titleMsg + '').length >= 32) {
									$scope.titleMsg = ($scope.titleMsg + '').substr(0, 32) + '...';
								}
								var options = {
								// element, popup window will open under this element.
									focusedElement: $element.find('input'),
									// element, stop closing popup window if event 'click' occurs in this element and its content.
									relatedTarget: $element.find('input'),
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

								if ($scope.titleMsg !== null) {
									popupInstance = basicsLookupdataPopupService.showPopup(options);
								}
							}else{
								quantity=$.trim($scope.model+'');
							}
							beChanged=true;
						};

						// model -> view
						ctrl.$render = function () {
							$scope.model = ctrl.$viewValue;
						};

						function setValue()
						{
							if(beChanged===true){
								$scope.model=quantity;

								ctrl.$setViewValue($scope.model);
								ctrl.$commitViewValue();

								$scope.$parent.$eval(attrs.config + '.rt$change()');
							}
						}

						$scope.onEnterKeyDown = function () {
							if (popupInstance !== null) {
								popupInstance.close();
							}
							setValue();
						};

						$scope.onBlur = function () {
							setValue();
						};

						$scope.$on('$destroy', function(){
							if (popupInstance !== null) {
								popupInstance.close();
							}
							setValue();
						});
					}
				};
			}]);

})(angular);
