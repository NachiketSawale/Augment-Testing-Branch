/**
 * Created by reimer on 19.11.2014.
 */

(function basicsUserformCommonServiceDefinition(angular) {

	/* global Platform */
	'use strict';

	const moduleName = 'basics.userform';

	/**
	 * @ngdoc service
	 * @name basicsUserformCommonService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsUserformCommonService', [
		'globals',
		'_',
		'$',
		'$window',
		'$q',
		'$http',
		'$timeout',
		'$injector',
		'cloudDesktopModalBackgroundService',
		'basicsWorkflowInstanceService',
		'platformModalService',
		'userFormOpenMethod',
		'basicsUserFormPassthroughDataService',
		'basicsUserformCommonApiFactory',
		function basicsUserformCommonService(
			globals,
			_,
			$,
			$window,
			$q,
			$http,
			$timeout,
			$injector,
			cloudDesktopModalBackgroundService,
			basicsWorkflowInstanceService,
			platformModalService,
			userFormOpenMethod,
			basicsUserFormPassthroughDataService,
			basicsUserformCommonApiFactory) {

			let defaultOptions = {
				formId: null,
				formDataId: null,
				editable: false,
				setReadonly: false,
				modal: false,
				description: null,
				openMethod: userFormOpenMethod.NewWindow
			};
			let createServiceCounter = 0;

			function createNewInstance(options) {
				let service = {};
				let formOption = {};
				let proxyService = null;
				let connectOptions = _.extend({
					getDataSource: function () {
						return null;
					}
				}, options);

				// events
				service.formDataSaved = new Platform.Messenger();
				service.winOnClosed = new Platform.Messenger();
				service.formDataChanged = new Platform.Messenger();
				service.formTemplateStatus = new Platform.Messenger();
				service.formSubmitted = new Platform.Messenger();

				function createServiceName() {
					return 'basicsUserformApiService_' + (++createServiceCounter);
				}

				function createRequestUrl(options) {
					let args = {
						formId: options.formId,
						formDataId: options.formDataId,
						contextId: options.contextId,
						editable: options.editable,
						fromModule: options.fromModule,
						context1Id: 0
					};

					if (options.rubricFk === 78) {
						// todo: Not sure whether this check statement is necessary or not.
						args.context1Id = options.context1Id;
					}
					if (options.rubricFk === 91) {
						args.tempContextId = options.tempContextId;
					}

					return globals.webApiBaseUrl + 'basics/userform/getformlink?' + _.map(args, function argsMapFn(value, key) {
						// workaround parameters .NET Core issue
						if (_.isNil(value)) {
							value = -1;
						}
						return key + '=' + value;
					}).join('&');

				}

				function attachService(win, connectOptions) {

					win.userInfo = basicsUserFormPassthroughDataService.getUserInfo();

					win.clientContext = basicsUserFormPassthroughDataService.getContextInfo();

					win.initialData = basicsUserFormPassthroughDataService.getInitialData();

					proxyService = basicsUserformCommonApiFactory.createApiService(createServiceName(), {
						onEmitFormChanged: function (changedItems) {
							if (_.isEmpty(changedItems) && win.document && win.document.forms && win.__itwo40) {
								changedItems = win.__itwo40.collectFormData(win.document.forms[0]);
							}
							service.formDataChanged.fire(changedItems);
						},
						saveFormAsync: function (formData) {
							return service.saveFormData(formData);
						},
						getDataSource: function () {
							const result = connectOptions && _.isFunction(connectOptions.getDataSource) ? connectOptions.getDataSource() : null;
							return _.cloneDeep(result);
						},
						onFormSubmitted: function (formData) {
							service.formSubmitted.fire(formData);
						}
					});

					proxyService.exportTo(win);

					// Try execute ready function which define in custom form.
					if (_.isFunction(win['__itwo40Ready'])) {
						win['__itwo40Ready'](win.__itwo40);
					}

				}

				function showUserForm(options) {

					service.setOption(options);

					service.getUrlAsync(options).then(function getUrlCallback(result) {
						if (!result) {
							service.formTemplateStatus.fire('NoFormFound');
							return;
						}
						options.formLink = result.url;
						let saveIsCalled = false; // indicates if form was saved before closing
						let saveFormDataRequestFlg = false;

						const setModalBackgroundIfModal = function (visible) {
							if (options.modal) {
								cloudDesktopModalBackgroundService.setModalBackground(visible);
							}
						};

						let winSaveCallback = function (formData) {
							if (!saveFormDataRequestFlg) {
								saveIsCalled = true;
								saveFormDataRequestFlg = true;
								let originType = options.modal ? 'POPUP_WIN' : 'CONTAINER';
								service.setFormSaveState({
									origin: 'USER_FROM',
									originType: originType
								});
								if ('CONTAINER' === originType) {
									service.formTemplateStatus.fire('Saving');
								}
								service.saveFormData(formData, options).then(function saveFormDataCallback() {
									saveIsCalled = false;
									saveFormDataRequestFlg = false;
								});
							}
						};

						let setSaveCallback = function (win) {
							win.saveCallbackFunction = winSaveCallback;
							if (typeof win.initFormData === 'function') {
								win.initFormData();
							}
						};

						let winCloseCallback = function (obj) {
							if (options.modal && obj && obj.target.URL !== 'about:blank') {
								setModalBackgroundIfModal(false);
							}
							basicsUserFormPassthroughDataService.setInitialData('');
							service.winOnClosed.fire(saveIsCalled);
						};

						let elemChangeCallback = function (changedItems) {
							service.formDataChanged.fire(changedItems);
						};

						let attachEvent = function (win, options) {

							let getValue = function (ctrl) {
								return ctrl.type === 'checkbox' ? ctrl.checked : ctrl.value;
							};

							let addElemChangeEvent = function () {
								let userForm = win.document.forms[0];
								if (userForm) {
									for (let i = 0; i < userForm.elements.length; i++) {
										let ele = userForm.elements[i];
										ele[ele.addEventListener ? 'addEventListener' : 'attachEvent']((ele['attachEvent'] ? 'on' : '') + 'change', function elemChangeEventCallback() {
											elemChangeCallback([{
												name: this.name,
												value: getValue(this)
											}]);
										}, false);
									}
								}
							};
							// fix For Latest Chrome 89 not support beforeunload
							win[win.addEventListener ? 'addEventListener' : 'attachEvent']((win['attachEvent'] ? 'on' : '') + 'unload', winCloseCallback, false);

							win[win.addEventListener ? 'addEventListener' : 'attachEvent']((win['attachEvent'] ? 'on' : '') + 'beforeunload', winCloseCallback, false);

							if (options.editable) {
								setSaveCallback(win);
								addElemChangeEvent();
							}
						};

						const checkWinStateWithTimeout = function (win, state) {
							if(state.counter > 60){
								// Max wait for 60 * 1000 ms.
								return state;
							}

							state.counter = state.counter + 1;
							state.timerId = $window.setTimeout(() => {
								if (!win || win.closed) {
									setModalBackgroundIfModal(false);
									return state.clearTimeout();
								}
								checkWinStateWithTimeout(win, state);
							}, 1000);

							return state;
						};

						let readyPromise = function () {
							let defer = $q.defer();
							if (options.openMethod === userFormOpenMethod.Container) {
								if (options.iframe) {

									// Remove last binding load event if exists
									if (options.iframe.__iframeLoadFn) {
										$(options.iframe).unbind('load', options.iframe.__iframeLoadFn);
									}

									// New load event
									options.iframe.__iframeLoadFn = function iframeLoadFn() {
										defer.resolve(options.iframe.contentWindow);
									};

									// Bind the new load event
									$(options.iframe).bind('load', options.iframe.__iframeLoadFn);

									if (formOption === options) {
										// Load the URL
										$(options.iframe).attr('src', result.url);
									}
								} else {
									defer.reject('Load failed - Please ensure that iframe is ready!');
								}
							} else if (options.openMethod === userFormOpenMethod.PopupWindow) {
								showPopupUserFormAsync(options).then(function (win) {
									defer.resolve(win);
								});
							} else {
								setModalBackgroundIfModal(true);

								let win = $window.open(result.url, null, result.windowOptions);
								const state = checkWinStateWithTimeout(win, {
									timerId: -1,
									counter: 0,
									clearTimeout: function () {
										$window.clearTimeout(this.timerId);
									}
								});

								if (win) {
									win[win.addEventListener ? 'addEventListener' : 'attachEvent']((win.addEventListener ? 'load' : 'onload'), function () {
										state.clearTimeout();
										defer.resolve(win);
									});
								} else {
									setModalBackgroundIfModal(false);

									defer.reject('Open window failed - Please ensure that no popup-blocker is activated!');
								}
							}
							return defer.promise;
						};

						readyPromise().then(function successFn(win) {

							attachService(win, connectOptions);

							attachEvent(win, options);

							service.formTemplateStatus.fire('FormLoadFinish', win);

						}, function failedFn(reason) {
							service.formTemplateStatus.fire('FormLoadFailure');

							showWarning(reason);
						});
					});
				}

				function previewUserForm(options) {

					service.setOption(options);

					if (options.openMethod === userFormOpenMethod.PopupWindow) {
						showPopupUserFormAsync(options).then(function (win) {
							attachService(win, connectOptions);
						});
						return;
					}

					service.getUrlAsync(options).then(function getUrlCallback(result) {

						let win = $window.open('', 'userform-preview', result.windowOptions);
						if (!win) {
							showWarning('Open window failed - Please ensure that no popup-blocker is activated!');
							return;
						}

						function configure() {
							if (win.document) {
								let title = result.url.substring(result.url.lastIndexOf('/') + 1).toLowerCase();
								$(win.document).attr('title', title);
								$(win.document.body)
									.css({width: '100%', height: '100%', padding: 0, margin: 0})
									.html('<iframe credentialless width="100%" height="100%" id="iframe" src="' + result.url + '" sandbox="allow-forms allow-scripts allow-presentation allow-modals allow-same-origin"></iframe>');

								$(win.document.body).find('iframe').bind('load', function () {
									attachService(this.contentWindow, connectOptions);
								}).attr('src', result.url);

							} else {
								$timeout(configure, 200);
							}
						}

						configure();
					});
				}

				function showPopupUserFormAsync(options) {
					let defer = $q.defer();
					let modalOptions = {
						templateUrl: globals.appBaseUrl + 'basics.userform/templates/basics-userform-popup-window.html',
						backdrop: false,
						windowClass: 'form-modal-dialog',
						width: '1050px',
						height: '800px',
						resizeable: true,
						controller: 'basicsUserformPopupWindowController',
						resolve: {
							popupOptions: function () {
								return _.extend({
									onFormLoaded: function (iframe) {
										defer.resolve(iframe.contentWindow, options);
									},
									helper: service
								}, options);
							}
						}
					};

					platformModalService.showDialog(modalOptions);
					return defer.promise;
				}

				function showWarning(message) {
					let modalOptions = {
						headerTextKey: 'Warning',
						bodyTextKey: message,
						showOkButton: true,
						iconClass: 'ico-warning'
					};
					platformModalService.showDialog(modalOptions);
				}

				service.getUrlAsync = function getUrlAsync(options) {

					let requestUrl = createRequestUrl(options);

					return $http.get(requestUrl).then(function urlResponseFn(response) {
						return {
							url: response.data,
							windowOptions: response.headers('WindowOptions')
						};
					}, function () {
						console.log('can\'t get file in server');
					});

				};

				/**
				 * @ngdoc function
				 * @name previewForm
				 * @function
				 * @methodOf basicsUserformCommonService
				 * @description Opens the form in a new browser window (readonly mode - without loading data)
				 * @param {Integer} formId the form id.
				 */
				service.previewForm = function previewForm(formId) {
					let options = angular.extend({}, defaultOptions, {
						formId: formId
					});
					previewUserForm(options);
				};

				/**
				 * @ngdoc function
				 * @name addData
				 * @function Opens the form in a new browser window (allows adding data)
				 * @methodOf basicsUserformCommonService
				 * @description
				 * @param {object} options
				 */
				service.addData = function addData(options) {
					let addOptions = angular.extend({}, defaultOptions, {
						editable: true,
						modal: true,
					}, options);
					showUserForm(addOptions);
				};

				/**
				 * @ngdoc function
				 * @name editData
				 * @function Opens the form in a new browser window
				 * @methodOf basicsUserformCommonService
				 * @description
				 * @param {object} options
				 * @example service.editData({ formId: formFk, formDataId: formDataId, editable: allowEdit, setReadonly: false, modal:true});
				 */
				service.editData = function editData(options) {
					let editOptions = angular.extend({}, defaultOptions, {
						editable: true,
						modal: true
					}, options);
					showUserForm(editOptions);
				};

				/**
				 * @ngdoc function
				 * @name showData
				 * @function Opens the form in a new browser window
				 * @methodOf basicsUserformCommonService
				 * @description
				 * @param {object} options
				 * @example service.showData({ formId: formFk, formDataId: formDataId, editable: allowEdit, setReadonly: false, modal:true});
				 */
				service.showData = function showData(options) {
					showUserForm(options);
				};

				service.setOption = function setOption(option) {
					formOption = option;
				};

				service.getOption = function getOption() {
					return formOption;
				};

				service.saveFormData = function saveFormData(formData, option) {
					let completeFormData = {};
					let currentOption = option ? option : formOption;
					completeFormData.FormId = currentOption.formId;
					completeFormData.FormDataId = currentOption.formDataId;
					completeFormData.ContextFk = currentOption.contextId;
					completeFormData.UserFormData = angular.isArray(formData) ? formData : null;
					completeFormData.IsReadonly = currentOption.setReadonly || false;
					completeFormData.Description = currentOption.description || null;
					if (currentOption.rubricFk) {
						completeFormData.RubricFk = currentOption.rubricFk;
					}
					if (currentOption.intersectionId) {
						completeFormData.IntersectionId = currentOption.intersectionId;
					}
					return $http.post(globals.webApiBaseUrl + 'basics/userform/saveformdata', completeFormData).then(function saveFormDataCallback(response) {

						service.formDataSaved.fire(response.data.FormDataId, {
							formDataId: response.data.FormDataId,
							formData: formData,
							formOption: currentOption
						});

						if (proxyService) {
							proxyService.emitFormSaved();
						}

						// Trigger workflow?
						if (response.data.WorkflowTemplateFk !== null) {
							basicsWorkflowInstanceService.startWorkflow(response.data.WorkflowTemplateFk, response.data.FormDataId, null);
						}

						return response.data;
					});
				};

				service.getFormSaveState = function getFormSaveState() {
					return _.extend({
						origin: null,
						originType: null
					}, service.__formSaveState);
				};

				service.setFormSaveState = function setFormSaveState(state) {
					service.__formSaveState = state;
				};

				service.collectFormData = function collectFormData(form) {
					if (proxyService) {
						return proxyService.collectFormData(form);
					}
					return null;
				};

				return service;
			}

			let newInstance = createNewInstance();

			newInstance.createNewInstance = createNewInstance;

			return newInstance;

		}]);
})(angular);

(function userFormOpenMethodDefinition(angular) {
	'use strict';

	let moduleName = 'basics.userform';

	// the company definition
	angular.module(moduleName).constant('userFormOpenMethod', {
		NewWindow: 1,
		PopupWindow: 2,
		ByTab: 3,
		Container: 4
	});

})(angular);
