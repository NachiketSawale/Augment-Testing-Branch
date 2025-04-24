/**
 * Created by baf on 09.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.unit';

	/**
	 * @ngdoc service
	 * @name basicsUnitQuantityProcessorFactoryService
	 * @description provides validation methods for basics unit quantityProcessor entities
	 */
	angular.module(moduleName).service('basicsUnitQuantityProcessorFactoryService', BasicsUnitQuantityProcessorFactoryService);

	BasicsUnitQuantityProcessorFactoryService.$inject = ['_', '$q', 'platformSchemaService', 'platformLanguageService', 'platformContextService', 'platformDomainList', 'accounting', 'basicsUnitMainService'];

	function BasicsUnitQuantityProcessorFactoryService(_, $q, platformSchemaService, platformLanguageService, platformContextService, platformDomainList, accounting, basicsUnitMainService) {
		var self = this;

		this.initialize = function initialize() {
			if(!basicsUnitMainService.hasUnitsLoaded()) {
				return basicsUnitMainService.load()?.then(function() {
					return true;
				});
			}
			var deferred = $q.defer();
			deferred.resolve(true);
			return deferred.promise;
		};

		function initDomainInfo(processor, schemeRef, prop) {
			platformSchemaService.getSchema(schemeRef).then( function(scheme) {
				processor.domainInfo = platformDomainList[scheme.properties[prop].domain];
			});
		}

		function evaluateUsedProperties(settings) {
			var prefix = settings.deepObjectPrefix ? (settings.deepObjectPrefix + '.') : '';
			return {
				valueProp: prefix + settings.valueProp,
				uoMProp: prefix + settings.uoMProp,
				quantityUoMProp: prefix + settings.quantityUoMProp
			};
		}

		this.createProcessor = function createProcessor(settings) {
			var cultureInfo = platformLanguageService.getLanguageInfo(platformContextService.culture());
			var usedProperties = evaluateUsedProperties(settings);
			var processor = {
				domainInfo: null,
				processItem: function doProcessItem(item) {
					self.processItem(item, usedProperties.valueProp, usedProperties.uoMProp, usedProperties.quantityUoMProp, processor.domainInfo, cultureInfo);
				},
				revertProcessItem: function doRevertProcessItem(item) {
					self.revertProcessItem(item, settings.quantityUoMProp);
				}
			};

			initDomainInfo(processor, settings.schemeRef, settings.valueProp);

			return processor;
		};

		this.processItem = function processItem(item, valueProp, uoMProp, quantityUoMProp, domainInfo, cultureInfo) {
			var value = accounting.formatNumber(item[valueProp], domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
			var unit = basicsUnitMainService.getItemById(_.get(item,uoMProp));

			var code = '';
			if(!_.isNil(unit)) {
				code = ' ' + unit.UnitInfo.Translated;
			}

			_.set(item, quantityUoMProp, value + code);
		};

		this.revertProcessItem = function revertProcessItem(item, quantityUoMProp) {
			_.set(item, quantityUoMProp, '');
			delete item[quantityUoMProp];
		};
	}
})(angular);
