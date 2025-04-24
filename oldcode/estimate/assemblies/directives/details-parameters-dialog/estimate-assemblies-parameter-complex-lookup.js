/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateParamComplexLookup
	 * @function
	 *
	 * @description
	 * lookup to show assigned estimate parameters in different estimation structures with two different dropdown popup
	 */
	angular.module(moduleName).directive('estimateAssembliesParameterComplexLookup', ['estimateParamComplexLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateParamComplexLookupCommonService',
		'estimateAssembliesParameterComplexLookupService','globals','$',
		function (estimateParamComplexLookupService, BasicsLookupdataLookupDirectiveDefinition, estimateParamComplexLookupCommonService,estimateAssembliesParameterComplexLookupService,globals,$) {

			let defaults = {
				lookupType: 'estimateAssembliesParameterComplexLookup',
				valueMember: 'Code',
				displayMember: 'Code',
				showCustomInputContent: true, // show custom input content.
				formatter: estimateParamComplexLookupCommonService.displayFormatter, // return custom input content
				idProperty:'Id',
				uuid: '1ef609e3754b40b4ae75c4178f228e39',
				columns:estimateParamComplexLookupCommonService.getColumns(),
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let scope = this;
							// clear all items
							if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
								estimateParamComplexLookupCommonService.clearAllItems(args, scope);
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
							if (e.target.className.indexOf('ico-parameter') === -1 && e.target.className.indexOf('ico-menu') === -1) {
								return;
							}
							estimateParamComplexLookupCommonService.openPopup(e, this);
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {

					getList: function () {
						return estimateParamComplexLookupService.getListAsync();
					},

					getItemByKey: function (value) {
						return estimateParamComplexLookupService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value) {
						return estimateParamComplexLookupService.getItemByIdAsync(value);
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.

					let onOpenPopupClicked = function (event, editValue) {
						editValue(event);
					};

					$.extend($scope.lookupOptions, {
						buttons: [
							{
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-add',
								execute: onOpenPopupClicked,
								canExecute:function(){
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
