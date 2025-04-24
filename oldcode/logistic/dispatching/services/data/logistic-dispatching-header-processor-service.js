/**
 * Created by baf on 22.08.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingHeaderProcessorService
	 * @description processes items sent from server regarding data specific write protection of properties
	 */
	angular.module(moduleName).service('logisticDispatchingHeaderProcessorService', LogisticDispatchingHeaderProcessorService);

	LogisticDispatchingHeaderProcessorService.$inject = ['_', 'platformRuntimeDataService', 'platformDataServiceConfiguredReadonlyExtension',
		'basicsCompanyNumberGenerationInfoService', 'mainViewService', 'logisticDispatchingConstantValues'
	];

	function LogisticDispatchingHeaderProcessorService(_, platformRuntimeDataService, platformDataServiceConfiguredReadonlyExtension,
		basicsCompanyNumberGenerationInfoService, mainViewService, logisticDispatchingConstantValues
	) {
		var self = this;

		self.processItem = function processItem(item) {
			item.supportsPoolJob = true;
			if(item.IsReadOnly){
				platformRuntimeDataService.readonly(item, true);
			} else {
				var fields = [
					{field: 'DeliveryAddressContactFk', readonly: true},
					{field: 'DeliveryAddressFk', readonly: true},
					{field: 'PerformingProjectFk', readonly: true},
					{field: 'ReceivingProjectFk', readonly: true},
					{field: 'PerformingCompanyFk', readonly: true},
					{field: 'ReceivingCompanyFk', readonly: true},
					{field: 'ExchangeRate', readonly: item.LoginCompanyCurrencyFk === item.CurrencyFk}
				];
				if (item.Version >= 1) {
					fields.push({field: 'RubricCategoryFk', readonly: true});
				}

				if (item.Version === 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService').hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
					item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService').provideNumberDefaultText(item.RubricCategoryFk, item.Code);
					fields.push({field: 'Code', readonly: true});
				}

				platformDataServiceConfiguredReadonlyExtension.overrideReadOnlyProperties('Logistic.Dispatching', 'DispatchHeader', fields);

				platformRuntimeDataService.readonly(item, fields);
			}
		};

		self.processItemOnCreate = function processItemOnCreate(item) {
			let containerId = logisticDispatchingConstantValues.uuid.container.headerList;
			let defaultValues = mainViewService.customData(containerId, 'defaultValues');
			if(!_.isNil(defaultValues))
			{
				item.RubricCategoryFk = defaultValues.RubricCategoryFk;
			}

			var fields = [
				{field: 'ExchangeRate', readonly: item.LoginCompanyCurrencyFk === item.CurrencyFk}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		self.validateRubricCategory = function (item) {
			// avoid to load wrong RubricCategory
			if(item.Version === 0 && item.RubricCategoryFk === 0){
				item.RubricCategoryFk = null;
			}
		};
	}

})(angular);
