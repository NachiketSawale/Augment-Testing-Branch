/**
 * Created by joshi on 20.01.2016.
 */

( function (angular) {
	'use strict';
	/* global globals, $ */
	let moduleName = 'estimate.rule';
	/**
	 * @ngdoc service
	 * @name estimateRuleComplexLookup
	 * @function
	 *
	 * @description
	 * lookup to show assigned estimate rules in different estimation structures with two different dropdown popup
	 */
	angular.module(moduleName).directive('estimateRuleComplexLookup', ['$injector', '$q', 'estimateRuleComplexLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		'estimateRuleComplexLookupCommonService','estimateRuleComboService','estimateRuleCommonService',
		function ($injector, $q, estimateRuleComplexLookupService, BasicsLookupdataLookupDirectiveDefinition, estimateRuleComplexLookupCommonService, estimateRuleComboService, estimateRuleCommonService) {

			let defaults = {
				lookupType: 'estimateRulesComplexLookup',
				valueMember: 'Code',
				displayMember: 'Icon',

				isClientSearch: true,
				isExactSearch: true,

				showClearButton: false,
				showEditButton: false,

				showCustomInputContent: true,
				formatter: estimateRuleComplexLookupCommonService.displayFormatter,
				uuid: '41288e82539f41aa8581517349c756ee',
				columns: estimateRuleComplexLookupCommonService.getColumnsReadOnly(),
				gridOptions: {
					multiSelect: true
				},
				isStaticGrid: true,
				treeOptions: {
					parentProp: 'CustomEstRuleFk',
					childProp: 'CustomEstRules',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true,
					idProperty:'Id'
				},
				title: {
					name: 'Rules',
					name$tr$: 'estimate.rule.rules'
				},
				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					return searchValue;
				},
				onDataRefresh: function ($scope) {
					let rateBookService = $injector.get('estimateProjectRateBookConfigDataService');

					// refresh it, and check it refresh or not
					if(rateBookService){
						return rateBookService.initData().then(function(/* response */){
							estimateRuleComplexLookupService.getEstRuleItemsPromise().then(function(response){
								let estRuleItems = estimateRuleCommonService.generateRuleCompositeList(response.data,undefined,true);
								estimateRuleComplexLookupService.setCompositeRuleItems(estRuleItems);

								if($scope.settings){
									estRuleItems = estimateRuleComplexLookupService.filterRuleByBoq(estRuleItems, $scope.settings);
								}
								$scope.refreshData(estRuleItems);

								estimateRuleComboService.updateItemList(estRuleItems);
							});
						});
					}
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let scope = this;
							// clear all items
							if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
								let defer =$q.defer();
								// Now only lineItem has editable rule in the detail form
								if(e.target.form !== null){
									defer.promise = estimateRuleComplexLookupCommonService.clearAllItemsInLineItemDetailForm(args, scope);
								}
								else{
									defer.promise = estimateRuleComplexLookupCommonService.clearAllItems(args, scope);
								}
								defer.promise.then(function(){
									$injector.get('estimateMainLineitemParamertersService').refreshToLineItemParams(null,true);
								});
							}
						}
					},
					{
						name: 'onSelectedItemsChanged',
						handler: function (e, args) {
							let scope = this;

							// Now only lineItem has editable rule in the detail form
							if(estimateRuleComplexLookupCommonService.getIfClickFromDetailForm())
							{
								estimateRuleComplexLookupCommonService.onSelectionChangeInLineItemDetailForm(args, scope);
							}
							else
							{
								estimateRuleComplexLookupCommonService.onSelectionChange(args, scope);
							}
						}
					},
					{
						name: 'onInputGroupClick',
						handler: function (e) {
							if (e.target.className.indexOf('rule-icons') === -1) {
								if(e.currentTarget.className.indexOf('grid-container') !== -1){
									// It will set estimateRuleComplexLookupCommonService.getIfClickFromDetailForm() true here
									estimateRuleComplexLookupCommonService.setIfClickFromDetailForm(false);
								}
								else{
									// It will set estimateRuleComplexLookupCommonService.getIfClickFromDetailForm() false here
									estimateRuleComplexLookupCommonService.setIfClickFromDetailForm(true);
								}

								return;
							}

							estimateRuleComplexLookupCommonService.openPopup(e, this);
						}
					},
					{
						name: 'onEditValueChanged',
						handler: function (e, args) {
							if(!this.displayItem && args.entity){
								this.displayItem = args.entity.RuleAssignment;
							}
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				dataProvider: {
					getList: function (config, scope) {
						return estimateRuleComplexLookupService.getListAsync(config, scope);
					},

					getItemByKey: function (value, config, scope) {
						return estimateRuleComplexLookupService.getSearchList(value, config, scope);
					},

					getSearchList: function (value, config, scope) {
						return estimateRuleComplexLookupService.getSearchList(value, config, scope);
					}
				},
				controller: ['$scope', 'estimateRuleComplexLookupService', function ($scope, estimateRuleComplexLookupService) { // do external logic to specific lookup directive controller here.
					let onOpenPopupClicked = function (event, editValue) {
						editValue(event);
					};

					$scope.lookupOptions.popupOptions.width = 1000;
					estimateRuleComplexLookupService.loadLookupData();
					// add button should not be displayed in Estimate read only state
					let estMainServ = $injector.get('estimateMainService');
					console.log('estMainServ.getIsEstimate()',estMainServ.getIsEstimate());
					if (estMainServ.getIsEstimate()) {
						if (!estMainServ.getHeaderStatus() || estMainServ.hasCreateUpdatePermission()) {
							$scope.lookupOptions.showClearButton = true;
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
						} else {
							$scope.lookupOptions.showClearButton = false;
						}
					} else {
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
					}
				}]
			});
		}
	]);
})(angular);
