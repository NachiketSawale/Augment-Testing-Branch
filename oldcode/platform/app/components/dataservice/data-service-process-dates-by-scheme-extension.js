/**
 * Created by baf on 11.09.2014.
 */
(function (angular) {
	/* global moment */
	'use strict';
	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceProcessDatesBySchemeExtension
	 * @function
	 * @requires platformSchemaService, _
	 * @description
	 * platformDataServiceProcessDatesBySchemeExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceProcessDatesBySchemeExtension', PlatformDataServiceProcessDatesBySchemeExtension);

	PlatformDataServiceProcessDatesBySchemeExtension.$inject = ['platformSchemaService', '_'];

	function PlatformDataServiceProcessDatesBySchemeExtension(platformSchemaService, _) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceNavigationExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.createProcessor = function createProcessor(schemeRef) {
			var processor = {
				fields: [],
				processItem: function doProcessItem(item) {
					self.processItem(item, processor.fields);
				},
				revertProcessItem: function doRevertProcessItem(item) {
					self.revertProcessItem(item, processor.fields);
				}
			};

			self.getDateFields(schemeRef, processor);

			return processor;
		};

		this.createProcessorFromScheme = function createProcessor(scheme) {
			var processor = {
				fields: [],
				processItem: function doProcessItem(item) {
					self.processItem(item, processor.fields);
				},
				revertProcessItem: function doRevertProcessItem(item) {
					self.revertProcessItem(item, processor.fields);
				}
			};

			self.getDateFieldsFromScheme(scheme, processor);

			return processor;
		};

		this.parseString = function formatDate(item, field, format) {
			switch (format) {
				case 'date':
					item[field] = moment(item[field]);
					break;
				case 'dateutc':
					item[field] = moment.utc(item[field]);
					break;
				case 'datetime':
					item[field] = moment(item[field]);
					break;
				case 'datetimeutc':
					item[field] = moment.utc(item[field]);
					break;
				case 'timeutc':
					var timeMoment = moment.utc(item[field]);
					if (!timeMoment.isValid()) {
						timeMoment = moment.utc('1970-01-01 ' + item[field]);
					}
					item[field] = timeMoment;
					break;
				default:
					break;
			}
		};

		this.processItem = function processItem(item, fields) {
			if (!_.isNil(item)) {
				_.forEach(fields, function (entry) {
					if (item[entry.field]) {
						self.parseString(item, entry.field, entry.format);
					}
				});
			}
		};

		this.formatMoment = function formatMoment(item, field, format) {
			switch (format) {
				case 'date':
					item[field] = item[field].format('YYYY[-]MM[-]DD[T00:00:00Z]');
					break;
				case 'dateutc':
					item[field] = item[field].utc().format();
					break;
				case 'datetime':
					item[field] = item[field].format('YYYY[-]MM[-]DD[T]HH[:]mm[:]ss[Z]');
					break;
				case 'datetimeutc':
					item[field] = item[field].utc().format();
					break;
				case 'timeutc':
					item[field] = item[field].utc().format();
					break;
				default:
					break;
			}
		};

		this.revertProcessItem = function revertProcessItem(item, fields) {
			var field;
			_.forEach(fields, function (entry) {
				field = entry.field;
				if (item[field] && !angular.isString(item[field])) {
					self.formatMoment(item, entry.field, entry.format);
				}
			});
		};

		this.getDateFields = function getDateFields(schemeRef, processor) {
			platformSchemaService.getSchema(schemeRef).then(function (scheme) {
				self.getDateFieldsFromScheme(scheme, processor);
			});
		};

		this.getDateFieldsFromScheme = function getDateFieldsFromScheme(scheme, processor) {
			var objProperties = scheme.properties;
			for (var prop in objProperties) {
				if (objProperties.hasOwnProperty(prop)) {
					switch (objProperties[prop].domain) {
						case 'date':
							processor.fields.push({field: prop, format: 'date'});
							break;
						case 'dateutc':
							processor.fields.push({field: prop, format: 'dateutc'});
							break;
						case 'datetime':
							processor.fields.push({field: prop, format: 'datetime'});
							break;
						case 'datetimeutc':
							processor.fields.push({field: prop, format: 'datetimeutc'});
							break;
						case 'timeutc':
							processor.fields.push({field: prop, format: 'timeutc'});
							break;
						default:
							break;
					}
				}
			}
		};
	}
})(angular);
