/**
 * Created by wed on 06/23/2020.
 */

(function basicsUserformCommonApiFactoryDefinition(angular) {

	'use strict';

	angular.module('basics.userform').factory('basicsUserformCommonApiFactory', [
		'_',
		'globals',
		'$',
		'$q',
		'$http',
		'PlatformMessenger',
		'platformUserInfoService',
		'platformContextService',
		'cloudDesktopInfoService',
		'cloudDesktopPinningContextService',
		function basicsUserformCommonApiFactory(
			_,
			globals,
			$,
			$q,
			$http,
			PlatformMessenger,
			platformUserInfoService,
			platformContextService,
			cloudDesktopInfoService,
			cloudDesktopPinningContextService
		) {

			var _serviceCache = {};

			function createUserFormAPIService(serviceName, createOptions) {

				var service = _serviceCache[serviceName];

				if (!service) {

					var options = _.extend({
						getDataSource: angular.noop,
						saveFormAsync: angular.noop,
						onEmitFormChanged: angular.noop,
						onFormSubmitted: angular.noop
					}, createOptions);

					var onFormSaved = new PlatformMessenger();

					var createHttpCallbackFn = function (callback) {
						var callbackFn = function callbackWarperFn(result) {
							if (callback && angular.isFunction(callback)) {
								callback(result);
							}
						};

						return {
							successFn: function (response) {
								callbackFn({status: true, data: response.data});
							},
							failFn: function (reason) {
								callbackFn({status: false, error: reason});
							}
						};
					};

					var defaultFormElemValueParser = {
						__nameParser: function (ele) {
							return ele.type;
						},
						__get: function (ele) {
							return this.__nameParser ? this.parsers[this.__nameParser(ele)] : null;
						},
						parsers: {
							checkbox: function (elem) {
								return !!elem.checked;
							},
							radio: function (elem) {
								return elem.checked ? elem.value : null;
							},
							select: function (elem) {
								return elem.options[elem.selectedIndex].value;
							}
						}
					};

					var userFormElemValueParser = {
						__nameParser: null,
						__get: function (ele) {
							return this.__nameParser ? this.parsers[this.__nameParser(ele)] : null;
						},
						parsers: {},
						reset: function () {
							this.__nameParser = null;
							this.parsers = {};
						}
					};

					var collectFormData = function (form) {
						for (var i = 0, formData = []; i < form.elements.length; i++) {
							var elem = form.elements[i],
								name = elem.name;
							if (name) {
								var parseFn = userFormElemValueParser.__get(elem) || defaultFormElemValueParser.__get(elem);
								var value = angular.isFunction(parseFn) ? parseFn(elem) : elem.value;
								if (value !== null) {
									var newFormData = {
										name: elem.name,
										value: value
									};
									if (elem.attributes['paramcode']) {
										newFormData.paramCode = elem.attributes['paramcode'].value;
									}
									if (elem.attributes['columnname']) {
										newFormData.columnName = elem.attributes['columnname'].value;
									}
									formData.push(newFormData);
								}
							}
						}
						return formData;
					};

					// TODO: Any new APIs must be sync to _itwo40.js in user form module in backend code.
					var itwo40 = {
						httpClient: {
							get: function (url, callback) {
								var callbackFn = createHttpCallbackFn(callback);
								$http.get(globals.webApiBaseUrl + _.trimStart(url, '/')).then(callbackFn.successFn, callbackFn.failFn);
							},
							post: function (url, data, callback) {
								var callbackFn = createHttpCallbackFn(callback);
								$http.post(globals.webApiBaseUrl + _.trimStart(url, '/'), data).then(callbackFn.successFn, callbackFn.failFn);
							},
							put: function (url, data, callback) {
								var callbackFn = createHttpCallbackFn(callback);
								$http.put(globals.webApiBaseUrl + _.trimStart(url, '/'), data).then(callbackFn.successFn, callbackFn.failFn);
							},
							patch: function (url, data, callback) {
								var callbackFn = createHttpCallbackFn(callback);
								$http.patch(globals.webApiBaseUrl + _.trimStart(url, '/'), data).then(callbackFn.successFn, callbackFn.failFn);
							}
						},
						getUserInfo: function () {
							var userInfo = platformUserInfoService.getCurrentUserInfo();
							return {
								UserId: userInfo.UserId
							};
						},
						getClientContext: function () {
							return platformContextService.getContext();
						},
						getCompanyInfo: function () {
							var headerInfo = cloudDesktopInfoService.read();
							var context = this.getClientContext();
							return {
								id: context.clientId,
								companyName: headerInfo.companyName
							};
						},
						getPinningProjectInfo: function () {
							var pinningProject = cloudDesktopPinningContextService.getPinningItem(cloudDesktopPinningContextService.tokens.projectToken);
							if (pinningProject) {
								return {
									id: pinningProject.id,
									info: pinningProject.info
								};
							}
							return null;
						},
						getAvailablePinningItemTokens: function () {
							return [].concat(cloudDesktopPinningContextService.tokens);
						},
						getPinningItem: function (token) {
							let pinningItem = cloudDesktopPinningContextService.getPinningItem(token);
							if (pinningItem) {
								return {
									id: pinningItem.id,
									info: pinningItem.info
								};
							}
							return null;
						},
						getDataSource: function () {
							return options.getDataSource();
						},
						saveForm: function (formData) {
							options.saveFormAsync(formData).then(function saveFormAsync(result) {
								service.emitFormSaved();
								return result;
							});
						},
						registerFormSaved: function (fn) {
							onFormSaved._handlers = (onFormSaved._handlers || []).concat([fn]);
							onFormSaved.register(fn);
						},
						emitFormChanged: function (changedItems) {
							options.onEmitFormChanged(changedItems);
						},
						extendFormElemValueParser: function (nameParser, valueParsers) {
							userFormElemValueParser.__nameParser = nameParser;
							_.extend(userFormElemValueParser.parsers, valueParsers);
						},
						collectFormData: function (form) {
							return collectFormData(form);
						},
						submitForm: function (formData){
							options.onFormSubmitted(formData);
						}
					};

					var reset = function () {

						// Reset form save handlers
						if (onFormSaved._handlers && onFormSaved._handlers.length) {
							_.each(onFormSaved._handlers, function unregisterFn(fn) {
								onFormSaved.unregister(fn);
							});

							onFormSaved._handlers.length = 0;
						}

						// Reset user form element value parsers
						userFormElemValueParser.reset();
					};

					var emitFormSaved = function () {
						onFormSaved.fire();
					};

					var exportTo = function (window) {
						reset();
						if (!window.__itwo40) {
							_.extend(window, {
								__itwo40: itwo40
							});
						}
					};

					var destroy = function () {
						reset();
					};

					service = {
						emitFormSaved: emitFormSaved,
						collectFormData: collectFormData,
						exportTo: exportTo,
						destroy: destroy
					};

					_serviceCache[serviceName] = service;
				}

				return service;
			}

			return {
				createApiService: createUserFormAPIService
			};
		}]);
})(angular);
