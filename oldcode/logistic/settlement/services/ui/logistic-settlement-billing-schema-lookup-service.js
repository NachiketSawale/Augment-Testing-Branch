/**
 * Created by baf on 01.04.2019
 */
 
 (function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	angular.module(moduleName).service('logisticSettlementBillingSchemaLookupService', LogisticSettlementBillingSchemaLookupService);
	
	LogisticSettlementBillingSchemaLookupService.$inject = ['_', '$q', 'basicsLookupdataConfigGenerator', 'logisticSettlementBillingSchemaDataService'];
	
	function LogisticSettlementBillingSchemaLookupService(_, $q, basicsLookupdataConfigGenerator, logisticSettlementBillingSchemaDataService) {
		var self = this;
		
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticSettlementBillingSchemaLookupService', {
			valMember: 'Id',
			dispMember: 'Description',
			showIcon:false,
			columns: [
				{
					id: 'Description',
					field: 'Description',
					name: 'Description',
					formatter: 'description',
					width: 250,
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'Amount',
					field: 'Amount',
					name: 'Amount',
					formatter: 'money',
					width: 150,
					name$tr$: 'cloud.common.entityAmount'
				},
				{
					id: 'Sorting',
					field: 'Sorting',
					name: 'Sorting',
					formatter: 'integer',
					width: 150,
					name$tr$: 'basics.billingschema.entitySorting'
				}
			],
			uuid: '665a24fdc7da46478b77a0676738680e'
		});

		this.resetCache = _.noop;//function (options) {};

		this.setCache = _.noop;//function (options, items) {};

		// returns data sync and triggers the async getlist if not already done => no promise
		this.getListSync = function getListSync() {
			return logisticSettlementBillingSchemaDataService.getList();
		};

		// returns data async => promise
		this.getList = function getList() {
			return $q.when(self.getListSync());
		};

		this.getLookupData = function getLookupData() {
			return $q.when(self.getListSync());
		};


		this.getDefault = function getDefault() {
			return null;
		};

		this.getItemById = function getItemById(id) {
			return logisticSettlementBillingSchemaDataService.getItemById(id);
		};

		this.getItemByIdAsync = function getItemById(id) {
			return $q.when(self.getItemById(id));
		};

		this.selectableCallback = function(candidate) {
			var selected = logisticSettlementBillingSchemaDataService.getSelectedItem();
			
			return selected.Id !== candidate.Id && selected.Sorting < candidate.Sorting;
		};
	}
})(angular);

