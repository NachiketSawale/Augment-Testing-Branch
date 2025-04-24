/**
 * Created by mov on 1/16/2020
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
     * @ngdoc directive
     * @name estimateMainTotalsConfigType
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description
     */
	angular.module('estimate.main').directive('estimateMainTotalsConfigStructureTypeEnterpriseCostGroup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'esttotalsconfigstructuretypeenterprisecostgroup',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : '6c67287e6d9548219e820ac5f7bcf7a8'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainTotalsConfigStructureTypeServiceCostGroup'
			});
		}]);
})();
