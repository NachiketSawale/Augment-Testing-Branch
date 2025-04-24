/**
 * Created by janas on 28.06.2019.
 */


(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module(moduleName);

	controllingStructureModule.factory('controllingStructureChangeCompanyWizardService',
		['_', '$http', '$translate', 'platformTranslateService', 'platformModalFormConfigService', 'platformSidebarWizardCommonTasksService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'controllingStructureMainService', 'controllingStructureContextService',
			function (_, $http, $translate, platformTranslateService, platformModalFormConfigService, platformSidebarWizardCommonTasksService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, controllingStructureMainService, controllingStructureContextService) {

				var curCompany = controllingStructureContextService.getCompany();

				var filters = [{
					// make sure only companies with same project context (like login company) are displayed
					key: 'controlling-structure-change-company-filter',
					fn: function (item /* , entity */) {
						return (item && item.IsLive && curCompany && curCompany.ProjectContextFk === item.ProjectContextFk);
					}
				}];

				var service = {
					showChangeCompanyWizard: function showChangeCompanyWizard() {
						var selectedControllingUnits = controllingStructureMainService.getSelectedEntities(),
							title = 'controlling.structure.changeCompanyWizardTitle',
							msg = $translate.instant('controlling.structure.noCurrentCUnitSelection');

						// process if only one controlling unit is selected
						if (_.size(selectedControllingUnits) === 1) {

							basicsLookupdataLookupFilterService.registerFilter(filters);

							var selectedControllingUnit = _.first(selectedControllingUnits);
							var modalDialogConfig = {
								title: $translate.instant(title),
								dataItem: {CompanyId: selectedControllingUnit.CompanyFk},
								formConfiguration: {
									fid: 'controlling.structure.changeCompanyWizardDialog',
									version: '0.1.0',
									showGrouping: false,
									groups: [{
										gid: 'baseGroup',
										attributes: ['CompanyId']
									}],
									rows: [
										basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
											dataServiceName: 'controllingStructureCompanyLookupDataService', // TODO: service will be moved to basics part; + make sure same project context!
											filterKey: 'controlling-structure-change-company-filter',
											filter: function (/* item */) {
												return {
													depth: 10,
													includeStart: true
												};
											},
											cacheEnable: true,
											additionalColumns: false,
											showClearButton: false
										},
										{
											required: true,
											gid: 'baseGroup',
											rid: 'companyId',
											label: 'Company',
											label$tr$: 'cloud.common.entityCompany',
											type: 'lookup',
											model: 'CompanyId',
											sortOrder: 1
										})
									]
								},
								handleOK: function handleOK(result) {
									if (_.has(result, 'data.CompanyId')) {
										controllingStructureMainService.changeCompany(_.get(result, 'data.CompanyId'), selectedControllingUnit);
									}
									basicsLookupdataLookupFilterService.unregisterFilter(filters);
								},
								handleCancel: function handleCancel() {
									basicsLookupdataLookupFilterService.unregisterFilter(filters);
								}
							};

							platformTranslateService.translateFormConfig(modalDialogConfig.formConfiguration);
							platformModalFormConfigService.showDialog(modalDialogConfig);
						} else {
							platformSidebarWizardCommonTasksService.showErrorNoSelection(title, msg);
						}
					}
				};
				return service;
			}
		]);
})();
