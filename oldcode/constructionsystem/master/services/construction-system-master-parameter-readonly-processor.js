(function (angular) {

	'use strict';

	angular.module('constructionsystem.master').constant('cosDefaultType', {
		givenDefault: 1,
		propertyOrGivenDefault: 2,
		propertyOrQuantityQuery: 3,
		quantityQuery: 4,
		quantityQueryOrProperty: 5,
		propertyCurrentObjectOrGivenDefault: 6,
		propertyCurrentObjectOrQuantityQuery: 7,
		quantityQueryOrPropertyCurrentObject: 8,
		customize: 9
	});

	angular.module('constructionsystem.master').factory('constructionSystemMasterParameterReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor', 'parameterDataTypes', 'constructionSystemMasterHeaderService', 'cosDefaultType',
			function (commonReadOnlyProcessor, parameterDataTypes, parentService, cosDefaultType) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'CosParameterDto',
					moduleSubModule: 'ConstructionSystem.Master',
					readOnlyFields: ['PropertyName', 'QuantityQuery', 'DefaultValue', 'IsLookup', 'BasFormFieldFk']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					service.setFieldsReadOnly(item);
				};

				/* jshint -W074 */
				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'PropertyName':
							if (item.CosDefaultTypeFk === cosDefaultType.propertyOrGivenDefault ||
								item.CosDefaultTypeFk === cosDefaultType.propertyOrQuantityQuery ||
								item.CosDefaultTypeFk === cosDefaultType.quantityQueryOrProperty ||
								item.CosDefaultTypeFk === cosDefaultType.propertyCurrentObjectOrGivenDefault ||
								item.CosDefaultTypeFk === cosDefaultType.propertyCurrentObjectOrQuantityQuery ||
								item.CosDefaultTypeFk === cosDefaultType.quantityQueryOrPropertyCurrentObject ||
								item.CosDefaultTypeFk === cosDefaultType.customize) {
								return true;
							}
							else {
								item.PropertyName = null;
								return false;
							}
						case 'QuantityQuery':
							if (item.CosDefaultTypeFk === cosDefaultType.quantityQuery ||
								item.CosDefaultTypeFk === cosDefaultType.propertyOrQuantityQuery ||
								item.CosDefaultTypeFk === cosDefaultType.quantityQueryOrProperty ||
								item.CosDefaultTypeFk === cosDefaultType.propertyCurrentObjectOrQuantityQuery ||
								item.CosDefaultTypeFk === cosDefaultType.quantityQueryOrPropertyCurrentObject) {
								return true;
							}
							else {
								if (item.QuantityQueryInfo) {
									item.QuantityQueryInfo.Description = null;
								}
								return false;
							}
						case 'DefaultValue':
							if (item.CosDefaultTypeFk === cosDefaultType.givenDefault ||
								item.CosDefaultTypeFk === cosDefaultType.propertyOrGivenDefault ||
								item.CosDefaultTypeFk === cosDefaultType.customize) {
								return true;
							}
							else {
								item.DefaultValue = null;
								return false;
							}
						case 'IsLookup':
							if (item.CosParameterTypeFk === parameterDataTypes.Boolean) {
								item.IsLookup = false;
								return false;
							}
							else {
								return true;
							}
						case 'BasFormFieldFk':
							if (!angular.isDefined(parentService.getSelected()) || parentService.getSelected() === null) {
								return false;
							}
							else {
								return parentService.getSelected().BasFormFk !== null;
							}
						default :
							return true;
					}
				};


				return service;
			}]);

})(angular);