/**
 * Created by wri on 5/9/2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
     * @ngdoc directive
     * @name estimateMainConfigType
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description
     */
	angular.module('estimate.main').directive('estimateMainConfigType', [
		'BasicsLookupdataLookupDirectiveDefinition','estimateMainEstConfigTypeService',
		function (BasicsLookupdataLookupDirectiveDefinition, estimateMainEstConfigTypeService) {

			let defaults = {
				lookupType: 'estconfigtype',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid : '86f580ae469e4f14bf0361d6f26863d4',
				onDataRefresh: function ($scope) {
					estimateMainEstConfigTypeService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainEstConfigTypeService'
			});
		}]);
})();
