/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainHeaderLookup
	 * @requires estimateMainHeaderLookup
	 * @description
	 */
	angular.module(moduleName).directive('estimateMainHeaderLookup', ['$q', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainService',

		function ($q, BasicsLookupdataLookupDirectiveDefinition, estimateMainService) {
			let defaults = {
				lookupType: 'EstHeaders',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'B59CC74C8B55490E9E5D9E80DA10B32F',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function(){
						let deferred = $q.defer();
						let estHeader = estimateMainService.getSelectedEstHeaderItem();
						let list = [];
						list.push(estHeader);
						deferred.resolve(list);
						return deferred.promise;
					},
					getItemByKey: function () {
						let deferred = $q.defer();
						let estHeader = estimateMainService.getSelectedEstHeaderItem();
						deferred.resolve(estHeader);
						return deferred.promise;
					}
				}
			});
		}]);

})(angular);
