/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainBoqPackageAssignFormConfig', ['$http', '$translate','$injector', 'basicsLookupdataLookupFilterService',
		'basicsCommonQuantityTransferFormConstant', '_',
		function ($http, $translate,$injector, basicsLookupdataLookupFilterService,
			basicsCommonQuantityTransferFormConstant, _) {

			let callingService = {};

			let config = {
				fid: 'assignPackage',
				showGrouping: false,
				skipPermissionsCheck: true,
				change: change,
				groups: [{
					gid: 'default'
				}],
			};
			let defaultRows = [
				{
					gid: 'default',
					rid: 'isCreateNew',
					type: 'radio',
					label: 'Create New',
					label$tr$: 'estimate.main.createNew',
					model: 'boqPackageAssignmentEntity.IsCreateNew',
					options: {
						valueMember: 'value',
						labelMember: 'label',
						groupName: 'isCreateNew',
						items: [
							{
								value: 1,
								label: ' '
							}
						]
					}
				},
				{
					gid: 'default',
					rid: 'updateToPackageExist',
					type: 'directive',
					directive: 'platform-composite-input',
					label: 'Update to Existed Package',
					label$tr$: 'estimate.main.updateToPackageExist',
					model: 'boqPackageAssignmentEntity.IsCreateNew',
					options: {
						rows: [
							{
								type: 'radio',
								model: 'boqPackageAssignmentEntity.IsCreateNew',
								cssLayout: 'xs-12 sm-12 md-1 lg-1',
								options: {
									valueMember: 'value',
									labelMember: 'label',
									groupName: 'isCreateNew',
									items: [
										{
											value: 0,
											label: ' '
										}
									]
								}
							},
							{
								type: 'boolean',
								model: 'boqPackageAssignmentEntity.hidePackageWithMaterialOrNonCurrentCriteria',
								options: getHidePackageWithMaterialOrNonCurrentCriteriaOptions()
							}
						]
					}
				},
				{
					gid: 'default',
					rid: 'prcStructureFk',
					model: 'boqPackageAssignmentEntity.Package.StructureFk',
					label: 'Procurement Structure',
					label$tr$: 'estimate.main.prcStructureFk',
					'type': 'directive',
					'mandatory': true,
					'required': true,
					'directive': 'basics-lookupdata-lookup-composite',
					'options': getPrcStructureLookupOptions(callingService)
				},
				{
					gid: 'default',
					rid: 'prcConfigurationFk',
					model: 'boqPackageAssignmentEntity.Package.ConfigurationFk',
					label: 'Configuration',
					label$tr$: 'estimate.main.createBoqPackageWizard.configuration',
					'type': 'directive',
					'directive': 'basics-configuration-configuration-combobox',
					'options': getConfigurationLookupOptions()
				},
				{
					gid: 'default',
					rid: 'prcPackageFk',
					model: 'boqPackageAssignmentEntity.Package.Id',
					label: 'Package',
					label$tr$: 'estimate.main.prcPackageFk',
					type: 'directive',
					directive: 'estimate-main-assign-boq-package-dynamic-composite-lookup',
					'options': getPackageLookupOptions()
				},
				{
					gid: 'default',
					rid: 'prcSubPackageFk',
					model: 'boqPackageAssignmentEntity.SubPackageFk',
					label: 'Sub Package',
					label$tr$: 'estimate.main.createMaterialPackageWizard.subPackage',
					type: 'directive',
					directive: 'estimate-main-assign-boq-package-dynamic-lookup',
					'options': getSubPackageLookupOptions()
				},
				{
					gid: 'default',
					rid: 'reference',
					label: 'Reference',
					label$tr$: 'cloud.common.entityReference',
					model: 'boqPackageAssignmentEntity.Package.Reference',
					type: 'description'
				},
				{
					gid: 'default',
					rid: 'clerkPrcFk',
					model: 'boqPackageAssignmentEntity.Package.ClerkPrcFk',
					label: 'Responsible',
					label$tr$: 'estimate.main.createMaterialPackageWizard.responsible',
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': getClerkLookupOptions()
				},
				{
					gid: 'default',
					rid: 'createUpdateBoQInPackage',
					label: 'Create/Update BoQ in Package',
					label$tr$: 'estimate.main.createBoqPackageWizard.createUpdateBoQInPackage',
					model: 'boqPackageAssignmentEntity.CreateUpdateBoQInPackage',
					type: 'boolean'
				}
			];

			return {
				getConfig: getConfig,
				setResponsible: setResponsible,
				getAllField: getAllField,
				change: change,
				registerLookupFilter: registerLookupFilter,
				getUniqueFieldsProfileOptions: getUniqueFieldsProfileOptions,
				getCostTransferOptionProfileOptions: getCostTransferOptionProfileOptions,
				getPrcStructureLookupOptions: getPrcStructureLookupOptions,
				getConfigurationLookupOptions: getConfigurationLookupOptions,
				getSubPackageLookupOptions: getSubPackageLookupOptions,
				getClerkLookupOptions:　getClerkLookupOptions,
				getQuantityTransferFromOptions: getQuantityTransferFromOptions,
				getLineItemWithNoResourcesFlagOptions: getLineItemWithNoResourcesFlagOptions,
				getHidePackageWithMaterialOrNonCurrentCriteriaOptions: getHidePackageWithMaterialOrNonCurrentCriteriaOptions,
				getPackageLookupOptions: getPackageLookupOptions,
				getPackageReferenceLen: getPackageReferenceLen
			};

			function getAllField() {
				let allRid = config.rows;
				return allRid;
			}

			function change(entity, model) {
				if(callingService.entityChanged){
					callingService.entityChanged(entity, model);
				}
			}

			function getConfig (service,packageSourceType, uniqueFieldsProfileService) {
				const configTemp = angular.copy(config);
				configTemp.fid = configTemp.fid + '-' + packageSourceType;
				if (packageSourceType === 1 || packageSourceType === 2 || packageSourceType === 3 || packageSourceType === 4 ||
					packageSourceType === 5) {
					configTemp.rows = [
						{
							gid: 'default',
							rid: 'assignPage',
							model: 'assignment',
							type: 'directive',
							directive: 'estimate-main-boq-package-assign-page'
						}
					];
					return configTemp;
				} else {
					configTemp.rows = defaultRows;
				}

				// packageSourceType
				// 1: projectBoQ,
				// 2:WIC BoQ,
				// 3:procurement structure of LineItem
				// 4:procurement structure of project BoQ
				// 5: resource

				let isAggregate = {
					'gid': 'default',
					'rid': 'isAggregate',
					'label': 'Aggregate',
					'label$tr$': 'estimate.main.createBoqPackageWizard.isAggregate',
					'model': 'boqPackageAssignmentEntity.isAggregate',
					'type': 'boolean',
					'sortOrder': 8
				};

				let controllingUnitLable = {
					'gid': 'default',
					'rid': 'controllingUnitLable',
					'label':'Controlling Unit as BoQ Division',
					'label$tr$': 'estimate.main.createBoqPackageWizard.controllingUnitAsBoQDivision',
					'model': 'boqPackageAssignmentEntity.IsControllingUnit',
					'type': 'boolean',
					'sortOrder': 9
				};

				let profile ={
					'gid': 'default',
					'rid': 'uniqueFieldsProfile',
					'label': 'Aggregate Option',
					'label$tr$': 'basics.common.uniqueFields.uniqueFieldsProfile',
					'model': 'boqPackageAssignmentEntity.uniqueFieldsProfile',
					'type': 'directive',
					'directive': 'basics-common-unique-fields-profile-lookup',// 'basics-common-unique-fields-profile',
					options: getUniqueFieldsProfileOptions(uniqueFieldsProfileService),
					'sortOrder': 10
				};

				registerLookupFilter();

				// Lable for option "Quantity Transfer Form" for criteria is "Project BoQ" only
				let QuantityTransferFromLable = {
					'gid': 'default',
					'rid': 'QuantityTransferFrom',
					'label': 'Quantity Transfer From',
					'label$tr$': 'estimate.main.createBoqPackageWizard.quantityTransferFrom',
					'model': 'boqPackageAssignmentEntity.QuantityTransferFrom',
					'type': 'directive',
					'directive': 'basics-common-quantity-transfer-form-lookup',
					'sortOrder': 10,
					options: getQuantityTransferFromOptions()
				};
				let isConsiderBoqQtyRelationLable = {
					'gid': 'default',
					'rid': 'IsConsiderBoqQtyRelation',
					'label': 'Consider BoQ Qty Relation',
					'label$tr$': 'estimate.main.createBoqPackageWizard.isConsiderBoqQtyRelation',
					'model': 'boqPackageAssignmentEntity.IsConsiderBoqQtyRelation',
					'type': 'boolean',
					'sortOrder': 11
				};

				let lineItemWithNoResourcesFlag = {
					type: 'boolean',
					model: 'boqPackageAssignmentEntity.lineItemWithNoResourcesFlag',
					options: getLineItemWithNoResourcesFlagOptions()
				};

				let costTransferOptprofile = {
					gid: 'default',
					rid: 'costTransferOptprofile',
					type: 'directive',
					directive: 'platform-composite-input',
					label$tr$: 'basics.common.uniqueFields.costTransferOptprofile',
					model: 'boqPackageAssignmentEntity.CostTransferOptprofile',// use for validator
					options: getCostTransferOptionProfileOptions(),
					sortOrder: 15
				};

				let projectBoqAndLineItemAsHierarchy = {
					'gid': 'default',
					'rid': 'projectBoqAndLineItemAsHierarchy',
					'label': 'BoQ Hierarchy',
					'label$tr$': 'estimate.main.createBoqPackageWizard.boqHierarchy',
					'model': 'boqPackageAssignmentEntity.BoqStructureOption4SourceResources',
					'type': 'radio',
					'options': {
						valueMember: 'value',
						labelMember: 'label',
						groupName: 'boqStructure4SourceResources',
						items: [
							{
								value: 1,
								label: $translate.instant('estimate.main.createBoqPackageWizard.projectBoqAndLineItemAsBoqHierarchy')
							}
						]
					},
					'sortOrder': 16
				};

				let isSkipPositionBoqAsDivisionBoq = {
					gid: 'default',
					rid: 'isSkipPositionBoqAsDivisionBoq',
					type: 'directive',
					directive: 'platform-composite-input',
					label: ' ',
					model: 'boqPackageAssignmentEntity.IsSkipBoqPositionAsDivisionBoq',// use for validator
					options: {
						rows: [{
							model: 'boqPackageAssignmentEntity.IsSkipBoqPositionAsDivisionBoq',
							type: 'boolean',
							options: {
								labelText: $translate.instant('estimate.main.createBoqPackageWizard.isSkipPositionBoqAsDivisionBoq')
							}
						}]
					},
					sortOrder: 17
				};

				let lineItemAsHierarchy = {
					'gid': 'default',
					'rid': 'lineItemAsHierarchy',
					'label': ' ',
					'label$tr$': ' ',
					'model': 'boqPackageAssignmentEntity.BoqStructureOption4SourceResources',
					'type': 'radio',
					'options': {
						valueMember: 'value',
						labelMember: 'label',
						groupName: 'boqStructure4SourceResources',
						items: [
							{
								value: 2,
								label: $translate.instant('estimate.main.createBoqPackageWizard.lineItemAsBoqHierarchy')
							}
						]
					},
					'sortOrder': 18
				};

				let allRid = _.map(configTemp.rows,'rid');

				let reference =  _.find(configTemp.rows,{'rid':'reference'});
				if(reference){
					let packageReferenceLen = $injector.get('estimateMainService').getPackageReferenceLen();
					reference.maxLength = packageReferenceLen;
				}

				if (packageSourceType !== 5) {
					if (allRid.indexOf('costTransferOptprofile') === -1) {
						configTemp.rows.push(costTransferOptprofile);
					}
					else {
						let cost = _.find(configTemp.rows, {rid: 'costTransferOptprofile'});
						if (cost && !_.find(cost.options.rows, {model: 'boqPackageAssignmentEntity.lineItemWithNoResourcesFlag'})) {
							cost.options.rows.push(lineItemWithNoResourcesFlag);
						}
					}
				} else {
					if (allRid.indexOf('costTransferOptprofile') > -1) {
						let cost = _.find(configTemp.rows, {rid: 'costTransferOptprofile'});
						_.remove(cost.options.rows, function (row) {
							return row.model === 'boqPackageAssignmentEntity.lineItemWithNoResourcesFlag';
						});
					}
				}

				let existQuantityTransferFrom = allRid.indexOf('QuantityTransferFrom');
				let existAggreate = allRid.indexOf('isAggregate');
				let exsistcontrollingUnitLable = allRid.indexOf('controllingUnitLable');
				let exsistUniqueFieldProfile = allRid.indexOf('uniqueFieldsProfile');

				let existisConsiderBoqQtyRelation = allRid.indexOf('IsConsiderBoqQtyRelation');
				let existPrcPackageFk = allRid.indexOf('prcPackageFk');
				let existProjectBoqAndLineItemAsHierarchy = allRid.indexOf('projectBoqAndLineItemAsHierarchy');
				let existLineItemAsHierarchy = allRid.indexOf('lineItemAsHierarchy');
				let existIsSkipPositionBoqAsDivisionBoq = allRid.indexOf('isSkipPositionBoqAsDivisionBoq');

				if (packageSourceType !== 5) {
					if (existisConsiderBoqQtyRelation === -1) {
						configTemp.rows.push(isConsiderBoqQtyRelationLable);
					}
				}
				else if (existisConsiderBoqQtyRelation > -1) {
					_.remove(configTemp.rows, function (item) {
						return item.rid === 'IsConsiderBoqQtyRelation';
					});
				}

				if(packageSourceType === 3 || packageSourceType === 4){
					if (existAggreate === -1) {
						configTemp.rows.push(isAggregate);
					}

					if(exsistcontrollingUnitLable === -1){
						configTemp.rows.push(controllingUnitLable);
					}

					if(exsistUniqueFieldProfile === -1){
						configTemp.rows.push(profile);
					}

					if (existQuantityTransferFrom > -1 || existProjectBoqAndLineItemAsHierarchy > -1 || existLineItemAsHierarchy > -1 || existIsSkipPositionBoqAsDivisionBoq > -1) {
						_.remove(configTemp.rows, function (item) {
							return item.rid === 'QuantityTransferFrom' || item.rid === 'projectBoqAndLineItemAsHierarchy' || item.rid === 'lineItemAsHierarchy' || item.rid === 'isSkipPositionBoqAsDivisionBoq';
						});
					}
				}
				else if (packageSourceType === 5) {
					if (existProjectBoqAndLineItemAsHierarchy === -1) {
						configTemp.rows.push(projectBoqAndLineItemAsHierarchy);
					}

					if (existIsSkipPositionBoqAsDivisionBoq === -1){
						configTemp.rows.push(isSkipPositionBoqAsDivisionBoq);
					}

					if (existLineItemAsHierarchy === -1) {
						configTemp.rows.push(lineItemAsHierarchy);
					}

					if (existQuantityTransferFrom > -1 || existAggreate > -1 || exsistcontrollingUnitLable > -1 || exsistUniqueFieldProfile > -1) {
						_.remove(configTemp.rows, function (item) {
							return item.rid === 'QuantityTransferFrom' || item.rid === 'isAggregate' ||
								item.rid === 'controllingUnitLable' || item.rid === 'uniqueFieldsProfile';
						});
					}
				}
				else{

					if(packageSourceType ===1 || packageSourceType === 2){
						if(existQuantityTransferFrom === -1){
							configTemp.rows.push(QuantityTransferFromLable);
						}
					}

					if (existAggreate > -1) {
						_.remove(configTemp.rows, function (item) {
							return item.rid === 'isAggregate';
						});
					}

					if(exsistcontrollingUnitLable > -1){
						_.remove(configTemp.rows, function (item) {
							return item.rid === 'controllingUnitLable';
						});
					}

					if(exsistUniqueFieldProfile > -1 || existProjectBoqAndLineItemAsHierarchy > -1 || existLineItemAsHierarchy > -1 || existIsSkipPositionBoqAsDivisionBoq > -1){
						_.remove(configTemp.rows, function (item) {
							return item.rid === 'uniqueFieldsProfile' || item.rid === 'projectBoqAndLineItemAsHierarchy' || item.rid === 'lineItemAsHierarchy' || item.rid === 'isSkipPositionBoqAsDivisionBoq';
						});
					}
				}

				if (existPrcPackageFk > -1) {
					let packageFkRow = configTemp.rows[existPrcPackageFk];
					packageFkRow.options.lookupOptions.selectableCallback = function selectableCallback(dataItem/* , entity */) {
						if (!dataItem.IsService) {
							return true;
						}
						if (packageSourceType === 1) {
							// return dataItem.IsFromPrjBoq;
							return dataItem.BoqCriteria === 1;
						}
						else if (packageSourceType === 2) {
							// return dataItem.IsFromWicBoq;
							return dataItem.BoqCriteria === 2;
						}
						else if (packageSourceType === 3 || packageSourceType === 4) {
							// return dataItem.IsFromLineItem;
							return dataItem.BoqCriteria === 3;
						}
						else if (packageSourceType === 5) {
							return dataItem.BoqCriteria === 4;
						}
					};
				}

				callingService = service;
				return configTemp;
			}

			function setResponsible(packageEntity ,postData) {
				return $http.post(globals.webApiBaseUrl + 'procurement/common/data/getPrcclerkAndConfirgId', postData).then(function (response) {
					if(response && response.data){
						packageEntity.ClerkPrcFk = response.data.clerkPrcFk;
						if(response.data.confirgurationId) {
							packageEntity.ConfigurationFk = response.data.confirgurationId;
						}
					}
				});
			}

			function registerLookupFilter() {
				let filters = [
					{
						key: 'estimate-wizard-create-boq-quantity-transfer-from',
						fn: function (item, entity) {
							if (entity.packageSourceType === 2) {
								return item.value === 'LineItemAQ' || item.value === 'LineItemWQ';
							}
							return true;
						}
					}];
				filters.forEach(function (filter) {
					if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						basicsLookupdataLookupFilterService.registerFilter(filter);
					}
				});
			}

			function getUniqueFieldsProfileOptions(uniqueFieldsProfileService) {
				return {
					service: uniqueFieldsProfileService
				};
			}

			function getCostTransferOptionProfileOptions(customOptions) {
				const options = {
					rows: [
						{
							model: 'updateOptions.CostTransferOptprofile',
							type: 'directive',
							directive: 'cost-transfer-option-profile',
							options: {
								service: 'costTransferOptionProfileService',
							},
							cssLayout: 'xs-12 sm-12 md-1 lg-1'
						}
					]
				};

				if (customOptions) {
					_.extend(options, customOptions);
				}
				return options;
			}

			function getPrcStructureLookupOptions(callingService) {
				return {
					'lookupDirective': 'basics-procurementstructure-structure-dialog',
					'descriptionField': 'StructureDescription',
					'descriptionMember': 'DescriptionInfo.Translated',
					'lookupOptions': {
						'initValueField': 'StructureCode',
						'showClearButton': true,
						'events': [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {

									if (args && args.selectedItem) {
										let packageData = args.entity.boqPackageAssignmentEntity.Package;
										let postData = {
											prcStructureFk: args.selectedItem.Id,
											projectFk: packageData ? packageData.ProjectFk : null,
											companyFk: packageData ? packageData.CompanyFk : null,
											isProcurementService: true
										};
										setResponsible(args.entity.boqPackageAssignmentEntity.Package, postData).then(function () {
											args.entity.boqPackageAssignmentEntity.Package.StructureFk = args.selectedItem.Id;
											args.entity.boqPackageAssignmentEntity.defaultDescription = args.selectedItem.DescriptionInfo.Translated;
											args.entity.boqPackageAssignmentEntity.SubPackageDescription = args.selectedItem.DescriptionInfo.Translated;
											callingService.entityChanged(args.entity, 'boqPackageAssignmentEntity.Package.ConfigurationFk');
										});
									} else if (!args.selectedItem) {
										callingService.validateBoqPackageItem(args.entity.boqPackageAssignmentEntity);
									}
								}
							}
						]
					}
				};
			}

			function getConfigurationLookupOptions() {
				return {
					filterKey: 'assign-boq-wizard-package-configuration-filter'
				};
			}

			function getSubPackageLookupOptions() {
				return {
					'lookupDirective': 'procurement-package-package2-header-combobox',
					'lookupOptions': {
						filterKey: 'assign-boq-wizard-sub-package-filter'
					},
					descriptionField: 'boqPackageAssignmentEntity.SubPackageDescription',
					readOnlyField: 'boqPackageAssignmentEntity.IsCreateNew'
				};
			}

			function getClerkLookupOptions() {
				return {
					'lookupDirective': 'cloud-clerk-clerk-dialog',
					'descriptionMember': 'Description',
					'lookupOptions': {'showClearButton': true}
				};
			}

			function getQuantityTransferFromOptions() {
				return {
					filterKey: 'estimate-wizard-create-boq-quantity-transfer-from'
				};
			}

			function getLineItemWithNoResourcesFlagOptions() {
				return {
					ctrlId: 'lineItemWithNoResourcesFlag',
					labelText: $translate.instant('estimate.main.lineItemWithNoResourcesFlag')
				};
			}

			function getHidePackageWithMaterialOrNonCurrentCriteriaOptions() {
				return {
					ctrlId: 'hidePackageWithMaterialOrNonCurrentCriteria',
					labelText: $translate.instant('estimate.main.hidePackageWithMaterialOrNonCurrentCriteria')
				};
			}

			function getPackageLookupOptions() {
				return  {
					'lookupDirective': 'procurement-package-package-with-update-option-lookup',
					'descriptionMember': 'DescriptionInfo.Translated',
					descriptionField: 'boqPackageAssignmentEntity.Package.Description',
					readOnlyField: 'boqPackageAssignmentEntity.IsCreateNew',
					codeField: 'boqPackageAssignmentEntity.Package.Code',
					boqPackageAssignmentEntityField: 'boqPackageAssignmentEntity',
					IsReadOnlyPackageCodeField: 'IsReadOnlyPackageCode',
					SubPackageDescriptionField: 'SubPackageDescription',
					'lookupOptions': {
						'showClearButton': false,
						'filterKey': 'assign-boq-wizard-prc-package-filter',
						'events': [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									args.entity.boqPackageAssignmentEntity.Package.Reference = '';
									_.assign(args.entity.boqPackageAssignmentEntity.Package, args.selectedItem);

									let packageReferenceLen = $injector.get('estimateMainService').getPackageReferenceLen();
									if (args.entity.boqPackageAssignmentEntity.Package.Reference && args.entity.boqPackageAssignmentEntity.Package.Reference.length > packageReferenceLen) {
										args.entity.boqPackageAssignmentEntity.Package.Reference = args.entity.boqPackageAssignmentEntity.Package.Reference.slice(0, packageReferenceLen);
									}

									if (args && args.selectedItem && args.selectedItem.IsService && args.entity && args.entity.boqPackageAssignmentEntity) {
										// if (args.selectedItem.IsFromLineItemAQ4Service) {
										if (args.selectedItem.BoqQtySource === 1) {
											args.entity.boqPackageAssignmentEntity.QuantityTransferFrom = basicsCommonQuantityTransferFormConstant.lineItemAQ;
											// } else if (args.selectedItem.IsFromLineItemWQ4Service) {
										} else if (args.selectedItem.BoqQtySource === 2) {
											args.entity.boqPackageAssignmentEntity.QuantityTransferFrom = basicsCommonQuantityTransferFormConstant.lineItemWQ;
											// } else if (args.selectedItem.IsFromBoqAQWQ4Service) {
										} else if (args.selectedItem.BoqQtySource === 3) {
											args.entity.boqPackageAssignmentEntity.QuantityTransferFrom = basicsCommonQuantityTransferFormConstant.lineItemQuantityTotal;
										} else if (args.selectedItem.BoqQtySource === 4) {
											args.entity.boqPackageAssignmentEntity.QuantityTransferFrom = basicsCommonQuantityTransferFormConstant.boqWQAQ;
										}

										args.entity.boqPackageAssignmentEntity.IsConsiderBoqQtyRelation = args.selectedItem.IsConsideredQtyRel; // args.selectedItem.IsConsideredQtyRel4Service;
										args.entity.boqPackageAssignmentEntity.hasUpdateOption = true;
										args.entity.boqPackageAssignmentEntity.BoqStructureOption4SourceResources = args.selectedItem.ResourceBoqStructure;
									} else if (args.entity && args.entity.boqPackageAssignmentEntity) {
										args.entity.boqPackageAssignmentEntity.hasUpdateOption = false;
									}
								}
							}
						]
					}
				};
			}

			function getPackageReferenceLen() {
				return $injector.get('estimateMainService').getPackageReferenceLen();
			}
		}
	]);
})(angular);
