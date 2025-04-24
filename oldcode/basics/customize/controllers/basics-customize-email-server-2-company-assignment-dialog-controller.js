(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';

	angular.module(moduleName).controller('basicsCustomizeEmailServer2CompanyAssignmentDialogController', ['$scope', '$translate', 'cloudDesktopCompanyService', 'platformContextService', '$timeout', 'platformTranslateService', '_', 'basicsCustomizeEmailServerConfigurationService', 'platformGridAPI', 'platformDialogService',
		function ($scope, $translate, cloudDesktopCompanyService, platformContextService, $timeout, platformTranslateService, _, basicsCustomizeEmailServerConfigurationService, platformGridAPI, platformDialogService) {

			const gridColumns = [
				{
					id: 'Status',
					field: 'Status',
					name$tr$: 'basics.customize.emailServer.gridColumn.status',
					formatter: 'description',
					width: 300
				}
			];

			function updateTools() {
				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					align: 'right',
					items: [
						{
							id: 'Dv0',
							type: 'divider'
						},
						{
							id: 'collapse',
							type: 'item',
							caption: 'cloud.common.toolbarCollapse',
							iconClass: 'tlb-icons ico-tree-collapse',
							fn: function (){
								let selected = platformGridAPI.rows.selection({gridId:$scope.gridId});
								platformGridAPI.rows.collapseAllSubNodes($scope.gridId,selected);

							}
						},
						{
							id: 'expand',
							type: 'item',
							caption: 'cloud.common.toolbarExpand',
							iconClass: 'tlb-icons ico-tree-expand',
							fn: function (){
								let selected = platformGridAPI.rows.selection({gridId:$scope.gridId});
								platformGridAPI.rows.expandAllSubNodes($scope.gridId,selected);

							}
						},
						{
							id: 'collapse-all',
							type: 'item',
							caption: 'cloud.common.toolbarCollapseAll',
							iconClass: 'tlb-icons ico-tree-collapse-all',
							fn: function (){
								platformGridAPI.rows.collapseAllNodes($scope.gridId);
							}
						},
						{
							id: 'expand-all',
							type: 'item',
							caption: 'cloud.common.toolbarExpandAll',
							iconClass: 'tlb-icons ico-tree-expand-all',
							fn: function (){
								platformGridAPI.rows.expandAllNodes($scope.gridId);
							}
						}
					]
				};

				$timeout($scope.tools.update);


				// $scope.tools = toolbarItems;
			}

			function setupGrid() {

				const columns = angular.copy(gridColumns);

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					const resultGridConfig = {
						columns: columns,
						data: [],
						id: $scope.gridId,
						lazyInit: true,
						options: {
							tree: true,
							indicator: false,
							childProp: 'ChildCompanies',
							idProperty: 'id',
							hierarchyEnabled: true,
							initialState: 'collapse',
							treeColumnDescription: ['code_company_name'],
							treeWidth:300,
							treeHeaderCaption: $translate.instant('basics.customize.emailServer.gridColumn.company'),
							cellCssStyleCallBack: function (row) {
								if(row) {
									if(isOverloadedEntry(row)){
										return {'Status': 'purple-color'};
									}
								}
							}
						}
					};
					platformGridAPI.grids.config(resultGridConfig);
					platformTranslateService.translateGridConfig(resultGridConfig.columns);
				}
			}

			function getStatusTextInGridNew(item, serverList, defaultServer){
				let overloadEmail = item.OVERLOADSENDEREMAIL;
				let selectedServer = defaultServer;
				if(item.BAS_EMAILSERVER_FK !== null){
					let foundServer = _.find(serverList, function (server){ return server.Id === item.BAS_EMAILSERVER_FK;});
					if(foundServer){
						selectedServer = foundServer;
					}
				}
				return selectedServer.DescriptionInfo.Translated + ', ' + ((overloadEmail) ?  overloadEmail : selectedServer.SenderEmail);
			}

			function getNameTextNew(item){
				return item.CODE + ' ' + item.company_name;
			}

			function getAssignmentTreeNew(addToList, allItems, serverList, defaultServer, parent){
				let itemsThisLevel = [];
				if(parent === null){
					itemsThisLevel = _.sortBy(_.filter(allItems, (e) => e.company_name !== null && e.bas_company_fk === null), ['CODE']);
				}else{
					itemsThisLevel = _.sortBy(_.filter(allItems, (e) => e.company_name !== null && e.bas_company_fk === parent.id), ['CODE']);
				}
				if(parent && itemsThisLevel.length > 0){
					parent.HasChildren = true;
				}
				_.each(itemsThisLevel, (item) => {
					_.assign(item, {
						code_company_name: getNameTextNew(item),
						ChildCompanies: [],
						Status: getStatusTextInGridNew(item, serverList, defaultServer),
						HasChildren: false,
						ParentCompany: parent,
						image: ''
					});
					addToList.push(item);
					getAssignmentTreeNew(item.ChildCompanies, allItems, serverList, defaultServer, item);
				});
			}

			function getIconClass(hasChildren, level){
				if(level === 0){
					return 'ico-comp-root';
				}else if(level === 1 || hasChildren){
					return 'ico-comp-businessunit';
				}else{
					return 'ico-comp-profitcenter';
				}
			}

			function sortAndSetImagesToTree(items, level){
				items = _.sortBy(items, ['CODE']);
				_.each(items, (item) => {
					item.image = 'control-icons ' + getIconClass(item.HasChildren, level);
					if(item.ChildCompanies.length > 0){
						sortAndSetImagesToTree(item.ChildCompanies, level + 1);
					}
				});

				return items;
			}

			function initializeGrid(){
				setupGrid();
				$scope.isLoading = true;
				basicsCustomizeEmailServerConfigurationService.readCompany2EmailServerTree().then(function (server2Company){
					let assignmentTree = [];
					let serverList = $scope.serverList;
					let defaultServer = _.find(serverList, function (server){ return server.IsDefault;});

					getAssignmentTreeNew(assignmentTree, server2Company.data, serverList, defaultServer, null);
					assignmentTree = sortAndSetImagesToTree(assignmentTree, 0);

					$scope.isLoading = false;
					updateGrid(assignmentTree);
					if($scope.selectedCompany === null){
						$scope.selectedCompany = assignmentTree[0];
					}

					$timeout(function (){
						platformGridAPI.rows.selection({gridId: $scope.gridId, rows:[$scope.selectedCompany]});
						$timeout(function (){
							rowSelected();
						}, 200);
					}, 200);
				}, function (){
					$scope.isLoading = false;
				});
			}

			function updateGrid(resultGridData) {
				platformGridAPI.grids.invalidate($scope.gridId);
				platformGridAPI.items.data($scope.gridId, resultGridData);
			}

			function constructDropdown(emailServerList){
				let itemsList = [];
				_.forEach(emailServerList, function (server){
					itemsList.push({
						id: server.Id,
						description: server.DescriptionInfo.Translated
					});
				});
				return itemsList;
			}

			function getAssignmentFormConfig(serverList) {
				return {
					fid: 'assignment.form',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							gid: 'general',
							header$tr$: 'basics.customize.emailServer.groupHeader.general',
							header:'General',
							isOpen: true
						},
						{
							gid: 'sender',
							header$tr$: 'basics.customize.emailServer.groupHeader.senderEmail',
							header:'Sender Email',
							isOpen: true
						},
						{
							gid: 'check',
							header$tr$: 'basics.customize.emailServer.groupHeader.checkConnection',
							header:'Check Connection',
							isOpen: true
						}
					],
					rows: [
						{
							gid: 'general',
							rid: 'serverNameDirective',
							label$tr$: 'basics.customize.emailServer.rowLabel.name',
							label: 'Name',
							type: 'directive',
							model: 'ServerId',
							domain: 'ServerId',
							directive: 'basics-customize-select-with-reset-directive',
							options: {
								items: constructDropdown(serverList),
								valueMember: 'id',
								displayMember: 'description'
							},
							directiveOptions: {
								btnTooltip: $translate.instant('basics.customize.emailServer.button.btnDiscardTooltip')
							}
						},
						{
							gid: 'sender',
							rid: 'senderEmailDirective',
							label$tr$: 'basics.customize.emailServer.rowLabel.senderEmail',
							type: 'directive',
							directive: 'basics-customize-email-with-reset-directive',
							model: 'SenderEmail',
							domain: 'SenderEmail',
							directiveOptions: {
								placeholderText: $translate.instant('basics.customize.emailServer.rowLabel.senderEmailPlaceholder'),
								btnTooltip: $translate.instant('basics.customize.emailServer.button.btnDiscardTooltip')
							}
						},
						{
							gid: 'check',
							rid: 'testConnection2',
							label$tr$: 'basics.customize.emailServer.rowLabel.testConnection',
							type: 'email',
							model: 'ReceiverEmail',
							domain: 'ReceiverEmail',
							placeholder: $translate.instant('basics.customize.emailServer.rowLabel.testConnectionPlaceholder'),
							options:{
								showButton: true,
								buttonFn:testConnection
							}
						}
					]
				};
			}

			function testConnection(entity){
				$scope.isLoading = true;
				$scope.loadingMessage = $translate.instant('basics.customize.emailServer.messages.testOngoing');
				basicsCustomizeEmailServerConfigurationService.testEmailConnection(_.cloneDeep($scope.currentItem)).then(function (result){
					$scope.isLoading = false;
					if(result && result.data){
						if(result.data.Success){
							platformDialogService.showMsgBox('basics.customize.emailServer.messages.testConnectionSuccess', 'basics.customize.emailServer.dialogTitle.testConnection', 'info');
						}else{
							platformDialogService.showMsgBox(result.data.Message, 'basics.customize.emailServer.dialogTitle.testConnection', 'error');
						}
					}
				}, function (){
					$scope.isLoading = false;
				});
			}

			function initializeVars(){
				$scope.gridId = '6f5f452fb031489eb20d317962015605';
				$scope.server2CompanyList = $scope.dialog.modalOptions.value.server2CompanyList;
				$scope.serverList = $scope.dialog.modalOptions.value.emailServerList;
				$scope.isLoading = false;
				$scope.messages = {
					saving: $translate.instant('basics.customize.emailServer.messages.saveOngoing'),
					testingConnection: $translate.instant('basics.customize.emailServer.messages.testOngoing')
				};
				$scope.loadingMessage = '';
				$scope.gridData = {
					state: $scope.gridId
				};
				$scope.hasLocalChangeServer = false;
				$scope.hasLocalChangeSenderEmail = false;

				$scope.currentItem = {
					ServerId: 0,
					SenderEmail: '',
					ReceiverEmail: '',
					inheritedServer: null,
					serverSelectionChanged: function (entity){
						$scope.hasLocalChangeServer = entity.ServerId !== $scope.currentItemBackup.ServerId;
					},
					senderEmailChanged: function (entity){
						$scope.hasLocalChangeSenderEmail = entity.SenderEmail !== $scope.currentItemBackup.SenderEmail;
					}
				};

				$scope.formOptions = {
					configure: getAssignmentFormConfig($scope.dialog.modalOptions.value.emailServerList)
				};

				platformTranslateService.translateFormConfig($scope.formOptions.configure);

				$scope.buttonTexts = {
					saveBtnCaption: $translate.instant('basics.customize.emailServer.button.btnSaveCaption'),
					saveBtnTooltip: $translate.instant('basics.customize.emailServer.button.btnSaveTooltip'),
					discardBtnCaption: $translate.instant('basics.customize.emailServer.button.btnDiscardCaption'),
					discardBtnTooltip: $translate.instant('basics.customize.emailServer.button.btnDiscardTooltip')
				};



				$scope.currentItemBackup = {
					ServerId: 0,
					SenderEmail: null,
					ReceiverEmail: null
				};

				$scope.selectedCompany = null;

			}

			function getServer2CompanyEntryInTree(companyInfo){
				let entryInServer2CompanyTable = _.find($scope.server2CompanyList, function (entity){
					return entity.CompanyFk === companyInfo.id;
				});

				if(entryInServer2CompanyTable){
					return entryInServer2CompanyTable;
				}else if(companyInfo.ParentCompany){
					entryInServer2CompanyTable = getServer2CompanyEntryInTree(companyInfo.ParentCompany);
				}

				return entryInServer2CompanyTable;
			}

			function getServer2CompanyEntry(companyInfo){
				let entryInServer2CompanyTable = _.find($scope.server2CompanyList, function (entity){
					return entity.CompanyFk === companyInfo.id;
				});

				return entryInServer2CompanyTable;
			}

			function getOverloadServerSettings(overloadedEntry){
				let overloadedServer = _.find($scope.serverList, function (server){ return server.Id === overloadedEntry.EmailServerFk;});
				return overloadedServer || null;
			}

			function getInheritedServerSettings(companyInfo, defaultServer){
				if(companyInfo.ParentCompany === null){
					return defaultServer;
				}else{
					let entryInServer2CompanyTableForParents = getServer2CompanyEntryInTree(companyInfo.ParentCompany);
					if(entryInServer2CompanyTableForParents){
						let overloadedServer = _.find($scope.serverList, function (server){ return server.Id === entryInServer2CompanyTableForParents.EmailServerFk;});
						return overloadedServer || defaultServer;
					}else{
						return defaultServer;
					}
				}
			}

			function setCurrentItem(serverId, senderEmail){
				$scope.currentItem.ServerId = serverId;
				$scope.currentItemBackup.ServerId = serverId;
				$scope.currentItem.SenderEmail = senderEmail;
				$scope.currentItemBackup.SenderEmail = senderEmail;
				$scope.hasLocalChangeSenderEmail = false;
				$scope.hasLocalChangeServer = false;
			}

			function isOverloadedEntry(targetRow){
				let currentOverloadEntry = getServer2CompanyEntry(targetRow);
				return !!currentOverloadEntry;
			}

			function proceedRowSelection(selectedRow){
				if(selectedRow){
					$scope.selectedCompany = selectedRow;
					$scope.hasOverloadedData = false;
					let defaultServer = _.find($scope.serverList, function (server){ return server.IsDefault;});
					$scope.currentItem.inheritedServer = getInheritedServerSettings($scope.selectedCompany, defaultServer);
					$scope.currentOverloadEntry = getServer2CompanyEntry($scope.selectedCompany);
					if($scope.currentOverloadEntry){
						let overloadServer = getOverloadServerSettings($scope.currentOverloadEntry);
						let overloadEmail = $scope.currentOverloadEntry.SenderEmail;
						let displayEmail = (overloadEmail ? overloadEmail : ((overloadServer.SenderEmail) ? overloadServer.SenderEmail : defaultServer.SenderEmail));
						let displayServerId = (overloadServer) ? overloadServer.Id : $scope.currentItem.inheritedServer.Id;
						setCurrentItem(displayServerId, displayEmail);
						$scope.hasOverloadedData = true;
					}else{
						setCurrentItem($scope.currentItem.inheritedServer.Id, $scope.currentItem.inheritedServer.SenderEmail);
					}
				}
			}

			function moveToPreviousRow(){
				$scope.moveToPrevious = true;
				$timeout(function (){
					platformGridAPI.rows.selection({gridId: $scope.gridId, rows:[$scope.selectedCompany]});
				}, 200);
			}

			const rowSelected = function (){
				let selectedRow = platformGridAPI.rows.selection({gridId: $scope.gridId});
				if(!$scope.moveToPrevious && ($scope.hasLocalChangeServer || $scope.hasLocalChangeSenderEmail)){
					platformDialogService.showYesNoDialog('basics.customize.emailServer.messages.changePresent', 'basics.customize.emailServer.dialogTitle.changePresent', 'no').then(function (result){
						if(result.no){
							moveToPreviousRow();
						}else{
							proceedRowSelection(selectedRow);
						}
					}, function (){
						moveToPreviousRow();
					});

				}else{
					if(!$scope.moveToPrevious){
						proceedRowSelection(selectedRow);
					}else{
						$scope.moveToPrevious = false;
					}
				}
			};

			$scope.saveClicked = function (){

				let newServerId = $scope.currentItem.ServerId;
				let newEmail = $scope.currentItem.SenderEmail;

				if(newServerId === $scope.currentItem.inheritedServer.Id){
					newServerId = null;
				}

				if(newEmail === $scope.currentItem.inheritedServer.SenderEmail){
					newEmail = null;
				}

				basicsCustomizeEmailServerConfigurationService.assignServer2Company(newServerId, newEmail, $scope.selectedCompany.id).then(function (result){
					basicsCustomizeEmailServerConfigurationService.readEmailServer2CompanyList().then(function (serverToCompanyList){
						$scope.server2CompanyList = serverToCompanyList.data;
						$scope.hasLocalChangeServer = false;
						$scope.hasLocalChangeSenderEmail = false;
						initializeGrid();
						$timeout(function (){
							platformGridAPI.rows.selection({gridId: $scope.gridId, rows:[$scope.selectedCompany]});
							if(result.data){
								platformDialogService.showMsgBox('basics.customize.emailServer.messages.saveSuccess', 'basics.customize.emailServer.dialogTitle.saveSuccess', 'info');
							}
						}, 200);
					});
				});

			};

			$scope.discardLocalChanges = function (){
				if($scope.currentItem.inheritedServer){
					$scope.currentItem.ServerId = $scope.currentItem.inheritedServer.Id;
					$scope.currentItem.SenderEmail = $scope.currentItem.inheritedServer.SenderEmail;
					$scope.currentItem.serverSelectionChanged($scope.currentItem);
					$scope.currentItem.senderEmailChanged($scope.currentItem);
				}
			};

			$scope.isBtnDisabled = function (){
				return !$scope.hasLocalChangeServer && !$scope.hasLocalChangeSenderEmail;
			};

			$scope.isDiscardBtnDisabled = function (){
				return !$scope.hasOverloadedData;
			};

			// company properties
			// { "id": 1, "parentId": null, "companyType": 1, "name": "Gruppe 101", "code": "Z1011", .... }
			$scope.getDisplaytext = function getDisplaytext(node) {
				// var result = '['+node.id+'] '+node.code + (node.name ? ' ' + node.name : '') + '(' + node.companyType + ')';
				return node.code + (node.name ? ' ' + node.name : '');
			};

			/*
			this function returns the ico class for the node, if node is not allowed to login we append '-d' and the
			disabled icon will be taken.
			*/
			$scope.classByType = function classByType(node) {
				if (node) {
					// $log.log('showSelected: ',node);
					var theClass = node.companyType === 1 ? 'ico-comp-businessunit' :
						node.companyType === 2 ? 'ico-comp-root' : 'ico-comp-profitcenter';
					if (!node.canLogin) {
						theClass += '-d';
					}
					return theClass;
				}
				return 'ico-comp-businessunit';
			};



			initializeVars();
			initializeGrid();
			updateTools();

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', rowSelected);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', rowSelected);
			});

		}
	]);
})(angular);