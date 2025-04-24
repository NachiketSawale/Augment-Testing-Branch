/**
 * Created by wed on 10/25/2022.
 */

(function (msal) {
	'use strict';

	angular.module('cloud.desktop').factory('msalAuthenticationCustomService', [
		'_',
		'globals',
		function (
			_,
			globals
		) {
			const _cache = new Map();
			const _defaultAppType = 'default';

			const _appType = Object.defineProperties({}, {
				oneDrive: {
					value: 'oneDrive'
				},
				outlook: {
					value: 'outlook'
				},
				powerBi: {
					value: 'powerBi'
				},
				default: {
					value: 'default'
				}
			});

			const _appScope = {
				oneDrive: [
					// 'https://graph.microsoft.com/.default',
					'User.Read',
					'Files.ReadWrite',
					'Calendars.ReadWrite'
				],
				outlook: [
					// 'https://graph.microsoft.com/.default',
					'User.Read',
					'Mail.Read',
					'Mail.Read.Shared',
					'Mail.ReadBasic',
					'Mail.ReadBasic.Shared',
					'Mail.ReadWrite',
					'Mail.ReadWrite.Shared',
					'Mail.Send',
					'Mail.Send.Shared',
					'User.ReadBasic.All'
				],
				powerBi: [
					// 'https://analysis.windows.net/powerbi/api/Capacity.Read.All',
					'User.Read',
					'https://analysis.windows.net/powerbi/api/Capacity.Read.All',
					'https://analysis.windows.net/powerbi/api/Report.Read.All',
					'https://analysis.windows.net/powerbi/api/Dashboard.Read.All',
					'https://analysis.windows.net/powerbi/api/Workspace.Read.All'
				],
				default: [
					'https://graph.microsoft.com/.default'
				]
			};

			const _buildConfig = function (clientId) {
				return {
					auth: {
						clientId: clientId,
						authority: `https://login.microsoftonline.com/${globals.aad.tenant}`
					},
					system: {
						loggerOptions: {
							loggerCallback: function (loglevel, message, containsPii) {
								if (containsPii) {
									return;
								}
								switch (loglevel) {
									case msal.LogLevel.Error:
										console.error(message);
										return;
									case msal.LogLevel.Info:
										console.info(message);
										return;
									case msal.LogLevel.Verbose:
										console.debug(message);
										return;
									case msal.LogLevel.Warning:
										console.warn(message);
										return;
									default:
										console.log(message);
										return;
								}
							},
							piiLoggingEnabled: globals.debugMode,
							logLevel: msal.LogLevel.Verbose,
						}
					}
				};
			};

			const _storageUtil = {
				createKey: function (clientId) {
					return `itwo:msal:${clientId}:account`;
				},
				readAccount: function (clientId) {
					const key = this.createKey(clientId);
					const value = sessionStorage.getItem(key);
					let accounts = [];
					if (value) {
						accounts = value.split(',').filter(v => v.trim() !== '');
					}
					return accounts;
				},
				appendAccount: function (clientId, account) {
					const key = this.createKey(clientId);
					let accounts = this.readAccount(clientId).filter(e => e !== account);
					accounts.push(account);
					sessionStorage.setItem(key, accounts.join(','));
				}
			};

			const _buildClientKey = function (client, appType) {
				return client + '-' + (appType ? appType : _defaultAppType);
			};

			const _tryGetDefaultAccount = function (clientId) {
				const accounts = _storageUtil.readAccount(clientId);
				return accounts && accounts.length ? accounts[accounts.length - 1] : null;
			};

			const _buildSilentRequest = function (client, clientId, appType, account, request) {
				let silentRequest = request || {};

				if (!silentRequest.account) {
					if (!account) {
						account = _tryGetDefaultAccount(clientId);
					}
					silentRequest.account = client.getAllAccounts().find(s => s.username === account);
				}
				if (!silentRequest.scopes) {
					silentRequest.scopes = _appScope[appType];
				}
				silentRequest.forceRefresh = silentRequest.forceRefresh || false;

				return silentRequest;
			};

			const _buildPopupRequest = function (client, clientId, appType, account, request) {
				let popupRequest = request || {};

				if (!popupRequest.loginHint) {
					popupRequest.loginHint = account ? account : _tryGetDefaultAccount(clientId);
				}
				if (!popupRequest.scopes) {
					popupRequest.scopes = _appScope[appType];
				}

				return popupRequest;
			};

			let createClientWrapper = function (clientId, appType) {
				const msalLib = msal || window.msal;
				const appTypeName = appType || _defaultAppType;
				const configuration = _buildConfig(clientId);

				let client = new msalLib.PublicClientApplication(configuration);
				client.initializeWrapperLibrary(msalLib.WrapperSKU.Angular, msalLib.version);

				const wrapper = {
					eventType: msal.EventType,
					isAuthenticated: function (account, request, showPopupIfNeed) {
						let silentRequest = _buildSilentRequest(client, clientId, appTypeName, account, request);
						return silentRequest.account ? client.acquireTokenSilent(silentRequest).then(tokenResponse => {
							_storageUtil.appendAccount(clientId, tokenResponse.account.username);
							return {isAuthenticated: true, result: tokenResponse};
						}, reason => {
							console.warn(reason);
							return {isAuthenticated: false, result: null};
						}).catch(error => {
							if (showPopupIfNeed && error instanceof msal.InteractionRequiredAuthError) {
								return this.loginPopup(account, request).then(loginResponse => {
									return {isAuthenticated: true, result: loginResponse};
								});
							} else {
								console.error(error);
								return Promise.resolve({isAuthenticated: false, result: null});
							}
						}) : Promise.resolve({isAuthenticated: false, result: null});
					},
					loginPopup: function (account, request) {
						let popupRequest = _buildPopupRequest(client, clientId, appTypeName, account, request);
						return client.loginPopup(popupRequest).then(tokenResponse => {
							_storageUtil.appendAccount(clientId, tokenResponse.account.username);
							return tokenResponse;
						});
					},
					logoutPopup: (logoutRequest) => {
						return client.logoutPopup(logoutRequest);
					},
					acquireTokenAsync: function (account, request) {
						return this.isAuthenticated(account, request).then(r => {
							return r.isAuthenticated ? Promise.resolve(r.result.accessToken) : this.loginPopup(account, request).then(p => p.accessToken);
						});
					},
					addEventCallback: function (callback) {
						return client.addEventCallback(callback);
					},
					removeEventCallback: function (callbackId) {
						client.removeEventCallback(callbackId);
					}
				};

				wrapper.addEventCallback((message) => {
					if (message.eventType === wrapper.eventType.LOGIN_SUCCESS) {
						_storageUtil.appendAccount(clientId, message.payload.account.username);
					}
				});

				return wrapper;
			};

			return {
				appType: _appType,
				client: (clientId, appType) => {
					const cacheKey = _buildClientKey(clientId, appType);
					if (!_cache.has(cacheKey)) {
						const client = createClientWrapper(clientId, appType);
						_cache.set(cacheKey, client);
					}
					return _cache.get(cacheKey);
				}
			};
		}
	]);

	angular.module('cloud.desktop').factory('msalOfficeResourceInterceptor', [
		'globals',
		'msalAuthenticationCustomService',
		function (
			globals,
			msalService) {
			return {
				request: function (config) {
					if ((!config || !config.headers) || (!config.headers['x-request-office'] && !config.headers['x-request-office-byapi'])) {
						return config;
					}

					let viaApi = config.headers['x-request-office-byapi'];

					return msalService.client(globals.aad.office365ClientId, msalService.appType.oneDrive).isAuthenticated().then(r => {
						if (r.isAuthenticated) {
							if (viaApi) {
								config.data.accessToken = r.result.accessToken;
							} else {
								config.headers.Authorization = 'Bearer ' + r.result.accessToken;
							}
						}
						return config;
					});
				},
				responseError: function (rejection) {
					return Promise.reject(rejection);
				}
			};
		}]);

})(window.msal);