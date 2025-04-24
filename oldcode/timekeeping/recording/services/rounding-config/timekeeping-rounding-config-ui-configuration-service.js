(function () {
	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingRoundingConfigUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides Timekeeping Rounding Config UI for dialog.
	 */
	angular.module(moduleName).factory('timekeepingRoundingConfigUIConfigurationService', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			let service = {};

			let formConfig = {
				groups: [
					{
						gid: 'roundingConfig',
						header: 'Rounding Config',
						header$tr$: 'timekeeping.recording.roundingConfigDialogForm.dialogCustomizeRoundingConfigTitle',
						isOpen: true,
						visible: true,
						sortOrder: 5
					}
				],
				rows: [basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.timekeepingroundingconfigtype', '',
					{
						gid: 'roundingConfig',
						rid: 'roundingConfigType',
						label: 'Rounding Config Type',
						label$tr$: 'timekeeping.recording.roundingConfigDialogForm.roundingConfigType',
						type: 'integer',
						model: 'roundingConfigTypeFk',
						sortOrder: 1,
						readonly: true
					}, true, {required: false}),
				{
					gid: 'roundingConfig',
					rid: 'roundingConfigDesc',
					label: 'Description',
					label$tr$: 'cloud.common.entityDescription',
					type: 'description',
					model: 'roundingConfigDesc',
					readonly: false,
					visible: true,
					sortOrder: 2
				},
				{
					gid: 'roundingConfig',
					label: 'Rounding Configure Detail',
					label$tr$: 'timekeeping.recording.roundingConfigDialogForm.roundingConfigDetail',
					rid: 'roundingConfigDetail',
					type: 'directive',
					model: 'roundingConfigDetail',
					directive: 'timekeeping-rounding-config-detail-grid',
					sortOrder: 3
				}
				],
				overloads: {}
			};

			service.getFormConfig = function () {
				return angular.copy(formConfig);
			};
			function durationFormatter(row, cell, value, columnDef, entity, plainText) {
				var culture = platformContextService.culture();
				var cultureInfo = platformLanguageService.getLanguageInfo(culture);
				var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				var platformObjectHelper = $injector.get('platformObjectHelper');
				let precision = _.get(columnDef, 'formatterOptions.decimalPlaces', _.get(columnDef, 'editorOptions.decimalPlaces', 3));

				if(_.isFunction(precision)) {
					precision = precision(columnDef, columnDef.field);
				}

				if(_.isNil(precision)) {
					precision = 3;
				}

				if (!_.isNumber(value)) {
					value = platformObjectHelper.getValue(entity, columnDef.field);
				}
				value = accounting.formatNumber(value, precision, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);

				if (platformRuntimeDataService.isHideContent(entity, columnDef.field)) {
					return ' ';
				}

				if (plainText) {
					return value;
				}

				var outValue = '<div class="flex-box flex-align-center">';
				outValue += '<span class="flex-element text-right">' + value + '</span>' + '</div>';
				return outValue;
			}

			return service;

		}
	]);

})(angular);
