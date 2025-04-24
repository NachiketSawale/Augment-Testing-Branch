/**
 * Created by reimer on 27.01.2015.
 */

(function (angular) {
	'use strict';

	var mod = angular.module('basics.dependentdata');

	mod.factory('basicsDependentDataDependentDataLayout', ['basicsLookupdataConfigGenerator','platformGridDomainService', 'platformGridLookupDomainFormatterService',function(basicsLookupdataConfigGenerator,gridDomainService,domainFormatterService){
		var service=
		{
			'fid': 'basics.dependentdata.dependentdata.layout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['id', 'modulefk', 'descriptioninfo', 'sourceobject', 'boundcolumn', 'sortby','dependentdatatypefk', 'iscompanycontext', 'isusercontext', 'isprojectcontext', 'isestimatecontext', 'ismodelcontext', 'boundcontaineruuid']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],

			'translationInfos': {

				'extraModules': ['basics.dependentdata'],

				'extraWords': {
					'ModuleFk': {location: 'basics.dependentdata', identifier: 'entityModuleFk', initial: 'Link to module'},
					'SourceObject': {location: 'basics.dependentdata', identifier: 'entitySourceObject', initial: 'Select'},
					'BoundColumn': {location: 'basics.dependentdata', identifier: 'entityBoundColumn', initial: 'Where'},
					'SortBy': {location: 'basics.dependentdata', identifier: 'entitySortBy', initial: 'Order by'},
					'DependentDataTypeFk': {location: 'basics.dependentdata', identifier: 'entityType', initial: 'Type'},
					'IsCompanyContext': {location: 'basics.dependentdata', identifier: 'entityIsCompanyContext', initial: 'Company filter [BAS_COMPANY_FK]'},
					'IsUserContext': {location: 'basics.dependentdata', identifier: 'entityIsUserContext', initial: 'User filter [FRM_USER_FK]'},
					'IsProjectContext': {location: 'basics.dependentdata', identifier: 'entityIsProjectContext', initial: 'Project filter [PRJ_PROJECT_FK]'},
					'IsEstimateContext': {location: 'basics.dependentdata', identifier: 'entityIsEstimateContext', initial: 'Estimate filter [EST_HEADER_FK]'},
					'IsModelContext': {location: 'basics.dependentdata', identifier: 'entityIsModelContext', initial: 'Model filter [MDL_MODEL_FK]'},
					'BoundContainerUuid':{location: 'basics.dependentdata', identifier: 'entityBoundContainer', initial: 'Sub container'},
				}
			},

			'overloads': {

				'id': {
					'readonly': true
				},

				'sourceobject': {

					'detail': { // not used
					},
					'grid': {
					}
				},

				'modulefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-dependent-data-module-combobox',
						'options': {
							// eagerLoad: true
						}
					},
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							lookupDirective: 'basics-dependent-data-module-combobox',
							lookupOptions: {
								removeDynamicItem: true
							}
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'basicsDependentDataModule',
							// 'displayMember': 'InternalName'
							displayMember: 'Description.Description'
						}

					}
				},
				'dependentdatatypefk':basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.dependentdata.type'),
				'boundcontaineruuid':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-dependent-data-container-combobox',
						'formatterOptions': {
							'lookupType': 'basicsDependentDataContainerLookup',
						}
					},
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'basics-dependent-data-container-combobox',
							'lookupOptions': {
								'showClearButton': true,
								'displayMember': 'Title'
							}
						},
						'formatter':function (row, cell, value, columnDef, dataContext, plainText, uniqueId, options) {
							return domainFormatterService.formatLookupMainColumn(row, cell, value, columnDef, dataContext, plainText, uniqueId, options, gridDomainService.formatLookup, gridDomainService.applyAsyncFormatterMarkup);
						},
						'formatterOptions': {
							'lookupType': 'basicsDependentDataContainerLookup',
							'displayMember': 'Title',
						}
					}
				}
			}
			/*,events: [{
				name: 'onSelectedItemChanged',
				handler: function onSelectedItemChanged(e, args) {
					console.log("============onSelectedItemChanged=======");

				}
			}]*/
		};

		return service;
	}]);

})(angular);
