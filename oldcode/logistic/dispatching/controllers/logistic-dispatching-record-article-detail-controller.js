/**
 * Created by leo on 11.04.2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRecordForTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching record for type entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingRecordArticleDetailController', LogisticDispatchingRecordArticleDetailController);

	LogisticDispatchingRecordArticleDetailController.$inject = ['$scope', 'platformRecordArticleDetailControllerService', 'logisticDispatchingRecordArticleDataService', 'logisticDispatchingConstantValues', '$injector', 'platformTranslateService', 'logisticDispatchingTranslationService',
		'logisticDispatchingRecordDataService', 'platformDataServiceProcessDatesBySchemeExtension'];

	function LogisticDispatchingRecordArticleDetailController($scope, platformRecordArticleDetailControllerService, logisticDispatchingRecordArticleDataService, logisticDispatchingConstantValues, $injector, platformTranslateService, logisticDispatchingTranslationService,
		logisticDispatchingRecordDataService, platformDataServiceProcessDatesBySchemeExtension) {

		var configDefinitions = [];
		configDefinitions[logisticDispatchingConstantValues.record.type.material] = {
			moduleName: 'logistic.job',
			configService: 'basicsMaterialRecordUIConfigurationService',
			options: {
				module: 'Basics.Material',
				dto: 'MaterialDto',
				lookupType: 'MaterialLookup',
				dataServiceName: 'logisticCommonMaterialDataService',
				processor: platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'MaterialDto',
					moduleSubModule: 'Basics.Material'
				})
			}
		};
		configDefinitions[logisticDispatchingConstantValues.record.type.plant] = {
			containerUid: '14744d2f5e004676abfefd1329b6beff',
			origModuleName: 'resource.equipment',
			options: {
				module: 'Resource.Equipment',
				dto: 'EquipmentPlantDto',
				lookupType: 'equipmentPlant',
				version: 3,
				processor: platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'EquipmentPlantDto',
					moduleSubModule: 'Resource.Equipment'
				})
			}
		};
		configDefinitions[logisticDispatchingConstantValues.record.type.resource] = {
			containerUid: 'd9391c21eaac4fb7b5db3178af56bdaa',
			origModuleName: 'resource.master',
			options: {
				module: 'Resource.Master',
				dto: 'ResourceDto',
				lookupType: 'ResourceMasterResource',
				version: 3,
				processor: platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ResourceDto',
					moduleSubModule: 'Resource.Master'
				})
			}
		};
		configDefinitions[logisticDispatchingConstantValues.record.type.costCode] = {
			configService: 'basicsCostCodesUIStandardService',
			options: {
				module: 'Basics.CostCodes',
				dto: 'CostCodeDto',
				lookupType: 'costcode',
				processor: platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'CostCodeDto',
					moduleSubModule: 'Basics.CostCodes'
				})
			}
		};
		configDefinitions[logisticDispatchingConstantValues.record.type.fabricatedProduct] =  {
			configService: 'productionplanningCommonProductUIStandardService',
			options: {
				module: 'ProductionPlanning.Common',
				dto: 'ProductDto',
				lookupType: 'CommonProduct',
				version: 3,
				processor: platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ProductDto',
					moduleSubModule: 'ProductionPlanning.Common'
				})
			}
		};
		configDefinitions[logisticDispatchingConstantValues.record.type.sundryService] = {
			containerUid: '3e8ef5f3b7c741f486e60dd2bb1c564c',
			origModuleName: 'logistic.sundryservice',
			options: {
				module: 'Logistic.SundryService',
				dto: 'SundryServiceDto',
				lookupType: 'logisticSundryServiceFk',
				version: 3,
				dataServiceName: 'logisticSundryServiceFilterLookupDataService',
				processor: platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'SundryServiceDto',
					moduleSubModule: 'Logistic.SundryService'
				})
			}
		};

		platformRecordArticleDetailControllerService.initController($scope, 'RecordTypeFk', 'ArticleFk', configDefinitions,
			logisticDispatchingConstantValues.record.type.resource, logisticDispatchingRecordArticleDataService, logisticDispatchingRecordDataService, logisticDispatchingTranslationService);

	}
})(angular);