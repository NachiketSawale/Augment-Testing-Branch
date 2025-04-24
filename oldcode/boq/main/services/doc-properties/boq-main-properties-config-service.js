(function () {
	/* global _ */
	'use strict';

	var modulename = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('boqMainPropertiesConfigService', ['$injector', 'basicsLookupdataConfigGenerator', 'boqMainCatalogAssignmentUIConfigService',
		function ($injector, basicsLookupdataConfigGenerator, boqMainCatalogAssignmentUIConfigService) {

			var service = {};

			var breakdownServiceOptions = {
				serviceName: 'boqMainUrBreakdownService',
				displayMember: 'DescriptionInfo.Translated',
				valueMember: 'DescriptionInfo.Translated',
				modelIsObject: false,
				inputDomain: 'description',
				formatter: 'description'
			};

			var formConfig = {
				showGrouping: true,
				change: 'change',
				groups: [
					{gid: '1', header: 'BoQ Configuration', header$tr$: 'boq.main.boqConfiguration', isOpen: true, visible: true, sortOrder: 1},
					{gid: '2', header: 'BoQ Structure', header$tr$: 'boq.main.Structure', isOpen: true, visible: true, sortOrder: 2},
					{gid: '3', header: 'Unit Rate Portions', header$tr$: 'boq.main.UrBreakdown', isOpen: true, visible: true, sortOrder: 3},
					{gid: '4', header: 'User Defined', header$tr$: 'boq.main.UserDefined', isOpen: true, visible: true, sortOrder: 4}
				],
				rows: [
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
						'basics.lookup.boqtype',
						'Description',
						{
							gid: '1',
							rid: 'type',
							model: 'BoqTypeId',
							sortOrder: 1,
							label$tr$: 'boq.main.boqType',
							type: 'integer'
						},
						false,
						{
							filterKey: 'boqTypeFilter',
							customIntegerProperty: 'MDC_LINEITEMCONTEXT_FK',
							required: true
						}
					),
					{
						gid: '1', rid: 'editConfig', label: 'Edit BoQ Configuration', label$tr$: 'boq.main.boqSpecificStruc',
						type: 'boolean', model: 'IsChecked', checked: false, disabled: false, visible: true, sortOrder: 2
					},
					{
						gid: '1', rid: 'str', label: 'Description', label$tr$: 'cloud.common.descriptionInfo',
						type: 'description', model: 'Description', readonly: false, visible: true, sortOrder: 3
					},
					{
						gid: '2', rid: 'standard', label: 'BoQ Standard', label$tr$: 'boq.main.boqStandard',
						type: 'select', model: 'BoqStandardFk',
						options: {
							serviceName: 'boqMainBoqStandardService',
							displayMember: 'DescriptionInfo.Translated',
							valueMember: 'Id'
						},
						readonly: false, disabled: false, visible: true, sortOrder: 1
					},
					{
						gid: '2', rid: 'mask', label$tr$: 'boq.main.boqMask', type: 'description', model: 'Boqmask', sortOrder: 2, visible: true, readonly: true
					},
					{
						gid: '2', rid: 'oenMask', label: ' ', type: 'select', model: 'OenBoqStructureId', visible: true, sortOrder: 2,
						options: { serviceName:'boqMainOenBoqStructureService', valueMember:'Id', displayMember:'Boqmask' }
					},
					{
						gid: '2', rid: 'detail', label: 'Structure Details', label$tr$: 'boq.main.structDetails',
						type: 'directive', model: 'StructureDetails', directive: 'boq-main-boq-structure-details',
						readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 3
					},
					{
						gid: '2', rid: 'enfrcStr', label: 'Enforce Structure', label$tr$: 'boq.main.enforceStruct',
						type: 'boolean', model: 'EnforceStructure', checked: false, disabled: false, visible: true, sortOrder: 4
					},
					{
						gid: '2', rid: 'leadZero', label: 'Reference No. with leading zeros', label$tr$: 'boq.main.refNoLeadingZeros',
						type: 'boolean', model: 'LeadingZeros', checked: false, disabled: false, visible: true, sortOrder: 7
					},
					{
						gid: '2', rid: 'skippedHierarchies', label: 'Allow skipped hierarchies', label$tr$: 'boq.main.SkippedHierarchiesAllowed',
						type: 'boolean', model: 'SkippedHierarchiesAllowed', checked: false, disabled: false, visible: true, sortOrder: 8
					},
					{
						gid: '3', rid: 'ed1', label: '1st UR Breakdown', label$tr$: 'boq.main.Urb1',
						type: 'inputselect', model: 'NameUrb1',
						options: angular.copy(breakdownServiceOptions),
						disabled: false, visible: true, sortOrder: 1
					},
					{
						gid: '3', rid: 'ed2', label: '2nd UR Breakdown', label$tr$: 'boq.main.Urb2',
						type: 'inputselect', model: 'NameUrb2',
						options: angular.copy(breakdownServiceOptions),
						disabled: false, visible: true, sortOrder: 2
					},
					{
						gid: '3', rid: 'ed3', label: '3rd UR Breakdown', label$tr$: 'boq.main.Urb3',
						type: 'inputselect', model: 'NameUrb3',
						options: angular.copy(breakdownServiceOptions),
						disabled: false, visible: true, sortOrder: 3
					},
					{
						gid: '3', rid: 'ed4', label: '4th UR Breakdown', label$tr$: 'boq.main.Urb4',
						type: 'inputselect', model: 'NameUrb4',
						options: angular.copy(breakdownServiceOptions),
						disabled: false, visible: true, sortOrder: 4
					},
					{
						gid: '3', rid: 'ed5', label: '5th UR Breakdown', label$tr$: 'boq.main.Urb5',
						type: 'inputselect', model: 'NameUrb5',
						options: angular.copy(breakdownServiceOptions),
						disabled: false, visible: true, sortOrder: 5
					},
					{
						gid: '3', rid: 'ed6', label: '6th UR Breakdown', label$tr$: 'boq.main.Urb6',
						type: 'inputselect', model: 'NameUrb6',
						options: angular.copy(breakdownServiceOptions),
						disabled: false, visible: true, sortOrder: 6
					},
					{
						gid: '3', rid: '7', label: 'UR is calculated mandatory from URB Total', label$tr$: 'boq.main.urCalcByURB',
						type: 'boolean', model: 'CalcFromUrb', checked: false, disabled: false, visible: true, sortOrder: 7
					},
					{
						gid: '4', rid: 'f1', label: 'Field1', label$tr$: 'boq.main.Userdefined1',
						type: 'description', model: 'NameUserdefined1', readonly: false, visible: true, sortOrder: 1
					},
					{
						gid: '4', rid: 'f2', label: 'Field2', label$tr$: 'boq.main.Userdefined2',
						type: 'description', model: 'NameUserdefined2', readonly: false, visible: true, sortOrder: 2
					},
					{
						gid: '4', rid: 'f3', label: 'Field3', label$tr$: 'boq.main.Userdefined3',
						type: 'description', model: 'NameUserdefined3', readonly: false, visible: true, sortOrder: 3
					},
					{
						gid: '4', rid: 'f4', label: 'Field4', label$tr$: 'boq.main.Userdefined4',
						type: 'description', model: 'NameUserdefined4', readonly: false, visible: true, sortOrder: 4
					},
					{
						gid: '4', rid: 'f5', label: 'Field5', label$tr$: 'boq.main.Userdefined5',
						type: 'description', model: 'NameUserdefined5', readonly: false, visible: true, sortOrder: 5
					}]
			};

			/**
			 * @ngdoc function
			 * @name getFormConfig
			 * @function
			 * @methodOf boqMainPropertiesConfigService
			 * @description Builds and returns the form configuration for the boq document properties dialog
			 * @parameter {Boolean} systemPropertiesOnly: return only those properties relevant for the system boq document properties
			 * @parameter {Boolean} catalogSystemOnly only config in customizing module
			 * @parameter {Boolean} urpConfig: config prepared for urp config
			 * @parameter boqTypeFk: boq type whose structure information are to be displayed
			 * @return {Object}: deep copy of the built form configuration
			 */
			service.getFormConfig = function (systemPropertiesOnly, catalogSystemOnly, urpConfig) {

				// For we're in a service here we return a reference of the local variable formConfig in this function when simply returning it.
				// When there are changes done to this config (i.e. changing the readonly state of the rows in the form),
				// those changes are stored to this reference and survive the lifetime of the underlying controller.
				// To avoid this we return a deep copy of the form config so every time we get the same result when calling this function.

				var deepCopiedFormConfiguration = angular.copy(formConfig);

				var catalogFormConfig = boqMainCatalogAssignmentUIConfigService.getFormConfig();
				deepCopiedFormConfiguration.groups = deepCopiedFormConfiguration.groups.concat(catalogFormConfig.groups);
				deepCopiedFormConfiguration.rows = deepCopiedFormConfiguration.rows.concat(catalogFormConfig.rows);

				if (systemPropertiesOnly) {
					// Do some adjustments in case we only want to show system based boq document properties

					// Remove the first row that holds the checkbox to make the structure a boq specific one.
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'editConfig';
					});

					// Replace the second row holding the boq type lookup by a simple readonly edit control
					// showing the description of the currently selected boq type.
					var boqTypeRowIndex = _.findIndex(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'type';
					});

					var boyTypeDescriptionRow = {
						gid: '1', rid: 'type', label: 'BoQ Configuration Type', label$tr$: 'boq.main.boqType',
						type: 'description', model: 'BoqTypeDescription', readonly: true, visible: true, sortOrder: 1
					};

					if (boqTypeRowIndex !== -1) {
						deepCopiedFormConfiguration.rows.splice(boqTypeRowIndex, 1, boyTypeDescriptionRow);
					}
				}
				else {
					_.remove(deepCopiedFormConfiguration.rows, {rid:'oenMask'});
				}

				if (catalogSystemOnly) {
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'editBoqCatalogConfigType';
					});

					var boqMainPropertiesDialogService = $injector.get('boqMainPropertiesDialogService');
					var dlgMode = boqMainPropertiesDialogService.getDialogMode();
					if (dlgMode === 'boqcatalog') {
						// only show boq catalog section
						deepCopiedFormConfiguration = angular.copy(catalogFormConfig);
						_.remove(deepCopiedFormConfiguration.rows, function (row) {
							return row.rid === 'editBoqCatalogConfigType';
						});
					}
				}

				if (urpConfig) {
					// Do some adjustments in case we want to have a configuration for the URP config


					// Replace the corresponding row by one fullfilling the needs of the URP config
					let calcFromUrbIndex = _.findIndex(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === '7';
					});

					let calcFromUrbRow = {
						gid: '3', rid: '7', label: ' ',
						type: 'directive', model: 'CalcFromUrb', checked: false, disabled: false, visible: true, sortOrder: 7, directive: 'boq-main-ur-calculate-from-checkbox'
					};

					if (calcFromUrbIndex !== -1) {
						deepCopiedFormConfiguration.rows.splice(calcFromUrbIndex, 1, calcFromUrbRow);
					}
				}

				return deepCopiedFormConfiguration;
			};

			return service;
		}

	]);

})();
