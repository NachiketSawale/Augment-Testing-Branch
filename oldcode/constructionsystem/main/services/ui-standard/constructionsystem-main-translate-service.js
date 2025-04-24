/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionsystemMainTranslationService
	 * @function
	 * @requires platformTranslateService
	 *
	 * @description
	 * #
	 * constructionsystem main translate service
	 */
	angular.module(moduleName).factory('constructionsystemMainTranslationService', [
		'platformTranslateService', 'platformTranslationUtilitiesService','$q',
		'modelViewerTranslationModules',

		function (platformTranslateService, platformTranslationUtilitiesService,$q,
			modelViewerTranslationModules) {

			var service = {instant: platformTranslateService.instant};

			var cloudCommonModule = 'cloud.common';
			var modelMainModule = 'model.main';
			var constructionSystemMasterModule = 'constructionsystem.master';
			var estimateMainModule='estimate.main';
			var basicsCommonModule = 'basics.common';
			var modelWdeviewerModule = 'model.wdeviewer';

			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [moduleName, cloudCommonModule,
					constructionSystemMasterModule, estimateMainModule, basicsCommonModule,
					modelWdeviewerModule].concat(modelViewerTranslationModules)
			};
			data.words = {
				// construction system master
				Reference: {location: cloudCommonModule, identifier: 'entityReference', initial: 'Reference'},
				MatchCode: {location: constructionSystemMasterModule, identifier: 'entityMatchCode', initial: 'Match Code'},
				IsDistinctInstances: {location: constructionSystemMasterModule, identifier: 'entityIsDistinctInstances', initial: 'Is Distinct Instances'},
				RubricCategoryFk: {location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk', initial: 'Rubric Category'},
				CosGroupFk: {location: cloudCommonModule, identifier: 'entityGroup', initial: 'Group'},
				CosTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
				StructureFk: {location: basicsCommonModule, identifier: 'entityPrcStructureFk', initial: 'Procurement Structure'},
				BasFormFk: {location: constructionSystemMasterModule, identifier: 'entityBasFormFk', initial: 'Form'},
				costGroup: {location: constructionSystemMasterModule, identifier: 'entitycostGroup', initial: 'Cost Group'},
				UomValue: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'Variable Name'},
				CosMasterParameterType: {location: constructionSystemMasterModule, identifier: 'entityParameterTypeFk', initial: 'Parameter Type'},

				// Instance
				CommentText: { location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment' },
				ControllingUnitFk:{location:cloudCommonModule,identifier:'entityControllingUnit',initial: 'Controlling Unit'},
				LicCostGroup1Fk: { location: constructionSystemMasterModule, identifier: 'entityLicCostGroupFk', initial: 'Liccost Group 1', param: { 'p_0': '1' } },
				LicCostGroup2Fk: { location: constructionSystemMasterModule, identifier: 'entityLicCostGroupFk', initial: 'Liccost Group 2', param: { 'p_0': '2' } },
				LicCostGroup3Fk: { location: constructionSystemMasterModule, identifier: 'entityLicCostGroupFk', initial: 'Liccost Group 3', param: { 'p_0': '3' } },
				LicCostGroup4Fk: { location: constructionSystemMasterModule, identifier: 'entityLicCostGroupFk', initial: 'Liccost Group 4', param: { 'p_0': '4' } },
				LicCostGroup5Fk: { location: constructionSystemMasterModule, identifier: 'entityLicCostGroupFk', initial: 'Liccost Group 5', param: { 'p_0': '5' } },
				IsChecked:{location:moduleName,identifier:'entityIsChecked',initial: 'IsChecked'},
				IsUserModified: { location: moduleName, identifier: 'isUserModified', initial: 'Is User Modified'},
				Status:{location:cloudCommonModule,identifier:'entityStatus',initial: 'Status'},
				BoqItemFk:{ location: estimateMainModule, identifier: 'boqItemFk', initial: 'BoqItem'},
				BoqHeaderFk:{ location: estimateMainModule, identifier: 'boqHeaderFk', initial: 'BoqHeader' },
				CosTemplateFk: { location: constructionSystemMasterModule, identifier: 'entityTemplateFk', initial: 'Template' },
				MasterHeaderCode:{ location: moduleName, identifier: 'masterHeaderCode', initial: 'Master Header Code' },
				MasterHeaderDescription:{ location: moduleName, identifier: 'masterHeaderDescription', initial: 'Master Header Description' },

				// Instance Header Parameter
				CosGlobalParamFk: { location: moduleName, identifier: 'instanceHeaderParameterGridContainerTitle', initial: 'Global Parameter' },

				// Instance parameter
				InstanceFk:{location:moduleName,identifier:'entityCosInstanceFk',initial: 'Instance'},
				ParameterFk:{location:cloudCommonModule,identifier:'entityDescription',initial: 'Description'},
				ParameterValue:{location:moduleName,identifier:'entityParameterValue',initial: 'Parameter Value'},
				ParameterValueVirtual:{location:moduleName,identifier:'entityParameterValueVirtual',initial: 'Parameter Value'},
				LastEvaluated:{location:moduleName,identifier:'entityLastEvaluated',initial: 'Last Evaluated'},
				ParameterValueFk:{location:moduleName,identifier:'entityCosParameterValueFk',initial: 'CosParameter Value'},
				QuantityQuery:{location:constructionSystemMasterModule,identifier:'entityQuantityQuery',initial: 'Quantity Query'},
				ModelPropertyFk: { location: constructionSystemMasterModule, identifier: 'entityPropertyName', initial: 'Property Name' },
				ValueDetail: {location:moduleName,identifier:'entityValueDetail',initial: 'Parameter Value Detail'},

				// Instance 2 object parameter.
				PropertyName:{location:moduleName,identifier:'entityPropertyName',initial: 'Property Name'},
				IsInherit:{location:moduleName,identifier:'entityIsInherit',initial: 'Is Inherit'},
				IsOldModel:{location:moduleName,identifier:'entityIsOldModel',initial: 'Is From Old Model'},

				// model (reference module: model.project)
				ModelFk: { location: modelMainModule, identifier: 'entityModel', initial: 'Model' },
				IsComposit: { location: modelMainModule, identifier: 'containerIsComposit', initial: 'Is Composite' },

				MeshId: {location: modelMainModule, identifier: 'objectMeshId', initial: 'Geometrical ID'},

				CadIdInt: {location: modelMainModule, identifier: 'objectCadIdInt', initial: 'Numerical CAD-Id'},
				IsNegative: {location: modelMainModule, identifier: 'objectIsNegative', initial: 'Negative'},
				IsComposite: {location: modelMainModule, identifier: 'objectIsComposite', initial: 'Composite'},

				// model object (reference module: model.main)
				IsParameterChanged: { location: moduleName, identifier: 'entityIsParameterChanged', initial: 'Is Parameter Changed' },
				referenceGroup: { location: modelMainModule, identifier: 'referenceGroup', initial: 'References' },
				CpiId: { location: modelMainModule, identifier: 'objectCpiId', initial: 'CPI-Id' },
				LocationFk: { location: modelMainModule, identifier: 'entityLocation', initial: 'Location' },
				ProjectCostGroup1Fk: { location: estimateMainModule, identifier: 'prjCostGroup1Fk', initial: 'Project Cost Group 1' },
				ProjectCostGroup2Fk: { location: estimateMainModule, identifier: 'prjCostGroup2Fk', initial: 'Project Cost Group 2' },
				ProjectCostGroup3Fk: { location: estimateMainModule, identifier: 'prjCostGroup3Fk', initial: 'Project Cost Group 3' },
				ProjectCostGroup4Fk: { location: estimateMainModule, identifier: 'prjCostGroup4Fk', initial: 'Project Cost Group 4' },
				ProjectCostGroup5Fk: { location: estimateMainModule, identifier: 'prjCostGroup5Fk', initial: 'Project Cost Group 5' },
				LineItemCostGroup1Fk: { location: modelMainModule, identifier: 'entityWICCostGroup', param: { number: '1' }, initial: 'WIC Cost-Group 1' },
				LineItemCostGroup2Fk: { location: modelMainModule, identifier: 'entityWICCostGroup', param: { number: '2' }, initial: 'WIC Cost-Group 2' },
				LineItemCostGroup3Fk: { location: modelMainModule, identifier: 'entityWICCostGroup', param: { number: '3' }, initial: 'WIC Cost-Group 3' },
				LineItemCostGroup4Fk: { location: modelMainModule, identifier: 'entityWICCostGroup', param: { number: '4' }, initial: 'WIC Cost-Group 4' },
				LineItemCostGroup5Fk: { location: modelMainModule, identifier: 'entityWICCostGroup', param: { number: '5' }, initial: 'WIC Cost-Group 5' },

				ProjectSortCode01Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '1' }, initial: 'Project Sort Code 1' },
				ProjectSortCode02Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '2' }, initial: 'Project Sort Code 2' },
				ProjectSortCode03Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '3' }, initial: 'Project Sort Code 3' },
				ProjectSortCode04Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '4' }, initial: 'Project Sort Code 4' },
				ProjectSortCode05Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '5' }, initial: 'Project Sort Code 5' },
				ProjectSortCode06Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '6' }, initial: 'Project Sort Code 6' },
				ProjectSortCode07Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '7' }, initial: 'Project Sort Code 7' },
				ProjectSortCode08Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '8' }, initial: 'Project Sort Code 8' },
				ProjectSortCode09Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '9' }, initial: 'Project Sort Code 9' },
				ProjectSortCode10Fk: { location: estimateMainModule, identifier: 'prjSortCodeFk', param: { number: '10' }, initial: 'Project Sort Code 10' },

				// model property (reference module: model.main)
				ObjectFk: { location: modelMainModule, identifier: 'entityObject', initial: 'Object' },
				ObjectSetFk: { location: modelMainModule, identifier: 'objectSet.entity', initial: 'Object Set' },
				PropertyKeyFk: { location: modelMainModule, identifier: 'propertyKey', initial: 'Key' },
				PropertyValue: { location: modelMainModule, identifier: 'propertyValue', initial: 'Value' },
				UoM: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				Value: { location: modelMainModule, identifier: 'propertyValue', initial: 'Value' },
				Inherited: { location: modelMainModule, identifier: 'inherited', initial: 'Inherited' },
				IsInherited: {location: 'model.main', identifier: 'inherited', initial: 'Inherited'},

				// cos job
				JobState:{location:cloudCommonModule,identifier:'entityStatus',initial: 'Status'},
				StartTime:{location:moduleName,identifier:'entityStartTime',initial: 'Start Time'},
				EndTime:{location:moduleName,identifier:'entityEndTime',initial: 'End Time'},
				ProgressMessage:{location:moduleName,identifier:'entityProgress',initial: 'Progress'},
				ErrorMessage:{location:moduleName,identifier:'entityError',initial: 'Error'},

				// object template
				MdlDimensionTypeFk: { location: constructionSystemMasterModule, identifier: 'entityDimensionType', initial: 'Dimension Type' },
				Height: { location: constructionSystemMasterModule, identifier: 'entityHeight', initial: 'Height' },
				Multiplier: { location: constructionSystemMasterModule, identifier: 'entityMultiplier', initial: 'Multiplier' },
				PositiveColor: { location: constructionSystemMasterModule, identifier: 'entityPositiveColor', initial: 'Positive Color' },
				MdlObjectTexturePosFk: { location: constructionSystemMasterModule, identifier: 'entityMdlObjectTexturePos', initial: 'Positive Texture' },
				NegativeColor: { location: constructionSystemMasterModule, identifier: 'entityNegativeColor', initial: 'Negative Color' },
				MdlObjectTextureNegFk: { location: constructionSystemMasterModule, identifier: 'entityMdlObjectTextureNeg', initial: 'Negative Texture' },
				color: { location: constructionSystemMasterModule, identifier: 'color', initial: 'Color' },
				PrjCostGroup1Fk: { location: estimateMainModule, identifier: 'prjCostGroup1Fk', initial: 'Project Cost Group 1' },
				PrjCostGroup2Fk: { location: estimateMainModule, identifier: 'prjCostGroup2Fk', initial: 'Project Cost Group 2' },
				PrjCostGroup3Fk: { location: estimateMainModule, identifier: 'prjCostGroup3Fk', initial: 'Project Cost Group 3' },
				PrjCostGroup4Fk: { location: estimateMainModule, identifier: 'prjCostGroup4Fk', initial: 'Project Cost Group 4' },
				PrjCostGroup5Fk: { location: estimateMainModule, identifier: 'prjCostGroup5Fk', initial: 'Project Cost Group 5' },
				MdcControllingUnitFk:{location:cloudCommonModule,identifier:'entityControllingUnit',initial: 'Controlling Unit'},
				PrjLocationFk: { location: modelMainModule, identifier: 'entityLocation', initial: 'Location' },
				Offset: { location: constructionSystemMasterModule, identifier: 'entityOffset', initial: 'Offset' },

				// object template property
				MdlPropertyKeyFk:{location: constructionSystemMasterModule, identifier: 'entityProperty', initial: 'Property'},
				BasUomFk: { location: constructionSystemMasterModule, identifier: 'entityUomFk', initial: 'UoM' },
				Formula: { location: constructionSystemMasterModule, identifier: 'entityFormula', initial: 'Formula' },

				'changeOption': {location: constructionSystemMasterModule, identifier: 'chgOptionGridContainerTitle', initial: 'Change Option'},
				'ChangeOption.IsCopyLineItems': {location: constructionSystemMasterModule, identifier: 'entityIsCopyLineItems', initial: 'Is Copy Line Items'},
				'ChangeOption.IsMergeLineItems': { location: constructionSystemMasterModule, identifier: 'entityIsMergeLineItems', initial: 'Is Merge Line Items' },
				'ChangeOption.IsChange': { location: constructionSystemMasterModule, identifier: 'entityIsChange', initial: 'Is Change' }
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			// for container information service use   module container lookup
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};
			return service;
		}
	]);
})(angular);
