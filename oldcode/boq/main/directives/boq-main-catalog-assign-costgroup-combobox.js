/**
 * Created by reimer on 28.11.2019.
 */

(function (angular) {
	/* global _ */
	'use strict';

	var moduleName = 'boq.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).directive('boqMainCatalogAssignCostgroupCombobox',
		['boqMainCatalogAssignCostgroupLookupService',
			'BasicsLookupdataLookupDirectiveDefinition',
			'platformGridAPI',
			function (lookupService,
				BasicsLookupdataLookupDirectiveDefinition,
				platformGridAPI) {

				var defaults = {
					lookupType: 'boqMainCatalogAssignCostgroupLookup',   // lookupService.getlookupType(),
					valueMember: 'Id',
					displayMember: 'Code',
					width: 500,
					height: 200,
					filterKey: 'boqMainCatalogAssignCostgroupLookupFilter',
					disableDataCaching: true,
					showLicCatalogsOnly: false
				};

				var getUnifiedList = function () {

					var entities = platformGridAPI.items.data('6f378badd6724fda8a3c2b95d3068011');
					var catalogIdsExist = _.uniq(_.map(entities || [], 'BasCostgroupCatFk'));
					return lookupService.getList(defaults.projectId, defaults.addNewItem, defaults.lineItemContextId, defaults.showLicCatalogsOnly,false).then(function (data) {
						if (catalogIdsExist.length > 0) {
							return _.filter(data, function (catalogItem) {
								return catalogIdsExist.indexOf(catalogItem.Id) < 0 || catalogItem.Id === 0;
							});
						} else {
							return data;
						}
					});
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

					dataProvider: {

						getList: function () {
							return getUnifiedList();
						},

						getItemByKey: function (value) {
							var projectId = _.isNumber(defaults.projectId) && defaults.projectId > 0 ? defaults.projectId : lookupService.getSelectedProjectId();
							return lookupService.getItemByKeyAsync(projectId, value);
						},

						getSearchList: function () {
							return getUnifiedList();
						}

					},

					controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.

						// region module vars
						defaults.projectId = $scope.lookupOptions.projectId;
						// defaults.addNewItem = $scope.lookupOptions.addNewItem;
						defaults.addNewItem = $scope.lookupOptions.addNewItem && $scope.entity.BoqCatalogFk === 15;
						defaults.showLicCatalogsOnly = $scope.lookupOptions.showLicCatalogsOnly;
						defaults.lineItemContextId = $scope.lookupOptions.lineItemContextId;

						$scope.lookupOptions.onDataRefresh = function (/* scope */) {
							return lookupService.refresh(defaults.projectId, defaults.lineItemContextId, defaults.showLicCatalogsOnly);
						};

					}]

				});

				// return directive;

			}
		]);
})(angular);
