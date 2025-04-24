/**
 * Created by leo on 11.04.2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementDispatchRecordDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching record for type entities.
	 **/
	angular.module(moduleName).controller('logisticSettlementDispatchRecordDetailController', LogisticSettlementDispatchRecordDetailController);

	LogisticSettlementDispatchRecordDetailController.$inject = ['$scope', 'platformRecordArticleDetailControllerService', 'logisticSettlementDispatchRecordDataService', 'logisticDispatchingConstantValues', '$injector', 'platformTranslateService', 'logisticDispatchingTranslationService',
		'logisticSettlementItemDataService', 'platformDataServiceProcessDatesBySchemeExtension'];

	function LogisticSettlementDispatchRecordDetailController($scope, platformRecordArticleDetailControllerService, logisticSettlementDispatchRecordDataService, logisticDispatchingConstantValues, $injector, platformTranslateService, logisticDispatchingTranslationService,
	                                                          logisticSettlementItemDataService, platformDataServiceProcessDatesBySchemeExtension) {

		var configDefinitions = [];
		configDefinitions[0] = {
			configService: 'logisticDispatchingRecordUIConfigurationService',
			options: {
				module: 'Logistic.Dispatching',
				dto: 'DispatchRecordDto',
				lookupType: 'DispatchRecord',
				dataServiceName: 'logisticCommonDispatchRecordDataService',
				processor: platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'DispatchRecordDto',
					moduleSubModule: 'Logistic.Dispatching'
				})
			}
		};

		platformRecordArticleDetailControllerService.initController($scope, null, 'DispatchRecordFk', configDefinitions,
				0, logisticSettlementDispatchRecordDataService, logisticSettlementItemDataService, logisticDispatchingTranslationService);

	}
})(angular);