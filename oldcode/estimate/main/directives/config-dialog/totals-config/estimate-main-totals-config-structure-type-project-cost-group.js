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
	angular.module('estimate.main').directive('estimateMainTotalsConfigStructureTypeProjectCostGroup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'esttotalsconfigstructuretypeprojectcostgroup',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : 'ae4027f9ae854dfa8c90d86d8a076a56'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainTotalsConfigStructureTypeServiceCostGroup'
			});
		}]);
})();
