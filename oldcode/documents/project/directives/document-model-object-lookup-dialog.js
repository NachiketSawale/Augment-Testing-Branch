/**
 * Created by alm on 27.8.2026.
 */
(function (angular) {
	'use strict';
	/* global globals, _ */
	angular.module('basics.lookupdata').factory('documentModelMainObjectLookupDataService', [
		'platformLookupDataServiceFactory',
		function (platformLookupDataServiceFactory) {
			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'model/main/object/', endPointRead: 'list'},
				filterParam: 'mainItemID'
			};
			var container = platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig);
			var service = container.service;
			return service;
		}
	]);

	/**
     * @ngdoc directive
     * @name documentModelObjectLookupDialog
     * @requires  documentModelObjectLookupDialog
     * @description lookup dialog to search model objects
     */
	angular.module('documents.project').directive('documentModelObjectLookupDialog', ['$q', '$http', 'BasicsLookupdataLookupDirectiveDefinition', 'documentModelMainObjectLookupDataService',
		function ($q, $http, BasicsLookupdataLookupDirectiveDefinition, documentModelMainObjectLookupDataService) {
			var defaults = {
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: '033476b51b9b48909e616b9df417bc77',
				columns: [
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						width: 120,
						toolTip: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'meshid',
						field: 'MeshId',
						name: 'MeshId',
						width: 100,
						toolTip: 'MeshId',
						formatter: 'integer',
						name$tr$: 'model.main.objectMeshId'
					},
					{
						id: 'cpiid',
						field: 'CpiId',
						name: 'CpiId',
						width: 100,
						toolTip: 'CpiId',
						formatter: 'description',
						name$tr$: 'model.main.objectCpiId'
					}
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
				controller: ['$scope', function ($scope) {
					if (null !== $scope.entity) {
						var modelId = $scope.entity.MdlModelFk || -1;
						documentModelMainObjectLookupDataService.setFilter(modelId);
					}
				}],
				dataProvider: {
					myUniqueIdentifier: 'DocumentMainModelObjectLookupDataHandler',
					getList: function () {
						return documentModelMainObjectLookupDataService.getList({});
					},

					getItemByKey: function (value, options) {
						return documentModelMainObjectLookupDataService.getItemById(value, options);
					},

					getDisplayItem: function (value) {
						return documentModelMainObjectLookupDataService.getItemByIdAsync(value);
					},
					getSearchList: function (value) {
						var items = [];
						return documentModelMainObjectLookupDataService.getList({}).then(function (result) {
							if (result && result.length) {
								items = _.filter(result, function (item) {
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
