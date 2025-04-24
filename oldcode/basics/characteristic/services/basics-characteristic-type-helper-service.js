/**
 * Created by reimer on 16.03.2015.
 */
(function () {

	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicTypeHelperService
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicTypeHelperService', ['$q', 'moment', 'basicsCharacteristicDataDiscreteValueLookupService',
		'basicsCharacteristicCodeLookupService', '_',
		function ($q, moment,
			discreteValueLookupService,
			basicsCharacteristicCodeLookupService, _) {

			var service = {};

			service.characteristicType2Domain = function (characteristicTypeId) {

				switch (characteristicTypeId) {
					case 1:
						return 'boolean';
					case 2:
						return 'description';
					case 3:
						return 'integer';
					case 4:
						return 'percent';
					case 5:
						return 'money';
					case 6:
						return 'quantity';
					case 7:
						return 'dateutc';
					case 8:
						return 'datetimeutc';
					default:
						return 'description';
				}
			};

			service.convertValue = function (value, characteristicTypeId) {

				switch (characteristicTypeId) {
					case 1:
						// return 'boolean';
						if (value === true || value === 1 || (value + '').toLowerCase() === 'true') {
							return true;
						} else {
							return false;
						}
					case 2:
						// return 'description';
						return value;
					case 3:
						// return 'integer';
						if( _.isInteger(value)){
							return value;
						}
						if(value && _.isString(value)) {
							return value ? parseInt(value.parseUserLocaleNumber()) : null; // value may be '' or null
						}
						return value ? parseInt(value) : null; // value may be '' or null
					case 4: // return 'percent';
					case 5: // return 'money';
					case 6:
						// return 'quantity';
						return parseFloat(value);
					case 7: // return 'dateutc';
					case 8:
						// return 'datetimeutc';
						if (value && !value._isAMomentObject) {
							return moment.utc(value);
						} else {
							return value;
						}
					case 10: // lookup
						return value ? parseInt(value) : value;
					default:
						return value;
				}
			};

			service.dispatchValue = function (dataDto, characteristicTypeId) {

				switch (characteristicTypeId) {
					case 1:
						dataDto.ValueBool = dataDto.ValueText;
						break;
					case 3:
					case 4:
					case 5:
					case 6:
						dataDto.ValueNumber = dataDto.ValueText;
						break;
					case 7:
					case 8:
						dataDto.ValueDate = moment.utc(dataDto.ValueText);
						break;
					case 10: // lookup
						dataDto.CharacteristicValueFk = dataDto.ValueText !== 0 ? dataDto.ValueText : null;
						break;
				}
			};

			service.isLookupType = function (characteristicTypeId) {
				return characteristicTypeId === 10;
			};

			service.isDateOrDateTimeType = function (characteristicTypeId) {
				return characteristicTypeId === 7 || characteristicTypeId === 8;
			};

			service.ValuePlaceholders = [

				{
					id: 1, description: '@Today', getValue: function () {
						return moment.utc(new Date());
					}
				},
				{
					id: 2, description: '@FirstDayOfYear', getValue: function () {
						return moment.utc(new Date().setMonth(0, 1));
					}
				},
				{
					id: 3, description: '@FirstDayOfMonth', getValue: function () {
						return moment.utc(new Date().setDate(1));
					}
				}
			];

			service.getDefaultValue = function (characteristicDto) {

				var placeholder = _.findLast(service.ValuePlaceholders, function (item) {
					return item.description === characteristicDto.DefaultValue;
				});
				if (placeholder) {
					return placeholder.getValue();
				} else {

					if (service.isLookupType(characteristicDto.CharacteristicTypeFk)) {
						var defaultItem = discreteValueLookupService.getDefaultItem(characteristicDto.Id);
						if (defaultItem) {
							return defaultItem.Id;
						}
					} else {
						return characteristicDto.DefaultValue;
					}
				}
			};

			service.getDefaultValueAsync = function (characteristicDto) {
				var deferred = $q.defer();
				var placeholder = _.findLast(service.ValuePlaceholders, function (item) {
					return item.description === characteristicDto.DefaultValue;
				});
				if (placeholder) {
					deferred.resolve(placeholder.getValue());
				} else {

					if (service.isLookupType(characteristicDto.CharacteristicTypeFk)) {
						discreteValueLookupService.getDefaultItemAsync(characteristicDto.Id).then(function (defaultItem) {
							if (defaultItem) {
								deferred.resolve(defaultItem.Id);
							} else {
								deferred.resolve(defaultItem);
							}
						});
					} else {
						if (service.isDateOrDateTimeType(characteristicDto.CharacteristicTypeFk)) {
							deferred.resolve(null);
						} else {
							deferred.resolve(characteristicDto.DefaultValue);
						}
					}
				}
				return deferred.promise;
			};

			service.dateList = [
				{Id: '@Today', Description: '@Today'},
				{Id: '@FirstDayOfYear', Description: '@FirstDayOfYear'},
				{Id: '@FirstDayOfMonth', Description: '@FirstDayOfMonth'}
			];

			service.mergeCharacteristic = function (characteristicData, characteristicId) {

				// get the associated characteristic entity
				var characteristic = basicsCharacteristicCodeLookupService.getItemById(characteristicId);
				if (characteristic) {
					// update characteristic data
					characteristicData.CharacteristicTypeFk = characteristic.CharacteristicTypeFk;
					characteristicData.Description = characteristic.DescriptionInfo.Description;
					characteristicData.CharacteristicGroupFk = characteristic.CharacteristicGroupFk;
					characteristicData.IsReadonly = characteristic.IsReadonly;
					// set default value
					characteristicData.ValueText = service.getDefaultValue(characteristic);
				}
			};

			service.mergeCharacteristicAsync = function (characteristicData, characteristicId) {
				var deferred = $q.defer();
				// get the associated characteristic entity
				var characteristic = basicsCharacteristicCodeLookupService.getItemById(characteristicId);
				if (characteristic) {
					// update characteristic data
					characteristicData.CharacteristicTypeFk = characteristic.CharacteristicTypeFk;
					characteristicData.Description = characteristic.DescriptionInfo.Description;
					characteristicData.CharacteristicGroupFk = characteristic.CharacteristicGroupFk;
					characteristicData.IsReadonly = characteristic.IsReadonly;
					// set default value
					service.getDefaultValueAsync(characteristic).then(function (value) {
						characteristicData.ValueText = value;
						deferred.resolve();
					});
				}
				return deferred.promise;
			};

			return service;

		}]);
})();

