/**
 * Created by xsi on 2016-10-10.
 */
( function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,$ */

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).directive('constructionSystemMainParamComplexLookup', ['constructionSystemMainParamComplexLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'constructionSystemMainParamComplexLookupCommonService',
		function (constructionSystemMainParamComplexLookupService, BasicsLookupdataLookupDirectiveDefinition, constructionSystemMainParamComplexLookupCommonService) {

			var defaults = {
				lookupType: 'estimateParamComplexLookup',
				valueMember: 'Code',
				displayMember: 'Code',
				showCustomInputContent: true, // show custom input content.
				formatter: constructionSystemMainParamComplexLookupCommonService.displayFormatter, // return custom input content
				idProperty:'Id',
				uuid: 'e0ce6eaa77bb4de988a3279a19333220',
				columns:constructionSystemMainParamComplexLookupCommonService.getColumns(),
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							var scope = this;
							// clear all items
							if(e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1){
								constructionSystemMainParamComplexLookupCommonService.clearAllItems(args, scope);
							}
							// add item
							else{
								constructionSystemMainParamComplexLookupCommonService.onSelectionChange(args, scope);
							}
						}
					},
					{
						name: 'onInputGroupClick',
						handler: function (e) {
							if (e.target.className.indexOf('ico-parameter') === -1 && e.target.className.indexOf('ico-menu') === -1) {
								return;
							}
							constructionSystemMainParamComplexLookupCommonService.openPopup(e, this);
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {

					getList: function () {
						return constructionSystemMainParamComplexLookupService.getListAsync();
					},

					getItemByKey: function (value) {
						return constructionSystemMainParamComplexLookupService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value) {
						return constructionSystemMainParamComplexLookupService.getItemByIdAsync(value);
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.

					var onOpenPopupClicked = function (event, editValue) {
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