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
	angular.module('estimate.main').directive('estimateMainTotalsConfigStructureType', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			let defaults = {
				lookupType: 'esttotalsconfigstructuretype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : 'dd401af49a5c4df0927d5287453d3461'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainTotalsConfigStructureTypeService'
			});
		}]);
})();
