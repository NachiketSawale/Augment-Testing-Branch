/**
 * Created by Frank Baedeker on 22.08.2017.
 */
(function (angular) {
	'use strict';

	var projectStockModule = 'project.stock';
	var module = angular.module(projectStockModule);

	var cloudCommonModule = 'cloud.common';
	var projectMainModule = 'project.main';
	var basicsClerkModule = 'basics.clerk';
	var basicsMaterialModule = 'basics.material';
	var basicsCustomizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name projectLocationTranslationService
	 * @description provides translation for project main module
	 */
	module.service('projectStockTranslationService', ProjectStockTranslationService);

	ProjectStockTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProjectStockTranslationService(platformTranslationUtilitiesService) {
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [projectStockModule, cloudCommonModule, projectMainModule, basicsClerkModule, basicsMaterialModule,
				basicsCustomizeModule]
		};

		data.words = {
			// Entities / container / Title
			entityStock: { location: projectStockModule, identifier: 'entityStock', initial: 'Project Stock'},
			entityStockLocation: { location: projectStockModule, identifier: 'entityStockLocation', initial: 'Project Stock Location'},

			// Attributes
			ProjectFk: { location: cloudCommonModule, identifier: 'entityProject', initial: 'Project' },
			IsLocationMandatory: { location: projectStockModule, identifier: 'locationMandatory', initial: 'Location Mandatory'},
			IsProvisionAllowed: { location: projectStockModule, identifier: 'provisionAllowed', initial: 'Provision Allowed'},
			StockValuationRuleFk: { location: projectStockModule, identifier: 'stockValuationRule', initial: 'Stock Valuation Rule'},
			StockAccountingTypeFk: { location: projectStockModule, identifier: 'stockAccountingType', initial: 'Stock Accounting Type'},
			StockTypeFk: { location: projectStockModule, identifier: 'stockType', initial: 'Stock Type'},
			CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
			CommentText: { location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments' },
			IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' },
			StockLocationFk: { location: projectStockModule, identifier: 'entityStockLocation', initial: 'Storage  Location' },
			StockFk: { location: projectStockModule, identifier: 'entityStock', initial: 'Project Stock' },
			MasterDataContextFk: { location: basicsCustomizeModule, identifier: 'masterdatacontext', initial: 'Masterdata Context' },
			ProjectStockFk: { location: projectStockModule, identifier: 'entityStock', initial: 'Project Stock' },
			MaterialCatalogFk: { location: basicsMaterialModule, identifier: 'materialCatalog', initial: 'Material Catalog' },
			MaterialFk: { location: basicsMaterialModule, identifier: 'material', initial: 'Material' },
			MinQuantity: { location: projectStockModule, identifier: 'minQuantity', initial: 'Minimuum Quantity' },
			MaxQuantity: { location: projectStockModule, identifier: 'maxQuantity', initial: 'Maximuum Quantity' },
			ProvisionPercent: { location: projectStockModule, identifier: 'provisionPercent', initial: 'Provision Percent' },
			ProvisionPeruom: { location: projectStockModule, identifier: 'provisionPerUoM', initial: 'Provision Per UoM' },
			IsLotManagement: { location: projectStockModule, identifier: 'isLotManagement', initial: 'Is Lot Management' },
			ControllingUnitFk: { location: projectStockModule, identifier: 'controllingUnitFk', initial: 'ControllingUnit' },
			StandardCost: { location: projectStockModule, identifier: 'standardCost', initial: 'Standard Cost' },
			LoadingCostPercent: { location: projectStockModule, identifier: 'loadingCostPercent', initial: 'Loading Cost %' },
			StartDate: {location: basicsCustomizeModule, identifier: 'startdate', initial: 'Start Date'},
			EndDate: {location: basicsCustomizeModule, identifier: 'enddate', initial: 'End Date'},
			BasClerkFk: {location: cloudCommonModule, identifier: 'entityClerk', initial: 'Clerk'},
			BasClerkRoleFk: {location: cloudCommonModule, identifier: 'entityClerkRole', initial: 'Clerk Role'},
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
			ValidFrom : {location: basicsClerkModule, identifier: 'entityValidFrom', initial: 'Valid From'},
			ValidTo: {location: basicsClerkModule, identifier: 'entityValidTo', initial: 'Valid To' },
			Stock2MaterialStatusFk: { location: projectStockModule, identifier: 'entitystock2materialstatus', initial: 'Status' },
		};

		function provideProjectStockContainerTitle(words) {
			words.stockListContainerTitle = { location: projectStockModule, identifier: 'stockListContainerTitle', initial: 'Project Stocks'};
			words.stockDetailContainerTitle = { location: projectStockModule, identifier: 'stockDetailContainerTitle', initial: 'Project Stock Details'};
		}

		// Get some predefined packages of words used in project
		provideProjectStockContainerTitle(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addClerkContainerTranslations(data.words);
		platformTranslationUtilitiesService.addTeleComTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(this, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		this.provideProjectStockContainerTitle = provideProjectStockContainerTitle;
	}
})(angular);
