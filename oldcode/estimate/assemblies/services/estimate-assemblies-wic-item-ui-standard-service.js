/**
 * Created by benny on 17.08.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies',
		angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimate.assemblies.estimateAssembliesWicItemUIStandardService
	 * @function
	 * @requires platformUIStandardConfigService platformSchemaService estimateAssembliesTranslationService basicsLookupdataConfigGenerator
	 *
	 * @description
	 * # This service provides standard layouts for different containers
	 *
	 */

	angModule.factory('estimateAssembliesWicItemUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'estimateAssembliesTranslationService', 'basicsLookupdataConfigGenerator', '$injector',
			function (platformUIStandardConfigService, platformSchemaService, estimateAssembliesTranslationService, basicsLookupdataConfigGenerator, $injector) {

				function createUnitGroupDetailLayout() {
					return {
						'fid': 'estimate.assemblies.groupdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['boqwiccatfk', 'boqwiccatboqfk', 'boqitemfk', 'uomfk', 'briefinfo']
							}
						],
						'overloads': {
							'boqwiccatfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
								events: [{
									name: 'onSelectedItemChanged',
									handler: function selectedBoqGroupChanged(e, args) {
										if (args.selectedItem && args.entity && args.entity.EstAssemblyWicItem) {
											if(args.entity.BoqWicCatFk!==args.selectedItem.Id)
											{
												// when the group changed , need to clear the wic catalog and wic item
												args.entity.BoqWicCatBoqFk = null;
												args.entity.BoqItemFk = null;
												args.entity.BoqLineTypeFk = null;
												args.entity.EstAssemblyWicItem.BoqHeaderFk = null;
												args.entity.EstAssemblyWicItem.BoqItemFk = null;
											}
										}
										else if (!args.selectedItem && args.entity && args.entity.EstAssemblyWicItem){
											args.entity.BoqWicCatBoqFk = null;
											args.entity.BoqItemFk = null;
											args.entity.BoqLineTypeFk = null;
											args.entity.EstAssemblyWicItem.BoqHeaderFk = null;
											args.entity.EstAssemblyWicItem.BoqItemFk = null;
										}
									}
								}],
								moduleQualifier: 'estimateAssembliesWicGroupLookupDataService',
								dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
								enableCache: true,
								valMember: 'Id',
								dispMember: 'Code'
							}),
							'boqwiccatboqfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								events: [{
									name: 'onSelectedItemChanged',
									handler: function selectedBoqHeaderChanged(e, args) {
										if (args.selectedItem && args.entity && args.entity.EstAssemblyWicItem) {
											if(args.entity.EstAssemblyWicItem.BoqHeaderFk !== args.selectedItem.BoqHeaderFk)
											{
												args.entity.BoqItemFk = null;
												args.entity.BoqLineTypeFk = null;
												args.entity.EstAssemblyWicItem.BoqItemFk = null;
											}
											args.entity.EstAssemblyWicItem.BoqHeaderFk = args.selectedItem.BoqHeaderFk;
										}
										else if (!args.selectedItem && args.entity && args.entity.EstAssemblyWicItem) {
											args.entity.BoqItemFk = null;
											args.entity.BoqLineTypeFk = null;
											args.entity.EstAssemblyWicItem.BoqItemFk = null;
										}
									}
								}],
								dataServiceName: 'boqHeaderLookupDataService',
								dispMember: 'BoqNumber',
								valMember: 'Id',
								filter: function (item) {
									let boqMainBoqTypes = $injector.get('boqMainBoqTypes');
									let filterEntity = {
										boqType: boqMainBoqTypes.wic,
										projectId: 0,
										selectedProject: '',
										boqGroupId:-1
									};
									if(item && item.BoqWicCatFk)
									{
										filterEntity.boqType = boqMainBoqTypes.wic;
										filterEntity.boqGroupId = item.BoqWicCatFk;
									}
									return filterEntity;
								},
								enableCache: true,
								columns: [
									{
										id: 'boqnumber',
										field: 'BoqNumber',
										name: 'BoqNumber',
										formatter: 'code',
										name$tr$: 'boq.main.boqNumber'
									},
									{
										id: 'description',
										field: 'Description',
										name: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}
								]
							}),
							'boqitemfk': {
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BoqItem',
										displayMember: 'Reference',
										'filterKey': 'estimate-assembly-wic-item-filter',
									},
									editor: 'lookup',
									editorOptions: {
										// directive: 'estimate-assembly-boqitem-lookup',
										'lookupDirective': 'estimate-assembly-boqitem-lookup',
										'lookupType': 'BoqItem',
										lookupOptions: {
											showClearButton: true,
											'lookupType': 'BoqItem',
											filterKey: 'estimate-assembly-wic-item-filter',
											additionalColumns: true,
											valueMember: 'Id',
											displayMember: 'Reference'
										}
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'estimate-assembly-boqitem-lookup',
										descriptionMember: 'BriefInfo.Description',
										lookupOptions: {
											'lookupType': 'BoqItem',
											'valueMember': 'Id',
											'displayMember': 'Reference',
											filterKey: 'estimate-assembly-wic-item-filter'
										}
									},
									sortOrder: 3
								},
							},
							'uomfk': {
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'basics-lookupdata-uom-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'uom',
										displayMember: 'Unit'
									}
								},
								readonly: true
							},
							'briefinfo': {
								readonly: true
							}
						}
					};
				}

				let BaseService = platformUIStandardConfigService,
					assembly2WicItemAttributeDomains = platformSchemaService.getSchemaFromCache({
						typeName: 'EstAssembly2WicItemDto',
						moduleSubModule: 'Estimate.Assemblies'
					});

				if (assembly2WicItemAttributeDomains) {
					assembly2WicItemAttributeDomains = assembly2WicItemAttributeDomains.properties;
					// to show these two columns in the grid
					delete assembly2WicItemAttributeDomains.BoqItemFk;
					assembly2WicItemAttributeDomains.BoqWicCatFk = { mandatory:true,domain:'integer'};
					assembly2WicItemAttributeDomains.BoqWicCatBoqFk = { mandatory:true,domain:'integer'};
					assembly2WicItemAttributeDomains.BoqItemFk = { mandatory:true,domain:'integer'};
					assembly2WicItemAttributeDomains.UomFk = {domain:'integer', mandatory:false};
					assembly2WicItemAttributeDomains.BriefInfo = {domain:'description', mandatory:false};
				}

				function GroupUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				GroupUIStandardService.prototype = Object.create(BaseService.prototype);
				GroupUIStandardService.prototype.constructor = GroupUIStandardService;

				return new GroupUIStandardService(createUnitGroupDetailLayout(), assembly2WicItemAttributeDomains, estimateAssembliesTranslationService);
			}]);
})();
