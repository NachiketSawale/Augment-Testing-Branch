/**
 * Created by wed on 7/26/2023.
 */

(function (angular, MicrosoftGraph) {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopOutlookMainService', [
		'_',
		'globals',
		'$http',
		'PlatformMessenger',
		'msalAuthenticationCustomService',
		function (
			_,
			globals,
			$http,
			PlatformMessenger,
			msalService
		) {
			const onToolbarItemClick = new PlatformMessenger();
			const onLoginSuccess = new PlatformMessenger();
			const onSelectedAccountChanged = new PlatformMessenger();
			const onAsyncEventHappened = new PlatformMessenger();
			const onCloseViewRequest = new PlatformMessenger();
			const onSwitchViewRequest = new PlatformMessenger();
			const onDraftRequest = new PlatformMessenger();
			const msalClient = msalService.client(globals.aad.office365ClientId, msalService.appType.outlook);

			let settings = null;
			let selectedAccount = null;
			let isShowOutlookCache = null;
			let profileCache = null;

			const graphClient = new MicrosoftGraph.Client({
				debugLogging: globals.debugMode,
				authProvider: {
					getAccessToken: () => {
						return msalClient.acquireTokenAsync();
					}
				}
			});

			const isShowInSidebar = function () {
				return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/isshowoutlookinsidebar').then(response => {
					isShowOutlookCache = response.data;
					return response.data;
				});
			};

			const readProfile = function () {
				return msalClient.isAuthenticated().then(r => {
					return r.isAuthenticated ? graphClient.api('/me').get() : null;
				});
			};

			const getSettings = function (mail) {
				const settingsReady = settings ? Promise.resolve(settings) : $http.get(globals.webApiBaseUrl + `basics/common/outlook/getsettings?mail=${mail}`).then(response => {
					settings = response.data;
					return settings;
				});
				return settingsReady.then(settings => {
					return settings ? JSON.parse(JSON.stringify(settings)) : null;
				});
			};

			const saveSettings = function (mail, partialSettings) {
				return getSettings().then(result => {
					settings = Object.assign({}, result, partialSettings);
					return $http.post(globals.webApiBaseUrl + `basics/common/outlook/savesettings?mail=${mail}`, settings);
				});
			};

			const setSelectedAccount = function (mailbox, folder, isShared, profile) {
				const isChanged = selectedAccount === null || mailbox.mail !== selectedAccount.mailbox.mail || selectedAccount.folder.name !== folder.name;
				selectedAccount = {
					mailbox: mailbox,
					folder: folder,
					isShared: isShared,
					profile: profile
				};
				if (isChanged) {
					onSelectedAccountChanged.fire(selectedAccount);
				}
			};

			const getSelectedAccount = function () {
				return selectedAccount;
			};

			const getIsShowOutlookSync = function () {
				return isShowOutlookCache;
			};

			const setProfileSync = function (profile) {
				profileCache = profile;
			};

			const getProfileSync = function () {
				return profileCache;
			};

			const transformContent = function (content) {
				const styles = [];
				let match;

				// Styles
				const stylePattern = /<style[^>]*>([\s\S]*?)<\/style>/gi;
				while ((match = stylePattern.exec(content)) !== null) {
					styles.push(match[1].trim().replace(/(;?[^;])(\w+?):([^;]+?)(?<!!important);/gi, '$1$2:$3 !important;'));
				}

				// Clear Styles
				content = content.replace(stylePattern, '');

				// Body
				const bodyPattern = /<body[^>]*>([\s\S]*?)<\/body>/gi;
				match = bodyPattern.exec(content);
				if (match) {
					content = match[1].trim();
				}

				content = content.replace(/<td([^>]*?)>\s*?(<img[^>]*?\/?>)\s*?<\/td>/ig, '<td$1><p><span>$2</span></p></td>');
				content = content.replace(/<td([^>]*?)\/>/ig, '<td$1></td>');
				content = content.replace(/width="(\d+).*?"/gi, 'width="$1"');
				content = content.replace(/<table([^>]*?)>([\s\S]*?)<\/table>/ig, '<table$1><tbody>$2</tbody></table>');
				content = content.replace(/\r\n/ig, '');

				return {
					styles: styles,
					content: content
				};
			};

			const customTdFormat = function (editor, useCustomFormat) {
				// JIRA DEV-31352 # Style Issue of Outlook Draft Box in Sidebar, workaround to retain original attributes and styles.
				const target = Quill.import('formats/td');
				const map = {
					table: new Map(),
					tr: new Map(),
					td: new Map()
				};

				target.create = _.wrap(target.create, function (baseFn, value) {
					const node = baseFn.call(target, value);
					if (useCustomFormat && useCustomFormat()) {
						if (value && value.tdRef) {
							const tableId = node.getAttribute('table_id');
							const rowId = node.getAttribute('row_id');
							const cellId = node.getAttribute('cell_id');

							if (value.tableRef) {
								map.table.set(tableId, value.tableRef);
							}

							if (value.trRef) {
								map.tr.set(rowId, value.trRef);
							}

							if (value.tdRef) {
								map.td.set(cellId, value.tdRef);
							}
						}
					}
					return node;
				});

				editor.clipboard.addMatcher('TABLE', function (node, delta) {
					if (useCustomFormat()) {
						const ops = delta.ops[delta.ops.length - 1];
						if (ops && ops.attributes && ops.attributes.td) {
							ops.attributes.td.tableRef = node;
						}
					}
					return delta;
				});

				editor.clipboard.addMatcher('TR', function (node, delta) {
					if (useCustomFormat()) {
						const ops = delta.ops[delta.ops.length - 1];
						if (ops && ops.attributes && ops.attributes.td) {
							ops.attributes.td.trRef = node;
						}
					}
					return delta;
				});

				editor.clipboard.addMatcher('TD', function (node, delta) {
					if (useCustomFormat()) {
						const ops = delta.ops[delta.ops.length - 1];
						if (ops && ops.attributes && ops.attributes.td) {
							ops.attributes.td.tdRef = node;
						}
					}
					return delta;
				});

				return map;
			};

			return {
				msalClient: msalClient,
				graphClient: graphClient,
				onToolbarItemClick: onToolbarItemClick,
				onLoginSuccess: onLoginSuccess,
				onSelectedAccountChanged: onSelectedAccountChanged,
				onAsyncEventHappened: onAsyncEventHappened,
				onCloseViewRequest: onCloseViewRequest,
				onSwitchViewRequest: onSwitchViewRequest,
				onDraftRequest: onDraftRequest,
				isShowInSidebar: isShowInSidebar,
				readProfile: readProfile,
				getSettings: getSettings,
				saveSettings: saveSettings,
				setSelectedAccount: setSelectedAccount,
				getSelectedAccount: getSelectedAccount,
				setProfileSync: setProfileSync,
				getProfileSync: getProfileSync,
				getIsShowOutlookSync: getIsShowOutlookSync,
				transformContent: transformContent,
				customTdFormat: customTdFormat
			};
		}
	]);

})(angular, window.MicrosoftGraph);