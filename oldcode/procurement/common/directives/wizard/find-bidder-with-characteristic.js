/**
 * Created by lja on 2015/10/10.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName)
		.directive('findBidderWithCharacteristic',
			['$http', '$translate', 'moment', 'basicsLookupdataLookupFilterService', 'basicsCharacteristicTypeHelperService', 'basicsCharacteristicDataDiscreteValueLookupService',
				'basicsCharacteristicGroupDataCombineLookupService',
				function ($http, $translate, moment, basicsLookupdataLookupFilterService, basicsCharacteristicTypeHelperService, basicsCharacteristicDataDiscreteValueLookupService,
					basicsCharacteristicGroupDataCombineLookupService) {
					return {
						restrict: 'AE',
						scope: {
							withCharacteristic: '=',
							isLoading: '='
						},
						templateUrl: function () {
							return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder-with-characteristic.html';
						},
						controller: ['$scope', controller],
						link: function ($scope) {

							var translationPrefix = 'procurement.common.findBidder.withCharacteristic.compareOperator.';
							var operator = [
								{id: 0, value: '', description: $translate.instant(translationPrefix + 'noComparison')},
								{id: 1, value: '=', description: $translate.instant(translationPrefix + 'equals')},
								{id: 2, value: '>', description: $translate.instant(translationPrefix + 'greaterThan')},
								{id: 3, value: '<', description: $translate.instant(translationPrefix + 'lessThan')},
								{id: 4, value: 'contains', description: $translate.instant(translationPrefix + 'contains')},
								{id: 5, value: '!isnullorempty', description: $translate.instant(translationPrefix + 'isNotNullOrEmpty')}
							];
							var filters = [
								{
									key: 'find-bidder-characteristic-value-filter',
									fn: function (item, context) {
										if (!context) {
											return false;
										}

										if (context.CharacteristicTypeFk === 10) {
											return item.CharacteristicFk === context.Id;
										}

										return true;
									}
								}
							];
							basicsLookupdataLookupFilterService.registerFilter(filters);

							if (!$scope.withCharacteristic.items) {
								getBasCharacteristic();
							}

							$scope.withCharacteristic.title = $translate.instant('procurement.common.findBidder.withCharacteristic.title');
							$scope.withCharacteristic.operators = $scope.withCharacteristic.operators ? $scope.withCharacteristic.operators : getOperators();
							$scope.withCharacteristic.selectedOp = $scope.withCharacteristic.selectedOp ? $scope.withCharacteristic.selectedOp : operator[0];
							$scope.withCharacteristic.lookupOptions = {
								lookupType: 'basicsCharacteristicDataDiscreteValueLookup',
								filterKey: 'find-bidder-characteristic-value-filter'
							};
							$scope.withCharacteristic.rt$readonly = readonly;
							$scope.withCharacteristic.rt$hasError = hasError;
							$scope.withCharacteristic.rt$errorText = errorText;
							$scope.withCharacteristic.rt$change = changeCompareValue;
							$scope.changeCharacteristic = changeCharacteristic;

							var unwatchSelectedItemFk = $scope.$watch('withCharacteristic.selectedItemFk', changeCharacteristic);
							basicsCharacteristicGroupDataCombineLookupService.setFilter(2);
							if (!_.isNil($scope.withCharacteristic.selectedItem)) {
								var selectedItem = $scope.withCharacteristic.selectedItem;
								basicsCharacteristicGroupDataCombineLookupService.setCache([selectedItem]);
							}
							$scope.$on('$destroy', function () {
								if (unwatchSelectedItemFk) {
									unwatchSelectedItemFk();
								}
							});

							// ///////////////////////////////////////////////////////////
							function getOperators() {
								if (!$scope.withCharacteristic.selectedItem) {
									return [operator[0]];
								}
								var characteristicTypeId = $scope.withCharacteristic.selectedItem.CharacteristicTypeFk;
								operator[2].description = getDescrioption4GreaterThan(characteristicTypeId);
								operator[3].description = getDescrioption4LessThan(characteristicTypeId);
								switch (characteristicTypeId) {
									case 1: // bool
										return [operator[0], operator[1]];
									case 10: // lookup
										return [operator[0], operator[1], operator[5]];
									case 2: // description
									case 9: // no value
										return [operator[0], operator[1], operator[4], operator[5]];
									case 3: // integer
									case 4: // percent
									case 5: // money
									case 6: // quantity
									case 7: // dateutc
									case 8: // datetimeutc
										return [operator[0], operator[1], operator[2], operator[3], operator[5]];
									default:
										return [operator[0]];
								}
							}

							function getBasCharacteristic() {
								$scope.isLoading = true;
								$http.get(globals.webApiBaseUrl + 'basics/characteristic/characteristic/getcharacteristicbysectionfk?sectionFk=2')
									.then(function (response) {
										$scope.withCharacteristic.items = response.data;
										_.forEach($scope.withCharacteristic.items, function (item) {
											if (item.CharacteristicTypeFk !== 7 && item.CharacteristicTypeFk !== 8) {
												if (item.CharacteristicTypeFk === 1) {
													if (item.DefaultValue === null || angular.isUndefined(item.DefaultValue)) {
														item.compareValue = 'false';
													} else {
														item.compareValue = item.DefaultValue;
													}
												} else {
													item.compareValue = basicsCharacteristicTypeHelperService.convertValue(item.DefaultValue, item.CharacteristicTypeFk);
												}
											} else {
												item.compareValue = moment.utc(Date.now());
											}
										});

										if (response.data.length > 0) {
											var selectedItem = $scope.withCharacteristic.selectedItem ? $scope.withCharacteristic.selectedItem : response.data[0];
											$scope.withCharacteristic.selectedItem = selectedItem;
											$scope.withCharacteristic.selectedItemFk = selectedItem.Id;
											$scope.withCharacteristic.characteristicDesc = selectedItem.DescriptionInfo.Translated;
											$scope.withCharacteristic.operators = getOperators();
											if (_.isNil($scope.withCharacteristic.selectedOp)) {
												$scope.withCharacteristic.selectedOp = operator[0];
											}
											basicsCharacteristicGroupDataCombineLookupService.setCache([selectedItem]);
										}
										$scope.isLoading = false;
									}, function () {
										$scope.isLoading = false;
									});

								var options = {lookupType: basicsCharacteristicDataDiscreteValueLookupService.getlookupType()};
								basicsCharacteristicDataDiscreteValueLookupService.getList(options);
							}

							function getDescrioption4GreaterThan(charType) {
								if (charType === 7 || charType === 8) {
									return $translate.instant(translationPrefix + 'laterThan');
								} else {
									return $translate.instant(translationPrefix + 'greaterThan');
								}
							}

							function getDescrioption4LessThan(charType) {
								if (charType === 7 || charType === 8) {
									return $translate.instant(translationPrefix + 'earlierThan');
								} else {
									return $translate.instant(translationPrefix + 'lessThan');
								}
							}

							function hasError() {
								if (!$scope.withCharacteristic.isActive || !$scope.withCharacteristic.selectedItem || ($scope.withCharacteristic.selectedOp.id !== 2 && $scope.withCharacteristic.selectedOp.id !== 3)) {
									$scope.withCharacteristic.hasError = false;
									return false;
								}

								var type = $scope.withCharacteristic.selectedItem.CharacteristicTypeFk;

								switch (type) {
									case 3: // integer
									case 4: // percent
									case 5: // money
									case 6: // quantity
									case 7: // dateutc
									case 8: // datetimeutc
										if ($scope.withCharacteristic.selectedItem.compareValue === null ||
											angular.isUndefined($scope.withCharacteristic.selectedItem.compareValue) ||
											$scope.withCharacteristic.selectedItem.compareValue === '') {
											$scope.withCharacteristic.hasError = true;
											return true;
										}
										break;
									default:
										$scope.withCharacteristic.hasError = false;
										return false;
								}
								$scope.withCharacteristic.hasError = false;
								return false;
							}

							function errorText() {
								return $translate.instant('procurement.common.findBidder.withCharacteristic.errorEmpty');
							}

							function readonly() {
								return $scope.withCharacteristic.selectedOp.id === 0 || $scope.withCharacteristic.selectedOp.id === 5;
							}

							function changeCharacteristic(newValue, oldValue) {
								if (newValue === oldValue) {
									return;
								}
								if ($scope.withCharacteristic.selectedItemFk) {
									$scope.withCharacteristic.selectedItem = _.find($scope.withCharacteristic.items, {Id: $scope.withCharacteristic.selectedItemFk});
									if ($scope.withCharacteristic.selectedItem) {
										$scope.withCharacteristic.characteristicDesc = $scope.withCharacteristic.selectedItem.DescriptionInfo.Translated;
									}
								} else {
									$scope.withCharacteristic.selectedItem = null;
									$scope.withCharacteristic.characteristicDesc = null;
								}
								$scope.withCharacteristic.operators = getOperators();
								$scope.withCharacteristic.selectedOp = operator[0];
							}

							function changeCompareValue() {
								if ($scope.withCharacteristic.selectedItem.compareValue === '') {
									$scope.withCharacteristic.selectedItem.compareValue = null;
								}
							}
						}
					};

					// //////////////////////////////////////////////////
					function controller($scope) {
						$scope.withCharacteristic.codeLookupConfig = {
							rt$readonly: function () {
								return !$scope.withCharacteristic.isActive;
							}
						};
						$scope.withCharacteristic.charCodeLookupOptions = {
							showClearButton: false
						};
					}
				}]);
})(angular);