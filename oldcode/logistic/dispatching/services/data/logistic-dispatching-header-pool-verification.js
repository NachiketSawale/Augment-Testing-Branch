/**
 * Created by baf on 29.01.2018
 */

(function (angular) {
	/* global globals, Platform */
	'use strict';
	const moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingHeaderValidationService
	 * @description provides validation methods for logistic dispatching header entities
	 */
	angular.module(moduleName).service('logisticDispatchingHeaderPoolVerification', LogisticDispatchingHeaderPoolVerification);

	LogisticDispatchingHeaderPoolVerification.$inject = ['_','logisticDispatchingRecordDataService', 'logisticDispatchingConstantValues'];

	function LogisticDispatchingHeaderPoolVerification(_, logisticDispatchingRecordDataService, logisticDispatchingConstantValues) {
		let self = this;
		let headerDataService = null;

		this.startVerification = function startVerification(headerService) {
			headerDataService = headerService;

			logisticDispatchingRecordDataService.registerListLoaded(self.onRecordsLoaded);
			logisticDispatchingRecordDataService.registerTypeChanged(self.onRecordsCompositionChanged);
		};

		this.stopVerification = function stopVerification(headerService) {
			if(headerDataService === headerService) {
				logisticDispatchingRecordDataService.unregisterListLoaded(self.onRecordsLoaded);
				logisticDispatchingRecordDataService.unregisterTypeChanged(self.onRecordsCompositionChanged);
			}
		};

		this.onRecordsLoaded = function onRecordsLoaded() {
			let records = logisticDispatchingRecordDataService.getList();
			if(_.isArray(records) && records.length > 0) {
				let header = headerDataService.getItemById(records[0].DispatchHeaderFk);
				if(!_.isNil(header)) {
					let matOrSundry = _.find(records, function (rec) {
						return (rec.RecordTypeFk === logisticDispatchingConstantValues.record.type.material ||
							rec.RecordTypeFk === logisticDispatchingConstantValues.record.type.sundryService);
					});

					header.supportsPoolJob = _.isNil(matOrSundry);
				}
			}
		};

		this.onRecordsCompositionChanged = function onRecordsCompositionChanged(value, record) {
			record.RecordTypeFk = value;
			let header = headerDataService.getItemById(record.DispatchHeaderFk);
			if(!_.isNil(header)) {
				let matOrSundry = null;
				let records = logisticDispatchingRecordDataService.getList();
				if(_.isArray(records) && records.length > 0) {
					matOrSundry = _.find(records, function(rec) {
						return (rec.RecordTypeFk === logisticDispatchingConstantValues.record.type.material ||
							rec.RecordTypeFk === logisticDispatchingConstantValues.record.type.sundryService);
					});

				}
				header.supportsPoolJob = _.isNil(matOrSundry);
			}
		};
	}
})(angular);
