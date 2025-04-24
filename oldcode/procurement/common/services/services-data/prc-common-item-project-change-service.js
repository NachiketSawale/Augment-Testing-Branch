(function () {
	/* global globals _ */
	'use strict';
	var moduleName = 'procurement.common';
	var angularModule = angular.module(moduleName);

	angularModule.factory('procurementItemProjectChangeService', ['basicsCommonChangeStatusService', 'basicsLookupdataConfigGenerator',  'basicsLookupdataLookupFilterService','basicsLookupdataLookupDescriptorService',
		'basicsLookupdataSimpleLookupService', 'platformDialogService','procurementContextService',
		function(basicsCommonChangeStatusService, basicsLookupdataConfigGenerator,  basicsLookupdataLookupFilterService,lookupDescriptorService,basicsLookupdataSimpleLookupService, platformDialogService,procurementContextService) {
			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'procurement-project-change-common-filter',
					serverSide: true,
					serverKey: 'procurement-project-change-common-filter',
					fn: function (item) {
						var projectFk = item.ProjectFk;
						if(projectFk === null || projectFk === undefined){
							var mainService =  procurementContextService.getLeadingService();
							if(mainService){
								var parentEntity = mainService.getSelected();
								if(parentEntity){
									projectFk = parentEntity.ProjectFk;
								}
							}
						}
						if(projectFk === undefined){
							projectFk = null;
						}
						return { ProjectFk: projectFk };
					}
				}
			]);

			function createService(moduleMainService, itemService){
				var service = {};

				service.UpdateChangedInfo = function(item){
					item.PrjChangeStatusFk = null;
					if (item.PrjChangeFk) {
						lookupDescriptorService.loadItemByKey('projectchange',item.PrjChangeFk).then(function(projectChange) {
							if (projectChange) {
								item.PrjChangeStatusFk = projectChange.ChangeStatusFk;
								itemService.markItemAsModified(item);
								itemService.gridRefresh();
							}
						});
					}else{
						itemService.markItemAsModified(item);
					}
				};

				service.changeProjectChangeStatus = function(statusName) {
					if(_.isNil(statusName)){
						statusName = 'prcitemprojectchange';
					}
					return basicsCommonChangeStatusService.provideStatusChangeInstance({
						statusName: statusName,
						mainService: moduleMainService,
						getDataService: function() {
							return {
								getSelected: function() {
									return itemService.getSelected();
								},
								gridRefresh: function() {
									itemService.gridRefresh();
								},
								refreshFunction:function() {
									return moduleMainService.refreshSelectedEntities ? moduleMainService.refreshSelectedEntities : moduleMainService.refresh;
								}

							};
						},
						isSimpleStatus: true,
						statusField: 'PrjChangeStatusFk',
						statusDisplayField: 'Description',
						title: 'boq.main.wizardChangeProjectChangeStatus',
						statusProvider: function() {
							var currentItem = itemService.getSelected();
							return lookupDescriptorService.loadItemByKey('projectchange',currentItem.PrjChangeFk).then(function(projectChange) {
								return basicsLookupdataSimpleLookupService.getList({
									valueMember: 'Id',
									displayMember: 'Description',
									lookupModuleQualifier: 'basics.customize.projectchangestatus',
									filter: {
										field: 'RubricCategoryFk',
										customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
									}
								}).then(function (respond) {
									var statues = _.filter(respond, function (item) {
										return item.RubricCategoryFk === projectChange.RubricCategoryFk && item.isLive === true;
									});
									if(_.isNil(statues) || statues.length === 0){
										platformDialogService.showInfoBox('basics.common.noStatusOfChosenPrjChange');
									}
									return statues;
								});
							});
						},
						customValidate: function (entities){
							var inValidIndex=_.findIndex(entities,function(item){
								return item.PrjChangeFk === null;
							});
							if(inValidIndex >= 0)
							{
								platformDialogService.showInfoBox('basics.common.noProjectChangeAssigned');
								return false;
							}
							else
							{
								return true;
							}
						}
					});
				};

				return service;
			}

			function getPrjChangeConfig() {
				const lookupOptions = { filterKey: 'procurement-project-change-common-filter', showAddButton: false };
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
			}

			function getPrjChangeStatusConfig() {
				var ret = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectchangestatus', 'Description', {
					showIcon: true,
					imageSelectorService: 'platformStatusIconService',
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					field: 'RubricCategoryFk'
				});
				ret.readonly = true;
				return ret;
			}
			return {
				getService: createService,
				getPrjChangeConfig: getPrjChangeConfig,
				getPrjChangeStatusConfig:getPrjChangeStatusConfig
			};
		}
	]);

})();
