(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name editor:platformEditorSettingService
	 * @function
	 * @requires
	 * @description
	 */
	angular.module('platform').factory('platformEditorSettingService', platformEditorSettingService);

	platformEditorSettingService.$inject = ['$rootScope', '$translate', 'cloudDesktopTextEditorConsts', 'platformRuntimeDataService', 'platformWysiwygEditorSettingsService'];

	function platformEditorSettingService($rootScope, $translate, cloudDesktopTextEditorConsts, platformRuntimeDataService, platformWysiwygEditorSettingsService) {
		var service = {};
		service.oldUnit = '';
		service.settings = {
			formConfig: {
				initializers: [],
				configure: {
					fid: 'SettingsView',
					version: '0.1.1',
					showGrouping: true,

					groups: [
						{
							gid: 'tool',
							header$tr$: 'platform.wysiwygEditor.settings.activate',
							isOpen: true,
							isVisible: true,
							sortOrder: 1
						},
						{
							gid: 'general',
							header$tr$: 'platform.wysiwygEditor.settings.groupGeneral',
							isOpen: true,
							isVisible: true,
							sortOrder: 10,
						},
						{
							gid: 'docview',
							isOpen: true,
							isVisible: true,
							sortOrder: 15,
						},
					],
					rows: [
						{
							gid: 'tool',
							rid: 'activateUserSettings',
							label$tr$: 'platform.wysiwygEditor.activateUserSettings',
							label: 'Activate User Settings',
							type: 'boolean',
							visible: true,
							sortOrder: 1,
							model: 'useSettings',
							change: function (entity) {
								let dataReadonly = !entity.useSettings;
								platformRuntimeDataService.readonly(entity, [
									{field: 'unitOfMeasurement', readonly: dataReadonly},
									{field: 'showRuler', readonly: dataReadonly},
									{field: 'documentWidth', readonly: dataReadonly},
									{field: 'documentPadding', readonly: dataReadonly}
								]);
							}
						},
						{
							gid: 'tool',
							rid: 'showRuler',
							label: 'Show Ruler',
							label$tr$: 'platform.wysiwygEditor.settings.showRuler',
							visible: true,
							sortOrder: 2,
							model: 'showRuler',
							type: 'boolean'
						},
						{
							gid: 'tool',
							rid: 'activateAutoNumberingSettings',
							label$tr$: 'platform.wysiwygEditor.activateAutoNumberSettings',
							label: 'Activate Autonumber Settings',
							type: 'boolean',
							visible: true,
							sortOrder: 3,
							model: 'autoNumberSettings'
						},
						{
							gid: 'general',
							rid: 'unitOfMeasurement',
							label: 'Unit Of Measurement',
							label$tr$: 'platform.wysiwygEditor.unitOfMeasurement',
							type: 'select',
							visible: true,
							model: 'unitOfMeasurement',
							options: {
								items: cloudDesktopTextEditorConsts.units,
								valueMember: 'value',
								displayMember: 'caption',
								modelIsObject: false,
							},
							change: function (entity) {

								let unit = cloudDesktopTextEditorConsts.units.find(item => item.value === entity.unitOfMeasurement);
								service.settings.formConfig.configure.groupsDict.docview.header = $translate.instant('platform.wysiwygEditor.settings.groupDocview') + ' (' + unit.caption + ')';

								let oldUnit = entity.oldUnit;

								let newDocumentWidthValue = platformWysiwygEditorSettingsService.convertInRequiredUnit(entity.unitOfMeasurement, oldUnit, entity.documentWidth);
								let docWidth = newDocumentWidthValue;
								entity.documentWidth = docWidth;

								let newPaddingValue = platformWysiwygEditorSettingsService.convertInRequiredUnit(entity.unitOfMeasurement, oldUnit, entity.documentPadding);
								let docPadding = newPaddingValue;
								entity.documentPadding = docPadding;

								entity.oldUnit = entity.unitOfMeasurement;
								service.settings.formConfig.configure.rowsDict.width.options.decimalPlaces = unit.decimal;
								service.settings.formConfig.configure.rowsDict.padding.options.decimalPlaces = unit.decimal;
								$rootScope.$broadcast('form-config-updated');
							},
							readonly: false
						},
						{
							gid: 'docview',
							rid: 'width',
							label: 'Width',
							label$tr$: 'platform.wysiwygEditor.settings.documentWidth',
							type: 'decimal',
							visible: true,
							sortOrder: 5,
							model: 'documentWidth',
							readonly: false,
							options: {
								decimalPlaces: 2
							}
						},
						{
							gid: 'docview',
							rid: 'padding',
							label: 'Margin',
							label$tr$: 'platform.wysiwygEditor.settings.documentPadding',
							type: 'decimal',
							visible: true,
							sortOrder: 10,
							model: 'documentPadding',
							readonly: false,
							options: {
								decimalPlaces: 2
							}
						},
					],
				}
			},
			headerText$tr$: 'platform.wysiwygEditor.settingsHeader',
		};

		return service;
	}
})();
