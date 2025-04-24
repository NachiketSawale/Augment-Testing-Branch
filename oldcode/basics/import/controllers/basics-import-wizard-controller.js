/**
 * Created by reimer on 28.07.2015.
 */

(function () {

	/* global angular, _ */

	'use strict';

	var moduleName = 'basics.import';

	/**
	 * @ngdoc controller
	 * @name basicsImportWizardController
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('basicsImportWizardController', [
		'globals',
		'_',
		'$q',
		'$scope',
		'$injector',
		'$translate',
		'basicsImportService',
		'platformGridAPI',
		'$timeout',
		'basicsLookupdataConfigGenerator',
		'basicsImportProfileService',
		'basicsLookupdataLookupFilterService',
		'platformTranslateService',
		'platformModalService',
		'platformDialogService',
		'basicsImportFormatService',
		'basicsImportHeaderService',
		'basicsCommonAIService',
		'permissions',
		'platformRuntimeDataService',
		function (globals,
		          _,
					 $q,
		          $scope,
		          $injector,
		          $translate,
		          basicsImportService,
		          platformGridAPI,
		          $timeout,
		          basicsLookupdataConfigGenerator,
		          basicsImportProfileService,
		          basicsLookupdataLookupFilterService,
		          platformTranslateService,
		          platformModalService,
					 platformDialogService,
		          basicsImportFormatService,
		          basicsImportHeaderService,
				  basicsCommonAIService,
			permissions,
			platformRuntimeDataService) {

			$scope.entity = null;
			$scope.customEntity = null;
			loadProfileData();   // init $scope.entity

			// default values
			if (!$scope.options.importOptions.hasOwnProperty('wizardParameter')) {
				$scope.options.importOptions.wizardParameter = {};
			}

			if($scope.options.importOptions.wizardParameter.hasOwnProperty('DefaultExcelProfile'))
			{
				var allExcelProfileContexts = [
					{ Id: 3, Code: 'FreeExcel' },
					{ Id: 4, Code: 'BoqBidder' },
					{ Id: 5, Code: 'BoqPlanner' },
					{ Id: 6, Code: 'MatBidder' },
					{ Id: 7, Code: 'BoqPes' }
				];

				var excelProfileId = allExcelProfileContexts.find(x => x.Code === ($scope.options.importOptions.wizardParameter.DefaultExcelProfile)).Id;
				if (!_.isUndefined(excelProfileId))
				{
					$scope.entity.ImportFormat = excelProfileId;
				}
			}
			else
			{
				$scope.entity.ImportFormat = 3;
			}

			$scope.path = globals.appBaseUrl;

			$scope.steps = [
				{
					number: 0,
					identifier: 'fileselection',
					name: $translate.instant('basics.import.headerFileSelection')
				},
				{
					number: 1,
					identifier: 'doubletfindmethods',
					name: $translate.instant('basics.import.headerDoubletFindMethods')
				},
				{
					number: 2,
					identifier: 'customsettings',
					name: $translate.instant('basics.import.headerImportsettings')
				},
				{
					number: 3,
					identifier: 'fieldmappings',
					name: $translate.instant('basics.import.headerFieldmappings')
				},
				{
					number: 4,
					identifier: 'editimport',
					name: $translate.instant('basics.import.headerEditimport')
				},
				{
					number: 5,
					identifier: 'previewresult',
					name: $translate.instant('basics.import.headerPreviewresult')
				}
			];

			function setupSteps(importOptions, importFormat) {
				$scope.steps[0].skip = basicsImportFormatService.isFixedRibFormat(importFormat) || skipStep(importOptions, 'FileSelectionPage');
				$scope.steps[1].skip = basicsImportFormatService.isFixedRibFormat(importFormat) || skipStep(importOptions, 'DoubletFindMethodsPage');
				$scope.steps[2].skip = basicsImportFormatService.isFixedRibFormat(importFormat) || skipStep(importOptions, 'CustomSettingsPage');
				$scope.steps[3].skip = basicsImportFormatService.isFixedRibFormat(importFormat) || skipStep(importOptions, 'FieldMappingsPage');
				$scope.steps[4].skip = basicsImportFormatService.isFixedRibFormat(importFormat) || skipStep(importOptions, 'EditImportPage');
				$scope.steps[5].skip = basicsImportFormatService.isFixedRibFormat(importFormat) || skipStep(importOptions, 'PreviewResultPage');
			}

			function skipStep(importOptions, pageName) {
				if (importOptions.hasOwnProperty(pageName)) {
					if (angular.isFunction(importOptions[pageName].skip)) {
						return importOptions[pageName].skip($scope.entity);
					}
					else {
						return importOptions[pageName].skip;
					}
				}
				else {
					return pageName === 'CustomSettingsPage';
				}

			}

			// region loading status

			$scope.isLoading = false;
			$scope.canNext = true;
			$scope.loadingInfo = '';

			function loadingStatusChanged(newStatus) {
				$scope.isLoading = newStatus;
			}

			basicsImportService.loadingStatusChanged.register(loadingStatusChanged);

			// endregion

			// region config view step 0 (Importfile)

			var formConfigImportfile =
				{
					showGrouping: false,
					groups: [
						{
							gid: '1',
							header: '',
							header$tr$: '',
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [
						{
							gid: '1',
							rid: 'Import Type',
							label: 'Import Type',
							label$tr$: 'basics.material.import.importType',
							type: 'directive',
							model: 'ImportType',
							directive: 'material-import-formatter-combobox',
							options: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										if ($scope.options.importOptions.OnImportTypeChangedCallback && _.isFunction($scope.options.importOptions.OnImportTypeChangedCallback)) {
											$scope.options.importOptions.OnImportTypeChangedCallback(args.selectedItem.Id,$scope);
										}
									}
								}]
							},
							visible: false,
							sortOrder: 1
						},
						{
							gid: '1',
							rid: 'SelectFile2Import',
							label: 'File to Import',
							label$tr$: 'basics.import.entityFile2Import',
							type: 'directive',
							model: 'File2Import',
							directive: 'basics-import-file-selection',
							options: {},
							visible: true,
							sortOrder: 1
						},
						{
							gid: '1',
							rid: 'ProfileName',
							label: 'Profile',
							label$tr$: 'basics.import.entityUserProfile',
							type: 'directive',
							model: 'ProfileName',
							directive: 'basics-import-profile-combobox',
							options: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										basicsImportProfileService.setSelectedId(args.selectedItem.id);
										var selectItem=args.selectedItem;
										var isSystemProfile='System'===selectItem.ProfileAccessLevel;
										if(isSystemProfile){
											$scope.canSave=basicsImportProfileService.hasSystemPermission(permissions.write);
										}
										else{
											$scope.canSave=true;
										}
									}
								}]
							},
							visible: true,
							sortOrder: 1
						},
						{
							gid: '1',
							rid: 'ImportFormat',
							label: 'Import Format',
							label$tr$: 'basics.import.entityExcelProfile',
							type: 'directive',
							model: 'ImportFormat',
							directive: 'basics-import-formats-combobox',
							visible: true,
							sortOrder: 1
						},
						{
							gid: '1',
							rid: 'SheetName',
							label: 'Sheet Name',
							label$tr$: 'basics.import.entityExcelSheetName',
							type: 'directive',
							model: 'ExcelSheetName',
							directive: 'basics-import-sheets-combobox',
							// visible: true,
							sortOrder: 1
						}
					]
				};

			$scope.$watch('entity.ImportFormat', function (newVal, oldVal) {

				if (newVal !== oldVal) {
					if ($scope.options.importOptions.OnImportFormatChangedCallback && _.isFunction($scope.options.importOptions.OnImportFormatChangedCallback)) {
						$scope.options.importOptions.OnImportFormatChangedCallback(newVal, $scope.entity);
					}
					setupSteps($scope.options.importOptions, newVal);
					setupFormConfigImportfile(newVal);
				}

			});

			var setupFormConfigImportfile = function (importFormat) {

				formConfigImportfile.rows[4].visible = !basicsImportFormatService.isFixedRibFormat(importFormat);   // SheetName
				$scope.$broadcast('form-config-updated');
			};


			if ($scope.options.importOptions.HandleImportFirstPage) {
				$scope.options.importOptions.HandleImportFirstPage(formConfigImportfile);
			}

			$scope.formOptionsImportfile = {
				configure: formConfigImportfile
				// validationMethod:
			};

			// endregion

			// region config view step 1 (doubletfindmethods)

			var formConfigDoubletFindMethods =
				{
					showGrouping: false,
					groups: [
						{
							gid: '1',
							header: '',
							header$tr$: '',
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [
						{
							gid: '1',
							rid: 'doubletFindMethods',
							label: 'Identify doublets by comparing',
							label$tr$: 'basics.import.entityDoubletFindMethods',
							type: 'directive',
							model: 'ImportDescriptor.DoubletFindMethods',
							directive: 'platform-checked-listbox',
							options: {
								displayMember: 'Description',
								selectedMember: 'Selected'
							},
							visible: true,
							sortOrder: 1
						}
					]
				};

			$scope.formConfigDoubletFindMethods = {
				configure: formConfigDoubletFindMethods
				// validationMethod:
			};

			// if ($scope.options.importOptions.DoubletFindMethodsPage && $scope.options.importOptions.DoubletFindMethodsPage.skip) {
			// 	$scope.steps[1].skip = true;
			// }
			// --> see setupSteps($scope.options.importOptions);

			// endregion

			// region config view step 2 (customsettings)

			// if ($scope.options.importOptions.CustomSettingsPage && $scope.options.importOptions.CustomSettingsPage.skip !== true) {
			if ($scope.options.importOptions.CustomSettingsPage) {
				$scope.formOptionsCustomSettings = {
					configure: $scope.options.importOptions.CustomSettingsPage.Config
				};
				// must set custom data since they will NOT be saved with the profile data
				// basicsImportProfileService.setCustomSettings($scope.options.importOptions.ImportDescriptor.CustomSettings);
			}
			if (!$scope.options.importOptions.CustomSettingsPage || $scope.options.importOptions.CustomSettingsPage.skip === true) {
				$scope.steps[2].skip = true;
			}

			// $scope.customEntity = basicsImportProfileService.getCustomSettings();

			// endregion

			// region config view step 3 (Field Mappings)

			var mappingGridColumns = [
				// { id: 'id', field: 'Id', name: 'Id', width: 100, readonly: true },
				{
					id: 'propertyName',
					field: 'PropertyName',
					name: 'Destination Field',
					name$tr$: 'basics.import.entityDestinationField',
					editor: null,
					readonly: true,
					formatter: 'description',
					width: 150
					// exclude: true  --> why did chk excluded this column in revision 415846?
				},
				{
					id: 'displayName',
					field: 'DisplayName',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					editor: 'description',
					formatter: 'description',
					readonly: true,
					width: 180
				},
				{
					id: 'mappingName',
					field: 'MappingName',
					name: 'Source Field',
					name$tr$: 'basics.import.entityMappingName',
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-import-mapped-to-combobox',
						lookupOptions: {
							showClearButton: true
						}
					},
					// formatter: 'lookup' -> content will be set to undefined?
					// customer formatter will break the validator render
					formatter: 'description',
					width: 180,
					validator: function (entity, value, model) {
						var options = $scope.options.importOptions;
						if (options && options.mapFieldValidator) {
							return options.mapFieldValidator(entity, value, model);
						}
						return {apply: true, valid: true, error: ''};
					}
				},
				{
					id: 'defaultValue',
					field: 'DefaultValue',
					name: 'Default Value',
					name$tr$: 'basics.import.entityDefaultValue',
					editor: 'description',
					formatter: 'description',
					width: 120,
					validator: function (entity, value, model) {
						if (entity.PropertyName === 'REQ_CODE' && entity.EntityName === 'QuoteRequisition'){
							var validateResult = {apply: true, valid: true, error: ''};
							if (value === '' && !entity.MappingName){
								var message = $translate.instant('procurement.common.emptyErrorMessage', {'DisplayName': entity.DisplayName});
								validateResult = {apply: true, valid: false, error: message};
							}
							platformRuntimeDataService.applyValidationResult(validateResult, entity, 'MappingName');
						}
					}
				}
			];

			var mappingGridId = '4aea8b65ee5248129d2164e00868fea4';

			$scope.mappingGridData = {
				state: mappingGridId
			};

			$scope.gridTriggersSelectionChange = true;
			$scope.enabledMappingGrouping = _.filter(getFilteredFields($scope.entity.ImportDescriptor.Fields, $scope.entity.ImportFormat), function (row) {
				return row.GroupName;
			}).length > 0;

			function setupMappingGrid() {

				if (!platformGridAPI.grids.exist(mappingGridId)) {
					if ($scope.enabledMappingGrouping) {
						var mappingFields = getFilteredFields($scope.entity.ImportDescriptor.Fields, $scope.entity.ImportFormat);
						mappingGridColumns.push({
							id: 'groupName',
							field: 'GroupName',
							name: 'Group Name',
							editor: null,
							readonly: true,
							width: 150,
							grouping: {
								aggregateCollapsed: true,
								aggregators: [],
								ascending: true,
								columnId: 'groupName',
								getter: 'Group Name',
								title: 'Group Name'
							},
							formatter: function (row, cell, value, columnDef, dataContext, plainText, opt, g) {
								var text = dataContext[columnDef.field];
								if (g && g.grouping) {
									var index = _.findIndex(mappingFields, {GroupName: text});
									if (index < 0) {
										index = _.findIndex(mappingFields, function (item) {
											return _.startsWith(text, item.GroupName);
										});
									}
									text = index + '.' + text;
								}
								return text;
							}
						});
					}
					var mappingGridConfig = {
						columns: angular.copy(mappingGridColumns),
						data: [],
						id: mappingGridId,
						lazyInit: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};
					platformGridAPI.grids.config(mappingGridConfig);
					platformTranslateService.translateGridConfig(mappingGridConfig.columns);
				}
			}

			function updateMappingGrid(updateMappingNames) {
				beforeupdateMappingFields();
				platformGridAPI.grids.invalidate(mappingGridId);

				updateMappingFields();
				translateMappingGrid($scope.entity.ImportDescriptor.Fields);

				var mappingFields = getFilteredFields($scope.entity.ImportDescriptor.Fields, $scope.entity.ImportFormat);
				platformGridAPI.items.data(mappingGridId, mappingFields);

				if (updateMappingNames&&($scope.entity.id===0)) {
					updateMappingNamesWithAI();
				}

				if ($scope.enabledMappingGrouping) {
					var grouping = [_.find(mappingGridColumns, {id: 'groupName'}).grouping];
					var grid = platformGridAPI.grids.element('id', mappingGridId);
					setColumnGrouping(grid, grouping);
				}

				platformGridAPI.grids.refresh(mappingGridId, true);
			}

			function setColumnGrouping(grid, grouping) {
				if (grid) {
					if (grid.instance && grid.dataView) {
						platformGridAPI.columns.setGrouping(mappingGridId, grouping, true);
						platformGridAPI.columns.setGrouping(mappingGridId, grouping);
					} else {
						$timeout(function () {
							setColumnGrouping(grid);
						}, 10);
					}
				}
			}

			function getFilteredFields(allFields, importFormat) {
				var result = [];

				angular.forEach(allFields, function (field) {
					if (field.Only4RibFormat && !basicsImportFormatService.isFixedRibFormat(importFormat)) {
						angular.noop();
					}else if(field.NotShowInMappingGrid){
						angular.noop();
					}
					else {
						result.push(field);
					}
				});

				// Ensures 'Id' uniqueness
				for (let i = 0; i < result.length; i++) {
					result[i].Id = i;
				}

				return result;
			}

			function beforeupdateMappingFields() {
				var beforeMappingFields = $scope.options.importOptions.ImportDescriptor.BeforeMappingFields;
				if (beforeMappingFields && _.isFunction(beforeMappingFields)) {
					var oldProfile = basicsImportProfileService.getDbProfileByName($scope.entity.ProfileName);
					if (_.isUndefined(oldProfile)) {
						oldProfile = basicsImportProfileService.getItemByProfileName($scope.entity.ProfileName);
					}
					beforeMappingFields($scope, oldProfile);
				}
			}

			function translateMappingGrid(mappingGridField) {
				if (_.isArray(mappingGridField)) {
					_.forEach(mappingGridField, function (item) {
						translateMappingGrid(item);
					});
				} else {
					if (mappingGridField.DisplayName) {
						mappingGridField.DisplayName = $translate.instant(mappingGridField.DisplayName);
					} else {
						mappingGridField.DisplayName = mappingGridField.PropertyName;
					}
				}
			}

			function updateMappingFields() {
				var fieldProcessor = $scope.options.importOptions.ImportDescriptor.FieldProcessor;
				if (fieldProcessor && _.isFunction(fieldProcessor)) {
					var oldProfile = basicsImportProfileService.getDbProfileByName($scope.entity.ProfileName);
					if (_.isUndefined(oldProfile) || oldProfile===null) {
						oldProfile = basicsImportProfileService.getItemByProfileName($scope.entity.ProfileName);
					}
					fieldProcessor($scope, oldProfile);
				}
			}

			// region auto mapping

			$scope.mappingProposal = function () {
				updateMappingNamesWithAI();
			};

			$scope.canExecMappingProposalBtn = function () {
				return $scope.currentStep.number === 3;
			};

			function collectMapping4AI() {
				var mappings = [];
				_.forEach($scope.entity.ImportDescriptor.Fields, function (item) {
					if (item.MappingName && item.MappingName !== 'null' && item.MappingName !== 'undefined') {
						mappings.push({
							FieldName: item.DisplayName,
							MappingName: item.MappingName
						});
					}
				});
				basicsImportService.collectMapping4AI(mappings);
			}


			function updateMappingNamesWithAI() {

				basicsCommonAIService.checkPermission('c5aab6bef3454793aacbf967cf8d62d4', false).then(function (canProceed) {
					if (!canProceed) {
						return;
					}
					var fieldNames = [];
					_.forEach($scope.entity.ImportDescriptor.Fields, function (item) {
						fieldNames.push(item.DisplayName);
					});

					basicsImportService.getMappingInfoByAI(fieldNames).then(function (response) {
						_.forEach($scope.entity.ImportDescriptor.Fields, function (item) {
							_.forEach(response.data, function (mapping) {
								if (item.DisplayName === mapping.FieldName) {
									item.MappingName = mapping.MappingName;
								}
							});
						});
						platformGridAPI.grids.refresh(mappingGridId, true);
						return response;
					});
				});

				var excelHeaders = {};
				_.forEach(basicsImportHeaderService.getList(), function (header) {
					// filter empty chars
					const key = header?.description?.toString().toLowerCase().replace(/\s/g, '');
					if(key){
						excelHeaders[key] = header.description;
					}
				});

				_.forEach($scope.entity.ImportDescriptor.Fields, function (field) {
					var justifiedPropName = field.PropertyName.toLowerCase().replace(/\W/g, '');  // consider only A-Z and 0-9
					field.MappingName = excelHeaders[justifiedPropName] || field.MappingName || (field.defaultMappingFun && field.defaultMappingFun(excelHeaders)) || '';
					let justDisplayName = field.DisplayName.toLowerCase().replace(/\s/g, '');
					if(excelHeaders[justDisplayName]){
						field.MappingName = excelHeaders[justDisplayName];
					}
				});
			}

			// endregion

			// region config step 4 (Edit Import) + 5 (Preview import)

			var editGridId = '768c40a320c8426d982e336ca63c2dc3';
			$scope.editGridData = {
				state: editGridId
			};

			var previewGridId = '98eb8070f2454c42a4ad66b3daca1811';
			$scope.previewGridData = {
				state: previewGridId
			};

			var importResultId = '4e77e223b9da494a9094dada3dd80f98';
			$scope.importResultData = {
				state: importResultId
			};

			function setupEditOrPreviewGrid(preview) {
				var gridColumns=updateEditOrPreviewGridColumns(preview);
				var gridId = preview ? previewGridId : editGridId;
				if ($scope.options.importOptions.GetGridColumn) {
					$scope.options.importOptions.GetGridColumn(gridColumns);
				}

				// noinspection JSCheckFunctionSignatures
				if (!platformGridAPI.grids.exist(gridId)) {
					var gridConfig = {
						columns:gridColumns,
						data: [],
						id: gridId,
						isStaticGrid:true,
						lazyInit: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Ix',
							iconClass: ''
						}
					};
					platformGridAPI.grids.config(gridConfig);
					platformTranslateService.translateGridConfig(gridConfig.columns);

					platformGridAPI.events.register(editGridId, 'onHeaderCheckboxChanged', headerCheckBoxChange);
				}
			}

			$scope.selectedPreviewItem = null;

			function onEditRowsChanged(/* e, arg */) {   // jshint ignore:line
				$scope.selectedPreviewItem = platformGridAPI.rows.selection({
					gridId: editGridId
				});
			}

			function headerCheckBoxChange(){
				// force Simulate button can be updated state according header checkbox clicking
				$scope.$apply();
			}

			platformGridAPI.events.register(editGridId, 'onSelectedRowsChanged', onEditRowsChanged);

			function onPreviewRowsChanged(/* e, arg */) {   // jshint ignore:line
				$scope.selectedPreviewItem = platformGridAPI.rows.selection({
					gridId: previewGridId
				});
			}

			platformGridAPI.events.register(previewGridId, 'onSelectedRowsChanged', onPreviewRowsChanged);

			function updateEditOrPreviewGridColumns(preview) {

				var previewGridColumns = [];
				previewGridColumns.push({
					id: 'Selected',
					field: 'Selected',
					name: 'Selected',
					name$tr$: 'basics.import.entitySelected',
					editor: 'boolean',
					formatter: 'boolean',
					width: 75,
					headerChkbox: true
				});
				previewGridColumns.push({
					id: 'rowNum',
					field: 'RowNum',
					name: 'rowNum',
					name$tr$: 'basics.import.rowNum',
					editor: '',
					formatter: 'description',
					width: 75
				});

				if (preview) {
					previewGridColumns.push({
						id: 'ImportResult',
						field: 'ImportResult',
						name: 'ImportResult',
						name$tr$: 'basics.import.entityImportResult',
						editor: '',
						formatter: importResultFormatter
					});
				}


				angular.forEach($scope.entity.ImportDescriptor.Fields, function (item) {    // jshint ignore:line
					if (item.MappingName || item.DefaultValue) {

						//var oldVal = ' (' + $translate.instant('basics.import.fieldOldValue') + ')';
						var newVal = ' (' + $translate.instant('basics.import.fieldNewValue') + ')';
						var currentVal = ' (' + $translate.instant('basics.import.fieldCurrentValue') + ')';



						var displayColDef = {
							id: item.PropertyName,
							field: item.PropertyName,
							name: (item.DisplayName || item.PropertyName)  + currentVal,
							formatter: item.DomainName,
							cssClass: 'import-dest-column'
						};

						if (item.DomainName === 'lookup') {
							if (item.FormatterOptions) {
								item.FormatterOptions.dataServiceName = 'basicsImportLookupHelperService';
								displayColDef.formatterOptions = item.FormatterOptions;
							}
							if (item.asyncValidatorOptions) {
								var validationService = $injector.get(item.asyncValidatorOptions.dataServiceName);
								if (validationService && item.asyncValidatorOptions.execute) {
									displayColDef.asyncValidator = validationService[item.execute];
								}
							}
						}
						var editColDef = {};
						// var editorDef = {};
						var def;
						var readonly = item.readonly && item.readonly === true;

						switch (item.Editor) {

							case 'domain':
							case 1:
								previewGridColumns.push(displayColDef);
								if (!readonly) {
									editColDef = {
										id: item.PropertyName + '_New',
										field: item.PropertyName + '_New',
										name: (item.DisplayName || item.PropertyName) + newVal,
										// name$tr$: item.PropertyName + newVal,
										formatter: item.DomainName,
										defaultValue: item.DefaultValue
									};

									// These fields are editable
									if (!preview && ['ReferenceNo','Reference2'].includes(item.PropertyName)) {
										editColDef.editor = editColDef.formatter;
									}

									if (item.MappingName && item.MappingName.length > 0) {
										def = {/* editor: item.DomainName.toLowerCase() */};// import from excel not need edit,so set field readonly
									}
									else {
										def = {formatter: notMappedFormatter};
									}

									angular.extend(editColDef, def);
									previewGridColumns.push(editColDef);
								}
								break;

							case 'idlookup':
							case 2:
								displayColDef.name = (item.DisplayName || item.PropertyName) + newVal;
								previewGridColumns.push(displayColDef);
								break;
							case 'customlookup':
							case 5:
								var defaultColDef = displayColDef;
								var lookupColumnDefinition = getLookupColDef(item);
								extendColumnDefinitionAndAttachToPreviewColumns(defaultColDef,lookupColumnDefinition,previewGridColumns);
								var newFieldEditColDef = getNewFieldDef(item,newVal);
								var customColDef = getCustomOrDefaultColumnDefinition(item,lookupColumnDefinition);
								extendColumnDefinitionAndAttachToPreviewColumns(newFieldEditColDef,customColDef,previewGridColumns);
								break;
							case 'simpledescriptionlookup':
							case 'simplelookup':
							case 4:
							case 3:
								// previewGridColumns.push(displayColDef);
								editColDef = displayColDef;
								def = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
									lookupName: item.LookupQualifier,
									att2BDisplayed: item.DisplayMember || 'Description',
									readOnly: true
								}); // readonly = true
								angular.extend(editColDef, def);
								previewGridColumns.push(editColDef);

								editColDef = {
									id: item.PropertyName + '_New',
									field: item.PropertyName + '_New',
									name: (item.DisplayName || item.PropertyName) + newVal,
									// name$tr$: 'basics.import.entityNewValue',
									defaultValue: item.DefaultValue
								};

								if (item.MappingName && item.MappingName.length > 0) {
									def = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
										lookupName: item.LookupQualifier,
										att2BDisplayed: item.DisplayMember || 'Description',
										readOnly: true
									});
									// import from excel not need edit,so set field readonly
									// def={};
								}
								else {
									def = {formatter: notMappedFormatter};
								}

								angular.extend(editColDef, def);
								previewGridColumns.push(editColDef);
								break;

								// not yet supported!
								// case 4:  // Directive
								//
								//	previewGridColumns.push(displayColDef);
								//	editColDef = {
								//		id: item.PropertyName,
								//		field: item.PropertyName,
								//		name: item.PropertyName,
								//		editor: 'lookup'
								//	};
								//	editorDef = {
								//		editorOptions: {
								//			directive: item.EditorDirective,
								//			lookupOptions: {
								//				showClearButton: true,
								//				displayMember: item.DisplayMember || 'Description',
								//				filterKey: item.FilterKey
								//			}
								//		},
								//		formatter: 'lookup',
								//		formatterOptions: {
								//			displayMember: item.DisplayMember || 'Description',
								//			lookupType: item.LookupQualifier
								//		}
								//	};

							default:  // No editor
								displayColDef.name = (item.DisplayName || item.PropertyName) + (item.ColumnNameReadOnly ? '' : newVal);
								if (!item.MappingName) {
									displayColDef.formatter = notMappedFormatter;
								}
								previewGridColumns.push(displayColDef);
								break;

						}
					}

				});
				if (_.isFunction($scope.options.importOptions.IsEmptyCallBack)) {
					let isEmpty = $scope.options.importOptions.IsEmptyCallBack();
					if (isEmpty) {
						let newList = [];
						for (let i = 0; i < previewGridColumns.length; i++) {
							if (previewGridColumns[i].name !== undefined || previewGridColumns[i].name !== null) {

								if (!previewGridColumns[i].name.includes($translate.instant('basics.import.fieldCurrentValue')) || previewGridColumns[i].name.includes($translate.instant('basics.import.fieldNewValue'))) {
									previewGridColumns[i].name = previewGridColumns[i].name.replaceAll('(' + $translate.instant('basics.import.fieldNewValue') + ')', '');
									newList.push(previewGridColumns[i]);
								}
							}
						}
						previewGridColumns = angular.copy(newList);
						return angular.copy(previewGridColumns);
					}
				}
				var gridColumns = angular.copy(previewGridColumns);
				return gridColumns;
			}

			function extendColumnDefinitionAndAttachToPreviewColumns(defaultColDef,customColDef,previewGridColumns){
				var editColDef = defaultColDef;
				angular.extend(editColDef, customColDef);
				previewGridColumns.push(editColDef);
			}

			function getLookupColDef(fieldDescriptor){
				var def = {
					formatter : 'lookup',
					formatterOptions:{
						displayMember: fieldDescriptor.DisplayMember || 'Description',
						lookupType: fieldDescriptor.LookupType,
						dataServiceName: fieldDescriptor.DataServiceName || fieldDescriptor.dataServiceName ,
						filter : fieldDescriptor.Filter || fieldDescriptor.filter
					}
				};

				angular.extend(def.formatterOptions,fieldDescriptor.FormatterOptions);
				return def;
			}

			function getNewFieldDef(fieldDescriptor,newVal){
				var newFieldEditColDef = {
					id: fieldDescriptor.PropertyName + '_New',
					field: fieldDescriptor.PropertyName + '_New',
					name: (fieldDescriptor.DisplayName || fieldDescriptor.PropertyName) + newVal,
					defaultValue: fieldDescriptor.DefaultValue
				};
				return newFieldEditColDef;
			}

			function getCustomOrDefaultColumnDefinition(fieldDescriptor,lookupColumnDefinition){
				var customColDef;
				if (fieldDescriptor.MappingName && fieldDescriptor.MappingName.length > 0) {
					customColDef = lookupColumnDefinition;
				}else{
					customColDef = {formatter: notMappedFormatter};
				}

				return customColDef;
			}

			function notMappedFormatter(row, cell, value, columnDef, entity) {   // jshint ignore:line

				var result = '(not mapped)';
				//
				// if (entity.Id === null || entity.Id === 0 ) {
				//	if (columnDef.defaultValue) {
				//		// Property value will set to the default value
				//		result = '(' + columnDef.defaultValue + ')';
				//	}
				// }

				if (columnDef.defaultValue && columnDef.defaultValue.length > 0) {
					// Property value will set to the default value
					result = '(' + columnDef.defaultValue + ')';
				}

				return result;
			}

			function fillResultInfo(value) {
				var imageName;
				var tooltip = '';
				var status = '';
				switch (value.Status) {
					case 1:  // skipped
						imageName = 'stop';
						tooltip = 'Not selected';
						break;
					case 2:  // nochanges
						imageName = 'transition';
						tooltip = 'No changes';

						break;
					case 9:  // failed
						imageName = 'error';
						tooltip = 'Import Failed!';
						status = 'Failed';
						break;
					case 16: // warning
						imageName = 'warning';
						tooltip = 'Warning';
						status = 'Warning';
						break;
					default:
						imageName = 'tick';
						tooltip = 'Success!';
						status = 'Success';
						break;
				}
				// noinspection JSUnresolvedVariable
				if (value.LogEntries) {
					for (var i = 0; i < value.LogEntries.length; i++) {
						tooltip = tooltip + '&#10' + value.LogEntries[i];
					}
				}
				if (value.LogErrorMsg) {
					for (var j = 0; j < value.LogErrorMsg.length; j++) {
						tooltip = tooltip + '&#10' + value.LogErrorMsg[j];
					}
				}
				return {imageName: imageName, toolTip: tooltip, status: status};
			}

			function importResultFormatter(row, cell, value, columnDef, entity) {   // jshint ignore:line

				if (!value) {
					return '';
				}
				var formatterRes = fillResultInfo(value);
				var path = '';
				if (value.Status === 9 || value.Status === 16) {
					path = globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-';
				} else {
					path = globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-';
				}
				var imageName = formatterRes.imageName;
				var tooltip = formatterRes.toolTip;


				if ($scope.canNext === true) {
					$scope.canNext = !(value.Status === 1 || value.Status === 2 || value.Status === 9);
				}


				return '<img src="' + path + imageName + '" title="' + tooltip + '">';
			}

			function updateEditOrPreviewGrid(preview) {
				var gridId = preview ? previewGridId : editGridId;
				platformGridAPI.grids.invalidate(gridId);
				platformGridAPI.items.data(gridId, basicsImportService.getPreviewData());
			}


			// endregion

			// region wizard navigation

			$scope.currentStep = angular.copy($scope.steps[0]);
			$scope.modalTitle = $scope.currentStep.name;

			$scope.getLastStep = function () {

				for (var i = $scope.steps.length; i > 0; i--) {
					if ($scope.steps[i - 1].skip === false) {
						return i - 1;
					}
				}
				return 0;

			};

			$scope.isLastStep = function () {
				return $scope.currentStep.number === $scope.getLastStep();
			};

			$scope.isFirstStep = function () {
				return $scope.currentStep.number === 0;
			};

			$scope.isEditImportStep = function () {
				return $scope.currentStep.identifier === 'editimport';
			};

			$scope.previousStep = function () {
				$scope.canNext = true;
				if ($scope.isFirstStep() || $scope.isLoading) {
					return;
				}

				// find previous step
				for (var i = $scope.currentStep.number - 1; i >= 0; i--) {
					if ($scope.steps[i].skip === false) {
						setCurrentStep(i);
						break;
					}
				}
				// updateCustomEntity();
				switch ($scope.currentStep.identifier) {
					case 'fieldmappings':
						setupMappingGrid();
						$timeout(function () {
							updateMappingGrid();
						}, 200);
						break;
					case 'editimport':
						setupEditOrPreviewGrid(false);
						$timeout(function () {
							// updateEditOrPreviewGridColumns(false); // hide result column
							updateEditOrPreviewGrid(false);
						}, 200);
						break;
				}

			};

			// $scope.steps = [
			//	{number: 0, identifier: 'fileselection',      name: $translate.instant('basics.import.headerFileSelection')},
			//	{number: 1, identifier: 'doubletfindmethods', name: $translate.instant('basics.import.headerDoubletFindMethods')},
			//	{number: 2, identifier: 'customsettings',     name: $translate.instant('basics.import.headerImportsettings')},
			//	{number: 3, identifier: 'fieldmappings',      name: $translate.instant('basics.import.headerFieldmappings')},
			//	{number: 4, identifier: 'editimport',         name: $translate.instant('basics.import.headerEditimport')},
			//	{number: 5, identifier: 'previewresult',      name: $translate.instant('basics.import.headerPreviewresult')}
			// ];
			$scope.nextStep = function() {
				var continueCheck = $scope.options.importOptions.PreventNextStepAsync ? $scope.options.importOptions.PreventNextStepAsync($scope.currentStep.identifier, $scope.entity.ImportFormat)
																											 : $q.when().then(function() { return null; } );
				continueCheck.then(function(result) {
					if (result) {
						platformDialogService.showDialog({ iconClass: 'info',  headerText$tr$: 'cloud.common.infoBoxHeader', bodyText: result, showOkButton: true});
						return;
					}

					setupSteps($scope.options.importOptions, $scope.entity.ImportFormat);

					if ($scope.currentStep.identifier === 'fieldmappings') {
						platformGridAPI.grids.commitAllEdits();
						collectMapping4AI(); // Collect mapping for AI. AI will use it to improve the mapping accuracy
					}

					if ($scope.isLastStep()) {    // start import
						var promise;
						if ($scope.steps[3].skip === true)  // we do not have the mapping page (e.g. RIB BoQ Excel format)
						{
							promise = basicsImportService.parseImportFile($scope.entity, true); // trigger import process on server
						}
						else if ($scope.steps[4].skip === true || $scope.steps[5].skip === true) {
							if($scope.hasPreviewed)
							{
								promise = basicsImportService.processImport($scope.entity);
							}
							else
							{
								promise = basicsImportService.previewImport($scope.entity, true);
							}

						}
						else {
							promise = basicsImportService.processImport($scope.entity);
						}

						promise.then(function (res) {

							handleImportComplete();

							function handleImportComplete() {
								$scope.isImportResultPage = true;
								// noinspection JSUnresolvedVariable
								if (res && res.ErrorCounter === 0) {

									if ($scope.options.importOptions.ShowProtocollAfterImport) {
										basicsImportService.showProtocol(res);
									}

									if ($scope.options.importOptions.OnImportSucceededCallback) {
										$scope.options.importOptions.OnImportSucceededCallback(res);
									}

									$scope.close();
								}
								else {
									updateEditOrPreviewGrid(true);
								}

								if ($scope.options.importOptions.OnImportCallback) {
									$scope.options.importOptions.OnImportCallback($scope, res);
								}

							}

						});
						return;
					}

					// find next step
					var newStep;
					for (newStep = $scope.currentStep.number + 1; newStep < $scope.steps.length; newStep++) {
						if ($scope.steps[newStep].skip === false) {
							break;
						}
					}
					// updateCustomEntity();
					switch ($scope.steps[newStep].identifier) {
						case 'fieldmappings':
							basicsImportService.parseImportFile($scope.entity).then(function (data) {
								if (data) {
									platformModalService.showMsgBox(data, 'cloud.common.informationDialogHeader', 'ico-info').then(function () {
										$scope.close();
									});
								}
								setCurrentStep(newStep);
								setupMappingGrid();
								$timeout(function () {
									updateMappingGrid(true);
									$scope.isWorking = false;
								}, 1000);
							}
							);
							break;
						case 'editimport':
							basicsImportService.previewImport($scope.entity).then(function () {
								if ($scope.options.importOptions.SkipSimulatePage) {
									$scope.options.importOptions.SkipSimulatePage($scope,basicsImportService.getPreviewData());
								}
								setCurrentStep(newStep);
								setupEditOrPreviewGrid(false);
								$timeout(function () {
									// updateEditOrPreviewGridColumns(false); // hide result column
									updateEditOrPreviewGrid(false);
									$scope.isWorking = false;
								}, 500);
							}
							);
							break;
						case 'previewresult':
							basicsImportService.simulateImport($scope.entity).then(function (res) {
								if (res && res.ErrorCounter !== 0) {
									$scope.canNext = false;
								}
								setCurrentStep(newStep);
								setupEditOrPreviewGrid(true);
								$timeout(function () {
									// updateEditOrPreviewGridColumns(true); // show result column
									updateEditOrPreviewGrid(true);
									$scope.isWorking = false;
								}, 500);
							}
							);
							break;
						default:
							setCurrentStep(newStep);
							break;
					}
				});
			};

			function jumpToImportData() {
				var data = basicsImportService.getPreviewData();
				if (data && data.length && $scope.isImportResultPage) {
					if ($scope.options.importOptions.HandleImportSucceed) {
						$scope.options.importOptions.HandleImportSucceed(data);
					}
				}
			}

			function setCurrentStep(step) {
				$scope.currentStep = angular.copy($scope.steps[step]);
				$scope.modalTitle = $scope.currentStep.name;
				if ($scope.options.importOptions.ModifyCustomSetting && _.isFunction($scope.options.importOptions.ModifyCustomSetting)) {
					$scope.options.importOptions.ModifyCustomSetting($scope);
				}
				if ($scope.options.importOptions.OnStepChange && _.isFunction($scope.options.importOptions.OnStepChange)) {
					$scope.options.importOptions.OnStepChange($scope.currentStep,$scope.entity);
				}

				modifyTranslation($scope);
			}

			// endregion

			// region translation

			// object holding translated strings
			$scope.translate = {};

			var loadTranslations = function () {
				platformTranslateService.translateFormConfig(formConfigImportfile);
				platformTranslateService.translateFormConfig(formConfigDoubletFindMethods);
				if ($scope.options.importOptions.CustomSettingsPage && $scope.options.importOptions.CustomSettingsPage.Config) {
					platformTranslateService.translateFormConfig($scope.options.importOptions.CustomSettingsPage.Config);
				}
				modifyTranslation();
			};

			function modifyTranslation() {
				if ($scope.options.importOptions.ModifyTranslate && _.isFunction($scope.options.importOptions.ModifyTranslate)) {
					$scope.options.importOptions.ModifyTranslate($scope);
				}
			}

			//
			// register translation changed event
			// noinspection JSUnresolvedVariable
			platformTranslateService.translationChanged.register(loadTranslations);

			// done in service
			// register a module - translation table will be reloaded if module isn't available yet
			// if(!platformTranslateService.registerModule(moduleName)) {
			// if translation is already available, call loadTranslation directly
			//	loadTranslations();
			// }


			$scope.getButtonText = function () {
				if ($scope.isLastStep()) {
					return $translate.instant('basics.common.button.ok');
				}
				if ($scope.isEditImportStep()) {
					return $translate.instant('basics.common.button.simulate');
				}
				return $translate.instant('basics.common.button.nextStep');
			};

			$scope.canExecuteNextButton = function () {

				switch ($scope.currentStep.number) {
					case 0:
						return $scope.entity.File2Import && $scope.entity.File2Import.length > 0;
					case 2:
						if ($scope.options.importOptions.CanNext) {
							return $scope.options.importOptions.CanNext($scope);
						} else {
							return !$scope.isLoading && $scope.canNext;
						}
					case 3:
						if ($scope.isLoading) {
							return false;
						}
						var options = $scope.options.importOptions;
						var grid = platformGridAPI.grids.element('id', mappingGridId);
						if (options.validateMapFields) {
							return options.validateMapFields(grid, $scope.entity.ImportDescriptor.Fields);
						}
						return true;
					case 4:  // editimport
						if ($scope.options.importOptions.CanSimulateNext) {
							return !$scope.isLoading &&$scope.options.importOptions.CanSimulateNext(basicsImportService.getPreviewData());
						}
						else {
							var temp = _.find(basicsImportService.getPreviewData(), {Selected: true});
							return !$scope.isLoading && !!temp;
						}
					case 5:  // previewresult
						// var temp2 = basicsImportService.getPreviewData().length > 0;
						// return !$scope.isLoading && temp2 && $scope.canNext;
						var countSelected = 0;
						var hasErrs = false;
						if (!$scope.isLoading) {
							var data = basicsImportService.getPreviewData();
							if (data && data.length > 0) {
								angular.forEach(data, function (item) {
									if (item.Selected) {
										if (item.ImportResult.Status === 9) {  // failed
											hasErrs = true;
										}
										countSelected++;
									}
								});
							}
						}
						return countSelected > 0 && hasErrs === false;

					default:
						return !$scope.isLoading && $scope.canNext;
				}

			};

			$scope.isImportResultPage = false;

			$scope.canExecutePreviousButton = function () {
				return !$scope.isFirstStep() && !$scope.isLoading;
			};

			// endregion

			// un-register on destroy
			$scope.$on('$destroy', function () {

				// platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				if (platformGridAPI.grids.exist(mappingGridId)) {
					platformGridAPI.grids.unregister(mappingGridId);
				}

				if (platformGridAPI.grids.exist(importResultId)) {
					platformGridAPI.grids.unregister(importResultId);
				}

				if (platformGridAPI.grids.exist(previewGridId)) {
					platformGridAPI.events.register(previewGridId, 'onSelectedRowsChanged', onPreviewRowsChanged);
					platformGridAPI.grids.unregister(previewGridId);
				}

				if (platformGridAPI.grids.exist(editGridId)) {
					platformGridAPI.grids.unregister(editGridId);
					platformGridAPI.events.unregister(editGridId, 'onHeaderCheckboxChanged', headerCheckBoxChange);
				}

				basicsImportProfileService.seletedItemChanged.unregister(loadProfileData);
				basicsImportService.loadingStatusChanged.unregister(loadingStatusChanged);
				platformTranslateService.translationChanged.unregister(loadTranslations);
				basicsImportService.cancelPendingRequest('controller was destroyed');
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
				basicsImportService.resetFile();

			});

			// region get/save settings

			function loadProfileData() {
				$scope.entity = angular.copy(basicsImportProfileService.getSelectedItem());
				$scope.customEntity = $scope.entity.ImportDescriptor.CustomSettings;
			}
			basicsImportProfileService.seletedItemChanged.register(loadProfileData);

			$scope.save = function () {

				$scope.entity.ImportDescriptor.CustomSettings = $scope.customEntity;

				// var selectedItem = basicsImportProfileService.getSelectedItem();
				if (basicsImportProfileService.isNewProfile($scope.entity)) {
					$scope.saveAs();
				}
				else {
					var profile=angular.copy($scope.entity);
					basicsImportProfileService.save(profile);
				}
			};

			$scope.saveAs = function () {
				basicsImportProfileService.showSaveProfileAsDialog($scope.entity);
			};

			$scope.canSave = true;
			$scope.canSaveAs = true;
			// endregion

			// region misc

			// listen for the file selected event
			// noinspection JSUnresolvedFunction
			$scope.$on('fileSelected', function (event, args) {
				// $scope.$apply(function () {
				$timeout(function () {
					// add the file object to the scope's files collection
					basicsImportService.setFile(args.file);
				}
				);
				// });
			});

			$scope.close = function () {
				// $modalInstance.dismiss();
				if ($scope.options.importOptions.HandleImportEnded) {
					$scope.options.importOptions.HandleImportEnded();
				}
				jumpToImportData();
				$scope.$parent.$close(false);
			};

			$scope.dialog = {};
			$scope.dialog.cancel = function () {
				$scope.close();
			};

			var filters = [
				{
					key: 'import-subsidiary-filter',
					fn: function (dataItem, dataContext) {
						return dataItem.BusinessPartnerFk === dataContext.Id;
						/* jshint ignore:line */ // maybe a string!
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			// endregion

			var init = function () {
				basicsImportFormatService.addValidExcelProfileContexts($scope.entity.ExcelProfileContexts);
				modifyImportDocumentPage();
				loadTranslations();
				setupSteps($scope.options.importOptions, $scope.entity.ImportFormat);
				setupFormConfigImportfile($scope.entity.ImportFormat);
			};
			init();

			function modifyImportDocumentPage() {
				if ($scope.options.importOptions.ModifyImportDocumentPage && _.isFunction($scope.options.importOptions.ModifyImportDocumentPage)) {
					$scope.options.importOptions.ModifyImportDocumentPage($scope);
				}
			}

			$scope.$on('customSettingChanged', function (event,data) {
				if ($scope.options.importOptions.HandleImportCustomSetting) {
					$scope.options.importOptions.HandleImportCustomSetting($scope,data,event);
				}
			});
		}
	]);
})();
