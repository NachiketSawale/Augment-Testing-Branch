(function () {
	'use strict';
	/* global _ */

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterParameterTypeHelper', ['moment',
		function (moment) {

			var service = {};

			service.parameterType2Domain = function (parameterTypeId) {

				switch (parameterTypeId) {
					case 0:
						return 'dateutc';
					case 1:
						return 'money';
					case 2:
						return 'money';
					case 3:
						return 'quantity';
					case 4:
						return 'quantity';
					case 5:
						return 'exchangerate';
					case 6:
						return 'factor';
					case 11:
						return 'date';
					case 12:
						return 'description';
					default:
						return 'description';
				}
			};

			/* jshint -W074 */
			service.dispatchValue = function (dataDto, parameterTypeId) {

				switch (parameterTypeId) {
					case 0:
						dataDto.ValueNumber = dataDto.ValueText;
						break;
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
						dataDto.ValueNumber = dataDto.ValueText;
						break;
					case 10: // lookup
						dataDto.parameterValueFk = dataDto.ValueText;
						break;
					case 11:
						dataDto.ValueDate = moment.utc(dataDto.ValueText);
						break;
					case 12:
						// noinspection SillyAssignmentJS
						// dataDto.ValueText = dataDto.ValueText;
						break;
				}
			};

			service.isLookupType = function (parameterTypeId) {
				return parameterTypeId === 10;
			};

			service.ValuePlaceholders = [

				{
					id: 1, description: '@Today', getValue: function () {
						return moment.utc(new Date());
					}
				},
				{
					id: 2, description: '@FirstDayOfYear', getValue: function () {
						var today = new Date();
						return moment.utc(new Date(today.getFullYear(), 0, 1));
					}
				},
				{
					id: 3, description: '@FirstDayOfMonth', getValue: function () {
						var today = new Date();
						return moment.utc(new Date(today.getFullYear(), today.getMonth(), 1));
					}
				}
			];

			service.getDefaultValue = function (parameterDto) {

				var placeholder = _.findLast(service.ValuePlaceholders, function (item) {
					return item.description === parameterDto.DefaultValue;
				});
				if (placeholder) {
					return placeholder.getValue();
				}
				else {
					return parameterDto.DefaultValue;
				}
			};

			service.dateList = [
				{ Id: '@Today', Description: '@Today' },
				{ Id: '@FirstDayOfYear', Description: '@FirstDayOfYear' },
				{ Id: '@FirstDayOfMonth', Description: '@FirstDayOfMonth' }
			];

			return service;

		}]);
})();

