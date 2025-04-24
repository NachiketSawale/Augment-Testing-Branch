/**
 * Created by alisch on 07.05.2020.
 */
(function () {
	'use strict';

	cloudDesktopAlertMessagesSettingsService.$inject = ['$http', '$q', '_', 'moment', 'cloudDesktopInfoService', 'platformUtilService', 'cloudDesktopSettingsState', 'platformRuntimeDataService', 'platformPermissionService', '$translate', 'cloudDesktopSettingsUserTypes'];

	function cloudDesktopAlertMessagesSettingsService($http, $q, _, moment, cloudDesktopInfoService, platformUtilService, dataStates, platformRuntimeDataService, platformPermissionService, $translate, userTypes) {
		const settingsKey = 'alertMessagesSettings'; // the property name of settings within the user settings object
		const accessRightDescriptors = ['5e9cf8037c5b418f9fd238bbe9dded40'];
		let shutDownAlertMsg;
		let certificateMessages;

		platformPermissionService.loadPermissions(accessRightDescriptors);

		/**
		 * @ngdoc function
		 * @name getMasterItemId
		 * @function
		 * @methodOf cloudDesktopAlertMessagesService
		 * @description Returns the id of the master item object of the specified user typ.
		 * @return { string } The id of the master item object
		 */
		function getMasterItemId() {
			return settingsKey;
		}

		/**
		 * @ngdoc function
		 * @name convertToTransferable
		 * @function
		 * @methodOf cloudDesktopAlertMessagesService
		 * @description Converts the settings from the UserSettings-object to the transportable format. This is necessary to save the data into the db.
		 * @param {Object} userSettings The User Settings data.
		 */
		function convertToTransferable(userSettings) { // jshint ignore:line
			// ToDo: do something with the data.
		}

		// /**
		//  * @ngdoc function
		//  * @name convertToEditable
		//  * @function
		//  * @methodOf cloudDesktopAlertMessagesService
		//  * @description Converts the User Settings to the editable format. This is necessary to display it in the form.
		//  * @param {Object} userSettings The User Settings data.
		//  */
		function convertToEditable(userSettings) { // jshint ignore:line
			_.noop(userSettings);
			// ToDo: do something with the data otherwise delete this function
		}

		/**
		 * @ngdoc function
		 * @name hasWritePermission
		 * @function
		 * @methodOf cloudDesktopAlertMessagesService
		 * @description Returns a bool value which indicates whether the user has write permissions
		 * @return {bool} True, when system user has write permissions
		 */
		function hasWritePermission() {
			return platformPermissionService.hasWrite('5e9cf8037c5b418f9fd238bbe9dded40');
		}

		/**
		 * @ngdoc function
		 * @name getMasterItem
		 * @function
		 * @methodOf cloudDesktopAlertMessagesService
		 * @description Returns an master item object for the settings dialog definition.
		 * @return {object} The master item object
		 */
		function getMasterItem(editableData, userType) { // jshint ignore:line
			switch (userType) {
				case userTypes.system:
					return {
						Id: getMasterItemId(),
						name: $translate.instant('cloud.desktop.design.alertMessages.amSystem'),
						data: editableData.items[settingsKey],
						visible: hasWritePermission(),
						form: getFormData(editableData.items[settingsKey], editableData)
					};
				default:
					return undefined;
			}
		}

		/**
		 * @ngdoc function
		 * @name getFormData
		 * @function
		 * @methodOf cloudDesktopAlertMessagesService
		 * @description Returns the config object for the form-generator
		 * @return {Object} The config object
		 */
		function getFormData(data, editableData) { // jshint ignore:line

			function getIconsCssByCertificateState(certInfo) {
				if (certInfo) {
					if (certInfo.remainingDaysValid > 30) {
						return 'control-icons ico-checked-2';
					}
					if (certInfo.remainingDaysValid >= 15) {
						return 'tlb-icons ico-warning';
					}
					if (certInfo.remainingDaysValid >= 5) {
						return 'tlb-icons ico-validation-error';
					}
				}
				return 'tlb-icons ico-error';
			}
			function getStyleByCertificateState(certInfo) {
				if (certInfo) {
					if (certInfo.remainingDaysValid > 30) {
						return {'background-color': '#CACFD2'};
					}
					if (certInfo.remainingDaysValid >= 15) {
						return {'background-color': '#ff7d33'};
					}
					if (certInfo.remainingDaysValid >= 5) {
						return {'background-color': '#ff7d33'};
					}
				}
				return {'background-color': '#FF6433;'};
			}


			const idSrvStyle = getStyleByCertificateState(data.cert.idSrv);
			const idSrvSslStyle = getStyleByCertificateState(data.cert.idSrvSsl);
			const webSrvStyle = getStyleByCertificateState(data.cert.webSrv);

			const idSrvCssClass = getIconsCssByCertificateState(data.cert.idSrv);
			const idSrvSslCssClass = getIconsCssByCertificateState(data.cert.idSrvSsl);
			const webSrvCssClass = getIconsCssByCertificateState(data.cert.webSrv);
			const idSrvCertificateConfig = [				// identity server Certificate
				{
					gid: 'certificate', sortOrder: 100, rid: 'cert.idsrv.header',
					readonly: true, visible: true,
					label: '',
					type: 'directive', directive: 'platform-info-form-control', model: 'data.cert.idSrv',
					options: {
						cssClass: idSrvCssClass, style: idSrvStyle,
						info$tr$: 'cloud.desktop.design.alertMessages.certificate.idSrvTitle', 'checkisValid': true
					}
				},
				{
					gid: 'certificate', sortOrder: 101, rid: 'cert.idsrv.isvalid',
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.isValid',
					type: 'boolean', visible: true, readonly: true,
					model: 'data.cert.idSrv.isValid'
				},
				{
					gid: 'certificate', sortOrder: 102, rid: 'cert.idsrv.friendlyname',
					type: 'description', readonly: true, visible: true,
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.friendlyName',
					model: 'data.cert.idSrv.friendlyName',
				},
				{
					gid: 'certificate', sortOrder: 104, rid: 'cert.idsrv.thumbprint',
					type: 'description', readonly: true, visible: true,
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.thumbPrint',
					model: 'data.cert.idSrv.thumbPrint',
				},
				{
					gid: 'certificate', sortOrder: 106, rid: 'cert.idsrv.validUntil',
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.validUntil',
					type: 'datetime', readonly: true, visible: true,
					model: 'data.cert.idSrv.until'
				},
				{
					gid: 'certificate', sortOrder: 108, rid: 'cert.idsrv.validdays',
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.validDays',
					type: 'description', readonly: true, visible: true,
					model: 'data.cert.idSrv.remainingDaysValid',
					// options: {cssClass: 'text-left'}
				}
			];
			const idSrvSslCertificateConfig = [			// identity server SSL Certificate
				{
					gid: 'certificate', sortOrder: 300, rid: 'cert.idsrvssl.header',
					readonly: true, visible: true,
					label: '',
					type: 'directive', directive: 'platform-info-form-control', model: 'data.cert.idSrvSsl',
					options: {
						cssClass: idSrvSslCssClass,style: idSrvSslStyle,
						info$tr$: 'cloud.desktop.design.alertMessages.certificate.idSrvSslTitle', 'checkisValid': true
					}
				},
				{
					gid: 'certificate', sortOrder: 301, rid: 'cert.idsrvssl.isvalid',
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.isValid',
					type: 'boolean', readonly: true, visible: true,
					model: 'data.cert.idSrvSsl.isValid'
				},
				{
					gid: 'certificate', sortOrder: 304, rid: 'cert.idsrvssl.friendlyname',
					type: 'description', readonly: true, visible: true,
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.friendlyName',
					model: 'data.cert.idSrvSsl.friendlyName',
				},
				{
					gid: 'certificate', sortOrder: 306, rid: 'cert.idsrvssl.thumbprint',
					type: 'description', readonly: true, visible: true,
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.thumbPrint',
					model: 'data.cert.idSrvSsl.thumbPrint',
				},
				{
					gid: 'certificate', sortOrder: 308, rid: 'cert.idsrvssl.validUntil',
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.validUntil',
					type: 'datetime', readonly: true, visible: true,
					model: 'data.cert.idSrvSsl.until'
				},
				{
					gid: 'certificate', sortOrder: 310, rid: 'cert.idsrvssl.validdays',
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.validDays',
					type: 'description', readonly: true, visible: true,
					model: 'data.cert.idSrvSsl.remainingDaysValid',
				}];
			const webSrvSslCertificateConfig = [				// web server Certificate
				{
					gid: 'certificate', sortOrder: 200, rid: 'cert.websrv.header',
					readonly: true, visible: true,
					label: '',
					type: 'directive', directive: 'platform-info-form-control', model: 'data.cert.webSrv',
					options: {
						cssClass: webSrvCssClass,style: webSrvStyle,
						info$tr$: 'cloud.desktop.design.alertMessages.certificate.webSrvTitle', 'checkisValid': true
					}
				},
				{
					gid: 'certificate', sortOrder: 201, rid: 'cert.websrv.isvalid',
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.isValid',
					type: 'boolean', readonly: true, visible: true,
					model: 'data.cert.webSrv.isValid'
				},
				{
					gid: 'certificate', sortOrder: 204, rid: 'cert.websrv.friendlyname',
					type: 'description', readonly: true, visible: true,
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.friendlyName',
					model: 'data.cert.webSrv.friendlyName',
				},
				{
					gid: 'certificate', sortOrder: 206, rid: 'cert.websrv.thumbprint',
					type: 'description', readonly: true, visible: true,
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.thumbPrint',
					model: 'data.cert.webSrv.thumbPrint',
				},
				{
					gid: 'certificate', sortOrder: 208, rid: 'cert.websrv.validUntil',
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.validUntil',
					type: 'datetime', readonly: true, visible: true,
					model: 'data.cert.webSrv.until'
				},
				{
					gid: 'certificate', sortOrder: 210, rid: 'cert.websrv.validdays',
					label$tr$: 'cloud.desktop.design.alertMessages.certificate.validDays',
					type: 'description', readonly: true, visible: true,
					model: 'data.cert.webSrv.remainingDaysValid',
				}
			];

			let formConfig = {
				fid: 'cloud.desktop.alertMessages.form',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						gid: 'shutdown', sortOrder: 1,
						header$tr$: 'cloud.desktop.design.alertMessages.groupShutdownMessage',
						isOpen: true, isVisible: true
					},
					{
						gid: 'certificate', sortOrder: 2,
						header$tr$: 'cloud.desktop.design.alertMessages.groupCertificateMessage',
						isOpen: true, isVisible: true
					}
				],
				rows: [
					{
						gid: 'shutdown', sortOrder: 10, rid: 'shutdownMessage',
						label$tr$: 'cloud.desktop.design.alertMessages.shutdownMessage',
						type: 'comment', visible: true,
						model: 'data.sd.content',
						change: function (entity, field, data) {
							changedContent(entity, field, data);
						}
					}, {
						gid: 'shutdown', sortOrder: 11, rid: 'templateinfo',
						label: '', visible: true,
						type: 'directive', directive: 'platform-info-form-control',
						options: {info$tr$: 'cloud.desktop.design.alertMessages.info'}
					}, {
						gid: 'shutdown', sortOrder: 13, rid: 'previewdir',
						type: 'directive',
						label$tr$: 'cloud.desktop.design.alertMessages.preview',
						model: 'data.sd.contentParsed',
						directive: 'platform-preview-form-control',
						options: {model: 'data.sd.contentParsed'},
						visible: true
					}, {
						gid: 'shutdown', sortOrder: 20, rid: 'validFrom',
						label$tr$: 'cloud.desktop.design.alertMessages.validFrom',
						type: 'datetime', visible: true,
						model: 'data.sd.from'
					}, {
						gid: 'shutdown', sortOrder: 30, rid: 'validUntil',
						label$tr$: 'cloud.desktop.design.alertMessages.validUntil',
						type: 'datetime', visible: true,
						model: 'data.sd.until'
					}, {
						gid: 'shutdown', sortOrder: 40, rid: 'active',
						label$tr$: 'cloud.desktop.design.alertMessages.isActive',
						type: 'boolean', visible: true,
						model: 'data.sd.isActive'
					}, {
						gid: 'shutdown', sortOrder: 50, rid: 'active',
						label$tr$: 'cloud.desktop.design.alertMessages.forceLogoff',
						type: 'boolean', visible: false,
						model: 'data.sd.forceLogoff'
					}, {
						gid: 'shutdown', sortOrder: 100, rid: 'delete',
						// label$tr$: 'cloud.desktop.design.alertMessages.clear',
						label: '', visible: true,
						type: 'directive', directive: 'platform-btn-form-control',
						options: {
							fnc: function ($event) {
								resetShutdownSetting($event, data);
							},
							caption$tr$: 'cloud.desktop.design.alertMessages.clear'
						}
					}
				]
			};

			if (data.cert) {
				if (data.cert.idSrv && data.cert.idSrv.thumbPrint) {
					formConfig.rows = formConfig.rows.concat(idSrvCertificateConfig);
				}
				const idSrvSslFound = data.cert.idSrvSsl && data.cert.idSrvSsl.thumbPrint;
				const webSrvFound = data.cert.webSrv && data.cert.webSrv.thumbPrint;
				const sameThumbPrint = idSrvSslFound && webSrvFound && (data.cert.idSrvSsl.thumbPrint === data.cert.webSrv.thumbPrint);
				if (sameThumbPrint) {
					formConfig.rows = formConfig.rows.concat(webSrvSslCertificateConfig);
				} else {
					if (webSrvFound) {
						formConfig.rows = formConfig.rows.concat(idSrvSslCertificateConfig);
					}
					if (idSrvSslFound) {
						formConfig.rows = formConfig.rows.concat(webSrvSslCertificateConfig);
					}
				}
			}

			return formConfig;
		}

		/**
		 * @param entity
		 */
		function changedContent(entity) {
			// console.log('changedContent: ', entity, field, data);
			cloudDesktopInfoService.formatShutDownAlertMessage(entity.data.sd);
			return true;
		}

		/**
		 *
		 * @param $event
		 * @param data
		 */
		function resetShutdownSetting($event, data) {

			_.assign(data, initShutdownMessage());

		}

		function initShutdownMessage() {
			return {
				content: '',
				contentParsed: '',
				from: moment(),
				until: moment().add(1, 'hour'),
				contentinfo: '',
				isActive: false,
				forceLogoff: false
			};
		}

		/**
		 * @ngdoc function
		 * @name isSettingsChanged
		 * @function
		 * @methodOf cloudDesktopAlertMessagesService
		 * @description Indicate whether the settings are changed.
		 * @returns { bool } True, if settings are changed, otherwise false.
		 */
		function isSettingsChanged(data) {
			return !!_.get(data[settingsKey], '__changed');
		}

		/**
		 * @ngdoc function
		 * @name onSaved
		 * @function
		 * @methodOf cloudDesktopAlertMessagesService
		 * @description This function will be processed after the settings dialog has saved his settings.
		 * @param { Object } data The data object of the selected master item.
		 */
		function onSaved(data) {
			if (isSettingsChanged(data)) {
				_.noop();
				// ToDo: if this function not needed, then just delete it
			}
		}

		/**
		 * @ngdoc function
		 * @name customGetSettings
		 * @function
		 * @methodOf cloudDesktopAlertMessagesService
		 * @description Loads the settings. These settings aren't from the user profiles like the normal settings.
		 * @returns {Promise<Object>} A promise that is resolved when the data is loaded.
		 */
		function customGetSettings(data) {
			return $q.when(getSettings()).then(function (localData) {
				_.set(data, settingsKey, localData);
			});
		}

		/**
		 * @ngdoc function
		 * @name customSaveSettings
		 * @function
		 * @methodOf cloudDesktopAlertMessagesService
		 * @description Saves the available settings. These settings are not saved in the user profiles like the normal settings.
		 * @returns {Promise<Object>} A promise that is resolved when the data is saved.
		 */
		function customSaveSettings(settings) {
			let amSettings;

			return $q.when((function () {
				if (isSettingsChanged(settings)) {
					amSettings = _.get(settings, 'items.settingsKey');
					return $q.when(saveSettings(amSettings));
				}
			})()).then(function () {
				delete settings[settingsKey]; // delete because there are no settings for the user profiles
			});
		}

		/**
		 * Save setting into Profile
		 * @param settings
		 * @returns {Promise<boolean>}
		 */
		function saveSettings(settings) { // jshint ignore:line

			let theMsg = {
				messageType: 'System.Application.ShutDownMsg',
				content: shutDownAlertMsg.content,
				validFromUtc: shutDownAlertMsg.from.utc().format(),
				validUntilUtc: shutDownAlertMsg.until.utc().format(),
				isActive: shutDownAlertMsg.isActive,
				forceLogoff: shutDownAlertMsg.forceLogoff
			};
			return platformUtilService.setApplicationMessages(theMsg).then(function (result) {// jshint ignore:line
				return true;
			});

		}

		/**
		 * @returns {Promise<{contentinfo: string, ValidToUtc: number, from: *, until: *, isActive: boolean, ValidFromUtc: number, content: string}>}
		 *
		 *{   "messageType": "System.Application.ShutDownMsg",
					    "content": "Attention! System will rebooted at <%= until %>! Logoff will be forced!!",
					    "validFromUtc": "2020-05-07T09:00:00Z",
					    "validUntilUtc": "2020-05-07T10:31:00Z",
					    "alertBeforeSeconds": 0,
					    "isActive": false,
					    "forceLogoff": true	}
			 return {'shutDownMsg': shutdownMsg, 'certificateMsg': certificateMsgs};
		 */

		function getSettings() {
			return platformUtilService.getAllMessages(true).then(function (result) {
				if (result) {
					if (result.shutDownMsg) {
						shutDownAlertMsg = {
							content: result.shutDownMsg.content,
							from: moment(result.shutDownMsg.validFromUtc),
							until: moment(result.shutDownMsg.validUntilUtc),
							contentinfo: result.shutDownMsg.content, // @TODO parsing comes later
							isActive: result.shutDownMsg.isActive,
							forceLogoff: result.shutDownMsg.forceLogoff
						};
					} else {
						shutDownAlertMsg = initShutdownMessage();
					}
					if (result.certificateMsg) {
						certificateMessages = {
							idSrv: result.certificateMsg.idSrv || {},
							webSrv: result.certificateMsg.webSrv || {},
							idSrvSsl: result.certificateMsg.idSrvSsl || {}
						};
						if (certificateMessages.idSrv) {
							certificateMessages.idSrv.until = moment(certificateMessages.idSrv.validUntilUtc);
						}
						if (certificateMessages.idSrvSsl) {
							certificateMessages.idSrvSsl.until = moment(certificateMessages.idSrvSsl.validUntilUtc);
						}
						if (certificateMessages.webSrv) {
							certificateMessages.webSrv.until = moment(certificateMessages.webSrv.validUntilUtc);
						}
					} else {
						certificateMessages = {
							idSrv: {}, webSrv: {}, idSrvSsl: {}
						};
					}
				}
				cloudDesktopInfoService.formatShutDownAlertMessage(shutDownAlertMsg);
				return {'sd': shutDownAlertMsg, 'cert': certificateMessages};
				// return shutDownAlertMsg;
			});
		}

		return {
			getMasterItemId: getMasterItemId,
			convertToTransferable: convertToTransferable,
			hasWritePermission: hasWritePermission,
			getMasterItem: getMasterItem,
			onSaved: onSaved,
			customGetSettings: customGetSettings,
			customSaveSettings: customSaveSettings,
			/**
			 * @ngdoc property
			 * @name .#settingsKey
			 * @propertyOf cloudDesktopAlertMessagesSettingsService
			 * @returns { string } The id of the settings object
			 */
			settingsKey: settingsKey
		};
	}

	/**
	 * @ngdoc service
	 * @name cloudDesktopAlertMessagesSettingsService
	 * @function
	 * @requires $http, $q, _, dataStates, platformRuntimeDataService, platformPermissionService, $translate, userTypes
	 *
	 * @description Manages the settings of the alert messages in mainheader.
	 */
	angular.module('cloud.desktop').factory('cloudDesktopAlertMessagesSettingsService', cloudDesktopAlertMessagesSettingsService);
})
();
