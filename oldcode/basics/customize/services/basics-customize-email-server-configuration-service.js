/**
 * Created by aljami on 11.10.2021
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeEmailServerConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides functionality to setup multiple email servers
	 */
	angular.module(moduleName).factory('basicsCustomizeEmailServerConfigurationService', ['platformMasterDetailDialogService', 'globals', '$http', '_', '$translate', 'platformRuntimeDataService', 'moment', 'platformGridAPI', '$timeout', 'platformModalFormConfigService', 'platformTranslateService', 'platformDialogService', 'platformPermissionService', '$q', 'platformDataServiceHttpResourceExtension',

		function (platformMasterDetailDialogService, globals, $http, _, $translate, platformRuntimeDataService, moment, platformGridAPI, $timeout, platformModalFormConfigService, platformTranslateService, platformDialogService, platformPermissionService, $q, platformDataServiceHttpResourceExtension) {

			let requiredFieldValidator = function (entity, value){
				if(value === '' || value === null){
					return {apply: true, valid: false, error: 'This field is required!!'};
				}

				return {apply: true, valid: true, error: ''};
			};

			let credentialFieldValidator = function (entity, value){
				if(entity.UseAuthentication){
					if(value === '' || value === null){
						return {apply: true, valid: false, error: 'This field is required!!'};
					}
				}

				return {apply: true, valid: true, error: ''};
			};

			function changeReadonlyUsingUseSecureAuthenticate(entity) {
				const properties = [
					{
						field: 'Username',
						readonly: !entity.UseAuthentication
					},
					{
						field: 'Password',
						readonly: !entity.UseAuthentication
					}
				];
				platformRuntimeDataService.readonly(entity, properties);
			}

			function utf8_to_b64(str) {
				return window.btoa(unescape(encodeURIComponent(str)));
			}

			function modifyEntityBeforeDialogShow(item) {
				item.Name = item.DescriptionInfo.Translated;
				item.InsertedAt = moment.utc(item.InsertedAt);
				item.ReceiverEmail = '';
				if (item.UpdatedAt) {
					item.UpdatedAt = moment.utc(item.UpdatedAt);
				}
				if (item.IsPasswordSet) {
					item.Password = '***';
				}
				changeReadonlyUsingUseSecureAuthenticate(item);
				return item;
			}

			function getEmailServerModifySettingsDialogOption(selectedServer, serverList){

				let dialogOptions = {
					headerText$tr$: 'basics.customize.emailServer.dialogTitle.dlgSettings',
					bodyTemplateUrl: globals.appBaseUrl + 'basics.customize/templates/basics-customize-email-server-list.html',
					title: 'Edit Assignment',
					backdrop: true,
					height: 'max',
					width: '830px',
					resizeable: true,
					showCancelButton: true,
					showOkButton: true,
					value: {
						items: [],
						selectedItem: null,
						defaultForm: null
					}
				};

				_.forEach(serverList, function (item) {
					item = modifyEntityBeforeDialogShow(item);
					dialogOptions.value.items.push(item);
					if(item.Id === selectedServer.Id){
						dialogOptions.value.selectedItem = item;
					}
				});

				return dialogOptions;
			}

			function getEmailServerCreateDialogOptions(newEntity) {

				newEntity.InsertedAt = moment();
				newEntity.Port = 587;
				newEntity.SecurityType = 2;
				newEntity.UseAuthentication = true;
				newEntity.EncryptionTypeFk = 1;

				let dialogConfig = {
					headerText$tr$: 'basics.customize.emailServer.dialogTitle.dlgCreate',
					bodyTemplateUrl: globals.appBaseUrl + 'basics.customize/templates/basics-customize-create-email-server-dialog.html',
					height: 'max',
					width: '800px',
					resizeable: true,
					showCancelButton: false,
					showOkButton: false,
					value: {
						selectedItem: newEntity,
						defaultForm: null
					},
					buttons:[

					]
				};
				return dialogConfig;
			}

			function processPasswordChangedBeforeUpdate(items) {
				_.forEach(items, function (item) {
					if (item.Password !== '***') {
						if (item.Password !== '') {
							item.IsPasswordChanged = true;
							item.Password = utf8_to_b64(item.Password);
						} else {
							item.IsPasswordChanged = item.IsPasswordSet;
							item.Password = '';
						}
					} else {
						item.IsPasswordChanged = false;
						item.Password = '';
					}
				});
				return items;
			}

			function processIsDefaultBeforeUpdate(items){
				let defaultsFound = 0;
				_.forEach(items, function (item){
					if(item.IsDefault){
						defaultsFound++;

						if(defaultsFound > 1){
							item.IsDefault = false;
						}
					}
				});

				if(defaultsFound === 0){
					if(items.length > 0){
						items[0].IsDefault = true;
					}
				}

				return items;
			}

			function populateGridWithData(items){
				$timeout(function () {
					const gridId = '3a51bf834b8649069172d23ec1ba35e2';
					platformGridAPI.items.data(gridId, items);
				});
			}

			function checkItemsValidity(itemList){

				let messageList = [];
				_.forEach(itemList, function (item){
					let errorsCount = 0;
					let message = 'Item id : ' + item.Id;
					if(!item.DescriptionInfo.Translated){
						message += ', Name required';
						errorsCount++;
					}
					if(_.isEmpty(item.ServerUrl)){
						message += ', ' + $translate.instant('basics.customize.emailServer.messages.serverUrlRequired');
						errorsCount++;
					}
					if(item.Port === ''){
						message += ', ' + $translate.instant('basics.customize.emailServer.messages.portRequired');
						errorsCount++;
					}
					if(_.isEmpty(item.SenderEmail)){
						message += ', ' + $translate.instant('basics.customize.emailServer.messages.senderEmailRequired');
						errorsCount++;
					}
					if(item.UseAuthentication){
						if(_.isEmpty(item.Username)){
							message += ', ' + $translate.instant('basics.customize.emailServer.messages.usernameRequired');
							errorsCount++;
						}

						if(_.isEmpty(item.Password)){
							message += ', ' + $translate.instant('basics.customize.emailServer.messages.passwordRequired');
							errorsCount++;
						}
					}

					if(errorsCount > 0){
						messageList.push(message);
					}

				});
				return messageList;
			}

			var service = {};

			service.hasManagementAccess = function () {
				return platformPermissionService.hasExecute('d48149582a0a4031b07295f9853ac427');
			};

			service.readCompany2EmailServerTree = function readCompany2EmailServerTree(companyId){
				let postData = (companyId) ? companyId : null;
				return $http.post(constructServer2CompanyServiceUrl('tree'), postData);
			};

			service.readEmailServerList = function readEmailServerList() {
				return $http.post(constructEmailServerServiceUrl('list'));
			};

			service.readEmailServer2CompanyList = function (){
				return $http.post(constructServer2CompanyServiceUrl('list'));
			};

			function constructEmailServerServiceUrl(endpoint) {
				return globals.webApiBaseUrl + 'basics/customize/EMailServer/' + endpoint;
			}

			function constructServer2CompanyServiceUrl(endpoint){
				return globals.webApiBaseUrl + 'basics/customize/emailserver2company/' + endpoint;
			}

			function showErrorDialog(errorMessages){
				let messageText = '';
				_.forEach(errorMessages, function (message){
					messageText += message + '<br>';
				});
				platformDialogService.showMsgBox(messageText, 'basics.customize.emailServer.dialogTitle.failed', 'error');
			}

			service.readServerResult = {
				currentDefault : null,
				serverList : []
			};

			service.getDefaultForm = function (testConnectionCallback){
				return {
					fid: 'default.form',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							gid: 'general',
							header$tr$: 'basics.customize.emailServer.groupHeader.general',
							isOpen: true
						},
						{
							gid: 'serverSettings',
							header$tr$: 'basics.customize.emailServer.groupHeader.serverSettings',
							isOpen: true
						},
						{
							gid: 'securitySettings',
							header$tr$: 'basics.customize.emailServer.groupHeader.securitySettings',
							isOpen: true
						},
						{
							gid: 'sender',
							header$tr$: 'basics.customize.emailServer.groupHeader.senderEmail',
							isOpen: true
						},
						{
							gid: 'others',
							header$tr$: 'basics.customize.emailServer.groupHeader.others',
							isOpen: false
						}
					],
					rows: [
						{
							gid: 'general',
							rid: 'name',
							label$tr$: 'basics.customize.emailServer.rowLabel.name',
							type: 'description',
							model: 'DescriptionInfo.Translated',
							placeholder: $translate.instant('basics.customize.emailServer.rowLabel.namePlaceholder'),
							validator: requiredFieldValidator
						},
						{
							gid: 'general',
							rid: 'isDefault',
							label$tr$: 'basics.customize.emailServer.rowLabel.isDefault',
							type: 'boolean',
							model: 'IsDefault',
							domain: 'IsDefault',
							change: function (entity){
								if(entity.IsDefault){
									service.readServerResult.currentDefault.IsDefault = false;
									entity.IsDefault = true;
									service.readServerResult.currentDefault= entity;
								}else{
									if(entity.Id === service.readServerResult.currentDefault.Id){
										entity.IsDefault = true;
										// show message
										platformDialogService.showMsgBox('basics.customize.emailServer.messages.defaultRequired', 'basics.customize.emailServer.dialogTitle.defaultRequired', 'info');
									}
								}
							}
						},
						{
							gid: 'general',
							rid: 'remark',
							label$tr$: 'basics.customize.emailServer.rowLabel.remark',
							type: 'remark',
							model: 'Remark',
							placeholder: $translate.instant('basics.customize.emailServer.rowLabel.remarkPlaceholder')
						},
						{
							gid: 'serverSettings',
							rid: 'serverUrl',
							label$tr$: 'basics.customize.emailServer.rowLabel.serverUrl',
							type: 'description',
							maxLength: 255,
							model: 'ServerUrl',
							domain: 'ServerUrl',
							placeholder: $translate.instant('basics.customize.emailServer.rowLabel.serverUrlPlaceholder'),
							validator: requiredFieldValidator
						},
						{
							gid: 'serverSettings',
							rid: 'port',
							label$tr$: 'basics.customize.emailServer.rowLabel.port',
							type: 'integer',
							model: 'Port',
							domain: 'Port',
							placeholder: $translate.instant('basics.customize.emailServer.rowLabel.portPlaceholder'),
							validator: requiredFieldValidator
						},
						{
							gid: 'securitySettings',
							rid: 'connectionSecurity',
							label$tr$: 'basics.customize.emailServer.rowLabel.connectionSecurity',
							type: 'select',
							model: 'SecurityType',
							domain: 'SecurityType',
							options: {
								items: [
									{id: 0, description: 'None'},
									{id: 1, description: 'STARTTLS'},
									{id: 2, description: 'SSL'}
								],
								valueMember: 'id',
								displayMember: 'description'
							}
						},
						{
							gid: 'securitySettings',
							rid: 'secureAuthenticate',
							label$tr$: 'basics.customize.emailServer.rowLabel.secureAuthenticate',
							type: 'boolean',
							model: 'UseAuthentication',
							domain: 'UseAuthentication',
							change: changeReadonlyUsingUseSecureAuthenticate
						},
						{
							gid: 'securitySettings',
							rid: 'username',
							label$tr$: 'basics.customize.emailServer.rowLabel.userName',
							type: 'description',
							model: 'Username',
							domain: 'Username',
							placeholder: $translate.instant('basics.customize.emailServer.rowLabel.userNamePlaceholder'),
							validator: credentialFieldValidator
						},
						{
							gid: 'securitySettings',
							rid: 'password',
							label$tr$: 'basics.customize.emailServer.rowLabel.password',
							type: 'password',
							model: 'Password',
							domain: 'Password',
							placeholder: $translate.instant('basics.customize.emailServer.rowLabel.passwordPlaceholder'),
							validator: credentialFieldValidator
						},
						{
							gid: 'sender',
							rid: 'senderEmail',
							label$tr$: 'basics.customize.emailServer.rowLabel.senderEmail',
							type: 'email',
							model: 'SenderEmail',
							domain: 'SenderEmail',
							placeholder: $translate.instant('basics.customize.emailServer.rowLabel.senderEmailPlaceholder'),
							validator: requiredFieldValidator
						},
						{
							gid: 'sender',
							rid: 'testConnection',
							label$tr$: 'basics.customize.emailServer.rowLabel.testConnection',
							type: 'email',
							model: 'ReceiverEmail',
							domain: 'ReceiverEmail',
							placeholder: $translate.instant('basics.customize.emailServer.rowLabel.testConnectionPlaceholder'),
							options:{
								showButton: true,
								buttonFn:testConnectionCallback
							}
						},
						{
							gid: 'others',
							rid: 'isLive',
							label$tr$: 'basics.customize.emailServer.rowLabel.isLive',
							type: 'boolean',
							model: 'IsLive',
							domain: 'IsLive'
						},
						{
							gid: 'others',
							rid: 'sorting',
							label$tr$: 'basics.customize.emailServer.rowLabel.sorting',
							type: 'integer',
							model: 'Sorting',
							domain: 'Sorting'
						},
						{
							gid: 'others',
							rid: 'insertedAt',
							label$tr$: 'basics.customize.emailServer.rowLabel.insertedAt',
							type: 'date',
							model: 'InsertedAt',
							domain: 'InsertedAt',
							readonly: true
						},
						{
							gid: 'others',
							rid: 'insertedBy',
							label$tr$: 'basics.customize.emailServer.rowLabel.insertedBy',
							type: 'description',
							model: 'InsertedBy',
							domain: 'InsertedBy',
							readonly: true
						},
						{
							gid: 'others',
							rid: 'updatedAt',
							label$tr$: 'basics.customize.emailServer.rowLabel.updatedAt',
							type: 'date',
							model: 'UpdatedAt',
							domain: 'UpdatedAt',
							readonly: true
						},
						{
							gid: 'others',
							rid: 'updatedBy',
							label$tr$: 'basics.customize.emailServer.rowLabel.updatedBy',
							type: 'description',
							model: 'UpdatedBy',
							domain: 'UpdatedBy',
							readonly: true
						}
					]
				};
			};

			service.showCreateEmailServerSettingsDialog = function () {

				$http.post(constructEmailServerServiceUrl('create')).then(function (createdEntity){
					let dialogConfig = getEmailServerCreateDialogOptions(createdEntity.data);
					platformDialogService.showDialog(dialogConfig);
				});


			};

			service.showEmailServerSettingsDialog = function (selectionType) {
				service.readEmailServerList().then(function (res) {
					service.readServerResult.serverList = res.data;
					service.readServerResult.currentDefault = _.find(res.data, (item) => item.IsDefault);
					// let dialogOptions = getEmailServerMasterDetailDialogOption(selectionType, res.data);
					let dialogOptions = getEmailServerModifySettingsDialogOption(selectionType, res.data);
					platformDialogService.showDialog(dialogOptions).then(function (result) {
						let errorMessages = checkItemsValidity(result.value.items);
						if(errorMessages.length === 0){
							let items = processPasswordChangedBeforeUpdate(result.value.items);
							items = processIsDefaultBeforeUpdate(items);
							$http.post(constructEmailServerServiceUrl('update'), items).then(function (updateResult) {
								populateGridWithData(updateResult.data);
								platformDialogService.showMsgBox('basics.customize.emailServer.messages.saveSuccess', 'basics.customize.emailServer.dialogTitle.saveSuccess', 'info');
							});
						}else{
							showErrorDialog(errorMessages);
						}
					}, function (closed){
						service.cancelCurrentTest();
					});
				});
			};

			service.showEmailServerAssignmentDialog = function () {

				service.readEmailServerList().then(function (serverList){
					service.readCompany2EmailServerTree(null).then(function (server2CompanyTree){
						service.readEmailServer2CompanyList().then(function (server2CompanyList){
							let myDialogOptions = {
								headerText$tr$: 'basics.customize.emailServer.dialogTitle.dlgAssignment',
								bodyTemplateUrl: globals.appBaseUrl + 'basics.customize/templates/basics-customize-email-server-company-assignment.html',
								showCancelButton: false,
								showNoButton: false,
								showOkButton: false,
								height: 'max',
								width: '1200px',
								resizeable: true,
								value:{
									defaultForm: null,
									selectedItem:null,
									emailServerList: serverList.data,
									server2Company:server2CompanyTree.data,
									server2CompanyList: server2CompanyList.data
								},
								buttons: [{
									id: 'close-btn',
									caption$tr$: 'basics.customize.emailServer.button.btnClose',
									disabled: function () {
										return false;
									}
								}]
							};

							platformDialogService.showDialog(myDialogOptions).then(function (ok){

							}, function (closed){
								service.cancelCurrentTest();
							});
						});
					});
				});
			};

			service.assignServer2Company = function (serverId, overrideEmail, companyId){
				let postData = {
					ServerId: serverId,
					OverrideEmail: overrideEmail,
					CompanyId: companyId
				};

				return $http.post(constructServer2CompanyServiceUrl('assign'), postData);
			};

			service.saveNewlyCreatedServer = function (dataToSave){
				let hasErrorsInData = true;
				let errorMessages = checkItemsValidity([dataToSave]);
				if (dataToSave.UseAuthentication) {
					if (dataToSave.Username !== '' && dataToSave.Username !== null && dataToSave.Password !== '' && dataToSave.Password !== null) {
						dataToSave.Password = utf8_to_b64(dataToSave.Password);
						hasErrorsInData = false;
					}
				} else {
					hasErrorsInData = false;
				}

				if (!hasErrorsInData) {
					dataToSave.DescriptionInfo.Modified = true;
					return $http.post(constructEmailServerServiceUrl('savenew'), dataToSave).then(function (createResult) {
						populateGridWithData(createResult.data);
						platformDialogService.showMsgBox('basics.customize.emailServer.messages.createSuccess', 'basics.customize.emailServer.dialogTitle.createSuccess', 'info');
						return true;
					});

				} else {
					if (errorMessages.length > 0) {
						showErrorDialog(errorMessages);
					} else {
						showErrorDialog(['basics.customize.emailServer.messages.createFailed']);
					}
					return $q.when(false);
				}

			};

			function testWithServer(item, checkPassword){
				let errors = false;
				if(!item.ReceiverEmail){
					errors = true;
					platformDialogService.showMsgBox('basics.customize.emailServer.messages.receiverEmailRequired', 'basics.customize.emailServer.dialogTitle.testConnection', 'info');
				}
				else if(!item.ServerUrl){
					errors = true;
					platformDialogService.showMsgBox('basics.customize.emailServer.messages.serverUrlRequired', 'basics.customize.emailServer.dialogTitle.testConnection', 'info');
				}
				else if(!item.Port){
					errors = true;
					platformDialogService.showMsgBox('basics.customize.emailServer.messages.portRequired', 'basics.customize.emailServer.dialogTitle.testConnection', 'info');
				}
				else if(!item.SenderEmail){
					errors = true;
					platformDialogService.showMsgBox('basics.customize.emailServer.messages.senderEmailRequired', 'basics.customize.emailServer.dialogTitle.testConnection', 'info');
				}
				else if(checkPassword && item.UseAuthentication && !item.Username){
					errors = true;
					platformDialogService.showMsgBox('basics.customize.emailServer.messages.usernameRequired', 'basics.customize.emailServer.dialogTitle.testConnection', 'info');
				}
				else if(checkPassword && item.UseAuthentication && !item.Password){
					errors = true;
					platformDialogService.showMsgBox('basics.customize.emailServer.messages.passwordRequired', 'basics.customize.emailServer.dialogTitle.testConnection', 'info');
				}

				if(!errors){
					if(checkPassword && item.UseAuthentication){
						let temp = processPasswordChangedBeforeUpdate([item]);
						item = temp[0];
					}
					let postData = {
						ServerInfo: item,
						ReceiverEmail: item.ReceiverEmail
					};
					service.cancelCurrentTest();
					return $http.post(constructEmailServerServiceUrl('testconnection'), postData, {timeout: platformDataServiceHttpResourceExtension.provideReadRequestToken(service.currentReqData)});
				}else{
					return $q.when();
				}
			}

			service.currentReqData = {};
			service.cancelCurrentTest = function (){
				platformDataServiceHttpResourceExtension.killRunningReadRequest(service.currentReqData);
			};

			service.testEmailConnection = function (currentItem){
				let item = currentItem;
				if(currentItem.ServerId){
					return service.readEmailServerList().then(function (res) {
						item = _.find(res.data, function (e){
							return e.Id === currentItem.ServerId;
						});

						item.SenderEmail = currentItem.SenderEmail;
						item.ReceiverEmail = currentItem.ReceiverEmail;

						return testWithServer(item, false);
					});
				}else{
					return testWithServer(item, true);
				}


			};

			return service;
		}
	]);
})();
