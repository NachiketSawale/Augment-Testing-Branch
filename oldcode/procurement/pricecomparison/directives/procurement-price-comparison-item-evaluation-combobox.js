(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc directive
	 * @name procurementPricecomparisonPrcItemEvaluationCombobox
	 * @element div
	 * @restrict A
	 * @description
	 *
	 * a combox to select or input a price in compare field 'Item Evaluation' for item/boq reevaluation in pricecomparison
	 */
	angular.module(moduleName).directive('procurementPricecomparisonPrcItemEvaluationCombobox', [
		'_', '$compile', '$timeout', 'platformObjectHelper',
		function (_, $compile, $timeout, platformObjectHelper) {
			return {
				restrict: 'A',
				scope: '=',
				link: function ($scope, element) {
					var entityType = $scope.options.entityType;
					var templateList = [];
					if (entityType === 'item' || entityType === 'boq') {
						templateList.push('<div procurement-price-comparison-evaluation-complex-lookup data-ng-model="lookupValue" data-entity="entity" data-options="options"></div>');
					}
					else {
						templateList.push('<div procurement-common-prc-item-evaluation-combobox data-ng-model="lookupValue" data-entity="entity" data-options="options"></div>');
					}
					templateList.push('<span data-platform-text-input data-ng-model="value" data-control-options="config.editorOptions" data-entity="entity" class="input-group"><span>');
					var content = templateList.join('');

					$scope.lookupValue$watch = $scope.$watch('lookupValue', lookupValue$watch);
					angular.extend($scope.config && $scope.config.editorOptions);
					$scope.options.getPrcItemEvaluation = $scope.options.getPrcItemEvaluation || function () {
					};
					$scope.options.lookupMember = $scope.options.lookupMember || $scope.config.field + '_$PrcItemEvaluationFk';
					$scope.getValue = $scope.options.getPriceByPrcItemEvaluation || ($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.getPriceByPrcItemEvaluation) ||
						function () {
							return platformObjectHelper.getValue($scope.entity, $scope.config.field);
						};
					if (entityType === 'item' || entityType === 'boq') {
						$scope.updatePrice = $scope.options.updateQuoteItemPrice || ($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.updateQuoteItemPrice) ||
							function () {
							};
					}
					$scope.$on('$destroy', function () {
						$scope.lookupValue$watch();
					});
					element.append($compile(content)($scope));

					$timeout(function () {
						var quoteItem = getQuoteItemFromEntity($scope.entity);
						if ((entityType === 'item' || entityType === 'boq') && quoteItem && !quoteItem.IsIdealBidder) {
							element.find('span[data-platform-text-input]').css({width: element.parent().width() - 51});
						}
						else {
							element.find('span[data-platform-text-input]').css({width: element.parent().width() - 34});
						}
						// to fix the item evaluation lookup appearance style
						element.find('.form-control').removeClass('form-control');
						$scope.lookupValue = platformObjectHelper.getValue($scope.entity, $scope.options.lookupMember);
						$scope.config.editorOptions.readonly = $scope.lookupValue !== 8;

						var userStyle = $scope.config.editorOptions.style || '';
						userStyle += 'background-color:#eee;';
						$scope.config.editorOptions.style = userStyle;
					});

					function lookupValue$watch(newValue, oldValue) {
						// TODO chi: check if the user select the other quote items
						if (newValue !== oldValue) {
							var quoteItem = getQuoteItemFromEntity($scope.entity);
							if (!quoteItem || !quoteItem.IsIdealBidder || (entityType !== 'item' && entityType !== 'boq')) {
								var originalVal = platformObjectHelper.getValue($scope.entity, $scope.config.field, 0);
								var value = $scope.getValue(newValue, $scope.config.field, $scope.config.qtnFieldId); // the third parameter needs for in comparison item, it need qtnFieldId to get qoute infomation
								platformObjectHelper.setValue($scope.entity, $scope.options.lookupMember, newValue);
								const validValue = (value || value === 0) ? value : ((!oldValue && $scope.value) || 0.00);
								$scope.config.editorOptions.readonly = newValue !== 8;
								$scope.value = oldValue !== undefined ? validValue : null;
								if (quoteItem) {
									if (entityType === 'item') {
										quoteItem.PrcItemEvaluationId = newValue;
										if (angular.isDefined(oldValue) && originalVal === $scope.value) {
											if (angular.isFunction($scope.options.markAsModified)) {
												$scope.options.markAsModified($scope.entity, $scope.entity);
											}
											if (angular.isFunction($scope.options.itemEvaluationChanged)) {
												$scope.options.itemEvaluationChanged($scope.entity, $scope.value, $scope.config.field, true);
											}
										}
									} else if (entityType === 'boq') {
										quoteItem.PrcItemEvaluationId = newValue;
										if (angular.isDefined(oldValue) && originalVal === $scope.value) {
											if (angular.isFunction($scope.options.markAsModified)) {
												$scope.options.markAsModified($scope.entity, $scope.entity);
											}
											if (angular.isFunction($scope.options.itemEvaluationChanged)) {
												$scope.options.itemEvaluationChanged($scope.entity, $scope.value, $scope.config.field, true);
											}
										}
									}
								}
							} else {
								if (newValue) {
									$scope.updatePrice($scope.entity, newValue, $scope.options.lookupMember, $scope.config.field);
								}
								else {
									$scope.value = null;
								}
							}
						}
					}

					function getQuoteItemFromEntity(entity) {
						if (entity) {
							var compareType = (entityType === 'item' || entityType === 'boq') ? entity.LineType : entity.BoqLineTypeFk;
							var parentItem = compareType === 0 ? entity : entity.parentItem;
							if (parentItem && parentItem.QuoteItems) {
								var quoteItems = parentItem.QuoteItems,
									quoteKey = $scope.config.isVerticalCompareRows ? $scope.config.quoteKey : $scope.config.field;
								return _.find(quoteItems, {QuoteKey: quoteKey});
							}
						}
						return null;
					}
				}
			};
		}
	]);
})(angular);
