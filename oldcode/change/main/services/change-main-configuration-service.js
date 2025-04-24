/**
 * Created by Frank Baedeker on 22.01.2015.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name changeMainConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in change main module
	 */
	angular.module('change.main').factory('changeMainConfigurationService',

		['platformUIStandardConfigService', 'changeMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'projectMainContainerInformationService', 'projectMainStandardConfigurationService',

			function (platformUIStandardConfigService, changeMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService, projectMainContainerInformationService, projectMainStandardConfigurationService) {

				//var projectMainStandardConfigListView = _.cloneDeep(projectMainStandardConfigurationService.getStandardConfigForDetailView());
				var projectMainLayout = _.cloneDeep(projectMainStandardConfigurationService.getProjectMainLayout());
				var prefix = 'Project.';
				var lcPrefix = prefix.toLowerCase();

				var projectAttributesGroups = projectMainLayout.groups;
				var projectAttributes = [];
				var changeAttributes = ['projectfk', 'rubriccategoryfk', 'changestatusfk', 'code', 'description', 'lastdate', 'reference', 'changetypefk', 'changereasonfk',
					'remark', 'probability', 'expectedcost', 'expectedrevenue', 'reason', 'instructiondate', 'submissiondate', 'confirmationdate','ordheaderfk','contractheaderfk',
					'factorbyamount', 'factorbyreason', 'electronicdataexchangenrgermangaeb'];
				setAttributesFromGroups(projectAttributesGroups, projectAttributes);

				function setAttributesFromGroups(attributes, attributesArray) {
					_.forEach(attributes, function (group) {
						_.forEach(group.attributes, function (colum) {
							//Not all columns show
							if (colum === 'companyfk' || colum === 'projectno' || colum === 'projectname' || colum === 'projectname2' || colum === 'currencyfk' || colum === 'islive' || colum === 'userdefined1' || colum === 'userdefined2') {
								attributesArray.push(lcPrefix + colum);
							}
						});
					});
				}


				var changeOverload = {
					rubriccategoryfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig(
						'basics.customize.rubriccategory',
						'Description',
						{
							required: true,
							field: 'RubricFk',
							filterKey: 'change-main-rubric-category-by-rubric-filter',
							customIntegerProperty: 'BAS_RUBRIC_FK'
						}),
					changestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectchangestatus', null, {
						showIcon: true,
						field: 'RubricCategoryFk',
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
					}),
					changetypefk:{
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'project-change-type-combobox',
								version:3,
								'lookupOptions': {
									'filterKey': 'change-main-type-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								version:3,
								'lookupType': 'ProjectChangeType',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'project-change-type-combobox',
							version:3,
							'options': {
								'filterKey': 'change-main-type-filter'
							}
						}
					},
					changereasonfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.changereason', null, {
						required: true,
						field: 'RubricCategoryFk',
						filterKey: 'change-main-by-rubric-category-filter',
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
					}),
					projectfk: {
						navigator: {
							moduleName: 'project.main',
							targetIdProperty: 'ProjectFk'
						},
						detail: {
							type: 'code',
							formatter: 'code',
							model: 'Project.ProjectNo'
						},
						grid: {
							formatter: 'code',
							field: 'Project.ProjectNo'
						},
						readonly: true
					},
					ordheaderfk: {
						readonly: true,
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-contract-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'defect-main--sales-contract-filter',
									showClearButton: true
								}
							}
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'sales-common-contract-dialog',
								lookupOptions: {
									filterKey: 'defect-main--sales-contract-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesContract',
								displayMember: 'Code'
							}
						}
					},

					contractheaderfk: {
						readonly: true,
						'navigator': {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'prc-con-header-dialog',
								lookupOptions: {
									filterKey: 'defect-main-Procurement-Contract-filter',
									showClearButton: true,
									'dialogOptions':{
										'alerts':[{
											theme:'info',
											message:'Setting procurement contract will overwrite quite a lot of related fields',
											message$tr$:'defect.main.procurementContractDialogTips'
										}]
									},
									title: {name: 'Procurement Contract', name$tr$: 'defect.main.procurementContractDialogTitle'}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'ConHeaderView',
								displayMember: 'Code'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'prc-con-header-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'defect-main-Procurement-Contract-filter',
									'dialogOptions':{
										'alerts':[{
											theme:'info',
											message:'Setting procurement contract will overwrite quite a lot of related fields',
											message$tr$:'defect.main.procurementContractDialogTips'
										}]
									},
									title: {name: 'Procurement Contract', name$tr$: 'defect.main.procurementContractDialogTitle'}
								}
							}
						}
					},

				};

				var projectOverload = projectMainLayout.overloads;
				var newProjectOverload = {};

				var projectProperties = [];
				_.forEach(projectMainLayout.groups, function (groups) {
					_.forEach(groups.attributes, function (property) {
						//Not all columns show
						if (property === 'companyfk' || property === 'projectno' || property === 'projectname' || property === 'projectname2' || property === 'currencyfk' || property === 'islive' || property === 'userdefined1' || property === 'userdefined2') {
							projectProperties.push(property);
						}
					});
				});

				_.forEach(projectProperties, function (property) {
					if (projectOverload.hasOwnProperty(property)) {
						projectOverload[property].readonly = true;
						newProjectOverload[lcPrefix + property] = projectOverload[property];
					} else {
						newProjectOverload[lcPrefix + property] = {readonly: true};
					}
				});


				var overloadsMerged = Object.assign(changeOverload, newProjectOverload);

				function createChangeDetailLayout() {
					return {
						fid: 'change.main.maindetailform',
						version: '0.2.4',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: changeAttributes
							},
							{
								gid: 'ProjectData',
								attributes: projectAttributes
							},
							{
								'gid': 'userDefTextGroup',
								'isUserDefText': true,
								'attCount': 5
							},
							{
								'gid': 'userDefNumberGroup',
								'isUserDefNumber': true,
								'attCount': 5
							},
							{
								'gid': 'userDefDateGroup',
								'isUserDefDate': true,
								'attCount': 5
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: overloadsMerged
					};
				}

				var changeChangeDetailLayout = createChangeDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var changeProjectMainAttributeDomains;
				var changeMainAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ChangeDto',
					moduleSubModule: 'Change.Main'
				});
				var projectMainAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ProjectDto',
					moduleSubModule: 'Project.Main'
				});
				var newProjectMainAttributeDomainsProperties = {};
				for (var domains in projectMainAttributeDomains.properties) {
					if (projectMainAttributeDomains.properties.hasOwnProperty(domains)) {

						newProjectMainAttributeDomainsProperties[prefix + domains] = projectMainAttributeDomains.properties[domains];
					}
				}


				if (changeMainAttributeDomains && projectMainAttributeDomains) {
					//changeMainAttributeDomains = changeMainAttributeDomains.properties;
					changeProjectMainAttributeDomains = Object.assign(changeMainAttributeDomains.properties, newProjectMainAttributeDomainsProperties);
				}

				return new BaseService(changeChangeDetailLayout, changeProjectMainAttributeDomains, changeMainTranslationService);
			}
		]);
})();
