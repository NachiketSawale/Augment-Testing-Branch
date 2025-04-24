/**
 * Created by zov on 02/04/2019.
 */
(function () {
	'use strict';
	/* global angular */

	var currentModule = 'productionplanning.drawing';
	var cloudCommonModule = 'cloud.common';
	var ppsCommonModule = 'productionplanning.common';
	var projectCostCodesModule = 'project.costcodes';
	var basicsMaterialModule = 'basics.material';
	var ppsAccounting = 'productionplanning.accounting';
	var productTemplate = 'productionplanning.producttemplate';
	var ppsCadImport = 'productionplanning.cadimport';
	var logisticJobModule = 'logistic.job';
	var resourceTypeModule = 'resource.type';

	angular.module(currentModule).factory('productionplanningDrawingTranslationService', [
		'platformTranslationUtilitiesService',
		'ppsTranslationUtilService',
		'ppsCommonCustomColumnsServiceFactory',
		function (platformTranslationUtilitiesService,
				  ppsTranslationUtilService,
				  customColumnsServiceFactory) {
			var service = {};

			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [currentModule, cloudCommonModule, ppsCommonModule, projectCostCodesModule, basicsMaterialModule, ppsAccounting, productTemplate, ppsCadImport, logisticJobModule],
				words: {
					EngDrawingStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
					EngDrawingTypeFk: {
						location: currentModule,
						identifier: 'engDrawingTypeFk',
						initial: '*Drawing Type'
					},
					IsFullyAccounted : {
						location: currentModule,
						identifier: 'isFullyAccounted ',
						initial: '*Is Fully Accounted'
					},
					PrjProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: '*Project'},
					BasClerkFk: {
						location: currentModule,
						identifier: 'responsibleClerk',
						initial: '*Responsible Clerk'
					},
					basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
					Assignment: {location: ppsCommonModule, identifier: 'assignment', initial: '*Assignment'},
					LgmJobFk: {location: projectCostCodesModule, identifier: 'lgmJobFk', initial: '*Logistic Job'},
					PrjLocationFk: {location: ppsCommonModule, identifier: 'prjLocationFk', initial: '*Location'},
					MdcControllingunitFk: {
						location: ppsCommonModule,
						identifier: 'mdcControllingUnitFk',
						initial: '*Controlling Unit'
					},

					EngDrwCompStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
					EngDrwCompTypeFk: {
						location: currentModule,
						identifier: 'drawingComponent.engDrwCompTypeFk',
						initial: '*Component Type'
					},
					MdcMaterialFk: {
						location: basicsMaterialModule,
						identifier: 'record.material',
						initial: '*Material'
					},
					MdcCostCodeFk: {location: cloudCommonModule, identifier: 'entityCostCode', initial: '*Cost Code'},
					BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*Uom'},
					Isimported: {location: currentModule, identifier: 'drawingComponent.isImported', initial: '*Is Imported'},
					EngAccRulesetResultFk: {location: currentModule, identifier: 'drawingComponent.rulesetResult', initial: '*Ruleset Result'},
					EngAccountingRuleFk: {location: currentModule, identifier: 'drawingComponent.rulePattern', initial: '*Rule-Pattern'},
					PpsItemFk: { location: ppsCommonModule, identifier: 'event.itemFk', initial: 'PPS Item' },

					Uom2Fk: {location: currentModule, identifier: 'drawingComponent.uom2', initial: '*Uom2'},
					Uom3Fk: {location: currentModule, identifier: 'drawingComponent.uom3', initial: '*Uom3'},
					Quantity2 : {location: currentModule, identifier: 'drawingComponent.quantity2', initial: '*Quantity2'},
					Quantity3 : {location: currentModule, identifier: 'drawingComponent.quantity3', initial: '*Quantity3'},

					BillingQuantity: { location: ppsCommonModule, identifier: 'product.billQuantity', initial: '*Bill Quantity' },
					BasUomBillFk: { location: ppsCommonModule, identifier: 'product.billUoM', initial: '*Bill Uom' },

					Length: {location: ppsCommonModule, identifier: 'product.length', initial: '*Length'},
					UomLengthFk: {location: ppsCommonModule, identifier: 'product.lengthUoM', initial: '*Length UoM'},
					Width: {location: ppsCommonModule, identifier: 'product.width', initial: '*Width'},
					UomWidthFk: {location: ppsCommonModule, identifier: 'product.widthUoM', initial: '*Width UoM'},
					Height: {location: ppsCommonModule, identifier: 'product.height', initial: '*Height'},
					UomHeightFk: {location: ppsCommonModule, identifier: 'product.heightUoM', initial: '*Height UoM'},
					Weight: {location: ppsCommonModule, identifier: 'product.weight', initial: '*Weight'},
					UomWeightFk: {location: ppsCommonModule, identifier: 'product.weightUoM', initial: '*Weight UoM'},
					Type: {location: currentModule, identifier: 'type', initial: '*Type'},
					PlanningInformation:{location: ppsCommonModule, identifier: 'event.planInformation', initial: '*Planning Information'},
					Quantities:{location: currentModule, identifier: 'drawingComponent.quantities', initial: '*Quantities'},
					RuleInformation:{location: currentModule, identifier: 'drawingComponent.ruleInformation', initial: '*Rule Information'},
					MdcMaterialCostCodeFk: {location: currentModule, identifier: 'drawingComponent.materialCostCode', initial: '*Material/CostCode'},
					XADSLegacyType: {location: currentModule, identifier: 'xads.legacytype', initial: '*Legacy Type'},
					XADSPosNo: {location: currentModule, identifier: 'xads.posno', initial: '*Pos No'},
					XADSGroup: {location: currentModule, identifier: 'xads.group', initial: '*Group'},
					XADSCode: {location: currentModule, identifier: 'xads.code', initial: '*Code'},
					XADSArticleID: {location: currentModule, identifier: 'xads.articleid', initial: '*Article ID'},
					XADSName: {location: currentModule, identifier: 'xads.name', initial: '*Name'},
					XADSCADName: {location: currentModule, identifier: 'xads.cadname', initial: '*CAD Name'},
					XADSUnit: {location: currentModule, identifier: 'xads.unit', initial: '*Unit'},
					XADSAmount: {location: currentModule, identifier: 'xads.amount', initial: '*Amount'},
					XADSPrice: {location: currentModule, identifier: 'xads.price', initial: '*Price'},
					KSTElementNumber:{location: currentModule, identifier: 'kst.elementnumber', initial: '*Element Number'},
					KSTElementType:{location: currentModule, identifier: 'kst.elementtype', initial: '*Element Type'},
					KSTDataSetNumber:{location: currentModule, identifier: 'kst.datasetnumber', initial: '*DataSet Number'},
					KSTArticleNumber:{location: currentModule, identifier: 'kst.articlenumber', initial: '*Article Number'},
					KSTQuantity:{location: currentModule, identifier: 'kst.quantity', initial: '*Quantity'},
					KSTUnit:{location: currentModule, identifier: 'kst.unit', initial: '*Unit'},
					KSTDescription:{location: currentModule, identifier: 'kst.description', initial: '*Description'},
					DocColor:{location: ppsCommonModule, identifier: 'docColor', initial: '*Doc State'},
					CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: '*Comment'},
					Revision: {location: ppsCommonModule, identifier: 'document.revision.revision', initial: '*Revision'},
					DbId:{location: ppsCommonModule, identifier: 'summary', initial: '*Summary'},
					// DrawingSkill
					ResSkillFk: {location: currentModule, identifier: 'skill.resSkillFk', initial: '*Skill'},
					CsvElementMark:{location: currentModule, identifier: 'csv.elementmark', initial: '*Element Mark'},
					CsvElementConfig:{location: currentModule, identifier: 'csv.elementconfig', initial: '*Element Config'},
					CsvArticleMark:{location: currentModule, identifier: 'csv.articlemark', initial: '*Article Mark'},
					CsvArticleDescription:{location: currentModule, identifier: 'csv.articledescription', initial: '*Article Description'},
					ResTypeFk: {location: resourceTypeModule, identifier: 'entityResourceType', initial: 'Resource Type'},
					EngDrawingFk: { location: ppsCommonModule, identifier: 'header.masterDrawingFk', initial: '*Master Drawing' }
				}
			};

			var customColumnsService = customColumnsServiceFactory.getService(currentModule);
			customColumnsService.init('productionplanning/drawing/customcolumn').then(function (result){
				customColumnsService.setTranslation(data.words);
			});

			// Add LicCostGroup,PrjCostGroup translation
			ppsTranslationUtilService.addLicCostGroupTranslation(data);
			ppsTranslationUtilService.addPrjCostGroupTranslation(data);

			//Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 10, 'UserDefined');

			//Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			//Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})();