(function () {
	/* global globals, _ */
	'use strict';

	var angularModule = angular.module('boq.main');

	/**
	 * @ngdoc boqMainCrbSiaService
	 * @name
	 * @function
	 * @description
	 */
	angularModule.factory('boqMainCrbSiaService', ['$http', '$translate', '$injector', 'platformDialogService', 'platformLongTextDialogService',
		function($http, $translate, $injector, platformDialogService, platformLongTextDialogService) {
			var service = {};

			service.importMultipleCrbSia = function (projectId, boqProjectService) {
				var formData;
				var fileElement;
				var succeededImports = [];
				var failedImports = [];


				function importSia(files, index) {
					$http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'boq/project/importcrbsia',
						headers: {'Content-Type': undefined},
						transformRequest: function () {
							formData = new FormData();
							formData.append('file', files[index]);
							formData.append('ProjectId', projectId);
							return formData;
						}
					})
						.then(function (response) {
							if (response.data) {
								if (response.data.ErrorText) {
									failedImports.push(response.data.OriginalFileName + ' - ' + response.data.ErrorText);
								} else {
									succeededImports.push(response.data.OriginalFileName);
									boqProjectService.loadSubItemList();
								}
							}

							if (++index < files.length) {
								importSia(files, index);
							} else {
								platformLongTextDialogService.showDialog(
									{
										headerText$tr$: 'boq.main.siaImport',
										codeMode: true,
										hidePager: true,
										dataSource: new function () {
											var infoText = '';
											if (_.some(succeededImports)) {
												infoText += $translate.instant('boq.main.importSucceeded') + '\n' + succeededImports.join('\n') + '\n\n';
											}
											if (_.some(failedImports)) {
												infoText += $translate.instant('boq.main.importFailed') + '\n' + failedImports.join('\n');
											}
											platformLongTextDialogService.LongTextDataSource.call(this);
											this.current = infoText;
										}
									});
							}
						});
				}

				fileElement = angular.element('<input type="file"/>');
				fileElement.attr('accept', '.crbx, .01s');
				fileElement.attr('multiple', '');
				fileElement.change(function () {
					importSia(this.files, 0);
				});
				fileElement.click();
			};

			// fileData has value, means a CRBX file has been selected and invoke this function directly.
			service.importCrbSia = function (boqMainService, selectedFile) {
				var fileElement;
				var boqRootItem;

				boqRootItem = boqMainService.getRootBoqItem();
				if (!_.isObject(boqRootItem)) {
					platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
					return;
				} else if (boqMainService.isWicBoq()) {
					platformDialogService.showInfoBox('boq.main.wicDisabledFunc');
					return;
				}

				if(selectedFile){
					importSia();
					return;
				}

				function importSia(siaImportObject) {
					var fileReader = new FileReader();
					fileReader.onload = function (e) {
						var request =
							{
								BoqHeaderId: boqRootItem.BoqHeaderFk,
								ProjectId: boqMainService.getSelectedProjectId(),
								FileName: selectedFile.name,
								FileContent: {Content: e.target.result.split(',')[1]},
								SiaImportResponse: siaImportObject
							};

						if(boqMainService.getQtoHeaderId){
							request.TargetQtoHeaderId = boqMainService.getQtoHeaderId();
						}

						return $http.post(globals.webApiBaseUrl + 'boq/main/crb/importsia', request)
							.then(function (response) {
								if (response.data !== null) {
									if (_.some(response.data.CrbCostgrpCatAssigns)) {
										if (response.data.ErrorText) {
											platformDialogService.showErrorBox(response.data.ErrorText, 'cloud.common.errorMessage');
										} else {
											var modalOptions =
												{
													headerText$tr$: 'boq.main.crbCostgrpCatAssign',
													bodyTemplate: ['<section class="modal-body">',
														'<div data-ng-controller="boqMainCrbSiaImportController">',
														'<div class="modal-wrapper" style="margin-top:10px">',
														'<div class="modal-wrapper subview-container">',
														'<platform-Grid data="gridData" />',
														'</div>',
														'</div>',
														'</div>',
														'<div style="margin-top:10px">',
														'<label style="margin-top:5px" class="platform-form-label">{{"boq.main.crbWicGroupSelection" | translate}}</label>',
														'<div style="margin-top:5px" class="lg-4 md-4" data-boq-main-flat-wic-group-lookup data-ng-model="selectedWicGroupId" data-options="wicGroupLookupOptions"></div>',
														'</div>',
														'</section>'].join(''),
													showOkButton: true,
													showCancelButton: true,
													resizeable: true,
													minHeight: '300px',
													minWidth: '1100px',
													importSia: importSia,
													siaImportObject: response.data
												};
											platformDialogService.showDialog(modalOptions);
										}
									} else {
										if (_.isEmpty(response.data.ErrorText) && _.isEmpty(response.data.InfoText)) {
											platformDialogService.showInfoBox('boq.main.importSucceeded');
										} else if (!_.isEmpty(response.data.ErrorText) && _.isEmpty(response.data.InfoText) && _.isEmpty(response.data.SiaTestError)) {
											platformDialogService.showErrorBox(response.data.ErrorText, 'cloud.common.errorMessage');
										} else {
											platformLongTextDialogService.showDialog(
												{
													headerText$tr$: 'boq.main.siaImport',
													topDescription: _.isEmpty(response.data.ErrorText) ?
														{text: $translate.instant('boq.main.importSucceeded'), iconClass: 'tlb-icons ico-info'} :
														{text: response.data.ErrorText, iconClass: 'tlb-icons ico-error'},
													codeMode: true,
													hidePager: true,
													dataSource: new function () {
														platformLongTextDialogService.LongTextDataSource.call(this);
														this.current = !_.isEmpty(response.data.SiaTestError) ? response.data.SiaTestError : response.data.InfoText;
													}
												});
										}

										if (_.isEmpty(response.data.ErrorText)) {
											$injector.get('boqUomLookupDataService').setCache({}, []); // Ensures a correct presentation of the CRB UOMs by enforcing a refresh of them
											boqMainService.refreshBoqData();
										}
									}
								}
							});
					};
					fileReader.readAsDataURL(selectedFile);
				}

				fileElement = angular.element('<input type="file"/>');
				fileElement.attr('accept', '.crbx, .01s');
				fileElement.change(function () {
					selectedFile = this.files[0];
					importSia();
				});
				fileElement.click();
			};

			service.exportCrbSia = function (boqMainService, reportParameters) {
				var boqRootItem;

				boqRootItem = boqMainService.getRootBoqItem();
				if (!_.isObject(boqRootItem)) {
					platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
					return;
				} else if (boqMainService.isWicBoq()) {
					platformDialogService.showInfoBox('boq.main.wicDisabledFunc');
					return;
				}

				var optionsGroup = [];
				optionsGroup += '<div class="platform-form-group" style="margin-top:10px">';
				optionsGroup += '<div>{{"boq.main.siaOptions" | translate}}</div>';
				_.forEach(['optionPrices', 'optionPriceconditions', 'optionQuantities'], function (option) {
					optionsGroup +=    '<div><div class="domain-type-boolean form-control flex-align-center">';
					optionsGroup +=       '<input type="checkbox" ng-disabled="' + option + '.IsDisabled" ng-model="' + option + '.IsMarked" data-domain="boolean" data-ng-click="onCheckboxClick(' + option + ')" style="margin-top:0"/>';
					optionsGroup +=       '<span>&nbsp;&nbsp;{{' + option + '.Name}}</span>';
					optionsGroup +=    '</div></div>';
				});
				optionsGroup += '</div>';

				var radioItemCount = 0;
				var radioGroup = [];
				if (!reportParameters) {
					radioGroup += '<div class="platform-form-row">';
					radioGroup += '<label class="platform-form-label">{{"boq.main.crbOutputFormat" | translate}}</label>';
					_.forEach(['SIA CRBX17' /* NOT supported anymore (todo: if no client miss it, the complete code can be removed) , 'SIA 451' */], function (radioItem) {
						radioGroup += '<div class="radio spaceToUp pull-left margin-left-ld">';
						radioGroup +=    '<label>';
						radioGroup +=       '<input type="radio" name="radioGroupA" ng-model="selectedOutput" ng-value="' + (++radioItemCount) + '">';
						radioGroup += radioItem;
						radioGroup +=    '</label>';
						radioGroup += '</div>';
					});
					radioGroup += '</div>';
				}

				let bodyTemplate = [];
				bodyTemplate +=    '<div data-ng-controller="boqMainCrbSiaExportController">';
				bodyTemplate +=       '<div class="platform-form-group">';
				bodyTemplate +=          radioGroup;
				if (!reportParameters) {
					bodyTemplate += '<div class="platform-form-row"></div>';
					bodyTemplate += '<div class="platform-form-row"></div>';
					bodyTemplate += '<div class="platform-form-row">';
					bodyTemplate += '<label class="platform-form-label">{{"basics.customize.language" | translate}}</label>';
					bodyTemplate += '<div class="platform-form-col">';
					bodyTemplate += '<div data-domain-control data-domain="select" class="form-control" data-options="crbLanguages" data-model="selectedCrbLanguage"></div>';
					bodyTemplate += '</div>';
					bodyTemplate += '</div>';
				}
				bodyTemplate +=          '<div class="platform-form-row"></div>';
				bodyTemplate +=          '<div class="platform-form-row"></div>';
				bodyTemplate +=          '<div class="platform-form-row">';
				bodyTemplate +=             '<label class="platform-form-label">{{"boq.main.crbDocumentType" | translate}}</label>';
				bodyTemplate +=             '<div class="platform-form-col">';
				bodyTemplate +=                '<div data-domain-control data-domain="select" class="form-control" data-options="crbDocumentTypes" data-model="selectedCrbDocumentType"></div>';
				bodyTemplate +=             '</div>';
				bodyTemplate +=          '</div>';
				bodyTemplate +=       '</div>';
				bodyTemplate +=       optionsGroup;
				bodyTemplate +=       '<div class="modal-wrapper" style="margin-top:10px">';
				bodyTemplate +=          '<label class="platform-form-label">{{"boq.main.siaRanges" | translate}}</label>';
				bodyTemplate +=          '<div class="modal-wrapper subview-container" style="margin-top:10px">';
				bodyTemplate +=             '<platform-grid data="gridData"></platform-grid>';
				bodyTemplate +=          '</div>';
				bodyTemplate +=       '</div>';
				bodyTemplate +=    '</div>';

				var modalOptions =
				{
					headerText$tr$: reportParameters ? 'boq.main.crbReportParameters' : 'boq.main.siaExport',
					bodyTemplate: bodyTemplate,
					showOkButton: true,
					showCancelButton: true,
					resizeable: true,
					minHeight: '400px',
					minWidth: '400px',
					currentBoqHeaderId: boqRootItem.BoqHeaderFk,
					qtoHeaderId: boqMainService.getQtoHeaderId ? boqMainService.getQtoHeaderId() : null,
					reportParameters: reportParameters
				};

				if(angular.isFunction(boqMainService.configOption)){
					boqMainService.configOption(modalOptions);
				}

				platformDialogService.showDialog(modalOptions);
			};

			return service;
		}
	]);

	angularModule.controller('boqMainCrbSiaImportController', ['$scope', '$translate', 'platformGridAPI', 'platformRuntimeDataService', 'boqMainCrbCostgroupLookupService2',
		function($scope, $translate, platformGridAPI, platformRuntimeDataService, boqMainCrbCostgroupLookupService2) {
			var importSia       = $scope.dialog.modalOptions.importSia;
			var siaImportObject = $scope.dialog.modalOptions.siaImportObject;

			function initNewOne(crbCostgrpCatAssign, code) {
				crbCostgrpCatAssign.NewPrjCostgrpCatAssign = {'Code': code};
				crbCostgrpCatAssign.NewPrjCostgrpCatAssign.IsBoq = true;
			}

			function setReadonlyState(crbCostgrpCatAssign) {
				var prjCostgrpCatAssigns = _.find(siaImportObject.PrjCostgrpCatAssigns, {'Id': crbCostgrpCatAssign.PrjCostgrpcatAssignFk});
				var isStandardCatalog = prjCostgrpCatAssigns && prjCostgrpCatAssigns.ContextCostGroupCatalogFk;

				_.forEach(gridColumns, function(column) {
					var readonly = true;
					if      (column.field === 'PrjCostgrpcatAssignFk')          { readonly = isStandardCatalog || crbCostgrpCatAssign.NewPrjCostgrpCatAssign; }
					else if (column.field === 'PrjCostgrpcatAssignDescription') { readonly = isStandardCatalog || crbCostgrpCatAssign.PrjCostgrpcatAssignFk; }
					else                                                        { readonly = !crbCostgrpCatAssign.NewPrjCostgrpCatAssign; }

					platformRuntimeDataService.readonly(crbCostgrpCatAssign, [{field: column.field, readonly: readonly}]);
				});
			}

			function onAssignmentChanged(e, arg) {
				var field = arg.grid.getColumns()[arg.cell].field;
				var crbCostgrpCatAssign = arg.item;
				var prjCostgrpCatAssign = _.find(siaImportObject.PrjCostgrpCatAssigns, {'Id': crbCostgrpCatAssign.PrjCostgrpcatAssignFk});

				setReadonlyState(crbCostgrpCatAssign);

				if (field === 'PrjCostgrpcatAssignFk') {
					crbCostgrpCatAssign.NewPrjCostgrpCatAssign = null;
					if (prjCostgrpCatAssign) {
						crbCostgrpCatAssign.BasCostgroupCatFk              = prjCostgrpCatAssign.ProjectCostGroupCatalogFk;
						crbCostgrpCatAssign.PrjCostgrpcatAssignDescription = prjCostgrpCatAssign.Description;
					}
					else {
						crbCostgrpCatAssign.PrjCostgrpcatAssignFk = -1;
						crbCostgrpCatAssign.BasCostgroupCatFk     = -1;
						crbCostgrpCatAssign.PrjCostgrpcatAssignDescription = '';
					}

					platformGridAPI.rows.refreshRow({'gridId': $scope.gridId, 'item': crbCostgrpCatAssign});
				}
			}

			function addBooleanColumn(fieldName, nameTr) {
				fieldName = 'NewPrjCostgrpCatAssign.' + fieldName;
				gridColumns.push({
					id:        fieldName,
					field:     fieldName,
					name$tr$:  'basics.customize.' + nameTr,
					formatter: 'boolean',
					editor:    'boolean',
					width:     40
				});
			}

			// Inits the grid columns
			var gridColumns = [
				{field: 'Name',                           name: $translate.instant('boq.main.crbCostgrpCatStructure'), width: 200},
				{field: 'PrjCostgrpcatAssignFk',          name: $translate.instant('boq.main.prjCostgrpCatExist'),     width: 120},
				{field: 'NewPrjCostgrpCatAssign.Code',    name: $translate.instant('boq.main.prjCostgrpCatNew'),       width: 120, formatter: 'code', editor: 'code'},
				{field: 'PrjCostgrpcatAssignDescription', name: $translate.instant('cloud.common.entityDescription'),  width: 150, editor: 'description'},
				{field: 'Sorting',                        name: $translate.instant('cloud.common.entitySorting'),      width:  60}];
			addBooleanColumn('IsBoq',                'isBoQ');
			addBooleanColumn('IsEstimate',           'isestimate');
			addBooleanColumn('IsConstructionSystem', 'isliccos');
			addBooleanColumn('IsProcurement',        'isProcurement');
			addBooleanColumn('IsEngineering',        'isEngineering');
			addBooleanColumn('IsProductionSystem',   'isProductionSystem');
			addBooleanColumn('IsModel',              'isModel');
			addBooleanColumn('IsQto',                'isQuantityTakeOff');
			addBooleanColumn('IsControlling',        'isControlling');
			addBooleanColumn('IsDefect',             'isDefect');
			_.forEach(gridColumns, function(column) { column.id = column.field; });
			boqMainCrbCostgroupLookupService2.initLookupColumn(gridColumns[1]);

			// Inits the grid rows
			boqMainCrbCostgroupLookupService2.setSourceData(siaImportObject.PrjCostgrpCatAssigns);
			_.forEach(siaImportObject.CrbCostgrpCatAssigns, function (crbCostgrpCatAssign) {
				var prjCostgrpCatAssign = _.find(siaImportObject.PrjCostgrpCatAssigns, {'Id': crbCostgrpCatAssign.PrjCostgrpcatAssignFk});
				if (prjCostgrpCatAssign) {
					crbCostgrpCatAssign.PrjCostgrpcatAssignDescription = prjCostgrpCatAssign.Description;
				}
				else {
					switch (crbCostgrpCatAssign.Code) {
						case '001': { initNewOne(crbCostgrpCatAssign, 'CRBKAG'); } break;
						case '002': { initNewOne(crbCostgrpCatAssign, 'CRBOGL'); } break;
						case '003': { initNewOne(crbCostgrpCatAssign, 'CRBEGL'); } break;
						case '004': { initNewOne(crbCostgrpCatAssign, 'CRBET_'); } break;
						case '005': { initNewOne(crbCostgrpCatAssign, 'CRBVGR'); } break;
						case '007': { initNewOne(crbCostgrpCatAssign, 'CRBNGL'); } break;
						case '008': { initNewOne(crbCostgrpCatAssign, 'CRBRGL'); } break;
					}
				}
				setReadonlyState(crbCostgrpCatAssign);
			});

			// Inits the grid
			$scope.gridId = 'D0A31C49AEDA4B3B9FB1C31EA53AA5FF';
			$scope.gridData =           {state: $scope.gridId};
			platformGridAPI.grids.config({'id': $scope.gridId, 'options': {idProperty: 'Code'}, 'columns': gridColumns});
			platformGridAPI.items.data(         $scope.gridId, _.orderBy(siaImportObject.CrbCostgrpCatAssigns, 'Code'));
			platformGridAPI.events.register(    $scope.gridId, 'onCellChange', onAssignmentChanged);
			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onAssignmentChanged);
			});

			$scope.wicGroupLookupOptions = {showClearButton: true, filterKey: 'estimate-main-wic-group-master-data-filter'};

			var okButton = $scope.dialog.getButtonById('ok');
			okButton.disabled = function () {
				return !_.every(siaImportObject.CrbCostgrpCatAssigns, function(crbCostgrpCatAssign) {
					return crbCostgrpCatAssign.PrjCostgrpcatAssignFk!==-1 || crbCostgrpCatAssign.NewPrjCostgrpCatAssign;
				});
			};
			okButton.fn = function() {
				platformGridAPI.grids.commitEdit($scope.gridId);
				$scope.$close({ok: true});
				siaImportObject.PrjCostgrpCatAssigns = null;
				siaImportObject.WicGroupId           = $scope.selectedWicGroupId;
				importSia(siaImportObject);
			};
		}
	]);

	angularModule.controller('boqMainCrbSiaExportController', ['$scope', '$http', '$translate', 'platformGridAPI', 'platformDialogService', 'platformLongTextDialogService', 'platformContextService',
		function($scope, $http, $translate, platformGridAPI, platformDialogService, platformLongTextDialogService, platformContextService) {
			var baseUrl = globals.webApiBaseUrl + 'boq/main/crb/';
			var outputs = { crbx: 1, sia451: 2 };
			var boqOutputs = { FullText: 1, ShortText: 2, ShortHeading: 3 };

			function updateOptionPriceconditions() {
				function isAnyFilterItemMarked(filterItems) {
					return _.some(filterItems, function (filterItem) {
						return filterItem.IsMarked || filterItem.Children && isAnyFilterItemMarked(filterItem.Children);
					});
				}

				$scope.optionPriceconditions.IsDisabled = !$scope.optionPrices.IsMarked || isAnyFilterItemMarked(_.find($scope.siaFilter.Children, {Id: 'ranges'}).Children);
				if ($scope.optionPriceconditions.IsDisabled) {
					$scope.optionPriceconditions.IsMarked = false;
				}
			}

			// Updates the filter markers
			function onMarkerModified(e, arg) {
				function setMarkerInChildren(filterItem, isMarked) {
					filterItem.IsMarked = isMarked;
					_.forEach(filterItem.Children, function (filterChildItem) {
						setMarkerInChildren(filterChildItem, isMarked);
					});
				}

				function setMarkerInParent(filterItemToChange, isMarked) {
					var filterParentItem;

					filterItemToChange.IsMarked = isMarked;

					filterParentItem = _.find(platformGridAPI.items.filtered($scope.gridId), function (aFilterItem) {
						return _.includes(aFilterItem.Children, filterItemToChange);
					});
					if (filterParentItem) {
						setMarkerInParent(filterParentItem, _.some(filterParentItem.Children, {IsMarked: true}));
					}
				}

				setMarkerInChildren(arg.item, arg.item.IsMarked);
				setMarkerInParent(arg.item, arg.item.IsMarked);
				platformGridAPI.grids.resize($scope.gridId);

				updateOptionPriceconditions();
			}

			$scope.onCheckboxClick = function (option) {
				if (option.Id === 'prices') {
					updateOptionPriceconditions();
				}
			};

			$scope.selectedOutput = outputs.crbx;

			// Inits the language combo box
			const culture = platformContextService.getCulture();
			$scope.crbLanguages = {valueMember: 'id', displayMember: 'name'};
			$scope.crbLanguages.items = [{id:2,name:'Deutsch'}, {id:7,name:'Français'}, {id:10,name:'Italiano'}];
			$scope.selectedCrbLanguage = _.startsWith(culture, 'fr') ? 7 : _.startsWith(culture, 'it') ? 10 : 2;

			// Inits the document type combo box
			var description = _.startsWith(culture, 'fr') ? {'A': 'Descriptif type', 'B': 'Appel d\'offres', 'C': 'Offre', 'D': 'Contrat/Avenant', 'I': 'Métré'} :
				_.startsWith(culture, 'it') ? {'A': 'Descrizione tipica', 'B': 'Gara d\'appalto', 'C': 'Offerta', 'D': 'Contratto/Avvenuta', 'I': 'Misurato'} :
					{'A': 'Musterleistungsverzeichnis', 'B': 'Ausschreibung', 'C': 'Angebot', 'D': 'Vertrag/Nachtrag', 'I': 'Ausmass'};
			var validCrbDocumentTypes = [];
			$scope.crbDocumentTypes = {valueMember: 'id', displayMember: 'name'};
			$http.get(baseUrl + 'crbdocumenttype?boqHeaderId=' + $scope.dialog.modalOptions.currentBoqHeaderId)
				.then(function (response) {
					if (_.isObject(response.data = JSON.parse(response.data))) {
						_.forEach(response.data.ValidCrbDocumentTypes, function (documentTypeCode) {
							validCrbDocumentTypes.push({id: documentTypeCode, name: documentTypeCode + ' - ' + description[documentTypeCode]});
						});
						$scope.crbDocumentTypes.items = validCrbDocumentTypes;
						$scope.selectedCrbDocumentType = response.data.CurrentCrbDocumentType;
					}
				});

			// Inits the BOQ outputs combo box
			$scope.boqOutputs = {
				valueMember: 'id', displayMember: 'name',
				items: [{'id': boqOutputs.FullText, 'name': 'Volltext'},     // $translate.instant('boq.main.crbBoqOutputFullText') },
					{'id': boqOutputs.ShortText, 'name': 'Kurztext'},     // $translate.instant('boq.main.crbBoqOutputShortText') },
					{'id': boqOutputs.ShortHeading, 'name': 'Suchtitel'}]
			};  // $translate.instant('boq.main.crbBoqOutputShortHeading') }] };
			$scope.selectedBoqOutput = boqOutputs.FullText;

			// Inits the filter grid
			var gridColumns = [{id: 'Id', field: 'Name', name: $translate.instant('boq.main.Description'), width: 300}];
			var gridOptions = {tree: true, marker: {multiSelect: true}, idProperty: 'Id', childProp: 'Children'};
			$scope.gridId = 'D41953E72DA74D8D94A910A008E1DD30';
			$scope.gridData = {state: $scope.gridId};
			platformGridAPI.grids.config({'id': $scope.gridId, 'options': gridOptions, 'columns': gridColumns});
			$http.get(baseUrl + 'siafilter?boqHeaderId=' + $scope.dialog.modalOptions.currentBoqHeaderId)
				.then(function (response) {
					function getDefaultValue(parameterName) {
						let ret = undefined;
						let parameter = _.find($scope.dialog.modalOptions.reportParameters, {'parameterName':parameterName});
						if (parameter) {
							if (Object.prototype.hasOwnProperty.call(parameter, 'value')) {
								ret = parameter.value;
							}
							else {
								ret = parameter.dataType==='System.Boolean' ? parameter.defaultValue==='true' : parameter.dataType==='System.Int32' ? Number(parameter.defaultValue) : parameter.defaultValue;
							}
						}
						return ret;
					}

					if (_.isObject(response.data = JSON.parse(response.data))) {
						$scope.siaFilter = response.data;
						$scope.optionPrices          = _.find(response.data.Children, {Id: 'prices'});
						$scope.optionPriceconditions = _.find(response.data.Children, {Id: 'priceconditions'});
						$scope.optionQuantities      = _.find(response.data.Children, {Id: 'quantities'});

						if ($scope.dialog.modalOptions.reportParameters) {
							$scope.selectedCrbDocumentType = _.find($scope.crbDocumentTypes.items, { 'id': getDefaultValue('DocumentType') });
							$scope.selectedCrbDocumentType = $scope.selectedCrbDocumentType ? $scope.selectedCrbDocumentType.id : $scope.crbDocumentTypes.items[0].id;

							$scope.selectedBoqOutput = _.find($scope.boqOutputs.items, { 'id': getDefaultValue('OutputMode') });
							$scope.selectedBoqOutput = $scope.selectedBoqOutput ? $scope.selectedBoqOutput.id : $scope.boqOutputs.items[0].id;

							$scope.optionPrices.         IsMarked = getDefaultValue('PrintPrices');
							$scope.optionPriceconditions.IsMarked = getDefaultValue('Print_Crb_Pricecondition') && $scope.optionPrices.IsMarked;
							$scope.optionQuantities.     IsMarked = getDefaultValue('PrintQnt');
						}

						platformGridAPI.items.data($scope.gridId, _.find(response.data.Children, {Id: 'ranges'}).Children);
						platformGridAPI.grids.resize($scope.gridId);
					}
				});

			// Starts the export
			$scope.dialog.getButtonById('ok').fn = function () {
				$scope.$close({ok: true});

				if ($scope.dialog.modalOptions.reportParameters) {
					$http.post(baseUrl+'preparereport' + '?boqHeaderId='+$scope.dialog.modalOptions.currentBoqHeaderId + '&documentType='+($scope.selectedCrbDocumentType) + '&boqOutput='+($scope.selectedBoqOutput), $scope.siaFilter)
						.then(function(response) {
							_.forEach(response.data, function(sourceParam) {
								let targetParam = _.find($scope.dialog.modalOptions.reportParameters, {'parameterName':sourceParam.Name});
								if (targetParam) {
									targetParam.value = sourceParam.ParamValue;
								}
							});
						});
				}
				else {
					var params = '';
					params += '?boqHeaderId='    + $scope.dialog.modalOptions.currentBoqHeaderId;
					params += '&isCrbx='         +($scope.selectedOutput===outputs.crbx);
					params += '&dataLanguageId=' + $scope.selectedCrbLanguage;
					params += '&documentType='   + $scope.selectedCrbDocumentType;
					params += $scope.dialog.modalOptions.qtoHeaderId ? '&qtoHeaderId=' + $scope.dialog.modalOptions.qtoHeaderId: '';
					$http.post(baseUrl + 'exportsia' + params, $scope.siaFilter).then(function(response) {
						function getErrorAttribValue(error, attribName) {
							let ret = error;
							ret = ret.substring(  ret.indexOf(attribName+'="')+3);
							ret = ret.substring(0,ret.indexOf('"'));
							return ret;
						}

						if (_.isEmpty(response.data.LogInfo)) {
							var link = angular.element(document.querySelectorAll('#downloadLink'));
							link[0].href = response.data.Uri;
							link[0].download = response.data.FileName;
							link[0].type = 'application/octet-stream';
							link[0].click();

							platformDialogService.showInfoBox('boq.main.exportSucceeded');
						}
						else {
							var infoText = response.data.LogInfo;
							const error2021List = _.filter(response.data.LogInfo.match(/<Error [\s\S]*?>/gi), function (error) { return error.includes('N="2021"'); });
							const error4721List = _.filter(response.data.LogInfo.match(/<Error [\s\S]*?>/gi), function (error) { return error.includes('N="4721"'); });
							const error6305List = _.filter(response.data.LogInfo.match(/<Error [\s\S]*?>/gi), function (error) { return error.includes('N="6305"'); });
							if (_.some(error2021List) || _.some(error4721List) || _.some(error6305List)) {
								infoText = '';
								if (_.some(error2021List)) {
									infoText += 'Error 2021 - ' + getErrorAttribValue(error2021List[0], 'T');
									infoText += '\n' + '	' + $translate.instant('boq.main.crbSiaExportError2021Comment')
									infoText += '\n\n';
								}

								if (_.some(error4721List)) {
									infoText += 'Error 4721 - ' + getErrorAttribValue(error4721List[0], 'T');
									infoText += '\n' + '	' + $translate.instant('boq.main.crbSiaExportError4721Comment')
									var lastAttribValue = '';
									_.forEach(error4721List, function (error) {
										var attribValue = getErrorAttribValue(error, 'I');
										if (attribValue != lastAttribValue) {
											infoText += '\n' + attribValue;
											lastAttribValue = attribValue;
										}
									});
									infoText += '\n\n';
								}

								if (_.some(error6305List)) {
									infoText += 'Error 6305 - ' + getErrorAttribValue(error6305List[0], 'T');
									infoText += '\n' + '	' + $translate.instant('boq.main.crbSiaExportError6305Comment')
									var lastAttribValue = '';
									_.forEach(error6305List, function (error) {
										var attribValue = getErrorAttribValue(error, 'I');
										if (attribValue != lastAttribValue) {
											infoText += '\n' + attribValue;
											lastAttribValue = attribValue;
										}
									});
									infoText += '\n\n';
								}
							}
							platformLongTextDialogService.showDialog({
								headerText$tr$: 'boq.main.siaExport',
								topDescription: {text: $translate.instant('boq.main.exportFailed'), iconClass: 'tlb-icons ico-info'},
								codeMode: true,
								hidePager: true,
								dataSource: new function() {
									platformLongTextDialogService.LongTextDataSource.call(this);
									this.current = infoText;
								}
							});
						}
					});
				}
			};

			platformGridAPI.events.register($scope.gridId, 'onCellChange',  onMarkerModified);
			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onMarkerModified);
			});
		}
	]);

	angularModule.factory('boqMainCrbCostgroupLookupService2', ['$q', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function ($q, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var availableCostgroupCatalogs = [];

			var service = platformLookupDataServiceFactory.createInstance({}).service;

			service.getLookupData = function () {
				return $q.when(_.filter(availableCostgroupCatalogs, 'ProjectCostGroupCatalogFk'));
			};
			service.getItemById = function (id) {
				return _.find(availableCostgroupCatalogs, ['Id', id]);
			};
			service.getItemByIdAsync = function (id) {
				return $q.when(service.getItemById(id));
			};

			service.initLookupColumn = function (lookupColumn) {
				var lookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'boqMainCrbCostgroupLookupService2'});

				lookupColumn.editor = 'lookup';
				lookupColumn.formatter        = lookupConfig.grid.formatter;
				lookupColumn.formatterOptions = lookupConfig.grid.formatterOptions;
				lookupColumn.editor           = lookupConfig.grid.editor;
				lookupColumn.editorOptions    = lookupConfig.grid.editorOptions;
				lookupColumn.editorOptions.lookupOptions.showClearButton   = true;
				lookupColumn.editorOptions.lookupOptions.additionalColumns = true;
				lookupColumn.editorOptions.lookupOptions.columns.push({id: 'IsBoq', field: 'IsBoq', formatter: 'boolean', name$tr$: 'basics.customize.isboq'});
			};

			service.setSourceData = function(sourceData) {
				availableCostgroupCatalogs = [];
				_.forEach(sourceData, function(prjCostgrpCatAssign) {
					availableCostgroupCatalogs.push({
						'Id':                           prjCostgrpCatAssign.Id,
						'Code':                         prjCostgrpCatAssign.Code,
						'IsBoq':                        prjCostgrpCatAssign.IsBoq,
						'ContextCostGroupCatalogFk':    prjCostgrpCatAssign.ContextCostGroupCatalogFk,
						'ProjectCostGroupCatalogFk':    prjCostgrpCatAssign.ProjectCostGroupCatalogFk,
						'DescriptionInfo': {Translated: prjCostgrpCatAssign.Description}
					});
				});
			};

			return service;
		}
	]);
})();
