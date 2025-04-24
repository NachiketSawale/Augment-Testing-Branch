/**
 @ngdoc controller
 * @name cloudSettingsDialogController
 * @function
 *
 * @description
 * Controller for the Document Properties Structure Details view.
 */

(function () {
	'use strict';

	var moduleName = 'basics.material';

	// jshint -W072
	// jshint +W098
	angular.module(moduleName).controller('basicsMaterialReportsController',
		['$scope', 'cloudDesktopSidebarService', 'platformModalService', 'reportingPlatformService', 'platformTranslateService', 'platformContextService', 'basicsMaterialMaterialCatalogService', 'basicsMaterialMaterialGroupsService',
			function ($scope, cloudDesktopSidebarService, platformModalService, reportingPlatformService, platformTranslateService, platformContextService, basicsMaterialMaterialCatalogService, basicsMaterialMaterialGroupsService) {

				function startMaterialReport() {
					var currentCatalog = basicsMaterialMaterialCatalogService.getSelected();
					var currentGroup = basicsMaterialMaterialGroupsService.getSelected();

					if (currentCatalog === null || currentGroup === null) {
						return;
					}

					var report = {
						Name: 'Material Master Data',
						TemplateName: 'MaterailMasterData.frx',
						Path: 'system\\FastReport\\Material'
					};

					var params = [
						{
							Name: 'CompanyID',
							ParamValue: platformContextService.getContext().clientId
						},
						{
							Name: 'MatCatalogID',
							ParamValue: currentCatalog.Id
						},
						{
							Name: 'MatGroupID',
							ParamValue: currentGroup.Id
						}
					];

					reportingPlatformService.prepare(report, params).then(reportingPlatformService.show);
				}

				var reportsList = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [
						{
							id: 1,
							text: 'Material',
							text$tr$: 'basics.material.moduleName',
							groupIconClass: 'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								{
									id: 11,
									text: 'Material Records',
									text$tr$: 'basics.material.record.gridViewTitle',
									type: 'item',
									showItem: true,
									fn: startMaterialReport
								}
							]
						}
					]
				};

				$scope.sidebarOptions = {
					name: cloudDesktopSidebarService.getSidebarIds().reports,
					title: 'Reports',
					reports: reportsList,
					showItemFunction: showItemFunction
				};

				function showItemFunction(id) {
					var itemById;
					//get group-element in list
					for(var i=0; i < reportsList.items.length; i++) {
						//get list-Element from found group-element
						itemById = _.find(reportsList.items[i].subitems, {id: id});
						//Execute function
						if(itemById) {
							itemById.fn();
							break;
						}
					}
				}

				var loadTranslations = function () {
					platformTranslateService.translateObject(reportsList, ['text']);
				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('cloud.desktop')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				// un-register on destroy
				$scope.$on('$destroy', function () {
					//platformTranslateService.translationChanged.unregister(loadTranslations);
				});

			}]);
})();