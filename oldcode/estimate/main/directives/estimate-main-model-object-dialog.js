/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/**
	 * @ngdoc directive
	 * @name estimateMainModelObjectDialog
	 * @requires  modelMainObjectLookupDataService
	 * @description lookup dialog to search model objects
	 */
	angular.module('estimate.main').directive('estimateMainModelObjectDialog',['_', '$q', '$http', 'BasicsLookupdataLookupDirectiveDefinition', 'modelMainObjectLookupDataService',
		function (_, $q, $http, BasicsLookupdataLookupDirectiveDefinition, modelMainObjectLookupDataService) {
			let defaults = {
				lookupType: 'modelObjects',
				valueMember: 'Id',
				displayMember: 'Description',
				// isClientSearch: true,
				// isExactSearch: true,
				uuid: '033476b51b9b48909e616b9df417bc77',
				columns:[
					{ id: 'desc', field: 'Description', name: 'Description', width: 120, toolTip: 'Description', formatter: 'description', name$tr$: 'cloud.common.entityDescription'},
					{ id: 'meshid', field: 'MeshId', name: 'MeshId', width:100, toolTip: 'MeshId', formatter: 'integer', name$tr$: 'model.main.objectMeshId'},
					{ id: 'cpiid', field: 'CpiId', name: 'CpiId', width:100, toolTip: 'CpiId', formatter: 'description', name$tr$: 'model.main.objectCpiId'}
				],
				title: {
					name: 'Model Objects',
					name$tr$: 'estimate.main.modelObjects'
				},
				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					return searchValue;
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'EstimateMainModelObjectLookupDataHandler',

					getList: function () {
						return modelMainObjectLookupDataService.getList({lookupType: 'modelObjects'});
					},

					getItemByKey: function (value) {
						return modelMainObjectLookupDataService.getItemById(value,defaults);
					},

					getDisplayItem: function (value) {
						return modelMainObjectLookupDataService.getItemByIdAsync(value,defaults);
					},

					getSearchList: function (value) {
						let items = [];
						return modelMainObjectLookupDataService.getList({lookupType: 'modelObjects'}).then(function(result){
							if(result && result.length){
								items = _.filter(result, function (item){
									return _.includes(item.Description.toString().toUpperCase(), value.toUpperCase());
								});
								return items;
							}
						});
					}
				}
			});
		}]);
})(angular);
