/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

( function (angular) {
	/* global $, globals */
	'use strict';

	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParamComplexLookup
	 * @function
	 *
	 * @description
	 * lookup to show assigned estimate parameters in different estimation structures with two different dropdown popup
	 */
	angular.module(moduleName).directive('estimateParamComplexLookup', ['$injector','estimateParamComplexLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateParamComplexLookupCommonService','$translate',
		function ($injector,estimateParamComplexLookupService, BasicsLookupdataLookupDirectiveDefinition, estimateParamComplexLookupCommonService,$translate) {

			let columns = estimateParamComplexLookupCommonService.getColumns();
			columns.push({
				id: 'sourceId',
				field: 'SourceId',
				name: 'Source',
				width: 500,
				toolTip: 'Source',
				name$tr$: 'estimate.parameter.source',
				required: false,
				sorting : 10,
				editor: 'lookup',
				editorOptions: {
					lookupDirective: 'estimate-main-param-source-lookup'
				},
				formatter: 'lookup',
				formatterOptions: {
					dataServiceName: 'estimateMainParamSourceLookupDataService',
					displayMember: 'DescriptionInfo.Translated'
				}
			});
			let defaults = {
				lookupType: 'estimateParamComplexLookup',
				valueMember: 'Code',
				displayMember: 'Code',
				showCustomInputContent: true, // show custom input content.
				formatter: estimateParamComplexLookupCommonService.displayFormatter, // return custom input content
				idProperty:'Id',
				uuid: 'e0ce6eaa77bb4de988a3279a19333220',
				disableDataCaching: true,
				columns:columns,
				width: 1000,
				onDataRefresh: function ($scope) {

					let mainItemName = null;
					if($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.$parent && $scope.$parent.$parent.$parent.config){
						mainItemName = $scope.$parent.$parent.$parent.config.formatterOptions.itemName;
					}else if($scope.$parent && $scope.$parent.options){
						mainItemName = $scope.$parent.options.itemName;
					}

					estimateParamComplexLookupService.loadLookupData(mainItemName,$scope.entity).then(function (data) {
						if(data){
							$scope.refreshData(data);
						}
					});
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let scope = this;
							// clear all items
							if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
								let platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
								platformDeleteSelectionDialogService.showDialog({dontShowAgain : true, id: 'e0ce6eaa77bb4de988a3279a19333220',headerText$tr$:'estimate.parameter.deleteParamHint'}).then(result => {
									if (result.ok || result.delete) {
										estimateParamComplexLookupCommonService.clearAllItems(args, scope).then(function(){
											$injector.get('estimateMainLineitemParamertersService').refreshToLineItemParams(null,true);
										});
									}
								});
							}
							// add item
							else{
								args.selectedItem.ValueType = args.selectedItem.ParamvaluetypeFk ? args.selectedItem.ParamvaluetypeFk : args.selectedItem.ValueType;
								estimateParamComplexLookupCommonService.onSelectionChange(args, scope);
							}
						}
					},
					{
						name: 'onInputGroupClick',
						handler: function (e) {
							if (e.target.className.indexOf('ico-parameter') === -1 && e.target.parentNode.className.indexOf('overlay-counter') === -1 && e.target.className.indexOf('ico-menu') === -1) {
								return;
							}
							// if this has been setted readonly,
							if(this.ngReadonly){
								return;
							}
							estimateParamComplexLookupCommonService.openPopup(e, this);
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function (options, scope) {
						let mainItemName = null;
						if(scope.$parent && scope.$parent.$parent && scope.$parent.$parent.config ){
							mainItemName = scope.$parent.$parent.config.formatterOptions.itemName;
							if(scope.$parent.$parent.config.formatterOptions.realDataService ==='estimateAssembliesService'){
								mainItemName = 'AssembliesEstLineItems';
							}
						}else if(scope.$parent &&scope.$parent.options){
							mainItemName = scope.$parent.options.itemName;
						}
						estimateParamComplexLookupService.clearCacheData(mainItemName);
						return estimateParamComplexLookupService.getListAsync(mainItemName,scope.entity);
					},

					getItemByKey: function (value, options, scope) {
						let mainItemName = null;
						if(scope.$parent && scope.$parent.$parent && scope.$parent.$parent.config && scope.$parent.$parent.config.formatterOptions){
							mainItemName = scope.$parent.$parent.config.formatterOptions.itemName;
							if(scope.$parent.$parent.config.formatterOptions.realDataService ==='estimateAssembliesService'){
								mainItemName = 'AssembliesEstLineItems';
							}
						}else if(scope.$parent &&scope.$parent.options){
							mainItemName = scope.$parent.options.itemName;
						}
						return estimateParamComplexLookupService.getItemByIdAsync(value,mainItemName,scope.entity);
					},

					getDisplayItem: function (value) {
						return estimateParamComplexLookupService.getItemByIdAsync(value);
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					let onOpenPopupClicked = function (event, editValue) {
						editValue(event);
					};

					$scope.lookupOptions.buttonTitles = {
						refresh:$translate.instant('estimate.parameter.refreshParam'),
						clear: $translate.instant('estimate.parameter.clearParam'),
					};

					let estMainServ = $injector.get('estimateMainService');

					if (estMainServ.getIsEstimate()) {
						// add button should not be displayed in Estimate read only state
						if (!estMainServ.getHeaderStatus() || estMainServ.hasCreateUpdatePermission()) {
							$scope.lookupOptions.showClearButton = true;
							$.extend($scope.lookupOptions, {
								buttons: [
									{
										title: $translate.instant('estimate.parameter.addParamHint'),
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
							buttons: [{
								title: $translate.instant('estimate.parameter.addParamHint'),
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-add',
								execute: onOpenPopupClicked,
								canExecute: function () {
									return true;
								}
							}]
						});
					}
				}]
			});
		}
	]);
})(angular);
