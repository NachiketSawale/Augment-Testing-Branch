(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklisttemplate';

	/* jshint -W072 */
	angular.module(moduleName).factory('hsqeCheckListTemplateHeaderService',
		['$injector', 'globals', '_', 'platformDataServiceFactory',
			'basicsLookupdataLookupDescriptorService',
			'basicsLookupdataLookupFilterService',
			'hsqeCheckListGroupService',
			'hsqeCheckListGroupFilterService',
			'cloudDesktopSidebarService',
			function ($injector, globals, _, platformDataServiceFactory,
				basicsLookupdataLookupDescriptorService,
				basicsLookupdataLookupFilterService,
				hsqeCheckListGroupService, hsqeCheckListGroupFilterService, cloudDesktopSidebarService) {

				var service;
				var sidebarSearchOptions = {
					moduleName: moduleName,
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: null,
					showOptions: false,
					showProjectContext: false,
					pinningOptions: {
						isActive: true,
						showPinningContext: [{token: 'project.main', show: true}, {token: 'model.main', show: true}],
						setContextCallback: function (prjService) {
							cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'PrjProjectFk');
						}
					},
					withExecutionHints: false
				};

				var serviceOption = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'hsqeCheckListTemplateHeaderService',
						httpRead: {
							route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/',
							usePostForRead: true,
							endRead: 'listbyfilter',
							extendSearchFilter: function (filterRequest) {
								service.filterRequest = filterRequest;
								var selGroup = hsqeCheckListGroupService.getIfSelectedIdElse(-1);
								if (selGroup < 0 || hsqeCheckListGroupService.isSelectRow === false) {
									hsqeCheckListGroupService.load();
								}
								var items = hsqeCheckListGroupFilterService.getFilter();
								filterRequest.furtherFilters = _.map(items, function (value) {
									return {
										Token: 'CheckListGROUP',
										Value: value
									};
								});
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/',
							usePostForRead: true,
							endCreate: 'createdto'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/',
							endUpdate: 'update'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/',
							usePostForRead: true,
							endDelete: 'deletedto'
						},
						entityRole: {
							root: {
								itemName: 'ChkListTemplates',
								moduleName: 'cloud.desktop.moduleDisplayNameCheckListTemplate',
								codeField: 'Code',
								descField: 'DescriptionInfo.Translated',
								addToLastObject: true,
								lastObjectModuleName: moduleName
							}
						},
						presenter: {
							list: {
								initCreationData: function (creationData) {
									creationData.HsqCheckListGroupFk = hsqeCheckListGroupService.getIfSelectedIdElse(-1);
								},
								incorporateDataRead: incorporateDataRead
							}
						},
						sidebarSearch: {
							options: sidebarSearchOptions
						},
						sidebarWatchList: {active: true},
						entitySelection: {supportsMultiSelection: true},
						translation: {
							uid: 'hsqeCheckListTemplateHeaderService',
							title: 'hsqe.checklisttemplate.headerGridContainerTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;

				function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData || {});
					var result = {
						FilterResult: readData.FilterResult,
						dtos: readData.Main || []
					};
					hsqeCheckListGroupService.isSelectRow = false;
					return serviceContainer.data.handleReadSucceeded(result, data);
				}


				var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
				confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer);

				var filters = [{
					key: 'rubriccategorytrv-for-checklist-template-filter',
					serverSide: true,
					fn: function () {
						return 'RubricFk = ' + $injector.get('hsqeCheckListDataService').checkListRubricFk;
					}
				}];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				serviceContainer.data.newEntityValidator = {
					validate: function validate(newItem) {
						var validationService = $injector.get('hsqeCheckListTemplateValidationService');
						validationService.validateCode(newItem, newItem.Code, 'Code');
						validationService.validateHsqCheckListGroupFk(newItem, newItem.HsqCheckListGroupFk, 'HsqCheckListGroupFk');
					}
				};

				return service;
			}
		]);
})(angular);
