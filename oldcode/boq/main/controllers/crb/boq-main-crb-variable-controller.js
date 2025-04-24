(function () {
	/* global globals, _ */
	'use strict';

	var angularModule = angular.module('boq.main');

	angularModule.controller('boqMainCrbVariableController', ['$scope', 'boqMainService', 'boqMainCrbVariableService',
		function ($scope, boqMainService, boqMainCrbVariableService) {
			boqMainCrbVariableService.initController($scope, boqMainService);
		}
	]);

	angularModule.factory('boqMainCrbVariableCoreService', ['$http', '$q', 'platformContextService',
		function ($http, $q, platformContextService) {
			var service = {};
			var currentCulture = platformContextService.getCulture();

			service.isPositiontext = function (crbVariable) {
				return crbVariable.Number === '00';
			};

			service.getLanguageKeyByCulture = function(languageId) {
				if (!languageId) { languageId = currentCulture; }
				return _.startsWith(languageId, 'fr') ? 'Fr' : _.startsWith(languageId, 'it') ? 'It' : 'De';
			};

			service.getContractorTextStartPos = function (description, contractorTextStartRow, contractorTextStartCol) {
				var ret = -1;
				var i;
				var descriptionRows;

				if (contractorTextStartRow !== null && contractorTextStartCol !== null && description.split('\n').length >= contractorTextStartRow - 1) {
					ret = 0;
					descriptionRows = description.split('\n');

					for (i = 0; i < descriptionRows.length && i < contractorTextStartRow - 1; i++) {
						ret += descriptionRows[i].length + 1;
					}
					ret += contractorTextStartCol - 1;
				}

				return ret;
			};

			service.markContractorTextInDescription = function (description, contractorTextStartRow, contractorTextStartCol) {
				var contractorTextStartPos;
				var ret = description;

				if (contractorTextStartRow) {
					contractorTextStartPos = service.getContractorTextStartPos(description, contractorTextStartRow, contractorTextStartCol);
					ret = description.substring(0, contractorTextStartPos - 1) + (description[contractorTextStartPos - 1] === '\n' ? '*\n' : '*') + description.substring(contractorTextStartPos);
				}

				return ret;
			};

			service.getPreview = function(crbVariables, additionalCrbVariables, currentBoqItemId, languageId) {
				var description;
				var languageKey = service.getLanguageKeyByCulture(languageId);
				var propNameDecription   = 'Description'  + languageKey;
				var propNameEntryStartCt = 'EntryStartCt' + languageKey;

				var preview = '';
				_.forEach(_.sortBy(crbVariables.concat(additionalCrbVariables), ['BoqItemFk','Number']), function(aCrbVariable) {
					if (aCrbVariable) {
						const isVariableOfCurrentBoqItem = currentBoqItemId===aCrbVariable.BoqItemFk;

						if (preview.length !== 0) {
							preview += '\n';
							if (isVariableOfCurrentBoqItem && !preview.includes('<b>')) { // First line of current BOQ item ?
								preview += '\n';
							}
						}

						description = aCrbVariable[propNameDecription];
						if (!description) {
							description = '';
						}

						if (service.isPositiontext(aCrbVariable)) {
							if (isVariableOfCurrentBoqItem) {
								description = `<b>${description}</b>`;
							}
							preview += description;
						}
						else {
							description = service.markContractorTextInDescription(description, aCrbVariable[`EntryStartRowCt${languageKey}`], aCrbVariable[`EntryStartCt${languageKey}`]);
							preview += `<b>${aCrbVariable[propNameEntryStartCt] ? '*' : '&nbsp;'}${aCrbVariable.Number}&nbsp;${description.split('\n').join('\n&nbsp;&nbsp;&nbsp;&nbsp;')}</b>`;
						}
					}
				});
				preview += '\n\n';
				preview = preview.replace(/\n/g,'<br>');

				return preview;
			};

			service.getPreviewAsync = function(boqMainService, additionalCrbVariables, languageId) {
				var boqItemIds = [];

				var boqItem = boqMainService.getSelected();
				if (!boqItem) {
					return;
				}

				do {
					boqItem = boqMainService.getBoqItemById(boqItem.BoqItemFk);
					if (boqItem && boqItem.BoqItemFk !== null) {
						boqItemIds.push(boqItem.Id);
					}
				}
				while (boqItem);

				if (_.some(boqItemIds)) {
					const currentBoqItem = boqMainService.getSelected();
					const params = '?boqHeaderId='+currentBoqItem.BoqHeaderFk + '&boqItemIds='+JSON.stringify(boqItemIds) + (additionalCrbVariables ? '' : '&boqItemIdForAll='+currentBoqItem.Id);
					return $http.get(globals.webApiBaseUrl + 'boq/main/crbvariable/' + 'specifications' + params).then(function(response) {
						if (response.data !== null) {
							return service.getPreview(response.data, additionalCrbVariables, currentBoqItem.Id, languageId);
						}
					});
				}
				else {
					return $q.when('');
				}
			};

			return service;
		}
	]);

	angularModule.factory('boqMainCrbVariableService', ['$injector', '$timeout', 'platformGridControllerService', 'boqMainCrbVariableDataService', 'boqMainCrbVariableUiService', 'boqMainCrbVariableValidationService', 'boqMainCrbService',
		function ($injector, $timeout, platformGridControllerService, boqMainCrbVariableDataService, boqMainCrbVariableUiService, boqMainCrbVariableValidationService, boqMainCrbService) {
			var dataService;

			return {
				initController: function ($scope, boqMainService) {
					function onCurrentBoqItemChanged() {
						$scope.preview = '';
					}

					function onEcoDevisVariabletextTakeoverStarted(sourceBoqItem) {
						dataService.setEcoDevisTexts(sourceBoqItem);
						return true;
					}

					if (_.startsWith(boqMainService.getServiceName(), 'qto')) {
						$injector.get('platformPermissionService').restrict(boqMainService.getContainerUUID().toLowerCase(), $injector.get('permissions').read);
					}

					dataService = boqMainCrbVariableDataService.getService(boqMainService, $scope);
					platformGridControllerService.initListController($scope, boqMainCrbVariableUiService, dataService, boqMainCrbVariableValidationService,
						{
							columns: [], cellChangeCallBack: function (arg) {
								dataService.propertyChanged(arg.item, arg.grid.getColumns()[arg.cell].field);
							}
						});

					$timeout(function() {
						boqMainCrbService.tryDisableContainer($scope, boqMainService, false);
						dataService.updateTools();
						boqMainCrbVariableValidationService.setDataService(dataService);
					});

					// Registers/Unregisters functions
					boqMainCrbService.ecoDevisVariabletextTakeoverStarted.register(onEcoDevisVariabletextTakeoverStarted);
					boqMainService.registerSelectionChanged(onCurrentBoqItemChanged);
					boqMainService.boqItemBriefChanged.register(dataService.onBoqItemBriefChanged);
					dataService.registerEntityDeleted(boqMainCrbVariableValidationService.crbVariableDeleted);
					$scope.$on('$destroy', function () {
						boqMainCrbService.ecoDevisVariabletextTakeoverStarted.unregister(onEcoDevisVariabletextTakeoverStarted);
						boqMainService.unregisterSelectionChanged(onCurrentBoqItemChanged);
						boqMainService.boqItemBriefChanged.unregister(dataService.onBoqItemBriefChanged);
						dataService.unregisterEntityDeleted(boqMainCrbVariableValidationService.crbVariableDeleted);
					});
				}
			};
		}
	]);

	angularModule.factory('boqMainCrbVariableDataService', ['$http', '$translate', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformContextService', 'platformGridAPI', 'platformDialogService', 'crbBoqPositionTypes', 'boqMainLineTypes', 'boqMainCrbVariableCoreService', 'boqMainCrbService',
		function ($http, $translate, platformDataServiceFactory, platformRuntimeDataService, platformContextService, platformGridAPI, platformDialogService, crbBoqPositionTypes, boqLineTypes, boqMainCrbVariableCoreService, boqMainCrbService) {
			var scope;
			var thisService;
			var thisData;
			var boqMainService;
			var descriptionMutables = ['DescriptionMutableDe', 'DescriptionMutableFr', 'DescriptionMutableIt'];
			var baseRoute = globals.webApiBaseUrl + 'boq/main/crbvariable/';

			function isPositiontext(crbVariable) {
				return boqMainCrbVariableCoreService.isPositiontext(crbVariable);
			}

			function canEdit(crbVariable, property) {
				var isReadonly;
				var descriptions = ['DescriptionDe', 'DescriptionFr', 'DescriptionIt'];
				var contractorTexts = ['ContractorTextDe', 'ContractorTextFr', 'ContractorTextIt'];
				var contractorEntryStarts = ['EntryStartCtDe', 'EntryStartRowCtDe', 'EntryStartCtFr', 'EntryStartRowCtFr', 'EntryStartCtIt', 'EntryStartRowCtIt'];
				var currentBoqItem = boqMainService.getBoqItemById(crbVariable.BoqItemFk);
				var languageKey = getLanguageKeyByProperty(property);

				if (isPositiontext(crbVariable)) {
					isReadonly = boqMainService.isCrbNpk() && !boqMainCrbService.isIndividualPosition(boqMainService, currentBoqItem) ||
						_.includes(descriptions, property) && currentBoqItem.PositionType === crbBoqPositionTypes.closed ||
						_.includes(descriptionMutables, property) ||
						_.includes(contractorTexts, property) ||
						_.includes(contractorEntryStarts, property) ||
						'Number' === property;
				} else {
					isReadonly = _.includes(descriptions, property) ||
						_.includes(descriptionMutables, property) && crbVariable.EntryStartDe === 0 ||
						_.includes(contractorTexts, property) && crbVariable['EntryStartCt' + languageKey] === null ||
						_.includes(contractorEntryStarts, property) && currentBoqItem.PositionType !== crbBoqPositionTypes.individual;
				}

				return !isReadonly;
			}

			function canCreate(isPositiontext) {
				var currentBoqItem = boqMainService.getSelected();

				return _.isObject(currentBoqItem) && currentBoqItem.PositionType !== undefined &&
					(isPositiontext && !boqMainService.isCrbNpk() && !_.includes([boqLineTypes.root,boqLineTypes.crbSubQuantity,1], currentBoqItem.BoqLineTypeFk) && !_.find(thisService.getList(), {Number:'00'}) ||
						!isPositiontext && _.includes([5,6,boqLineTypes.position], currentBoqItem.BoqLineTypeFk));
			}

			function trySetDefaultDescription00(ownerBoqItem, crbVariable00) {
				const languageKey = boqMainCrbVariableCoreService.getLanguageKeyByCulture();
				if (ownerBoqItem && crbVariable00 && !crbVariable00['DescriptionMutable'+languageKey]) {
					crbVariable00['DescriptionMutable'+languageKey] = ownerBoqItem.BriefInfo.Translated || '';
					thisService.setDescription(crbVariable00, languageKey);
				}
			}

			function setContractorText(crbVariable, languageKey) {
				var description = crbVariable['Description'+languageKey];
				var contractorTextStartPos = boqMainCrbVariableCoreService.getContractorTextStartPos(description, crbVariable['EntryStartRowCt'+languageKey], crbVariable['EntryStartCt'+languageKey]);
				crbVariable['ContractorText'+languageKey] = (description && contractorTextStartPos>=0) ? description.substring(contractorTextStartPos) : '';
			}

			function setDescriptionMutable(crbVariable, languageKey) {
				var description = crbVariable['Description'+languageKey];
				var entryStart  = crbVariable['EntryStart'+ languageKey];
				var contractorTextStartPos = boqMainCrbVariableCoreService.getContractorTextStartPos(description, crbVariable['EntryStartRowCt'+languageKey], crbVariable['EntryStartCt'+languageKey]);
				crbVariable['DescriptionMutable'+languageKey] = (description && entryStart) ? description.substring(entryStart-1, contractorTextStartPos===-1 ? description.length : contractorTextStartPos) : '';
			}

			function updatePreview() {
				boqMainCrbVariableCoreService.getPreviewAsync(boqMainService, thisService.getList(), scope.languageId).then(function(response) {
					scope.preview = response;
				});
			}

			function updateCellStates(crbVariable) {
				var readonlyFields = [];

				if (isPositiontext(crbVariable)) {
					platformRuntimeDataService.hideContent(crbVariable, descriptionMutables, true);
				}

				for (let prop in crbVariable) {
					if (Object.prototype.hasOwnProperty.call(crbVariable, prop)) {
						readonlyFields.push({ field: prop, readonly: !canEdit(crbVariable, prop) });
					}
				}
				platformRuntimeDataService.readonly(crbVariable, readonlyFields);
			}

			function getUnusedNumber() {
				var unusedNumber = '00';

				do {
					unusedNumber = _.padStart((parseInt(unusedNumber) + 1).toString(), 2, '0');
				}
				while (_.find(thisService.getList(), ['Number', unusedNumber]));

				return unusedNumber;
			}

			function getCurrenCrbVariableField() {
				var grid = platformGridAPI.grids.element('id', scope.gridId).instance;
				var currentCell = grid.getActiveCell();

				return currentCell ? grid.getColumns()[currentCell.cell].field : null;
			}

			function getLanguageKeyByProperty(languagePropertyName) {
				var languageKey = languagePropertyName.substring(languagePropertyName.length - 2);
				return ['De', 'Fr', 'It'].includes(languageKey) ? languageKey : 'De';
			}

			return {
				getService: function(boqMainServiceParam, scopeParam) {
					if (boqMainService !== boqMainServiceParam) {
						thisService = null;
						boqMainService = boqMainServiceParam;
					}

					if (scopeParam !== undefined) {
						scope = scopeParam;
					}

					if (!_.isObject(thisService)) {
						var serviceOptions = {
							flatNodeItem:
								{
									serviceName: 'boqMainCrbVariableDataService',
									entityRole: {leaf: {itemName: 'CrbBoqVariable', parentService: boqMainService}},
									actions: {
										delete: true, create: 'flat',
										canDeleteCallBackFunc: function (crbVariable) {
											return (!(boqMainService.isCrbNpk() && isPositiontext(crbVariable)));
										},
										canCreateCallBackFunc: function () {
											return canCreate(false);
										}
									},
									httpRead: {
										route: baseRoute, endRead: 'list',
										initReadData: function (readData) {
											var currentBoqItem = boqMainService.getSelected();
											readData.filter = '?boqItemId=' + currentBoqItem.Id + '&boqHeaderId=' + currentBoqItem.BoqHeaderFk;
										}
									},
									httpCreate: {route: baseRoute, endCreate: 'create'},
									dataProcessor: [{
										processItem: function(crbVariable) {
											_.forEach(['De','Fr','It'], function(languageKey) {
												setContractorText(    crbVariable, languageKey);
												setDescriptionMutable(crbVariable, languageKey);
											});

											// bre:
											// This default setting only works in function 'onBoqItemBriefChanged' when the container 'BoQ variables' is visible.
											// As workaround (no better idea) it additionally is executed when the variable 00 is visible for the first time. 
											if (crbVariable.Number==='00' && crbVariable.Version>0) {
												trySetDefaultDescription00(boqMainService.getSelected(), crbVariable);
											}

											updateCellStates(crbVariable);
										}
									}],
									presenter: {
										list: {
											incorporateDataRead: function (readData) {
												var readResult = thisData.handleReadSucceeded(readData, thisData);
												updatePreview();
												return readResult;
											},
											handleCreateSucceeded: function (newCrbVariable) {
												var currentBoqItem = boqMainService.getSelected();

												if (!isPositiontext(newCrbVariable)) {
													newCrbVariable.Number = getUnusedNumber();
												}

												newCrbVariable.BoqHeaderFk = currentBoqItem.BoqHeaderFk;
												newCrbVariable.BoqItemFk = currentBoqItem.Id;

												boqMainService.markItemAsModified(currentBoqItem);

												return newCrbVariable;
											}
										}
									}
								}
						};

						var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
						thisService = serviceContainer.service;
						thisData = serviceContainer.data;
					}

					thisService.updateTools = function () {
						const crbLanguages = [
							{ id:'de', type:'item', fn:onLanguageChanged, caption:'Deutsch',  iconClass:'control-icons ico-de' },
							{ id:'fr', type:'item', fn:onLanguageChanged, caption:'Français', iconClass:'control-icons ico-fr' },
							{ id:'it', type:'item', fn:onLanguageChanged, caption:'Italiano', iconClass:'control-icons ico-it' }];

						function onLanguageChanged(id) {
							updateLanguage(id);
						}

						function updateLanguage(languageId) {
							languageId = _.startsWith(languageId, 'fr') ? 'fr' : _.startsWith(languageId, 'it') ? 'it' : 'de';
							const languageTool = _.find(scope.tools.items, {id:'crbLanguage'});
							const crbLanguage  = _.find(crbLanguages, {id:languageId});

							languageTool.caption   = crbLanguage.caption;
							languageTool.iconClass = crbLanguage.iconClass;
							scope.tools.update();

							// Manipluates the binding of a grid column to a property of the DTO according to the current language
							platformGridAPI.grids.commitEdit(scope.gridId);
							_.forEach(platformGridAPI.grids.element('id', scope.gridId).instance.getColumns(), function(column) {
								if (['descriptionde', 'descriptionmutablede', 'contractortextde', 'hintde'].includes(column.id)) {
									column.field  = column.field.substring(0,column.field.length-2) + (languageId==='fr' ? 'Fr' : languageId==='it' ? 'It' : 'De');
								}
							});
							platformGridAPI.grids.invalidate(scope.gridId);

							scope.languageId = languageId;
							updatePreview();
						}

						if (!scope.tools) {
							return;
						}

						if (!_.find(scope.tools.items, {id: 'crbNewPositiontext'})) {
							var isCreating = false;
							scope.addTools([
								{
									id: 'crbLanguage',
									type: 'dropdown-btn',
									sort: -100,
									list: {
										cssClass: 'dropdown-menu-right',
										items: crbLanguages
									}
								},
								{
									id: 'crbNewPositiontext',
									caption: 'boq.main.crbNewPositiontext',
									iconClass: 'tlb-icons ico-sub-vb-new',
									type: 'item',
									permission: '#c',
									disabled: function () {
										return !canCreate(true) || isCreating;
									},
									fn: function () {
										isCreating = true;
										platformGridAPI.grids.commitAllEdits();
										return $http.post(baseRoute + 'create?number=00')
											.then(function (response) {
												isCreating = false;
												return thisData.onCreateSucceeded(response.data, thisData);
											});
									}
								},
								{
									id: 'crbEditVariable',
									caption: 'boq.main.crbEditVariable',
									iconClass: 'tlb-icons ico-wildcard-1',
									type: 'item',
									permission: '#c',
									// disabled:  function() { return !thisService.getSelected(); }, // bre: Does not work and I do not know why ...
									fn: function () {
										platformGridAPI.grids.commitAllEdits();
										var currentVariable = thisService.getSelected();
										var currentField = getCurrenCrbVariableField();

										if (!((_.startsWith(currentField, 'Description') || _.startsWith(currentField, 'ContractorText')) && canEdit(currentVariable, currentField))) {
											return;
										}

										var bodyTemplate;
										var languageKey = getLanguageKeyByProperty(currentField);
										bodyTemplate  = '<section class="modal-body">';
										bodyTemplate +=    '<div data-ng-controller="boqMainCrbVariableEditController" class="flex-element flex-box flex-column">';
										bodyTemplate +=       '<div class="flex-element flex-box flex-column">';
										bodyTemplate +=          '<textarea style="font-family:monospace" class="flex-element form-control noresize ng-valid ng-not-empty ng-touched ng-dirty ng-valid-parse" id="crbVariableTextareaEdit"></textarea>';
										bodyTemplate +=       '</div>';
										bodyTemplate +=       '<div class="flex-element flex-box flex-column" ng-show="hasPreview">';
										bodyTemplate +=          '<textarea style="font-family:monospace" class="flex-element form-control noresize" readonly="true" id="crbVariableTextareaPreview"></textarea>';
										bodyTemplate +=       '</div>';
										bodyTemplate +=    '</div>';
										bodyTemplate += '</section>';
										var modalOptions = {
											headerText$tr$: 'boq.main.crbEditVariable',
											bodyTemplate: bodyTemplate,
											showOkButton: true,
											showCancelButton: true,
											height: '500px',
											width: '400px',
											minWidth: '400px',
											resizeable: true,
											data: {'currentCrbVariable': currentVariable, 'currentField': currentField, 'languageKey': languageKey, 'dataService': thisService}
										};

										if (!isPositiontext(currentVariable)) {
											modalOptions.bodyTemplate = _.replace(modalOptions.bodyTemplate, 'hasPreview', 'true');
											if (_.startsWith(currentField, 'Description')) {
												modalOptions.customButtons = [{id: 'contractorText', caption$tr$: 'boq.main.ContractorText'}];
											}
										}

										platformDialogService.showDialog(modalOptions);
									}
								}]);

							var tool = _.find(scope.tools.items, {id: 'create'});
							if (tool) {
								tool.caption = $translate.instant('boq.main.crbNewVariable');
							}
						}

						scope.tools.update();
						updateLanguage(platformContextService.getCulture());
					};

					thisService.deleteSelection = function () {
						var ret;
						var specialUnterabschnitte = [];
						var currentBoqItem = boqMainService.getSelected();
						var currentChapter = currentBoqItem.Reference.substring(0, 4);
						var selectedVariables = thisService.getSelectedEntities();

						if (currentBoqItem.BoqLineTypeFk === 5 && _.endsWith(currentBoqItem.Reference, '.000.200') && _.find(selectedVariables, {Number: '02'})) {
							specialUnterabschnitte = _.filter(_.filter(boqMainService.getList(), {'BoqLineTypeFk': 3}), function (aBoqItem) {
								return _.includes([currentChapter + '010.', currentChapter + '020.', currentChapter + '030.'], aBoqItem.Reference);
							});
						}

						ret = thisService.deleteEntities(selectedVariables);

						if (_.some(specialUnterabschnitte)) {
							platformDialogService.showInfoBox('boq.main.crbSpecialBoqItemsToBeDeleted');
						}

						boqMainService.markItemAsModified(currentBoqItem);

						return ret;
					};

					thisService.propertyChanged = function (crbVariable, changedProperty) {
						if (crbVariable.Number === '00') {
							const languageKey = getLanguageKeyByProperty(changedProperty);
							if (changedProperty === 'Number') {
								crbVariable.Number = getUnusedNumber();
							}
							else if (changedProperty === 'Description'+languageKey) {
								crbVariable['DescriptionMutable'+languageKey] = crbVariable['Description'+languageKey];
							}
						}

						if (_.startsWith(changedProperty, 'DescriptionMutable') || _.startsWith(changedProperty, 'ContractorText') || _.startsWith(changedProperty, 'EntryStart')) {
							thisService.setDescription();
						}

						boqMainService.markItemAsModified(boqMainService.getSelected());
					};

					thisService.getCurrentCrbVariable = function () {
						var ret = thisService.getSelected();

						if (_.isObject(ret) && isPositiontext(ret)) {
							ret = null;
						}

						return ret;
					};

					thisService.getContractorTextStartPos = function (description, contractorTextStartRow, contractorTextStartCol) {
						return boqMainCrbVariableCoreService.getContractorTextStartPos(description, contractorTextStartRow, contractorTextStartCol);
					};

					thisService.markContractorTextInDescription = function (description, contractorTextStartRow, contractorTextStartCol) {
						return boqMainCrbVariableCoreService.markContractorTextInDescription(description, contractorTextStartRow, contractorTextStartCol);
					};

					thisService.setDescription = function (crbVariable, languageKey) {
						function formatDescription(description) {
							var i;
							var maxRowLength = 30;
							var formattedDescriptionRow;
							var formattedDescriptionRows = [];
							var descriptionRows = description.split('\n');
							for (i = 0; i < descriptionRows.length; i++) {
								formattedDescriptionRow = descriptionRows[i];
								if (formattedDescriptionRow.length > maxRowLength) {
									formattedDescriptionRow = formattedDescriptionRow.substring(0, maxRowLength) + '\n' + formattedDescriptionRow.substring(maxRowLength, descriptionRows[i].length);
								}
								formattedDescriptionRows.push(formattedDescriptionRow);
							}
							return formattedDescriptionRows.join('\n');
						}

						if (!crbVariable) {
							crbVariable = thisService.getSelected();
						}

						languageKey = languageKey || getLanguageKeyByProperty(getCurrenCrbVariableField());

						var descriptionRows;
						var description;
						var propNameDescr = 'Description' + languageKey;
						var contractorTextStartRow = crbVariable['EntryStartRowCt' + languageKey];
						var contractorTextStartCol = crbVariable['EntryStartCt' + languageKey];
						var contractorText;

						description = crbVariable[propNameDescr];
						if (!description) {
							description = '';
						}
						description = formatDescription(description.substring(0, crbVariable['EntryStart'+languageKey]-1) + crbVariable['DescriptionMutable'+languageKey]);

						if (contractorTextStartRow !== null) {
							// First fills the 'Description..' until to the 'EntryStart..'
							descriptionRows = description.split('\n');
							while (descriptionRows.length < contractorTextStartRow) {
								descriptionRows.push('');
							}
							while (descriptionRows[contractorTextStartRow - 1].length < contractorTextStartCol) {
								descriptionRows[contractorTextStartRow - 1] += ' ';
							}

							contractorText = crbVariable['ContractorText' + languageKey];
							if (!contractorText) {
								contractorText = '';
							}
							description = descriptionRows.join('\n');
							description = formatDescription(description.substring(0, thisService.getContractorTextStartPos(description, contractorTextStartRow, contractorTextStartCol)) + contractorText);
						}

						crbVariable[propNameDescr] = description;

						thisService.markItemAsModified(crbVariable);
						platformGridAPI.rows.refreshRow({'gridId': scope.gridId, 'item': crbVariable});
						updatePreview();
						updateCellStates(crbVariable);

						return description;
					};

					thisService.onBoqItemBriefChanged = function (boqItem) {
						if (!boqItem) { return; }

						var crbVariable00 = _.find(thisService.getList(), {Number:'00', BoqItemFk:boqItem.Id});
						trySetDefaultDescription00(boqItem, crbVariable00);
					};

					thisService.setEcoDevisTexts = function (sourceBoqItem) {
						var targetBoqItem;
						var matchingEcoDevisInfo;
						var languageKey = boqMainCrbVariableCoreService.getLanguageKeyByCulture();
						var changedCrbVariables = [];

						function onCrbVariablesLoaded(e) {
							if (e !== undefined) {
								thisService.unregisterListLoaded(onCrbVariablesLoaded);
								setEcoDevisTexts();
							}
						}

						function setEcoDevisTexts() {
							_.forEach(thisService.getList(), function (crbVariable) {
								matchingEcoDevisInfo = _.find(sourceBoqItem.EcoDevisInfos, function (ecoDevisInfo) {
									return crbVariable.Number === ecoDevisInfo.getVariableNumber();
								});
								if (matchingEcoDevisInfo && _.some(matchingEcoDevisInfo.crbEcodevisInfoEcoText)) {
									crbVariable['DescriptionMutable'+languageKey] = matchingEcoDevisInfo.crbEcodevisInfoEcoText;
									thisService.setDescription(crbVariable, languageKey);
									thisService.markItemAsModified(crbVariable);
									changedCrbVariables.push(crbVariable.Number);
									platformGridAPI.rows.refreshRow({'gridId': scope.gridId, 'item': crbVariable});
								}
							});

							if (_.some(changedCrbVariables)) {
								platformDialogService.showDialog({
									headerText$tr$: 'cloud.common.infoBoxHeader',
									bodyText: $translate.instant('boq.main.crbEcodevisVariabletextChanged') + ': ' + changedCrbVariables.join(', '),
									showOkButton: true,
									iconClass: 'info'
								});
							} else {
								platformDialogService.showInfoBox('boq.main.crbEcodevisVariabletextUnavailable4');
							}
						}

						targetBoqItem = _.find(boqMainService.getList(), {'Reference': sourceBoqItem.Reference});
						if (targetBoqItem) {
							if (boqMainService.getSelected() === targetBoqItem) {
								setEcoDevisTexts();
							} else {
								thisService.registerListLoaded(onCrbVariablesLoaded);
								boqMainService.setSelected(targetBoqItem);
							}
						} else {
							platformDialogService.showInfoBox('boq.main.crbEcodevisVariabletextUnavailable3');
						}
					};

					return thisService;
				}
			};
		}
	]);

	angularModule.factory('boqMainCrbVariableUiService', [
		'platformUIStandardConfigService', 'platformSchemaService', 'boqMainTranslationService',
		function (PlatformUIStandardConfigService, platformSchemaService, boqMainTranslationService) {
			var domainSchema = platformSchemaService.getSchemaFromCache({moduleSubModule: 'Boq.Main', typeName: 'CrbBoqVariableDto'});
			var gridLayout =
				{
					fid: 'boq.main.crb.variable.config',
					addValidationAutomatically: true,
					groups: [{
						'gid': 'basicData',
						'attributes': ['number', 'descriptionde', 'descriptionmutablede', 'contractortextde', 'ecodevismark', 'hintde', 'grp', 'publicationcode']
					},
					{'gid': 'entityHistory', 'isHistory': true}],
					overloads:
						{
							// The NPK properties
							ecodevismark: {readonly: true},
							hintde: {readonly: true},
							hintfr: {readonly: true},
							hintit: {readonly: true},
							grp: {readonly: true},
							publicationcode: {readonly: true}
						}
				};

			// Disables the sorting except for field 'Number'
			_.forEach(Object.values(gridLayout.groups[0].attributes), function (column) {
				if (!_.isObject(gridLayout.overloads[column])) {
					gridLayout.overloads[column] = {};
				}
				if (!_.isObject(gridLayout.overloads[column].grid)) {
					gridLayout.overloads[column].grid = {};
				}

				if (column !== 'number') {
					gridLayout.overloads[column].grid.sortable = false;
				}
			});

			return new PlatformUIStandardConfigService(gridLayout, domainSchema.properties, boqMainTranslationService);
		}
	]);

	angularModule.factory('boqMainCrbVariableValidationService', ['$translate', 'platformDataValidationService', 'platformRuntimeDataService',
		function ($translate, platformValidationService, platformRuntimeDataService) {
			var dataService;
			var validationService = {};

			function checkNumberIsUnique(changedCrbVariable) {
				var ret;
				var validationResult;
				var allCrbVariables = _.filter(dataService.getList(), function (cv) {
					return cv.Number !== '00';
				});

				_.forEach(allCrbVariables, function (aCrbVariable) {
					validationResult = platformValidationService.isUniqueAndMandatory(allCrbVariables, 'Number', aCrbVariable.Number, aCrbVariable.Id, {object: $translate.instant('boq.main.Number')});
					platformRuntimeDataService.applyValidationResult(validationResult, aCrbVariable, 'Number');
					if (aCrbVariable === changedCrbVariable) {
						ret = validationResult;
					}
				});

				return ret;
			}

			validationService.setDataService = function (dataServiceParam) {
				dataService = dataServiceParam;
			};

			validationService.crbVariableDeleted = function () {
				checkNumberIsUnique();
			};

			validationService.validateNumber = function (changedCrbVariable, number) {
				changedCrbVariable.Number = number;
				return checkNumberIsUnique(changedCrbVariable);
			};

			return validationService;
		}
	]);

	angularModule.controller('boqMainCrbVariableEditController', ['$scope',
		function ($scope) {
			var contractorTextPositionButton;
			var textareaEdit;
			var textareaPreview;
			var dataService = $scope.dialog.modalOptions.data.dataService;
			var crbVariableOrigin = $scope.dialog.modalOptions.data.currentCrbVariable;
			var languageKey       = $scope.dialog.modalOptions.data.languageKey;
			var currentField      = $scope.dialog.modalOptions.data.currentField;
			var description = crbVariableOrigin['Description'+languageKey];
			var isContractorText = _.startsWith(currentField, 'ContractorText');
			var entryStart = isContractorText ? dataService.getContractorTextStartPos(description, crbVariableOrigin['EntryStartRowCt'+languageKey], crbVariableOrigin['EntryStartCt'+languageKey])
				: crbVariableOrigin['EntryStart' + languageKey] - 1;
			var crbVariableClone = JSON.parse(JSON.stringify(crbVariableOrigin)); // deep clone

			if (!description) {
				description = '';
			}
			if (currentField === 'Description'+languageKey) {
				currentField = 'DescriptionMutable'+languageKey;
			}

			textareaPreview = document.getElementById('crbVariableTextareaPreview');
			textareaEdit    = document.getElementById('crbVariableTextareaEdit');
			textareaEdit.value = crbVariableOrigin[currentField];
			updatePreview(description);

			function updatePreview(description) {
				textareaPreview.value = dataService.markContractorTextInDescription(description, crbVariableClone['EntryStartRowCt' + languageKey], crbVariableClone['EntryStartCt' + languageKey]);
			}

			$scope.dialog.getButtonById('ok').fn = function () {
				for (let prop in crbVariableOrigin) {
					if (Object.prototype.hasOwnProperty.call(crbVariableOrigin, prop)) {
						crbVariableOrigin[prop] = crbVariableClone[prop];
					}
				}
				dataService.setDescription();
				dataService.propertyChanged(crbVariableOrigin, currentField);
				$scope.$close({ok: true});
			};

			contractorTextPositionButton = $scope.dialog.getButtonById('contractorText');
			if (contractorTextPositionButton) {
				contractorTextPositionButton.fn = function () {
					var entryStartRowCt = 'EntryStartRowCt' + languageKey;
					var entryStartCt = 'EntryStartCt' + languageKey;
					var rowsToSelectionstart;
					var rowStart;

					crbVariableClone['ContractorText' + languageKey] = '';
					if (crbVariableClone[entryStartRowCt]) {
						crbVariableClone[entryStartRowCt] = null;
						crbVariableClone[entryStartCt] = null;
					} else {
						rowsToSelectionstart = textareaEdit.value.substring(0, textareaEdit.selectionStart).split('\n');
						rowStart = (rowStart = rowsToSelectionstart.slice(0, -1).join('\n').length) === 0 ? -1 : rowStart;
						crbVariableClone[entryStartRowCt] = rowsToSelectionstart.length;
						crbVariableClone[entryStartCt] = textareaEdit.selectionStart - rowStart;
						if (crbVariableClone[entryStartCt] > 30) {
							crbVariableClone[entryStartRowCt]++;
							crbVariableClone[entryStartCt] = 1;
						}
					}

					updatePreview(dataService.setDescription(crbVariableClone));
				};
			}

			textareaEdit.oninput = function () {
				var maxRowLength = 30;
				var currentRowStart = this.value.substring(this.value, this.selectionStart - 1).lastIndexOf('\n') + 1;
				var currentRowEnd = this.value.indexOf('\n', this.selectionStart) + 1;
				var currentRow = this.value.substring(currentRowStart, currentRowEnd > 0 ? currentRowEnd : this.value.length).split('\n').join(''); // Removes all '\n'
				var firstRow = this.value.split('\n')[0];
				var descriptionRowsToEntryStartRow;
				var descriptionStartOfEntryStartRow;

				// The first row might be shorter than 'maxRowLength' because of the 'entryStart'
				if (this.selectionStart <= firstRow.length) { // Cursor in first line ?
					descriptionRowsToEntryStartRow = description.substring(0, entryStart).split('\n');
					descriptionStartOfEntryStartRow = descriptionRowsToEntryStartRow.slice(0, -1).join('').length + descriptionRowsToEntryStartRow.length - 1;
					maxRowLength -= entryStart - descriptionStartOfEntryStartRow;
				}

				if (currentRow.length > maxRowLength) {
					var selectionStart = this.selectionStart;

					currentRowEnd = currentRowStart + currentRow.lastIndexOf(' ');
					if (currentRowEnd >= currentRowStart) { // includes ' '
						this.value = this.value.substring(0, currentRowEnd) + '\n' + this.value.substring(currentRowEnd + 1, this.value.length);
						this.selectionStart = this.selectionEnd = selectionStart;
					} else {
						currentRowEnd = currentRowStart + maxRowLength;
						this.value = this.value.substring(0, currentRowEnd) + '\n' + this.value.substring(currentRowEnd, this.value.length);
						this.selectionStart = this.selectionEnd = selectionStart + 1;
					}
				}

				// Ensures the max number of text rows
				if (this.value.split('\n').length > 99) {
					this.value = this.value.substring(0, this.value.lastIndexOf('\n'));
				}

				crbVariableClone[currentField] = this.value;
				updatePreview(dataService.setDescription(crbVariableClone));
			};

			textareaEdit.onpaste = function (event) {
				/*
					Zeile1: 9012345678901234567890    
					Zeile2: 9012345678901234567890 234
					Zeile3: 9012345678901234567-90123456-8901234
					Zeile4: 901234567890123456789-12345678901234
					Zeile5: 901234567890123456789012345678901234
					Zeile6: 9012
					Zeile7: 9

					==>

					Zeile1: 9012345678901234567890
					Zeile2: 9012345678901234567890
					234
					Zeile3: 9012345678901234567-
					90123456-8901234
					Zeile4: 901234567890123456789-
					12345678901234
					Zeile5:
					901234567890123456789012345678
					901234
					Zeile6: 9012
					Zeile7: 9
				*/
				const maxRowLength = 30;
				var newText = '\n';
				var pastedTextRows = event.clipboardData.getData('Text').split('\n');

				_.forEach(pastedTextRows, function(pastedTextRow) {
					// Splits the pasted row in words by considering sub words and spliiting words which are longer than the nax row length
					var tmpPastedWords=[], pastedWords=[];
					_.forEach(_.trimEnd(pastedTextRow).split(' '), function(pastedWord) {
						var pastedSubWords = pastedWord.split('-');
						for (var i=0; i < pastedSubWords.length; i++) {
							tmpPastedWords.push(pastedSubWords[i] + (i<pastedSubWords.length-1 ? '-' : ''));
						}
					});
					_.forEach(tmpPastedWords, function(pastedWord) {
						pastedWords = pastedWords.concat(pastedWord.split(/(.{30})/).filter(s=>s.length>0));
					});

					// Builds a new text row by considering the max length
					var newTextRow = '';
					_.forEach(pastedWords, function(pastedWord) {
						if (newTextRow && !_.endsWith(newTextRow,'-')) { newTextRow += ' '; }
						if ((newTextRow+pastedWord).length > maxRowLength) {
							newText += _.trimEnd(newTextRow) + '\n';
							newTextRow = '';
						}
						newTextRow += pastedWord;
					});
					newText += _.trimEnd(newTextRow) + '\n';
				});

				event.preventDefault();
				document.execCommand('insertText', false, newText);
			};
		}
	]);
})();
