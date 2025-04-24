/**
 * Created by benny on 17.08.2016.
 */
/**
 * $Id: estimate-assemblies-wic-item-ui-standard-service.js 11512 2021-09-21 09:28:27Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies',
		angModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name estimate.assemblies.estimateAssembliesReferenceUIStandardService
     * @function
     * @requires platformUIStandardConfigService platformSchemaService estimateAssembliesTranslationService basicsLookupdataConfigGenerator
     *
     * @description
     * # This service provides standard layouts for different containers
     *
     */

	angModule.factory('estimateAssembliesReferenceUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'estimateAssembliesTranslationService', 'basicsLookupdataConfigGenerator', '$injector',
			function (platformUIStandardConfigService, platformSchemaService, estimateAssembliesTranslationService, basicsLookupdataConfigGenerator, $injector) {

				function getEstimateAssemblyReferenceLayout() {
					return {
						'fid': 'estimate.assemblies.reference',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['source']
							},
						],
						'overloads': {
							'source': {
								readonly: true,
								navigator : {
									moduleName:'',
									navFunc: function (triggerFieldOption, entity) {
										var naviService = $injector.get('platformModuleNavigationService');
										var Lineitem = {};
										switch(entity.Type){
											case 'L':
												if(entity.ShowDialog){
													$injector.get('platformDialogService').showDialog({iconClass: 'info', headerText$tr$: 'cloud.common.infoBoxHeader', bodyText$tr$: 'estimate.main.differentContextMsg', showOkButton: true});
												}
												else{
													triggerFieldOption.ProjectContextId = entity.ProjectId;
													triggerFieldOption.EstHeaderFk = entity.EstHeaderId;
													triggerFieldOption.Id = entity.EstLineItemId;
													Lineitem.EstLineItemId = entity.EstLineItemId;
													naviService.navigate({moduleName: 'estimate.main-line-item'},Lineitem, triggerFieldOption);
												}
												break;
											case 'PA':
												if(entity.ShowDialog){
													$injector.get('platformDialogService').showDialog({iconClass: 'info', headerText$tr$: 'cloud.common.infoBoxHeader', bodyText$tr$: 'estimate.main.differentContextMsg', showOkButton: true});
												}
												else {
													Lineitem.EstAssemblyFk = entity.EstLineItemId;
													triggerFieldOption.field = 'EstAssemblyFk';
													triggerFieldOption.ProjectFk = entity.ProjectId;
													naviService.navigate({moduleName: 'project.main-assembly'}, Lineitem, triggerFieldOption);
												}
												break;
											case 'A':
												Lineitem.EstAssemblyFk = entity.EstLineItemId;
												triggerFieldOption.field = 'EstAssemblyFk';
												naviService.navigate({moduleName: 'estimate.assemblies-internal'},Lineitem, triggerFieldOption);
												break;
										}
									},
									navModuleName: function (columnConfig, entity) {
										let url ='';
										switch(entity.Type){
											case 'L':
												url = 'estimate.main.estimate';
												break;
											case 'PA':
												url = 'estimate.assemblies.prjassembly';
												break;
											case 'A':
												url = 'estimate.assemblies.assembly';
												break;
										}
										return url;
									},
								},
							}
						}
					};
				}

				let BaseService = platformUIStandardConfigService,
					assemblyReferencesDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'AssemblyReferencesDto',
						moduleSubModule: 'Estimate.Assemblies'
					});

				if (assemblyReferencesDomains) {
					assemblyReferencesDomains = assemblyReferencesDomains.properties;
					assemblyReferencesDomains.References = {domain:'description', mandatory:true};
				}

				function GroupUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				GroupUIStandardService.prototype = Object.create(BaseService.prototype);
				GroupUIStandardService.prototype.constructor = GroupUIStandardService;

				return new GroupUIStandardService(getEstimateAssemblyReferenceLayout(), assemblyReferencesDomains, estimateAssembliesTranslationService);
			}]);
})();
