/**
 * Created by chi on 7/29/2016.
 */
(function (angular) {
	'use strict';
	/* global _ */
	/**
	 * @ngdoc service
	 * @name ServiceDataProcessDatesExtension
	 * @function
	 *
	 * @description
	 * The ServiceDataProcessDatesExtension converts date strings into real date variables.
	 */

	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).factory('ConstructionSystemMainPropertyNameProcessor', ConstructionSystemMainPropertyNameProcessor);
	ConstructionSystemMainPropertyNameProcessor.$inject = ['basicsLookupdataLookupDescriptorService'];
	function ConstructionSystemMainPropertyNameProcessor(basicsLookupdataLookupDescriptorService) {

		return function (serviceName) {

			var self = this;
			self.processItem = function processItem(item) {
				var newPropertyNames = [];
				var propertyNames = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterPropertyName');

				if (item.PropertyName !== null && angular.isDefined(item.PropertyName) && item.PropertyName !== '') {
					var found = _.find(propertyNames, function (property) {
						if (property.PropertyName === item.PropertyName && angular.isNumber(property.Id)) {
							return true;
						}
					});
					if (found) {
						item.ModelPropertyFk = found.Id;
					} else {
						var foundNew = _.find(newPropertyNames, function (property) {
							if (property.PropertyName === item.PropertyName) {
								return true;
							}
						});
						if(foundNew){
							item.ModelPropertyFk = foundNew.Id;
						}else{
							item.ModelPropertyFk = serviceName + item.Id;
							newPropertyNames.push({
								Id: item.ModelPropertyFk,
								PropertyName: item.PropertyName
							});
						}
					}
				}

				basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterPropertyName', newPropertyNames);
				basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterPropertyNameTempCache', newPropertyNames);
			};

			self.revertProcessItem = function revertProcessItem(item) {
				if (!angular.isNumber(item.ModelPropertyFk)) {
					item.ModelPropertyFk = null;
				}
			};
		};
	}
})(angular);