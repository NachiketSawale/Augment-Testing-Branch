/**
 * Created by leo on 06.05.2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobTaskArticleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job article entities.
	 **/
	angular.module(moduleName).controller('logisticJobTaskArticleDetailController', LogisticJobTaskArticleDetailController);

	LogisticJobTaskArticleDetailController.$inject = ['$scope', 'platformRecordArticleDetailControllerService', 'logisticJobTaskArticleDataService', 'logisticJobConstantValues', '$injector', 'platformTranslateService',
		'logisticJobTranslationService', 'logisticJobTaskDataService', 'platformDataServiceProcessDatesBySchemeExtension'];

	function LogisticJobTaskArticleDetailController($scope, platformRecordArticleDetailControllerService, logisticJobTaskArticleDataService, logisticJobConstantValues, $injector, platformTranslateService,
	                                                logisticJobTranslationService, logisticJobTaskDataService, platformDataServiceProcessDatesBySchemeExtension) {

		var configDefinitions = [];
		configDefinitions[logisticJobConstantValues.jobTaskType.contract] = {
			moduleName: 'logistic.job',
			configService: 'procurementCommonItemUIStandardService',
			options: {
				module: 'Procurement.Common',
				dto: 'PrcItemDto',
				lookupType: 'PrcItem',
				dataServiceName: 'logisticJobTaskPrcItemDataService',
				processor: platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PrcItemDto',
					moduleSubModule: 'Procurement.Common'
				})
			}
		};
		configDefinitions[logisticJobConstantValues.jobTaskType.invoice] = {
			configService: 'procurementInvoiceOtherUIStandardService',
			options: {
				module: 'Procurement.Invoice',
				dto: 'InvOtherDto',
				lookupType: 'InvOther',
				dataServiceName: 'logisticJobTaskPrcInvoiceDataService',
				processor: platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'InvOtherDto',
					moduleSubModule: 'Procurement.Invoice'
				})
			}
		};

		platformRecordArticleDetailControllerService.initController($scope, 'JobTaskTypeFk', 'ArticleFk', configDefinitions,
				logisticJobConstantValues.jobTaskType.contract, logisticJobTaskArticleDataService, logisticJobTaskDataService, logisticJobTranslationService);

	}
})(angular);