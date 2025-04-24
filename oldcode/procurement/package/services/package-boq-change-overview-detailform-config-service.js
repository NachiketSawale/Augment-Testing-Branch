(function (angular) {
	'use strict';

	var modulename = 'procurement.package';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('packageBoqChangeOverviewDetailFormConfigService', ['$injector', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'PlatformMessenger', 'boqMainCommonService',
		'accounting', 'platformContextService', 'platformLanguageService', 'boqMainSplitQuantityConfigService', '$translate',
		function ($injector, basicsLookupdataConfigGenerator, platformSchemaService, PlatformMessenger, boqMainCommonService,
			accounting, platformContextService, platformLanguageService, boqMainSplitQuantityConfigService, $translate) {

			var service = {};

			function FormConfig(option) {

				var self = this;

				self.fid = 'boq.main.changeoverview';
				self.version = '0.1.0';
				self.showGrouping = true;
				self.groups = [
					{
						gid: 'BasicData',
						attributes: ['reference', 'briefinfo', 'f', 'contractcode', 'prjchangeid', 'prjchangestatusid', 'boqrootitemreference']
					},
					{
						gid: 'QuantityPrice',
						attributes: ['quantity', 'basuomfk', 'price', 'finalprice']
					}
				];
				self.overloads = {
					'reference': {
						'grid': {
							'validator': 'validateEntityReference'
						},
						'readonly': true
					},
					'briefinfo': {'readonly': true},
					'f': {'readonly': true},
					'contractcode': {
						'readonly': true
					},
					'prjchangeid': {
						'readonly': true,
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'project-change-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'boq-main-project-change-common-filter'
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'project-change-dialog',
								lookupOptions: {
									'showClearButton': true,
									filterKey: 'boq-main-project-change-common-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'projectchange',
								displayMember: 'Code'
							},
							width: 130
						}
					},
					'prjchangestatusid': {
						detail: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.projectchangestatus', 'Description', {
							field: 'RubricCategoryFk',
							customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
						}),
						grid: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.projectchangestatus',
							att2BDisplayed: 'Description',
							readOnly: true,
							options: {
								showIcon: true,
								imageSelectorService: 'platformStatusIconService',
								field: 'RubricCategoryFk',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
							}
						}),
						'readonly': true
					},
					'quantity': {
						'grid': {
							'formatter': function (row, cell, value, columnDef, entity, plainText) {
								return quantityFormatter(row, cell, value, columnDef, entity, plainText, option);
							},
							'readonly': true
						}
					},
					'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'boqUomLookupDataService',
						filterKey: 'boq-uom-filter',
						filter: function (boqItem) {
							var currentBoqHeader = null;
							if (boqItem) {
								currentBoqHeader = {BoqHeaderId: boqItem.BoqHeaderFk};
							}

							return currentBoqHeader;
						},
						enableCache: true,
						'readonly': true
					}),
					'price': {'readonly': true},
					'finalprice': {'readonly': true},
					'boqrootitemreference': {'readonly': true}
				};
			}

			service.getFormConfig = function (options) {

				var returnedFormConfig = new FormConfig(options); // angular.copy(formConfig);

				// Suppress bulk support for below given fields
				var fieldsToRemoveFromBulkSupport = ['reference', 'boqlinetypefk'];
				_.each(fieldsToRemoveFromBulkSupport, function (field) {
					if (returnedFormConfig.overloads && returnedFormConfig.overloads[field] && returnedFormConfig.overloads[field].grid) {
						returnedFormConfig.overloads[field].grid.bulkSupport = false;
					}
				});

				return returnedFormConfig;
			};

			function quantityFormatter(row, cell, value, columnDef, entity, plainText/* , option */) {

				var culture = platformContextService.culture();
				var cultureInfo = platformLanguageService.getLanguageInfo(culture);
				var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				var platformObjectHelper = $injector.get('platformObjectHelper');
				var precision = (columnDef.formatterOptions && columnDef.formatterOptions.decimalPlaces) || (columnDef.editorOptions && columnDef.editorOptions.decimalPlaces) || 3;
				if (!_.isNumber(value)) {
					value = platformObjectHelper.getValue(entity, columnDef.field);
				}
				value = accounting.formatNumber(value, precision, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);

				if (platformRuntimeDataService.isHideZeroValue(entity, columnDef.field)) {
					return ' ';
				}

				if (plainText) {
					return value;
				}

				var outValue = '<div class="flex-box flex-align-center">';
				if (entity.HasSplitQuantities) {
					outValue += '<i class="block-image control-icons ico-split-quantity" title="' + $translate.instant('boq.main.QuantitySplit') + '"></i>';
				}
				outValue += '<span class="flex-element text-right">' + value + '</span>' + '</div>';
				return outValue;
			}

			return service;
		}
	]);

})(angular);
