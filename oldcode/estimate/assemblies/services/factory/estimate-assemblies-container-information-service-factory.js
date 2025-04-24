/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global _ */
	let estimateAssembliesModule = angular.module('estimate.assemblies');

	/**
	 * @ngdoc service
	 * @name estimateAssembliesContainerInformationService
	 * @function
	 * @description
	 */
	estimateAssembliesModule.factory('estimateAssembliesContainerInformationServiceFactory', ['$injector',
		function ($injector) {

			let service = {};

			/* jshint -W074 */ // ignore cyclomatic complexity warning
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid, isProject, options) {
				let isPlantAssembly = options && options.isPlantAssembly;
				let isPrjPlantAssembly = options && options.isPrjPlantAssembly;
				let config = {};
				let estimateDefaultGridConfig = $injector.get('estimateDefaultGridConfig');
				let commonService = $injector.get('estimateMainCommonService');
				let layServ = null;
				let assemblyConfigExtendServiceName = options ? options.assemblyConfigExtendServiceName : null,
					assemblyResourceDataServiceName = options ? options.assemblyResourceDataServiceName : null,
					assemblyDataServiceName = options ? options.assemblyDataServiceName : null,
					assemblyValidationServiceName = options ? options.assemblyValidationServiceName : null,
					assemblyResourceDynamicConfigServiceName = options ? options.assemblyResourceDynamicConfigServiceName : null,
					assemblyResourceValidationServiceName = options ? options.assemblyResourceValidationServiceName : null;
				switch (guid) {
					case '234BB8C70FD9411299832DCCE38ED118': // estimateAssembliesAssembliesListController
					case '51f9aff42521497898d64673050588f4':
					case '02580d5adb6b48429302166d9e9ac8c6':
						layServ = isProject ? $injector.get('projectAssembliesConfigurationExtendService') : isPlantAssembly && !_.isEmpty(assemblyConfigExtendServiceName) ? $injector.get(assemblyConfigExtendServiceName) : $injector.get('estimateAssembliesConfigurationExtendService');
						// eslint-disable-next-line no-case-declarations
						let resourceService = isProject ? $injector.get('projectAssemblyResourceService') : isPlantAssembly && !_.isEmpty(assemblyResourceDataServiceName) ? $injector.get(assemblyResourceDataServiceName) : $injector.get('estimateAssembliesResourceService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';

						config.standardConfigurationService = isProject ? 'projectAssembliesConfigurationExtendService' : isPlantAssembly && !_.isEmpty(assemblyConfigExtendServiceName) ? assemblyConfigExtendServiceName : 'estimateAssembliesConfigurationExtendService';
						config.dataServiceName = isProject ? 'projectAssemblyMainService' : isPlantAssembly && !_.isEmpty(assemblyDataServiceName) ? assemblyDataServiceName : 'estimateAssembliesService';
						config.validationServiceName = isProject ? 'projectAssemblyValidationService' : isPlantAssembly && !_.isEmpty(assemblyValidationServiceName) ? assemblyValidationServiceName : 'estimateAssembliesValidationService';

						config.listConfig = angular.extend({
							type: 'assemblies',
							dragDropService: isProject ? undefined : $injector.get('estimateAssembliesClipboardService'),
							cellChangeCallBack: function cellChangeCallBack(arg) {
								if (isProject) {
									$injector.get('projectAssemblyMainService').onCellChange(arg, resourceService, commonService);
								} else if (isPlantAssembly && !_.isEmpty(assemblyDataServiceName)) {
									$injector.get(assemblyDataServiceName).onCellChange(arg, resourceService, commonService);
								} else {
									$injector.get('estimateAssembliesService').onCellChange(arg, resourceService, commonService);
								}
							},
							rowChangeCallBack: function rowChangeCallBack() {

								// get and set resource characteristics
								let resCharsDynamicService = isProject ? $injector.get('projectAssemblyResourceDynamicConfigurationService') : isPlantAssembly && !_.isEmpty(assemblyResourceDynamicConfigServiceName) ? $injector.get(assemblyResourceDynamicConfigServiceName) : $injector.get('estimateAssembliesResourceDynamicConfigurationService');
								if (isProject) {
									resCharsDynamicService.detachData('20c0401F80e546e1bf12b97c69949f5b'); // Project Assembly Resources container GUID
								} else if (isPlantAssembly) {
									resCharsDynamicService.detachData('eaa7ef996ed54b3b80f5535354ed1081'); // Plant Master Assembly Resources container GUID
								} else {
									resCharsDynamicService.detachData('a32ce3f29bd446e097bc818f71b1263d'); // Assembly Resources container GUID
								}
							}
						}, estimateDefaultGridConfig);
						if (guid === '234BB8C70FD9411299832DCCE38ED118' || guid === '51f9aff42521497898d64673050588f4') {
							config.listConfig.bulkEditorSettings = {
								serverSideBulkProcessing: true,
								skipEntitiesToProcess: false
							};
						}
						break;
					case 'b5c6ff9eab304beba4335d30700773da': // estimateAssembliesAssembliesDetailController
						layServ = $injector.get('estimateAssembliesConfigurationExtendService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'estimateAssembliesConfigurationExtendService';
						config.dataServiceName = 'estimateAssembliesService';
						config.validationServiceName = 'estimateAssembliesValidationService';
						break;
					case 'A32CE3F29BD446E097BC818F71B1263D': // estimateAssembliesAssemblyResourcesTreeController
					case  '20c0401F80e546e1bf12b97c69949f5b':
					case 'eaa7ef996ed54b3b80f5535354ed1081':
					case 'bedc9497ca84537ae6c8cabbb0b8faeb': // plantassemblyresourcecontroller
						layServ = isProject ? $injector.get('projectAssemblyResourceDynamicConfigurationService') : (isPlantAssembly || isPrjPlantAssembly) && !_.isEmpty(assemblyResourceDynamicConfigServiceName) ? $injector.get(assemblyResourceDynamicConfigServiceName) :
							$injector.get('estimateAssembliesResourceDynamicConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = isProject ? 'projectAssemblyResourceDynamicConfigurationService' : (isPlantAssembly || isPrjPlantAssembly) && !_.isEmpty(assemblyResourceDynamicConfigServiceName) ? assemblyResourceDynamicConfigServiceName : 'estimateAssembliesResourceDynamicConfigurationService';
						config.dataServiceName = isProject ? 'projectAssemblyResourceService' : (isPlantAssembly || isPrjPlantAssembly) && !_.isEmpty(assemblyResourceDataServiceName) ? assemblyResourceDataServiceName : 'estimateAssembliesResourceService';
						config.validationServiceName = isProject ? 'projectAssemblyResourceValidationService' : (isPlantAssembly || isPrjPlantAssembly) && !_.isEmpty(assemblyResourceValidationServiceName) ? assemblyResourceValidationServiceName : 'estimateAssembliesResourceValidationService';
						config.listConfig = angular.extend({
							/* enter specific options here */
							parentProp: 'EstResourceFk',
							childProp: 'EstResources',
							childSort: true,
							type: 'estResources',
							dragDropService: isProject || isPlantAssembly || isPrjPlantAssembly ? undefined : $injector.get('estimateAssembliesResourcesClipboardService'),
							cellChangeCallBack: function cellChangeCallBack(arg /* , buttons */) {
								let field = arg.grid.getColumns()[arg.cell].field;
								let argData = {item: arg.item, field: field, colName: field};
								if (isProject) {
									if (field !== 'Code') {
										$injector.get('projectAssemblyResourceService').estimateAssemblyResources(argData);
									}
								} else if ((isPlantAssembly || isPrjPlantAssembly) && !_.isEmpty(assemblyResourceDataServiceName)) {
									$injector.get(assemblyResourceDataServiceName).estimateAssemblyResources(argData);
								} else {
									if (field !== 'Code') {
										$injector.get('estimateAssembliesResourceService').estimateAssemblyResources(argData);
									}
								}
							},
							rowChangeCallBack: function rowChangeCallBack() {
								commonService.resetLookupItem();
								if (isProject) {
									$injector.get('estimateMainReplaceResourceUIService').setResourceDataServcie($injector.get('projectAssemblyResourceService'));
								} else if (isPlantAssembly && !_.isEmpty(assemblyResourceDataServiceName)) {
									$injector.get('estimateMainReplaceResourceUIService').setResourceDataServcie($injector.get(assemblyResourceDataServiceName));
								} else {
									$injector.get('estimateMainReplaceResourceUIService').setResourceDataServcie($injector.get('estimateAssembliesResourceService'));
								}
							}
						}, estimateDefaultGridConfig);
						if (isProject) {
							config.listConfig.bulkEditorSettings = {
								serverSideBulkProcessing: false,
								skipEntitiesToProcess: true
							};
						}
						break;
					case '8eb36f285d154864bba7da0574973c94': // estimateAssembliesAssemblyResourcesDetailController
						layServ = $injector.get('estimateAssembliesResourceDynamicConfigurationService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'estimateAssembliesResourceDynamicConfigurationService';
						config.dataServiceName = 'estimateAssembliesResourceService';
						config.validationServiceName = 'estimateAssembliesResourceValidationService';
						break;
					case '4DCC2EC321AF4a6297FED83EEACF9F38': // estimateAssembliesWicItemListController
						layServ = $injector.get('estimateAssembliesWicItemUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'estimateAssembliesWicItemUIStandardService';
						config.dataServiceName = 'estimateAssembliesWicItemService';
						config.validationServiceName = 'estimateAssembliesWicItemValidationService';
						config.listConfig = angular.extend({}, estimateDefaultGridConfig);
						break;
					case 'd0cd8c0b6d68486d9e8a137f2fb33687': // estimateAssembliesReferencesController
						layServ = $injector.get('estimateAssembliesReferenceUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'estimateAssembliesReferenceUIStandardService';
						config.dataServiceName = 'estimateAssembliesReferenceService';
						config.validationServiceName = null;
						config.listConfig = angular.extend({
							cellChangeCallBack: function cellChangeCallBack(arg) {
								$injector.get('estimateAssembliesWicItemProcessor').processItem(arg.item);
							}
						}, estimateDefaultGridConfig);
						break;
					case '588BE3EE73E94971A1C7A0BC7867C6BD': // estimateAssembliesCtrlGroupListController
						layServ = $injector.get('estimateAssembliesCtrlGroupUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'estimateAssembliesCtrlGroupUIStandardService';
						config.dataServiceName = 'estimateAssembliesCtrlGroupService';
						config.validationServiceName = 'estimateAssembliesCtrlGroupValidationService';
						config.listConfig = angular.extend({}, estimateDefaultGridConfig);
						break;
					case '179D44D751834DABB06EF4BA1F425D3C': // estimateAssembliesAssemblyStructureTreeController
					case 'b0b09a5709be478e9da50d8adbd3aa6d':
						layServ = isProject ? $injector.get('projectAssemblyStructureUIConfigurationService') : $injector.get('estimateAssembliesStandardConfigurationService');
						// eslint-disable-next-line no-case-declarations
						let assembliesStructureService = isProject ? $injector.get('projectAssemblyStructureService') : $injector.get('estimateAssembliesAssembliesStructureService');
						// eslint-disable-next-line no-case-declarations
						let estimateAssembliesFilterService = isProject ? $injector.get('projectAssemblyFilterService') : $injector.get('estimateAssembliesFilterService');

						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = isProject ? 'projectAssemblyStructureUIConfigurationService' : 'estimateAssembliesStandardConfigurationService';
						config.dataServiceName = isProject ? 'projectAssemblyStructureService' : 'estimateAssembliesAssembliesStructureService';
						config.validationServiceName = isProject ? 'projectAssemblyStructureValidationService' : 'estimateAssembliesAssemblyValidationService';
						config.listConfig = angular.extend({
							/* enter specific options here */
							parentProp: 'EstAssemblyCatFk',
							childProp: 'AssemblyCatChildren',
							type: 'assembliesCategories',
							dragDropService: isProject ? $injector.get('projectAssemblyStructureClipboardService') : $injector.get('estimateAssembliesCategoriesRuleClipboardService'),
							marker: {
								filterService: estimateAssembliesFilterService,
								filterId: 'estimateAssembliesAssembliesStructureService',
								dataService: assembliesStructureService,
								serviceName: isProject ? 'projectAssemblyStructureService' : 'estimateAssembliesAssembliesStructureService'
							},
							cellChangeCallBack: function cellChangeCallBack(arg) {
								assembliesStructureService.onCellChange(arg);
							},
							rowChangeCallBack: function rowChangeCallBack(arg, buttons) {
								let selectedItem = assembliesStructureService.getSelected();
								buttons.disableDelete = (selectedItem) ? selectedItem.HasChildren : true;
								buttons.disableCreateSub = angular.isUndefined(selectedItem);

								assembliesStructureService.onRowChange(selectedItem);
							}
						}, estimateDefaultGridConfig);
						break;
				}

				return config;
			};

			return service;
		}
	]);
})();
