/* jshint -W098 */ // parameter defined but never used
((angular) => {
	'use strict';

	const modulename = 'cloud.desktop';
	const serviceName = 'cloudDesktopTestService';

	serviceFunction.$inject = ['_', '$injector', 'platformDialogService', '$q', 'platformDialogDefaultButtonIds', 'globals'];

	function serviceFunction(_, $injector, platformDialogService, $q, defaultButtonIds, globals) {

		function getGridColumnsConfig() {
			return [{
				id: 'culture',
				name$tr$: 'platform.customTranslateControl.language',
				formatter: 'description',
				field: 'culture',
				width: 200
			}, {
				id: 'description',
				name$tr$: 'platform.customTranslateControl.description',
				formatter: 'description',
				field: 'description',
				editor: 'description',
				width: 400
			}, {
				id: 'p1',
				field: 'rib',
				readonly: false,
				width: 30,
				resizable: false,
				formatter: 'image',
				formatterOptions: {
					imageSelector: 'cloudDesktopRibPagesIconService'
				}
			}];
		}

		function getGridConfig(gridId, columnsConfig = getGridColumnsConfig()) {
			return {
				columns: columnsConfig,
				id: gridId,
				lazyInit: true,
				enableConfigSave: false,
				options: {
					idProperty: 'culture',
					editable: true,
					indicator: true,
					skipPermissionCheck: true
				}
			};
		}

		function showControlTestDialog(formConfig = undefined) {
			// is the forms controlls readonly
			let readOnlyState = false;
			// the model object for the dialogs form
			let values = {};
			let gridId = 'testGrid';

			let formDialogOptions = {
				formConfig: {
					configure: formConfig || getFormConfig()
				},
				value: values,
				headerText: 'Test Dialog',
				buttons: [{
					id: 'cancel'
				}, {
					id: 'ok',
					disabled: function disabled(info) {
						return (!info.value);
					}
				}], topDescription: 'This is a dialog for testing various controls made by Germanys UI Team.',
				customButtons: [
					// Read Only
					{
						id: 'readonly',
						caption: 'Set Read Only',
						fn: function (event, info) {
							if (info.value) {
								readOnlyState = !readOnlyState;
								let props = Object.keys(info.value);
								props.forEach(function (prop) {
									$injector.get('platformRuntimeDataService').readonly(info.value, [{
										field: prop,
										readonly: readOnlyState
									}]);
								});

								info.button.caption = readOnlyState ? 'Unset Read Only' : 'Set Read Only';
							}
						}
					},
					// Show Custom Dialog
					{
						id: 'dialog',
						caption: 'Show Custom Dialog',
						fn: function (/* event, info */) {
							showCustomDialog();
						}
					},
					// Show Error
					{
						id: 'error',
						caption: 'Show Error',
						fn: function (/* event, info */) {
							showErrorDialog();
						}
					}, // Show Test Dialog
					{
						id: 'test',
						caption: 'Test',
						fn: function (event, info) {
							showTestDialog(info);
						}
					}]
			};

			// call controls test dialog
			return $injector.get('platformDialogFormService').showDialog(formDialogOptions);

			function getFormRows() {
				return [getFormControl('remark', {
					'options': {
						type: 'resizable',
						useMaxHeight: true
					}
				}),
					getFormControl('url'), getFormControl('fileselect', {
					'options': {
						fileFilter: 'image/*',
						maxSize: '500KB',
						retrieveDataUrl: true
					}
				}), getFormControl('description', {
					// validator: function () {
					// return {apply: true, valid: false, error: 'Name muss ziemlich cool sein'};
					// }
				}), getFormControl('decimal', {}), getFormControl('action', {
					readonly: true,
					'modelValue': {
						actionList: [{
							toolTip: 'just a test',
							icon: 'tlb-icons ico-download',
							callbackFn: null,
							readonly: false
						}]
					}
				}), getFormControl('color', {options: {showHashCode: true, showClearButton: true}}),
				getFormControl('color', {
					rid: 'color2',
					model: 'color2',
					options: {showHashCode: true, showClearButton: true}
				}),
				getFormControl('code'), getFormControl('numcode'),
				getFormControl('multicode'), getFormControl('history'), getFormControl('translation'),
				getFormControl('email'), getFormControl('password'), getFormControl('iban'),
				getFormControl('convert'), getFormControl('durationsec', {options: {}}), getFormControl('money'),
				getFormControl('time'), getFormControl('date'), getFormControl('boolean'), getFormControl('text'),
				getFormControl('select', {
					options: {
						items: [{id: '1', description: 'Eintrag 1'}, {id: '2', description: 'Eintrag 2'}, {
							id: '3',
							description: 'Eintrag 3'
						}],
						valueMember: 'id',
						displayMember: 'description'
					}
				}),
				getFormControl('inputselect'), getFormControl('imageselect'),
				getFormControl('customtranslate', {
					// model: '$cust.testSection.testId.testName',
					options: {
						onInitiated: function (/* info */) {
						},
						onTranslationChanged: function (/* info */) {
						},
						inputDomain: 'comment',
						section: 'testSection',
						id: 'testId',
						name: 'testName',
						watchId: true
					}
				}),
				getFormControl('marker'), getFormControl('radio'),
				{
					gid: 'config',
					rid: 'grid',
					label: 'grid',
					visible: true,
					model: 'grid',
					type: 'directive',
					directive: 'platform-grid-form-control',
					options: {
						gridConfig: getGridConfig(gridId),
						tools: {
							showImages: true,
							showTitles: true,
							cssClass: 'tools ',
							items: [
								// {
								//    id: '146',
								//    sort: 5,
								//    caption: 'Mein Test für den action select button',
								//    iconClass: 'tlb-icons ico-rec-new',
								//    type: 'action-btn'
								// },
								{
									id: '1',
									sort: 10,
									caption: 'Show test popup',
									iconClass: 'tlb-icons ico-export-all-views',
									type: 'item',
									disabled: function () {
										return false;
									},
									fn: function (buttonId, button, info) {
										const popupOptions = {
											multiPopup: false,
											plainMode: true,
											hasDefaultWidth: false,
											minWidth: 250,
											maxWidth: 350,
											scope: info.scope,
											cssClass: 'config-test-popup',
											focusedElement: angular.element(info.e.currentTarget),
											template: '<div>Das ist ein Test</div><br><br><span>das ist ein zweiter Test</span>'
										};

										let popupInstance = $injector.get('basicsLookupdataPopupService').toggleLevelPopup(popupOptions);

										if (!_.isNil(popupInstance)) {
											popupInstance.opened.then(() => {
												$injector.get('$timeout')(() => {
													info.scope.$digest();
												}, 0);
											});
										}
									}

								},
								{
									id: '1',
									sort: 10,
									caption: 'cloud.common.toolbarInsert',
									iconClass: 'tlb-icons ico-rec-new',
									type: 'item',
									disabled: function () {
										return false;
									},
									fn: function (/* buttonId, button, info */) {
										console.log('add');

										let newGridData = {
											// id: platformCreateUuid(),
											culture: 'de',
											description: 'Deutschland',
											rib: 1
										};

										$injector.get('platformManualGridService').addNewRowInGrid(gridId, newGridData);
									}

								},
								{
									id: '2',
									sort: 20,
									caption: 'cloud.common.toolbarDelete',
									iconClass: 'tlb-icons ico-rec-delete',
									type: 'item',
									disabled: function () {
										return false;
									},
									fn: function (/* buttonId, button, info */) {
										console.log('delete');

										/* unused ...
										let newGridData = {
											// id: platformCreateUuid(),
											culture: 'de',
											description: 'Deutschland',
											rib: 1
										};
										*/

										$injector.get('platformManualGridService').deleteSelectedRow(gridId, true);
									}
								}
							]
						},
						// gridId: gridId,
						height: '120px',
						overlay: {show: false, info: 'das ist mein test', css: 'meintest'}
					}
				},
				getFormControl('directive', {
					label: 'action-select-btn',
					directive: 'platform-action-select-btn',
					options: {
						showImages: true,
						activeValue: 'item21',
						// cssClass: 'dropdown-menu-right',
						items: [
							{
								id: 12,
								caption: 'mein Test',
								caption$tr$: 'cloud.desktop.design.headerColor',
								type: 'item',
								iconClass: 'tlb-icons ico-cut',
								visible: true,
								fn: function (/* id, item */) {
									console.log('12');
								}
							}, {
								id: 'item21',
								caption$tr$: 'cloud.desktop.design.headerColor',
								type: 'item',
								iconClass: 'tlb-icons ico-copy',
								visible: true,
								// platformTranslateService.translateObject(myObject, undefined, {recursive: true});
								fn: function (/* id, item */) {
									console.log('item21');
								}
							},
							{
								id: 31,
								caption: 'Text4',
								type: 'item',
								iconClass: 'tlb-icons ico-paste',
								value: 0,
								visible: true,
								fn: (/* id, item */) => console.log('31')
							}
						]
					}
				})];
			}

			function getFormConfig(formRows = getFormRows()) {

				return {
					fid: 'cloud.desktop.uds.form',
					version: '1.0.0',
					showGrouping: false,
					groups: [{
						gid: 'config',
						isOpen: true,
						isVisible: true,
						sortOrder: 1,
					}],
					rows: formRows
				};
			}

			function getFormControl(type, objectExtention) {
				let obj = {
					gid: 'config',
					rid: type,
					label: type,
					type: type,
					visible: true,
					model: type,
				};

				obj = _.assign(obj, objectExtention);

				values[obj.model] = _.get(objectExtention, 'modelValue') || '';
				return obj;
			}
		}

		function showErrorDialog(errorNumber) {
			let errorUrl, promise;

			if (errorNumber) {
				// if errorNumber was passed
				promise = $q.when(errorNumber);
			} else {
				// if not then Error Choose Dialog
				let formDialogOptions = getSelectDialogOptions('Dialog', 'errorNumber', [
					{id: 1, description: 'local error read from a text file to inject a reported exception'},
					{id: 2, description: 'Stacktrace in Message with harmful xxs attack string within'},
					{id: 3, description: 'Nested Business Layer Exception'},
					{id: 4, description: 'Nested Server Exceptions'}
				]);

				promise = $injector.get('platformDialogFormService').showDialog(formDialogOptions).then((result => {
					if (result.ok) {
						return result.value.errorNumber;
					}
				}));
			}

			// show custom dialog depending on the dialogNumber
			promise.then(function (en) {
				let params;

				switch (en) {
					case 1:
						// local error read from a json file to inject a reported exception

						// Create the invisible input-element and add to the dom
						const inputElement = document.createElement('input');
						inputElement.type = 'file';
						inputElement.accept = '.json';
						inputElement.style.display = 'none';  // Unsichtbar machen

						document.body.appendChild(inputElement);

						// process the file, if one has been selected
						inputElement.addEventListener('change', function () {
							const file = inputElement.files[0];

							if (file && file.type === 'application/json') {
								const reader = new FileReader();
								reader.onload = function (event) {
									try {
										const jsonContent = JSON.parse(event.target.result);
										platformDialogService.showErrorDialog(jsonContent);
									} catch (error) {
										console.error('Invalid JSON-file:', error);
									}
								};

								reader.readAsText(file);
							} else {
								alert('Please select a valid JSON file with error data within.');
							}

							// Removes the input-element after upload
							document.body.removeChild(inputElement);
						});

						// Triggers the click event
						inputElement.click();

						return;
						// // (D:\Entwicklung\Test Codes\Backend Fehlermeldung Test\response.txt)
						// errorUrl = globals.webApiBaseUrl + 'cloud/desktop/testcases/throw';
						// params = {filename: 'response.txt'};
						// break;
					case 2:

						errorUrl = globals.webApiBaseUrl + 'cloud/desktop/testcases/throwJson';
						break;
					case 3:
						// Nested Business Layer Exception
						errorUrl = globals.webApiBaseUrl + 'cloud/desktop/testcases/throw2';
						break;
					case 4:
						// Nested Server Exceptions like FileNotFound etc
						errorUrl = globals.webApiBaseUrl + 'cloud/desktop/testcases/throw3';
						break;
					default:
						return;
				}

				let optionsObject = {
					method: 'POST',
					url: errorUrl
				}

				if (params) {
					optionsObject.params = params;
				}

				$injector.get('$http')(optionsObject).then(function (result) {
					return result;
				});
			});
		}

		function showTestDialog(info) {
			const options = {
				width: '600px',
				backdrop: false,
				headerText: 'Result Test',
				bodyTemplate: `
<div data-ng-controller="cloudDialogResultTestController">
	<div class="fileselect" style='min-height:50px; min-width: 50px; border: 1px solid black' data-ng-bind-html="data.fileselect" title='{{ data.fileselect }}'></div>
</div>`,
				dataItem: info,
				buttons: [{
					id: 'ok'
				}],
			};

			return $injector.get('platformDialogService').showDialog(options).then(result => console.table(result));
		}

		function getSelectDialogOptions(label, modelName, items) {
			return {
				formConfig: {
					configure: {
						fid: 'cloud.desktop.dialog-choose.form',
						version: '1.0.0',
						showGrouping: false,
						groups: [{
							gid: 'config',
							isOpen: true,
							isVisible: true,
							sortOrder: 1,
						}],
						rows: [{
							gid: 'config',
							rid: 'select',
							label: label,
							type: 'select',
							visible: true,
							model: modelName,
							options: {
								items: items,
								valueMember: 'id',
								displayMember: 'description'
							}
						}],
					}
				},
				value: {},
				headerText: 'Choose ' + label,
				resizable: false,
				width: '300px',
				buttons: [{
					id: 'cancel'
				}, {
					id: 'ok',
					disabled: function disabled(info) {
						return (!_.get(info, 'value.' + modelName));
					}
				}],
			};
		}

		function showCustomDialog(dialogNumber) {
			let options;
			let promise, gridDefinition;

			if (dialogNumber) {
				// if dialogNumber was passed
				promise = $q.when(dialogNumber);
			} else {
				// if not then Dialog Choose Dialog
				let formDialogOptions = getSelectDialogOptions('Dialog', 'dialogNumber', [
					{id: 1, description: 'Don\'t show again'},
					{id: 2, description: 'Test for documentation'},
					{id: 3, description: 'Info Box'},
					{id: 4, description: 'Delete Selection'},
					{id: 5, description: 'Langtext Dialog'},
					{id: 6, description: 'Yes No Dialog'},
					{id: 7, description: 'Input Dialog'},
					{id: 8, description: 'Messagebox'},
					{id: 9, description: 'Info Box'},
					{id: 10, description: 'Detail Box (Longtext)'},
					{id: 11, description: 'Detail Box (Grid)'},
					{id: 12, description: 'Example Form Dialog'},
					{id: 90, description: 'Controller Test'},
				]);

				promise = $injector.get('platformDialogFormService').showDialog(formDialogOptions).then((result => {
					if (result.ok) {
						return result.value.dialogNumber;
					}
				}));
			}

			// show custom dialog depending on the dialogNumber
			promise.then(function (dn) {
				switch (dn) {
					case 1:
						// ------------ don't show again dialogue
						options = {
							id: '13456dd6',
							bodyText: 'This is an example not translated body text.',
							headerText: 'Example Header Text',
							dontShowAgain: true,
							resizable: true,
							// dontShowAgain: {
							// showOption: true,
							// defaultActionButtonId: 'ok'
							// }
						};
						break;
					case 2:
						// --------------- Test Dialog for Documentation
						options = {
							iconClass: 'info',
							headerText: 'anyTranslationKey1',
							bodyText: 'anyTranslationKey2',
							topDescription: {
								iconClass: 'info',
								text: 'that is my top Description'
							},
							buttons: [{
								id: 'ok'
							}, {
								id: 'cancel'
							}],
							customButtons: [{
								id: 'doSomething',
								caption: 'anyTranslationKey3',
								fn: () => console.log('something')
							}]
						};
						break;
					case 3:
						// -------------- Info Box ---------------------------------------------
						return platformDialogService.showInfoBox('Hello, this is a simply info box.').then(result => console.table(result));
					case 4:
						// --------- delete selection dialog --------------------------------
						options = {
							id: '1345',
							bodyText: 'This is an example not translated body text.',
							headerText: 'Example Header Text',
							dontShowAgain: true,
							dedtails: {
								options: gridDefinition,
								value: [{'culture': 'de', 'description': 'germany'}, {
									'culture': 'en',
									'description': 'england'
								}],
								offsetY: 150
							}
						};
						return $injector.get('platformDeleteSelectionDialogService').showDialog({}).then(result => console.table(result));
					case 5: {
						// ------------------ Longtext -------------------------------------------------------
						let platformLongTextDialogService = $injector.get('platformLongTextDialogService');

						// eslint-disable-next-line no-inner-declarations
						const DataSource = function (text) {
							platformLongTextDialogService.LongTextDataSource.call(this);
							this.current = text;
						};

						let ds = new DataSource('This is an example for a long text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Magna ac placerat vestibulum lectus mauris ultrices eros in. Urna et pharetra pharetra massa massa. Pellentesque elit eget gravida cum. Porttitor lacus luctus accumsan tortor posuere ac ut consequat semper. Curabitur gravida arcu ac tortor dignissim convallis aenean et. Purus non enim praesent elementum facilisis. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Vulputate dignissim suspendisse in est ante. Et malesuada fames ac turpis egestas sed tempus.\n' +
								'\n\n' +
								'Mi ipsum faucibus vitae aliquet nec. Euismod in pellentesque massa placerat. Faucibus interdum posuere lorem ipsum dolor sit amet. Neque laoreet suspendisse interdum consectetur libero. Lacus luctus accumsan tortor posuere ac ut consequat semper viverra. Sapien pellentesque habitant morbi tristique. Mauris cursus mattis molestie a. Habitant morbi tristique senectus et netus. Dui vivamus arcu felis bibendum. Turpis egestas maecenas pharetra convallis posuere morbi leo urna.\n' +
								'\n\n' +
								'Placerat in egestas erat imperdiet sed euismod nisi porta lorem. Nunc mi ipsum faucibus vitae aliquet nec. Orci phasellus egestas tellus rutrum tellus pellentesque eu. Lacus vestibulum sed arcu non odio euismod lacinia. Dignissim diam quis enim lobortis scelerisque fermentum dui faucibus. Tempus urna et pharetra pharetra massa massa ultricies. Risus feugiat in ante metus dictum at tempor commodo. Auctor augue mauris augue neque gravida in fermentum et. Lorem dolor sed viverra ipsum nunc. Varius quam quisque id diam vel quam.');

						let dlgConfig = {
							headerText: 'Example Title',
							hidePager: true,
							dataSource: ds
						};

						return $injector.get('platformLongTextDialogService').showDialog(dlgConfig).then(result => console.table(result));
					}
					case 6: {
						// --------------------- yes no dialog --------------------------------------------
						const showDontShowAgain = false;
						const defaultButton = 'no';
						return platformDialogService.showYesNoDialog('Do you want some Tea?', 'Question', defaultButton, 'myDialogId', showDontShowAgain).then(result => console.table(result));
					}
					case 7: {
						// ---------------------- input dialog ------------------------------------------
						const modalOptions = {
							headerText: 'Example Title',
							bodyText: 'Please Enter 4 numbers',
							pattern: '^\\d{4}$',
							maxLength: 16
						};

						return $injector.get('platformDialogService').showInputDialog(modalOptions).then(result => console.table(result));
					}
					case 8:
						// -------------------------- MessageBox ---------------------------------
						return platformDialogService.showMsgBox('This is only a test message box.', 'Test', 'info').then(result => console.table(result));
					case 9: {
						// ------------------------- Info Box ----------------------------------------
						const showDontShowAgain2 = true;
						return platformDialogService.showInfoBox('This is a infobox.', 'myDialogId', showDontShowAgain2).then(result => console.table(result));
					}
					case 10:
						// ---------------------------------------------------------------------
						options = {
							width: '600px',
							headerText: 'Detail Box (Longtext)',
							iconClass: 'ico-warning',
							bodyText: 'This is just a test dialog to show the Detail Box. The detail area contains a grid with further info.',
							details: {
								show: true,
								type: 'longtext',
								value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non consectetur a erat nam at lectus. Aliquet nec ullamcorper sit amet risus. Proin libero nunc consequat interdum varius sit. A pellentesque sit amet porttitor eget dolor morbi. Ac odio tempor orci dapibus ultrices in iaculis nunc sed. Hendrerit dolor magna eget est lorem ipsum dolor sit. Nunc sed velit dignissim sodales ut eu sem. Ac turpis egestas sed tempus. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse. Mi bibendum neque egestas congue quisque egestas diam. Ac tincidunt vitae semper quis lectus nulla. Ut eu sem integer vitae justo eget magna fermentum iaculis.

										Amet massa vitae tortor condimentum lacinia quis vel. Dignissim sodales ut eu sem integer vitae. Adipiscing commodo elit at imperdiet dui accumsan sit. Cras sed felis eget velit aliquet sagittis id consectetur purus. Nulla facilisi morbi tempus iaculis urna id volutpat. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Dolor sit amet consectetur adipiscing elit. Sit amet luctus venenatis lectus magna fringilla urna porttitor. Mauris pellentesque pulvinar pellentesque habitant. Et malesuada fames ac turpis egestas integer eget aliquet. Suspendisse potenti nullam ac tortor vitae purus faucibus. Vitae congue mauris rhoncus aenean vel elit. Sed tempus urna et pharetra. Risus nullam eget felis eget nunc lobortis. Volutpat ac tincidunt vitae semper quis. Morbi tristique senectus et netus et malesuada fames ac. Laoreet non curabitur gravida arcu ac tortor dignissim. Adipiscing commodo elit at imperdiet dui accumsan.`
							}
						};

						return $injector.get('platformDialogService').showDetailMsgBox(options).then(result => console.table(result));
					case 11:
						// ---------------------------------------------------------------------
						gridDefinition = getGridConfig('detailDialogGrid');

						options = {
							width: '600px',
							headerText: 'Detail Box (Grid)',
							iconClass: 'ico-warning',
							bodyText: 'This is just a test dialog to show the Detail Box. The detail area contains a longtext with further info.',
							details: {
								type: 'grid',
								options: gridDefinition,
								value: [{'culture': 'de', 'description': 'germany'}, {'culture': 'en', 'description': 'england'}],
								offsetY: 150
							}
						};

						return $injector.get('platformDialogService').showDetailMsgBox(options).then(result => console.table(result));
					case 12: {
						// ---------------------- Example Form Dialog --------------------------
						let exampleFormValues = {name: 'Michael', lastName: 'Alisch'};

						let exampleFormRows = [
							{
								gid: 'example',
								rid: 'exampleName',
								label: 'Name',
								type: 'description',
								visible: true,
								model: 'name'
							},
							{
								gid: 'example',
								rid: 'exampleName',
								label: 'Lastname',
								type: 'description',
								visible: true,
								model: 'lastName'
							}];

						let exampleFormConfig = {
							fid: 'cloud.desktop.exampleForm',
							version: '1.0.0',
							showGrouping: false,
							groups: [{
								gid: 'example',
								isOpen: true,
								isVisible: true,
								sortOrder: 1,
							}],
							rows: exampleFormRows
						};

						options = {
							formConfig: {
								configure: exampleFormConfig
							},
							width: '600px',
							headerText: 'Example Form Dialog',
							topDescription: 'This is a dialog for testing the form dialog service',
							value: exampleFormValues,
							buttons: [{
								id: defaultButtonIds.cancel
							}, {
								id: defaultButtonIds.ok,
								disabled: function disabled(info) {
									return (!info.value);
								}
							}]
						};

						return $injector.get('platformDialogFormService').showDialog(options).then(
							result => {
								console.table(result);
							}
						);
					}
					case 90:
						options = {
							width: '600px',
							headerText: 'Controller Test',
							bodyTemplate: '<div data-ng-controller="cloudDialogController">Das ist ein Test</div>',
							buttons: [{
								id: 'ok'
							}, {
								id: 'cancel'
							}],
						};

						return $injector.get('platformDialogService').showDialog(options).then(result => console.table(result));
					default:
						return $q.when('');
				}

				// show default dialog
				return platformDialogService.showDialog(options).then(result => console.table(result));
			});
		}

		return {
			/**
				 * @ngdoc function
				 * @name showControlDialog
				 * @function
				 * @methodOf cloudDesktopTestService
				 * @description This shows a dialog which contains every domain control for test purposes
				 * @return { promise } returns the dialogs result promise
				 */
			showControlDialog: showControlTestDialog,
			/**
				 * @ngdoc function
				 * @name showErrorDialog
				 * @function
				 * @methodOf cloudDesktopTestService
				 * @description This triggers a backend error and displays the corresponding error dialogue.
				 * @return { promise } returns the dialogs result promise
				 */
			showErrorDialog: showErrorDialog,
			/**
				 * @ngdoc function
				 * @name showCustomDialog
				 * @function
				 * @methodOf cloudDesktopTestService
				 * @description This shows a custom test dialog.
				 * @param { number } dialogNumber Any dialog number
				 * @return { promise } returns the dialogs result promise
				 */
			showCustomDialog: showCustomDialog
		};
	}

	/**
		 * @ngdoc service
		 * @name cloudDesktopTestService
		 * @function
		 * @requires _
		 * @description This test service provides some functions for ui test proposes. For questions ask Michael Alisch (UI Team Germany)
		 */
	angular.module(modulename).factory(serviceName, serviceFunction);

	// Controller ---------------------------------------------------------------------------------
	let cloudDialogController = function ($scope) {
		console.log($scope);
	};

	cloudDialogController.$inject = ['$scope'];
	angular.module(modulename).controller('cloudDialogController', cloudDialogController);

	let cloudDialogResultTestController = function ($scope, _, basicsCommonDrawingUtilitiesService) {
		const modalOptions = $scope.dialog.modalOptions;

		let svg = _.get(modalOptions, 'dataItem.value.fileselect', undefined);

		const sanitizedSvg = basicsCommonDrawingUtilitiesService.getSanitizedSvg(svg?.data, false);
		_.set($scope, 'data.fileselect', sanitizedSvg);

		// if (svg) {
		// 	const parts = svg.data.split('base64,');
		//
		// 	if (parts.length > 1) {
		// 		const base64Part = parts[1];
		// 		const decodedString = atob(base64Part);
		// 		const sanitizedSvg = $sanitize(decodedString);
		// 		_.set($scope, 'data.fileselect', sanitizedSvg);
		// 	}
		// }
	};

	cloudDialogResultTestController.$inject = ['$scope', '_', 'basicsCommonDrawingUtilitiesService'];
	angular.module(modulename).controller('cloudDialogResultTestController', cloudDialogResultTestController);
}
)(angular);