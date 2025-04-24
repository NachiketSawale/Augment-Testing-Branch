/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainMaterialLookupDataService', ['$q','basicsLookupdataLookupDescriptorService',
		function ($q, basicsLookupdataLookupDescriptorService) {
			return {
				getItemByIdAsync: function(id) {
					let MaterialRootItem,
						MaterialItem = basicsLookupdataLookupDescriptorService.getLookupItem('MaterialRecord', id);

					if (MaterialItem !== null) {
						MaterialRootItem = basicsLookupdataLookupDescriptorService.getLookupItem('MaterialRecord', MaterialItem.Code);
					}

					return $q.when(MaterialRootItem);
				},

				getList : function(){
					return null;
				},

				getItemByKey : function(id){
					let MaterialRootItem,
						MaterialItem = basicsLookupdataLookupDescriptorService.getLookupItem('MaterialRecord', id);

					if (MaterialItem !== null) {
						MaterialRootItem = basicsLookupdataLookupDescriptorService.getLookupItem('MaterialRecord', MaterialItem.Code);
					}

					return $q.when(MaterialRootItem);
				}
			};
		}]);
})(angular);
