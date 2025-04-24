/**
 * Created by zos on 1/4/2018.
 */

(function (angular) {
	/* global globals, $ */
	'use strict';
	var moduleName = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainRuleComplexLookup
	 * @function
	 *
	 * @description
	 * lookup to show assigned rules in different estimation structures with two different dropdown popup
	 */
	angular.module(moduleName).directive('boqRuleComplexLookup', ['boqRuleComplexLookupService', 'BasicsLookupdataLookupDirectiveDefinition', '$injector', '$q', 'boqRuleComplexLookupCommonService', 'estimateRuleCommonService',
		function (boqRuleComplexLookupService, BasicsLookupdataLookupDirectiveDefinition, $injector, $q, boqRuleComplexLookupCommonService, estimateRuleCommonService) {

			var defaults = {
				lookupType: 'boqRulesComplexLookup',

				// the rule entity's id field, bind to the mainEntity.Rule field in the column definition
				// once the rule item is selected, the mainEntity.Rule = rule.Id, an integer
				valueMember: 'Code',
				displayMember: 'Icon',

				isClientSearch: true,
				isExactSearch: true,

				showClearButton: true,
				showEditButton: false,

				showCustomInputContent: true,
				formatter: boqRuleComplexLookupCommonService.displayFormatter,
				uuid: 'B1F5553F1A9346D69FC0E0E6261FAE22',
				columns: boqRuleComplexLookupCommonService.getColumnsReadOnly(),
				gridOptions: {
					multiSelect: true
				},
				title: {
					name: 'Rules',
					name$tr$: 'estimate.rule.rules'
				},

				treeOptions: {
					parentProp: 'CustomEstRuleFk',
					childProp: 'CustomEstRules',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true,
					idProperty: 'Id'
				},

				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					return searchValue;
				},

				onDataRefresh: function ($scope) {
					if (boqRuleComplexLookupService.isNavFromBoqProject()) {
						var rateBookService = $injector.get('estimateProjectRateBookConfigDataService');

						// refresh it, and check it refresh or not
						if (rateBookService) {
							return rateBookService.initData().then(function () {
								boqRuleComplexLookupService.getCompositeRuleItemsPromise().then(function (response) {
									var estRuleItems = estimateRuleCommonService.generateRuleCompositeList(response.data, 'isForBoq', true);
									boqRuleComplexLookupService.setCompositeRuleItems(estRuleItems);
									$scope.refreshData(boqRuleComplexLookupService.filterRuleByBoq(estRuleItems));
								});
							});
						}
					} else if (boqRuleComplexLookupService.isNavFromBoqWic()) {
						var deferred = $q.defer();
						var scope = $scope;
						var ruleItems = boqRuleComplexLookupService.refreshDataForWic($scope);
						deferred.resolve(ruleItems);
						deferred.promise.then(function (response) {
							if (response) {
								scope.refreshData(boqRuleComplexLookupService.filterRuleByBoq(response));
							}
						});
					}
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							var scope = this;

							// just for detail form when User click the delete icon
							if (e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1) {
								boqRuleComplexLookupCommonService.clearAllItems(args, scope);
							}
						}
					},
					{
						name: 'onSelectedItemsChanged',
						handler: function (e, args) {
							var scope = this;

							// add item
							boqRuleComplexLookupCommonService.onSelectionChange(args, scope);
						}
					},
					{
						name: 'onInputGroupClick',
						handler: function (e, args) {
							var scope = this;

							// Clear default selection
							args.entity.Rule = null;

							// clear all items, delete,
							// e.target.className:btn btn-default control-icons ico-input-delete
							if (e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1) {
								boqRuleComplexLookupCommonService.clearAllItems(args, scope);
							} else if (e && e.target && e.target.className && e.target.className.indexOf('block-image') !== -1) {
								if (e.target.className.indexOf('rule-icons') !== -1) {
									// edit param items
									// e.target.className: pane-r block-image rule-icons ico-house overlay-1 19
									boqRuleComplexLookupCommonService.openPopup(e, scope);
								}
							}
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				dataProvider: {
					getList: function (config, scope) {
						return boqRuleComplexLookupService.getListAsync(config, scope);
					},

					getItemByKey: function (value, config, scope) {
						// return estimateAssembliesRuleComplexLookupService.getItemByIdAsync(value);
						// return boqRuleComplexLookupService.getSearchList(value, config, scope);
						return boqRuleComplexLookupService.getListAsync(config, scope);
					},

					getSearchList: function (value, config, scope) {
						return boqRuleComplexLookupService.getSearchList(value, config, scope);
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					var onOpenPopupClicked = function (event, editValue) {
						editValue(event);
						$scope.lookupOptions.popupOptions.width = 1000;
					};

					$.extend($scope.lookupOptions, {
						buttons: [
							{
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-add',
								execute: onOpenPopupClicked,
								canExecute: function () {
									return true;
								}
							}
						]
					});

				}]
			});
		}
	]);
})(angular);
