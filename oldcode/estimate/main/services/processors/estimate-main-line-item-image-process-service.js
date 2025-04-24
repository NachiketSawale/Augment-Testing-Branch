/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemImageProcessor
	 * @function
	 *
	 * @description
	 * The estimateMainLineItemImageProcessor adds images according to base line item or referenced line item.
	 */
	angular.module('estimate.main').factory('estimateMainLineItemImageProcessor', ['$translate', function ($translate) {

		let service = {};

		service.processItem = function processItem(lineItem) {
			// insert Images to resource Item according to Resource Type
			if (lineItem) {
				lineItem.image = lineItem.EstLineItemFk > 0 ? 'ico-reference-line' : 'ico-base-line';
			}
		};

		service.select = function (lineItem) {

			if (lineItem) {
				let image = 'control-icons ';
				if(lineItem.EstRuleSourceFk !== null){
					image +=lineItem.EstLineItemFk > 0 ? 'ico-reference-line-rule' : 'ico-base-line-rule';
				} else if(lineItem.HasReferenceLineItem){
					image +=lineItem.EstLineItemFk > 0 ? 'ico-reference-line' : 'ico-source-line';
				}
				else{
					image += lineItem.EstLineItemFk > 0 ? 'ico-reference-line' : 'ico-base-line';
				}
				return image;
			}
		};

		service.isCss = function () {
			return true;
		};

		service.selectTooltip = function (lineItem) {
			if (lineItem) {
				return lineItem.EstLineItemFk > 0 ? 
					$translate.instant('estimate.main.referenceLineItem') : $translate.instant('estimate.main.baseLineItem');
			}
			return '';
		};
		return service;
	}]);
})(angular);
