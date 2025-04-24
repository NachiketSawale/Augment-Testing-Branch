/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainResourceSubItem
	 * @requires  estimateMainResourceCodeLookup
	 * @description replace control and domain according to resource type
	 */

	angular.module(moduleName).directive('estimateMainResourceSubItemDesc', [
		function () {

			return {
				restrict: 'A',
				scope : {
					entity:'=',
					ngModel:'=',
					options:'=',
					config:'=',
					grid: '='
				},
				template: function (elem, attrs) {
					let gridAttribute = attrs.grid ? 'data-grid="true"' : '';
					let domainAttribute = 'data-domain="comment"';
					let readonlyAttribute = 'readonly="false"';
					let maxLengthAttribute = '';
					if (!attrs.grid){
						domainAttribute = attrs.domain ? ' data-domain="' + attrs.domain + '"': ' data-domain="comment"';
					}
					if (attrs.readonly){
						readonlyAttribute = ' readonly="true"';
					}
					if (attrs.displayMember === 'Code'){
						maxLengthAttribute = ' data-max-length="20"';
					}else if (attrs.displayMember === 'DescriptionInfo.Translated'){
						maxLengthAttribute = ' data-max-length="255"';
					}
					return '<div data-domain-control data-cssclass="grid-control" ' + gridAttribute + ' class ="fullwidth" data-ng-model="ngModel" data-entity="entity" '+ domainAttribute + ' data-config="config"  '+ maxLengthAttribute +  readonlyAttribute +' style="height: inherit"/>';
				}
			};
		}
	]);

})(angular);

