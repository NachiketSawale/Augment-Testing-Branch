/**
 * Created by wed on 7/26/2023.
 */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').controller('cloudDesktopOutlookSendboxController', [
		'_',
		'$q',
		'Quill',
		'keyCodes',
		'$timeout',
		'$translate',
		'$scope',
		'$http',
		'$state',
		'globals',
		'platformDialogService',
		'platformEditorService',
		'platformDragdropService',
		'cloudDesktopOutlookConstant',
		'cloudDesktopOutlookMainService',
		'cloudDesktopOutlookAttachmentService',
		'platformModalService',
		'platformModuleStateService',
		'platformModuleNavigationService',
		'platformContextService',
		'cloudDesktopSidebarService',
		'PlatformMessenger',
		'cloudDesktopInfoService',
		function (
			_,
			$q,
			Quill,
			keyCodes,
			$timeout,
			$translate,
			$scope,
			$http,
			$state,
			globals,
			platformDialogService,
			platformEditorService,
			platformDragdropService,
			outlookConstant,
			outlookMainService,
			outlookAttachmentService,
			platformModalService,
			platformModuleStateService,
			naviService,
			platformContextService,
			cloudDesktopSidebarService,
			PlatformMessenger,
			cloudDesktopInfoService
		) {
			const viewUUID = '2b9a17f1d9de4aa7b7552107b72668d0';

			const dropIdentifiers = [{
				type: 'documentRevision',
				getDoc: function (entity) {
					return entity.FileArchiveDocFk;
				},
				canDrop: function (entity) {
					return !_.isNil(this.getDoc(entity));
				},
				createAttachment: function (entity, extProps) {
					const name = entity.OriginFileName || entity.Barcode || entity.Description || entity.Id;
					return outlookAttachmentService.createAttachment(name, extProps);
				}
			}, {
				type: 'modelMainObjectDataService',
				getDoc: function (entity) {
					return entity.FileArchiveDocFk;
				},
				canDrop: function (entity) {
					return !_.isNil(this.getDoc(entity));
				},
				createAttachment: function (entity, extProps) {
					const name = entity.OriginFileName || entity.Code || entity.Barcode || entity.Description || entity.Id;
					return outlookAttachmentService.createAttachment(name, extProps);
				}
			}, {
				type: 'leadEntity',
				canDrop: function (entity) {
					return !_.isNil(entity.Id);
				},
				createLink: function (entity, type, draggedData) {
					let context = platformContextService.getContext();
					let moduleName = getModuleName($state.current);
					let linkName = '';
					let url = globals.clientUrl + '#api?navigate&operation=lookup&module=' + moduleName + '&company=' + context.clientCode;
					switch (type) {
						case 'businesspartner.main': {
							linkName = entity.BusinessPartnerName1;
							url = url + '&search=' + entity.BusinessPartnerName1;
							break;
						}
						case 'cosMainInstance': {
							linkName = entity.Code + ' ' + (entity.DescriptionInfo ? entity.DescriptionInfo.Description : '');
							let filterRequest = cloudDesktopSidebarService.filterRequest;
							url = url + '&project=' + filterRequest.projectContextId + '&id=' + entity.InstanceHeaderFk + '&search=' + entity.Code;
							if (draggedData.instanceHeaderInfo && draggedData.instanceHeaderInfo.EstimateHeaderId) {
								url = url + '&extparams=' + draggedData.instanceHeaderInfo.EstimateHeaderId;
							}
							break;
						}
						case 'procurement.stock': {
							linkName = entity.StockCode + '-' + entity.StockDescription + '\\' + entity.MaterialCode + '-' + entity.Description1;
							url = url + '&search=' + entity.MaterialCode + '&extparams=' + entity.PrjStockFk;
							break;
						}
						case 'procurement.inventory': {
							linkName = entity.Id + ' ' + (entity.Description || '');
							url = url + '&id=' + entity.Id;
							break;
						}
						case 'controlling.common.project': {
							linkName = entity.ProjectNo + ' ' + (entity.ProjectName || '');
							url = url + '&id=' + entity.Id;
							break;
						}
						case 'model.annotation': {
							let description = entity.DescriptionInfo ? entity.DescriptionInfo.Description : entity.Description ? entity.Description : '';
							linkName = (description ? (' ' + description) : '');
							url = url + '&search=' + description + '&id=' + entity.Id;
							break;
						}
						case 'model.changeset': {
							let description = entity.DescriptionInfo ? entity.DescriptionInfo.Description : entity.Description ? entity.Description : '';
							linkName = (description ? (' ' + description) : '');
							url = url + '&search=' + description + '&id=' + entity.Id;
							break;
						}
						case 'project.main': {
							linkName = entity.ProjectLongNo + '-' + (entity.ProjectName || '');
							url = url + '&id=' + entity.Id;
							break;
						}
						case 'basics.workflow': {
							linkName = entity.DescriptionInfo ? entity.DescriptionInfo.Description : entity.Description ? entity.Description : '';
							url += '&id=' + entity.Id;
							break;
						}
						default: {
							let description = entity.DescriptionInfo ? entity.DescriptionInfo.Description : entity.Description ? entity.Description : '';
							if (!description) {
								const headerInfo = cloudDesktopInfoService.read();
								description = headerInfo.subTitle[0].description;
							}
							linkName = (entity.Code || '') + '-' + (description || '');
							url = url + '&id=' + entity.Id;
						}
					}
					return {
						name: linkName,
						moduleName: moduleName,
						item: entity,
						url: '<a target="_blank" href="' + url + '">' + linkName + '</a>'
					};
				}
			}];

			const insertStyle = function (styles) {
				document.getElementById('ctrl-outlook-custom-style').innerText = styles.join(' ');
			}

			const insertContent = function (content) {
				const quill = $scope.editor.instance;
				const range = quill.getSelection(true);
				let index = quill.getLength();
				if (range) {
					index = range.index;
				}
				quill.clipboard.dangerouslyPasteHTML(index, content);
				$scope.sendRequest.message.body.content = quill.root.innerHTML;

				updateEditor();
			}

			const updateRecipients = function (selectedItems, items, recipients, addRecipients) {
				if (addRecipients) {
					selectedItems.forEach(item => {
						if (item) {
							const target = items.find(e => e.email === item.Email);
							if (target) {
								items.splice(items.indexOf(target), 1);
							}
							items.push({
								displayName: _.trim(item.FullName) ? _.trim(item.FullName) : item.Email,
								email: item.Email
							});
						}
					});
				} else {
					selectedItems.forEach(item => {
						items.splice(items.indexOf(item), 1);
					});
				}

				recipients.length = 0;
				items.forEach(item => {
					recipients.push({
						emailAddress: {
							address: item.email
						}
					});
				});
			};

			const createRecipientsOptions = function (selectedCallback) {
				return {
					lookupOptions: {
						displayMember: 'FullName',
						gridOptions: {
							multiSelect: true
						},
						filterOptions: {
							serverSide: false,
							fn: function (entity) {
								return _.trim(entity.Email).length > 0;
							}
						},
						events: [{
							name: 'onInputKeyDown',
							handler: function (evt, args) {
								if ((evt.keyCode === keyCodes.TAB || evt.keyCode === keyCodes.ENTER) && !args.completeItem && args.inputValue && args.inputValue.indexOf('@') > -1) {
									let items = _.map(args.inputValue.split(';'), item => {
										if (item) {
											return {
												FullName: item,
												Email: item
											};
										}
									});
									selectedCallback && selectedCallback(items, true);
								}
							}
						}, {
							name: 'onSelectedItemsChanged',
							handler: function (evt, args) {
								selectedCallback && selectedCallback(args.selectedItems);
							}
						}, {
							name: 'onSelectedItemChanged',
							handler: function (evt, args) {
								selectedCallback && selectedCallback([args.selectedItem]);
							}
						}],
						disableTeams: true,
						isTextEditable: true
					},
					config: {
						rt$readonly: function () {
							return false;
						}
					},
					entity: {},
					items: []
				};
			};

			const attachReportAsBody = function (result) {
				asyncExecute(() => {
					return $http.post(globals.webApiBaseUrl + 'basics/common/outlook/generateReport', result.generateRequest)
						.then(function (response) {
							if (response.data.Success) {
								$scope._useCustomFormat = true;
								const result = outlookMainService.transformContent(response.data.Message);
								insertStyle(result.styles);
								insertContent(result.content);
							} else {
								platformModalService.showErrorBox('cloud.desktop.outlook.generateFailedContent', 'cloud.desktop.outlook.generateFailedTitle', 'ico-error');
							}
						});
				});
			};

			const attachReportAsAttachment = function (result) {
				let attachment = {
					name: result.report.name,
					'@odata.type': '#microsoft.graph.fileAttachment',
					isServerFile: true,
					generateRequest: result.generateRequest
				};
				// $scope.sendRequest.message.subject = result.report.name;
				$scope.sendRequest.message.attachments.push(attachment);
			};

			const asyncExecute = function (asyncFn) {
				outlookMainService.onAsyncEventHappened.fire(true);
				return asyncFn().finally(() => {
					outlookMainService.onAsyncEventHappened.fire(false);
				});
			};

			const getModuleName = function (state) {
				const moduleName = 'cloud.desktop';
				let urlPath = state.url.split('/');
				if (urlPath[0] !== '^') {
					// return urlPath[1];
					// At the moment we have only cloud.desktop
					return moduleName;
				}

				return urlPath[1] + '.' + urlPath[2];
			};

			const asyncAttributes = function (source, target) {
				for (let i = 0; i < source.attributes.length; i++) {
					const attr = source.attributes[i];
					target.setAttribute(attr.name, attr.nodeValue);
				}
			};

			const updateEditor = function () {
				if (!$scope._elemMap || !$scope.editor.instance) {
					return;
				}

				if ($scope._elemMap.table.size) {
					[...$scope._elemMap.table.keys()].forEach(key => {
						const tableRef = $scope._elemMap.table.get(key);
						const table = $scope.editor.instance.root.querySelector(`table[table_id="${key}"]`);
						if (table && tableRef) {
							asyncAttributes(tableRef, table);
						}
					});
				}

				if ($scope._elemMap.tr.size) {
					[...$scope._elemMap.tr.keys()].forEach(key => {
						const trRef = $scope._elemMap.tr.get(key);
						const tr = $scope.editor.instance.root.querySelector(`tr[row_id="${key}"]`);
						if (tr && trRef) {
							asyncAttributes(trRef, tr);
						}
					});
				}

				if ($scope._elemMap.td.size) {
					[...$scope._elemMap.td.keys()].forEach(key => {
						const tdRef = $scope._elemMap.td.get(key);
						const td = $scope.editor.instance.root.querySelector(`td[cell_id="${key}"]`);
						if (td && tdRef) {
							asyncAttributes(tdRef, td);

							if (td.attributes['style'] && !tdRef.attributes['style']) {
								td.removeAttribute('style');
							}
						}
					});
				}

				$scope.sendRequest.message.body.content = $scope.editor.instance.root.innerHTML;
			};

			const combineStyles = function (body) {
				return {
					contentType: body.contentType,
					content: `<style>${document.getElementById('ctrl-outlook-custom-style').innerText}</style>` + body.content
				};
			};

			$scope.selectedAccount = outlookMainService.getSelectedAccount();

			$scope.sendRequest = {
				message: {
					id: '',
					subject: '',
					body: {
						contentType: 'html',
						content: ''
					},
					toRecipients: [],
					ccRecipients: [],
					attachments: []
				},
				saveToSentItems: true
			};

			$scope.editor = {
				name: 'sidebar-outlook-email-editor',
				editable: true,
				instance: null
			};

			$scope.subjectConfig = {
				rt$readonly: function () {
					return false;
				}
			};

			$scope.ddTarget = _.extend(new platformDragdropService.DragdropTarget(platformDragdropService.dragAreas.sidebar, viewUUID), {
				canDrop: function (info) {
					let hasParent = false;
					let isAttachment = _.includes(['documentCentralQueryDataService'], info.draggedData.sourceGrid.itemService.getServiceName());
					if (info.draggedData.sourceGrid.itemService && _.isFunction(info.draggedData.sourceGrid.itemService.parentService)) {
						hasParent = !!info.draggedData.sourceGrid.itemService.parentService();
					}
					let drop = _.find(dropIdentifiers, s => s.type === info.draggedData.sourceGrid.type && (hasParent || isAttachment));
					if (!drop) {
						drop = _.find(dropIdentifiers, s => s.type === 'leadEntity');
					}
					return _.some(info.draggedData.sourceGrid.data, entity => drop.canDrop(entity));
				},
				drop: function (info) {
					let hasParent = false;
					let isAttachment = _.includes(['documentCentralQueryDataService'], info.draggedData.sourceGrid.itemService.getServiceName());
					if (info.draggedData.sourceGrid.itemService && _.isFunction(info.draggedData.sourceGrid.itemService.parentService)) {
						hasParent = !!info.draggedData.sourceGrid.itemService.parentService();
					}
					let drop = _.find(dropIdentifiers, s => s.type === info.draggedData.sourceGrid.type && (hasParent || isAttachment));
					if (!drop) {
						drop = _.find(dropIdentifiers, s => s.type === 'leadEntity');
					}
					if ((_.includes(['documentRevision', 'modelMainObjectDataService'], info.draggedData.sourceGrid.type) && hasParent) || isAttachment) {
						const documents = info.draggedData.sourceGrid.data;
						const attachments = documents.map(doc => {
							return drop.createAttachment(doc, {
								isServerFile: true,
								docId: drop.getDoc(doc)
							});
						});
						$scope.$apply(() => {
							$scope.sendRequest.message.attachments.push(...attachments);
						});
					} else {
						let type = info.draggedData.sourceGrid.type;
						const links = info.draggedData.sourceGrid.data.map(entity => {
							return drop.createLink(entity, type, info.draggedData);
						});
						$scope.$apply(() => {
							insertContent(links[0].url);
						});
					}
				},
				getAllowedActions: function () {
					return [platformDragdropService.actions.copy];
				}
			});

			$scope.toOptions = createRecipientsOptions(function (selectedItems, isFromBtn) {
				let originId = $scope.toOptions.entity.Id;
				updateRecipients(selectedItems, $scope.toOptions.items, $scope.sendRequest.message.toRecipients, true);
				$timeout(() => {
					if (isFromBtn) {
						$scope.toOptions.entity.Id = null;
					} else {
						let lastIndex = originId.lastIndexOf(';');
						let entityId = null;
						if (lastIndex > -1) {
							entityId = originId.substring(0, lastIndex + 1);
						}
						$scope.toOptions.entity.Id = entityId;
					}
					angular.element('.sidebar-outlook-send-box').find('.to').find('input[type="text"]').focus();
				}, 100);
			});

			$scope.ccOptions = createRecipientsOptions(function (selectedItems, isFromBtn) {
				let originId = $scope.ccOptions.entity.Id;
				updateRecipients(selectedItems, $scope.ccOptions.items, $scope.sendRequest.message.ccRecipients, true);
				$timeout(() => {
					if (isFromBtn) {
						$scope.ccOptions.entity.Id = null;
					} else {
						let lastIndex = originId.lastIndexOf(';');
						let entityId = null;
						if (lastIndex > -1) {
							entityId = originId.substring(0, lastIndex + 1);
						}
						$scope.ccOptions.entity.Id = entityId;
					}
					angular.element('.sidebar-outlook-send-box').find('.cc').find('input[type="text"]').focus();
				}, 100);
			});

			$scope._useCustomFormat = false;

			$scope.onToolbarItemClick = function (arg) {
				switch (arg.id) {
					case outlookConstant.toolbars.id.attachFile:
						$scope.addFile();
						break;
					case outlookConstant.toolbars.id.attachReport:
						$scope.attachReport();
						break;
				}
			};

			$scope.removeToRecipient = function (item) {
				updateRecipients([item], $scope.toOptions.items, $scope.sendRequest.message.toRecipients, false);
			};

			$scope.removeCcRecipient = function (item) {
				updateRecipients([item], $scope.ccOptions.items, $scope.sendRequest.message.ccRecipients, false);
			};

			$scope.resetEditor = function () {
				$scope.sendRequest.message.id = '';
				$scope.sendRequest.message.subject = '';
				$scope.sendRequest.message.body.content = '';

				$scope.sendRequest.message.toRecipients.length = 0;
				$scope.sendRequest.message.ccRecipients.length = 0;
				$scope.sendRequest.message.attachments.length = 0;

				$scope.toOptions.items.length = 0;
				$scope.toOptions.entity.Id = null;

				$scope.ccOptions.items.length = 0;
				$scope.ccOptions.entity.Id = null;

				if ($scope.editor.instance) {
					$scope.editor.instance['setText']('');
				}

				if ($scope._elemMap) {
					$scope._elemMap.table.clear();
					$scope._elemMap.tr.clear();
					$scope._elemMap.td.clear();
				}

				document.getElementById('ctrl-outlook-custom-style').innerText = '';
			};

			$scope.saveDraft = function (message) {
				return message.id
					? outlookMainService.graphClient.api(`/me/messages/${message.id}`).patch(message)
					: outlookMainService.graphClient.api('/me/messages').post(message);
			};

			$scope.saveAttachments = function (messageId, attachments) {
				const tobeSaved = attachments.filter(m => _.isUndefined(m.id));
				const clientLargeFiles = tobeSaved.filter(a => a.isClientLargeFile).map(attach => attach.file);
				const serverFiles = tobeSaved.filter(a => a.isServerFile).map(attach => {
					if (attach.generateRequest) {
						return {
							GenerateRequest: attach.generateRequest,
							DocName: attach.name
						};
					}
					return {
						DocId: attach.docId,
						DocName: attach.name
					};
				});
				const clientSmallFiles = tobeSaved.filter(function (attach) {
					return !attach.isClientLargeFile && !attach.isServerFile;
				});
				let uploadAsync = [];

				if (serverFiles.length) {
					uploadAsync.push(
						outlookAttachmentService.uploadServerFile(outlookMainService.msalClient, messageId, serverFiles).then(result => {
							return result.Success ? Promise.resolve(result) : Promise.reject(result.Message);
						})
					);
				}
				if (clientLargeFiles.length || clientSmallFiles.length) {
					const clientQueue = [];

					if (clientSmallFiles.length) {
						clientQueue.push(() => outlookAttachmentService.uploadClientSmallFile(outlookMainService.graphClient, messageId, clientSmallFiles));
					}
					if (clientLargeFiles.length) {
						clientQueue.push(() => outlookAttachmentService.uploadClientLargeFile(outlookMainService.graphClient, messageId, clientLargeFiles));
					}
					const clientUpload = clientQueue.reduce(function (chain, currFn) {
						return chain.then(currFn);
					}, Promise.resolve());

					uploadAsync.push(clientUpload);
				}

				return Promise.all(uploadAsync).then(() => {
					return messageId;
				}).catch(reason => {
					console.error(reason);
				});
			};

			$scope.sendDraft = function (messageId) {
				return outlookMainService.graphClient.api(`/me/messages/${messageId}/send`).post();
			};

			$scope.fillForm = function (message) {
				$scope._useCustomFormat = true;
				$scope.sendRequest.message.id = message.id;
				$scope.sendRequest.message.subject = message.subject;
				$scope.sendRequest.message.body.content = outlookAttachmentService.processAttachments(message.body.content, message.attachments);
				const result = outlookMainService.transformContent($scope.sendRequest.message.body.content);
				insertStyle(result.styles);
				$scope.sendRequest.message.body.content = result.content;
				if (message.attachments && message.attachments.length && message['hasAttachments']) {
					$scope.sendRequest.message.attachments = message.attachments
						.filter(m => m.isInline === false)
						.map(m => {
							return outlookAttachmentService.createAttachment(m.name, {
								id: m.id
							});
						});
				}

				if (message.toRecipients && message.toRecipients.length) {
					updateRecipients(message.toRecipients.map(t => {
						return {
							FullName: t.emailAddress.name,
							Email: t.emailAddress.address
						};
					}), $scope.toOptions.items, $scope.sendRequest.message.toRecipients, true);
				}

				if (message.ccRecipients && message.ccRecipients.length) {
					updateRecipients(message.ccRecipients.map(t => {
						return {
							FullName: t.emailAddress.name,
							Email: t.emailAddress.address
						};
					}), $scope.ccOptions.items, $scope.sendRequest.message.ccRecipients, true);
				}

				$timeout(() => updateEditor(), 10);
			};

			$scope.loadDraft = function (draft) {
				asyncExecute(() => {
					return outlookMainService.graphClient.api(`/me/messages/${draft.id}`)
						.select('subject,body,hasAttachments,sender,toRecipients,ccRecipients,attachments')
						.expand('attachments($select=id,name,isInline,size)')
						.get()
						.then(result => {
							const inlineDocs = result.attachments.filter(m => outlookAttachmentService.isPossibleInlineFile(m.size));
							return outlookAttachmentService.getAttachments(draft.id, inlineDocs).then(attachments => {
								result.attachments.forEach(m => {
									const target = attachments.find(item => item.id === m.id);
									Object.assign(m, target);
								});
								$scope.fillForm(result);
							});
						});
				});
			};

			$scope.send = function () {
				const draftRequest = _.extend({}, $scope.sendRequest.message, {
					body: combineStyles($scope.sendRequest.message.body),
					attachments: []
				});
				const attachments = $scope.sendRequest.message.attachments;

				asyncExecute(() => {
					return $scope.saveDraft(draftRequest)
						.then((message) => {
							return $scope.saveAttachments(message.id, attachments);
						})
						.then((messageId) => {
							if (!draftRequest.id) {
								draftRequest.id = messageId;
							}
							return $scope.sendDraft(messageId);
						})
						.then(() => {
							if (draftRequest.id) {
								outlookMainService.onDraftRequest.fire({
									action: outlookConstant.actions.draft.send,
									data: draftRequest
								});
							}
							$scope.closeView();
						});
				});
			};

			$scope.save = function () {
				const draftRequest = _.extend({}, $scope.sendRequest.message, {
					body: combineStyles($scope.sendRequest.message.body),
					attachments: []
				});
				const attachments = $scope.sendRequest.message.attachments;

				return asyncExecute(() => {
					return $scope.saveDraft(draftRequest)
						.then((message) => {
							return $scope.saveAttachments(message.id, attachments).then(() => {
								return message;
							});
						})
						.then((message) => {
							outlookMainService.onDraftRequest.fire({
								action: outlookConstant.actions.draft.create,
								data: message
							});
							$scope.closeView();
							return message;
						});
				});
			};

			$scope.saveAndOpen = function () {
				$scope.save().then((message) => {
					window.open(message['webLink'], 'OutlookWindow');
				});
			};

			$scope.delete = function () {
				asyncExecute(() => {
					const deleteReady = $scope.sendRequest.message.id
						? outlookMainService.graphClient.api(`/me/messages/${$scope.sendRequest.message.id}`).delete()
						: Promise.resolve();
					return deleteReady.then(() => {
						outlookMainService.onDraftRequest.fire({
							action: outlookConstant.actions.draft.delete,
							data: $scope.sendRequest.message
						});
						$scope.closeView();
					});
				});
			};

			$scope.closeView = function () {
				$scope.resetEditor();
				outlookMainService.onCloseViewRequest.fire();
			};

			$scope.addFile = function () {
				const fileElem = document.createElement('input');
				fileElem.setAttribute('type', 'file');
				fileElem.setAttribute('accept', '*/*');
				fileElem.setAttribute('multiple', null);

				const onFileChanged = function (e) {
					const files = e.target.files;
					$scope.$apply(() => {
						for (let i = 0; i < files.length; i++) {
							const file = files[i];
							const attachment = outlookAttachmentService.createAttachment(file.name);
							$scope.sendRequest.message.attachments.push(attachment);
							if (outlookAttachmentService.isLargeFile(file.size)) {
								attachment.isClientLargeFile = true;
								attachment.file = file;
							} else {
								const reader = new FileReader();
								reader.addEventListener('load', () => {
									attachment['contentBytes'] = reader.result.split(',')[1];
								});
								reader.readAsDataURL(file);
							}
						}
					});
				};

				fileElem.addEventListener('change', onFileChanged);
				fileElem.click();
			};

			$scope.attachReport = function () {
				let urlPath = $state.current.url.split('/');
				let module = urlPath[1] + '.' + urlPath[2];
				let modState = platformModuleStateService.state(module);
				let mainService = modState.rootService;
				let allowAttachReport = false;
				if (mainService) {
					let leadingEntity = mainService.getSelected();
					if (leadingEntity) {
						allowAttachReport = true;
					}
				}
				if (allowAttachReport) {
					let modalOptions = {
						scope: $scope.$new(true),
						templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/outlook/insert-reports-dialog.html',
						controller: 'insertReportsDialogController',
						showOkButton: true,
						showCancelButton: true,
						resizeable: true,
						minHeight: '400px',
						minWidth: '800px'
					};
					return platformModalService.showDialog(modalOptions).then(function (result) {
						if (!result.ok) {
							return;
						}
						if (result.result.type === 'html') {
							attachReportAsBody(result.result);
						} else {
							attachReportAsAttachment(result.result);
						}
					});
				} else {
					platformModalService.showMsgBox($translate.instant('cloud.desktop.outlook.noLeadEntity'), 'Info', 'info');
				}
			};

			$scope.removeFile = function (index) {
				const attachment = $scope.sendRequest.message.attachments[index];
				if ($scope.sendRequest.message.id && attachment.id) {
					outlookMainService.graphClient.api(`/me/messages/${$scope.sendRequest.message.id}/attachments/${attachment.id}`).delete();
				}
				$scope.sendRequest.message.attachments.splice(index, 1);
			};

			$scope.isSaveDisabled = function () {
				const message = $scope.sendRequest.message;
				return !message.subject && !message.body.content.length && !message.toRecipients.length && message.ccRecipients.length;
			};

			$scope.isSendDisabled = function () {
				return !$scope.sendRequest.message.toRecipients.length;
			};

			$scope.onSelectedAccountChanged = function (account) {
				$scope.selectedAccount = account;
			};

			$scope.onSwitchViewRequest = function (arg) {
				switch (arg.id) {
					case outlookConstant.views.id.sendBox:
						$scope.loadDraft(arg.data);
						break;
				}
			};

			$scope.onEmailEditorCreated = function (callback) {
				$timeout(() => {
					$scope.editor.instance = platformEditorService.getEditor($scope.editor.name);
					if (!$scope.editor.instance) {
						$scope.onEmailEditorCreated(callback);
					} else {
						_.isFunction(callback) && callback($scope.editor.instance);
					}
				}, 300);
			};

			$scope.onEmailEditorCreated((editor) => {
				$scope.addImageUploader(editor);
				$scope.customEditor(editor);
			});

			$scope.addImageUploader = function (editor) {
				editor.getModule('toolbar').addHandler('image', function image() {
					const context = this;
					let fileElem = document.createElement('input');
					fileElem.setAttribute('type', 'file');
					fileElem.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
					fileElem.classList.add('ql-image');
					fileElem.addEventListener('change', function () {
						let selectedFile = fileElem.files && fileElem.files.length ? fileElem.files[0] : null;
						if (selectedFile) {
							if (!outlookAttachmentService.isAllowImageSize(selectedFile.size)) {
								platformDialogService.showInfoBox($translate.instant('cloud.desktop.outlook.maxImageSizeLimit', {
									max: outlookAttachmentService.sizes.inlineMaxImageSize
								}));
								return;
							}
							const reader = new FileReader();
							reader.onload = function (e) {
								const range = context.quill.getSelection(true);
								const image = new Image();
								image.src = e.target.result.toString();
								image.onload = function () {
									const Delta = Quill.import('delta');
									let insertDelta = new Delta()
										.retain(range.index)
										.delete(range.length)
										.insert({image: e.target.result}, {
											style: 'width:' + image.width + 'px'
										});
									context.quill['updateContents'](insertDelta, Quill.sources.USER);
								};
								context.quill.setSelection(range.index + 1, Quill.sources.SILENT);
							};
							reader.readAsDataURL(selectedFile);
						}
					});
					fileElem.click();
				});
			};

			$scope.useCustomFormat = function () {
				return $scope._useCustomFormat;
			};

			$scope.customEditor = function (editor) {
				$scope._elemMap = outlookMainService.customTdFormat(editor, $scope.useCustomFormat);
				editor.on('editor-change', () => {
					$scope._useCustomFormat = editor.hasFocus();
				});
			};

			$scope.onMouseDown = function () {
				$timeout(function () {
					let toolBar = angular.element('.ql-table-toolbar');
					if (toolBar) {
						toolBar.addClass('ql-hidden');
					}
				}, 100);
			};

			$scope.onMouseEnterAttachment = function () {
				let ddTarget = {
					canDrop: function () {
						return true;
					},
					drop: function () {
					},
					getAllowedActions: function () {
						return [platformDragdropService.actions.copy];
					}
				};
				ddTarget._onDragStarted = new PlatformMessenger();
				ddTarget._onDragStarted.register(function (draggedData) {
				});
				platformDragdropService.mouseEnter(ddTarget);
			};

			$scope.onMouseDownAttachment = function (item) {
				platformDragdropService.startDrag({
					sourceGrid: {
						data: [item],
						type: 'outlook',
						itemService: outlookMainService,
						attachmentService: outlookAttachmentService,
						copy: function () { }
					},
					draggingFromDraft: true
				}, [
					platformDragdropService.actions.link
				], {
					number: [item].length,
					text: item.subject
				});
			}

			outlookMainService.onSwitchViewRequest.register($scope.onSwitchViewRequest);
			outlookMainService.onToolbarItemClick.register($scope.onToolbarItemClick);
			outlookMainService.onSelectedAccountChanged.register($scope.onSelectedAccountChanged);

			$scope.$on('$destroy', function () {
				outlookMainService.onSwitchViewRequest.unregister($scope.onSwitchViewRequest);
				outlookMainService.onToolbarItemClick.unregister($scope.onToolbarItemClick);
				outlookMainService.onSelectedAccountChanged.unregister($scope.onSelectedAccountChanged);
			});
		}
	]);
})(angular);