(function () {
	/* global globals */
	'use strict';

	var angularModule = angular.module('boq.main');

	angularModule.factory('boqMainProjectChangeService', ['basicsCommonChangeStatusService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataSimpleLookupService', 'projectChangeLookupDataService', 'cloudCommonGridService', 'platformDialogService', '_', 'boqMainProjectChangeStatusLookupDataService',
		function(basicsCommonChangeStatusService, basicsLookupdataConfigGenerator, basicsLookupdataSimpleLookupService, projectChangeLookupDataService, cloudCommonGridService, platformDialogService, _, boqMainProjectChangeStatusLookupDataService) {
			var service = {};

			service.propertyChanged = function(boqMainService, changedBoqItem, propertyName) {
				var flatBoqItemChildren = [];
				if (propertyName === 'PrjChangeFk') {
					changedBoqItem.PrjChangeStatusFk = null;
					changedBoqItem.PrjChangeStatusFactorByReason = 0;
					changedBoqItem.PrjChangeStatusFactorByAmount = 0;

					// Sets the default of 'changedBoqItem.PrjChangeStatusFk' and cleans the children
					if (changedBoqItem.PrjChangeFk) {
						projectChangeLookupDataService.setFilter(boqMainService.getSelectedProjectId());
						projectChangeLookupDataService.getItemByIdAsync(changedBoqItem.PrjChangeFk, {dataServiceName:'projectChangeLookupDataService'}).then(function(projectChange) {
							if (projectChange) {
								changedBoqItem.PrjChangeStatusFk = projectChange.ChangeStatusFk;
								cloudCommonGridService.flatten([changedBoqItem], flatBoqItemChildren, 'BoqItems');
								var prjChange = _.filter(flatBoqItemChildren, function(boqItem) { return boqItem!==changedBoqItem && boqItem.PrjChangeFk; });
								if(prjChange.length > 0)
								{
									platformDialogService.showYesNoDialog('boq.main.projectChangeText', 'boq.main.information').then(function (result) {
										if (result.no) {
											_.forEach(_.filter(flatBoqItemChildren, function(boqItem) { return boqItem!==changedBoqItem && boqItem.PrjChangeFk; }), function(childBoqItem) {
												childBoqItem.PrjChangeFk       = null;
												childBoqItem.PrjChangeStatusFk = null;
												childBoqItem.PrjChangeStatusFactorByReason = 0;
												childBoqItem.PrjChangeStatusFactorByAmount = 0;
												boqMainService.markItemAsModified(  childBoqItem);
												boqMainService.updateReadonlyStatus(childBoqItem);
											});
											boqMainService.gridRefresh();
										}
									}); 
								}
							}
						});
					}
				}
			};

			service.getServerSideFilterKeyForProjectChanges = function getServerSideFilterKeyForProjectChanges(boqMainService) {
				var moduleName = boqMainService.getModuleName();

				if (moduleName.startsWith('sales.'))
				{
					return 'sales-bid-project-change-common-filter';
				}
				if (moduleName.startsWith('procurement.'))
				{
					return 'procurement-project-change-common-filter';
				}

				return 'sales-common-project-change-common-filter';
			};

			service.getPrjChangeConfig = function() {
				const lookupOptions = { filterKey: 'boq-main-project-change-common-filter', showAddButton: false };
				return {
					'detail': {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'project-change-dialog',
							descriptionMember: 'Description',
							'lookupOptions': lookupOptions
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: { directive: 'project-change-dialog', 'lookupOptions': lookupOptions },
						formatter: 'lookup',
						formatterOptions: { lookupType: 'projectchange', displayMember: 'Code' }
					}
				};
			};

			service.getPrjChangeStatusConfig = function() {
				var ret = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectchangestatus', 'Description', {
					showIcon: true,
					imageSelectorService: 'platformStatusIconService',
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					field: 'RubricCategoryFk'
				});
				ret.readonly = true;
				return ret;
			};

			service.changeProjectChangeStatus = function(moduleMainService, boqMainService) {
				return basicsCommonChangeStatusService.provideStatusChangeInstance({
					statusName: 'changeboqitemprojectchangestatus',
					mainService: moduleMainService,
					getDataService: function() {
						return {
							getSelected: function() {
								return boqMainService.getSelected();
							},
							gridRefresh: function() {
								boqMainService.gridRefresh();
							}
						};
					},
					isSimpleStatus: true,
					statusField: 'PrjChangeStatusFk',
					statusDisplayField: 'DescriptionInfo.Description',
					title: 'boq.main.wizardChangeProjectChangeStatus',
					updateUrl: 'boq/main/changeprojectchangestatus',
					statusProvider: function() {
						var currentBoqItem = boqMainService.getSelected();
						projectChangeLookupDataService.setFilter(boqMainService.getSelectedProjectId());
						return projectChangeLookupDataService.getItemByIdAsync(currentBoqItem.PrjChangeFk, {dataServiceName:'projectChangeLookupDataService'}).then(function(projectChange) {
							return boqMainProjectChangeStatusLookupDataService.getList({
								lookupType: 'boqMainProjectChangeStatusLookupDataService'
							}).then(function (respond) {
								var statuses = _.filter(respond, function (item) {
									return item.RubricCategoryFk === projectChange.RubricCategoryFk;
								});
								if(_.isNil(statuses) || statuses.length === 0){
									platformDialogService.showInfoBox('basics.common.noStatusOfChosenPrjChange');
								}
								return statuses;
							});
						});
					}
				});
			};

			return service;
		}
	]);

	angularModule.factory('boqMainProjectChangeStatusLookupDataService', [
		'_', '$q', '$injector', 'platformLookupDataServiceFactory',
		function (_, $q, $injector, platformLookupDataServiceFactory) {
			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'boq/main/',
					endPointRead: 'getProjectChangeStatuses'
				},
				filterParam: 'projectId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);

})();
