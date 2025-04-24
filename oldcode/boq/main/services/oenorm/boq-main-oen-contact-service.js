(function() {
	/* global globals, _ */
	'use strict';
	var angularModule = angular.module('boq.main');

	angularModule.factory('boqMainOenContactControllerService', ['platformDetailControllerService', 'boqMainOenContactDataService', 'boqMainOenContactUiService', 'boqMainOenService', 'boqMainTranslationService',
		function(platformDetailControllerService, contactDataService, contactUiService, boqMainOenService, boqMainTranslationService) {
			return {
				getInstance: function(scope, boqMainService) {
					scope.setTools = function() {
						scope.$parent.setTools({
							showImages: true,
							showTitles: true,
							cssClass: 'tools',
							items: [
								{
									id: 'createCompany',
									caption: 'boq.main.oen.uicontainer.contact.createCompany',
									type: 'item',
									iconClass: 'tlb-icons ico-add-customer-company',
									disabled: true,
									fn: function() {
										dataService.createContact('company');
									}
								},
								{
									id: 'createPerson',
									caption: 'boq.main.oen.uicontainer.contact.createPerson',
									type: 'item',
									iconClass: 'tlb-icons ico-add-user',
									disabled: true,
									fn: function() {
										dataService.createContact('person');
									}
								},
								{
									id: 'delete',
									caption: 'cloud.common.taskBarDeleteRecord',
									type: 'item',
									iconClass: 'tlb-icons ico-rec-delete',
									disabled: true,
									fn: function() {
										dataService.deleteContact();
									}
								},
								{
									id: 'previous',
									caption: 'platform.formContainer.previous',
									type: 'item',
									iconClass: 'tlb-icons ico-rec-previous',
									fn: function() {
										dataService.goToPrev();
									}
								},
								{
									id: 'next',
									caption: 'platform.formContainer.next',
									type: 'item',
									iconClass: 'tlb-icons ico-rec-next',
									fn: function() {
										dataService.goToNext();
									}
								},
								/* {
									id: 'setting',
									caption$tr$: 'platform.formContainer.settings',
									type: 'item',
									iconClass: 'tlb-icons ico-settings',
									fn: function () {
										scope.$parent.formContainerOptions.formOptions.showConfigDialog();
									}
								} */
								// form configuration is not working
							]
						});
					};

					var dataService = contactDataService.getInstance(scope, boqMainService);
					platformDetailControllerService.initDetailController(scope, dataService, null, contactUiService, boqMainTranslationService);

					boqMainOenService.tryDisableContainer(scope, boqMainService, false);
				}
			};
		}
	]);

	angularModule.factory('boqMainOenContactDataService', ['$http', '$injector', '$timeout', '$translate', 'platformDataServiceFactory', 'platformRuntimeDataService',
		function($http, $injector, $timeout, $translate, platformDataServiceFactory, platformRuntimeDataService) {
			return {
				getInstance: function(scope, boqMainService) {
					const baseUrl = globals.webApiBaseUrl + 'boq/main/oen/contact/';
					var oenLbMetadataDataService = $injector.get('boqMainOenLbMetadataDataService').getInstance(boqMainService);
					var oenLvHeaderDataService   = $injector.get('boqMainOenLvHeaderDataService').  getInstance(boqMainService);
					// TODO: var oenParameterDataService  = $injector.get('boqMainOenParameterDataService'). getInstance(boqMainService);

					function showUi(contact) {
						if (!boqMainService.isOenBoq()) {
							return;
						}

						function disableButtons(contact) {
							if (scope.$parent.tools) {
								const isMetadataContact = getParentService().getServiceName()==='boqMainOenLbMetadataDataService';
								const isCreateDisabled = isMetadataContact ? contact : !_.some(getRemainingLvHeaderContactFks(contact));
								const isDeleteDisabled = service.getList().length<1;

								let uiTools = scope.$parent.tools.items;
								if (_.some(uiTools)) {
									uiTools[uiTools.findIndex(b=>b.id==='createCompany')].disabled = isCreateDisabled || isReadOnly();
									uiTools[uiTools.findIndex(b=>b.id==='createPerson')]. disabled = isCreateDisabled || isReadOnly();
									uiTools[uiTools.findIndex(b=>b.id==='delete')].       disabled = isDeleteDisabled || isReadOnly();
									uiTools[uiTools.findIndex(b=>b.id==='previous')].     disabled = isMetadataContact;
									uiTools[uiTools.findIndex(b=>b.id==='next')].         disabled = isMetadataContact;

									scope.$parent.tools.update();
								}
							}
						}

						var uiGroups = scope.formOptions.configure.groups;
						var groupCompanyIndex       = uiGroups.findIndex(g => g.gid === 'oen.uicontainer.contact.groupCompany');
						var groupContactPersonIndex = uiGroups.findIndex(g => g.gid === 'oen.uicontainer.contact.groupContactPerson');
						var groupPersonIndex        = uiGroups.findIndex(g => g.gid === 'oen.uicontainer.contact.groupPerson');

						scope.context = '';
						if (getParentService()) {
							if (getParentService().getSelected()) {
								scope.getUiAddOns().getWhiteboard().setVisible(false);
							}
							else {
								const parentContainers = [$translate.instant('boq.main.oen.uicontainer.lvHeader.title'), $translate.instant('boq.main.oen.LbMetadata')].join(', ');
								scope.getUiAddOns().getWhiteboard().showInfo($translate.instant('boq.main.selectOenContactParent') + ' ' + parentContainers);
							}

							scope.context = $translate.instant('cloud.common.languageSubTitlePrefix')+': ';
							if (getParentService().getServiceName() === 'boqMainOenLbMetadataDataService') {
								scope.context += $translate.instant('boq.main.oen.LbMetadata');
							}
							else {
								scope.context += $translate.instant('boq.main.oen.uicontainer.lvHeader.title');
								if (contact) {
									scope.context += ' - ' + $translate.instant('boq.main.oen.uicontainer.contact.lvHeaderContext') + ': ';
									if      (contact.OenLvHeaderClientFk)   { scope.context += $translate.instant('boq.main.oen.uicontainer.contact.lvHeaderContextClient'); }
									else if (contact.OenLvHeaderProcUnitFk) { scope.context += $translate.instant('boq.main.oen.uicontainer.contact.lvHeaderContextProcUnit'); }
									else if (contact.OenLvHeaderCreatorFk)  { scope.context += $translate.instant('boq.main.oen.uicontainer.contact.lvHeaderContextCreator'); }
									else if (contact.OenLvHeaderBidderFk)   { scope.context += $translate.instant('boq.main.oen.uicontainer.contact.lvHeaderContextBidder'); }
								}
							}
						}

						if (!contact) {
							disableButtons();
							uiGroups[groupCompanyIndex].      visible = false;
							uiGroups[groupContactPersonIndex].visible = false;
							uiGroups[groupPersonIndex].       visible = false;
						}
						else if (contact.OenPerson) {
							disableButtons(contact);
							uiGroups[groupCompanyIndex].      visible = false;
							uiGroups[groupContactPersonIndex].visible = false;
							uiGroups[groupPersonIndex].       visible = true;
						}
						else if (contact.OenCompany) {
							disableButtons(contact);
							uiGroups[groupCompanyIndex].      visible = true;
							uiGroups[groupContactPersonIndex].visible = true;
							uiGroups[groupPersonIndex].       visible = false;
						}

						scope.$broadcast('form-config-updated');
					}

					var serviceOption = {
						flatLeafItem: {
							module: 'boq.main',
							serviceName: 'boqMainOenContactDataService',
							entityRole: {leaf: {itemName: 'OenContact', parentService: oenLvHeaderDataService, doesRequireLoadAlways: true}},
							httpRead: {
								route: baseUrl, endRead: 'list',
								initReadData: function(readData) {
									var filter;
									switch (getParentService().getServiceName()) {
										case 'boqMainOenLbMetadataDataService': filter = '?lbMetadataId='; break;
										case 'boqMainOenLvHeaderDataService':   filter = '?lvHeaderId=';   break;
									}
									readData.filter = filter + getParentService().getSelected().Id;
								}
							}
						}
					};
					var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
					var service = serviceContainer.service;

					function isReadOnly() {
						return !boqMainService.isWicBoq() && getParentService().getServiceName()==='boqMainOenLbMetadataDataService';
					}

					function getRemainingLvHeaderContactFks() {
						var contactFks = ['OenLvHeaderBidderFk','OenLvHeaderClientFk','OenLvHeaderProcUnitFk','OenLvHeaderCreatorFk'];
						_.forEach(_.clone(contactFks), function(contactFk) {
							_.forEach(service.getList(), function(contact) {
								if (contact[contactFk] !== null) {
									_.remove(contactFks, function(fk) { return fk===contactFk; });
								}
							});
						});

						return contactFks;
					}

					function getParentService() {
						return serviceContainer.data.parentService;
					}

					function setParentService(parentService) {
						serviceContainer.data.parentService = serviceOption.flatLeafItem.entityRole.leaf.parentService = parentService;
						if (!parentService.getChildServices().includes(service)) {
							parentService.registerChildService(service);
						}

						/* To be enabled together with 'boqMainOenParameterDataService' as parent service
						service.unloadSubEntities(); // Force unload of own entities to reset data if the following loading call yields no data
						if (!skip) {
							parentService.loadSubItemList(true);
						} */
					}

					service.registerListLoaded(function () {
						if (_.some(service.getList())) {
							service.setSelected(service.getList()[0]);
						}

						// Only in a WIC BOQ the fields are editable
						if (isReadOnly()) {
							_.forEach(service.getList(), function(contact) {
								platformRuntimeDataService.readonly(contact, true);
							});
						}
					});

					service.createContact = function(type) {
						var url = baseUrl+'create' + '?isCompany='+(type==='company') + '&';
						switch (getParentService().getServiceName()) {
							case 'boqMainOenLbMetadataDataService': url += 'lbMetadataId'; break;
							case 'boqMainOenLvHeaderDataService':   url += _.replace(getRemainingLvHeaderContactFks()[0], 'OenLvHeader', 'lvHeader'); break;
						}
						url += '=' + getParentService().getSelected().Id;

						return $http.post(url).then(function(response) {
							$timeout(function() {
								showUi(response.data);
							});
							return serviceContainer.data.onCreateSucceeded(response.data, serviceContainer.data);
						});
					};

					service.deleteContact = function () {
						showUi();
						service.deleteSelection();
					};

					function onThisSelectionChanged() {
						showUi(service.getSelected());
					}
					function onParentSelectionChanged(_e, selectedItem) {
						if (selectedItem) {
							setParentService('IsWithPriceShares' in selectedItem ? oenLvHeaderDataService : oenLbMetadataDataService);
						}
						showUi();
					}
					function onContainerFocusChanged(parentService) {
						setParentService(parentService);
					}
					service.                 registerSelectionChanged(onThisSelectionChanged);
					oenLbMetadataDataService.registerSelectionChanged(onParentSelectionChanged);
					oenLvHeaderDataService.  registerSelectionChanged(onParentSelectionChanged);
					oenLvHeaderDataService.  containerFocusChanged.register(onContainerFocusChanged);
					oenLbMetadataDataService.containerFocusChanged.register(onContainerFocusChanged);

					if (scope) {
						scope.$on('$destroy', function() {
							service.                 unregisterSelectionChanged(onThisSelectionChanged);
							oenLbMetadataDataService.unregisterSelectionChanged(onParentSelectionChanged);
							oenLvHeaderDataService.  unregisterSelectionChanged(onParentSelectionChanged);
							oenLvHeaderDataService.  containerFocusChanged.unregister(onContainerFocusChanged);
							oenLbMetadataDataService.containerFocusChanged.unregister(onContainerFocusChanged);
						});
					}

					return service;
				}
			};
		}
	]);

	angularModule.factory('boqMainOenContactUiService', ['$translate', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'platformSchemaService', 'boqMainTranslationService', 'boqMainOenTranslationService', 'basicsLookupdataConfigGenerator',
		function($translate, platformUIStandardConfigService, platformUIStandardExtentService, platformSchemaService, boqMainTranslationService, boqMainOenTranslationService, basicsLookupdataConfigGenerator) {
			const gidPrefix = 'oen.uicontainer.contact.';
			const gids = [gidPrefix + 'groupCompany', gidPrefix + 'groupContactPerson', gidPrefix + 'groupPerson'];

			var layout = {
				fid: 'boq.main.oen.contact',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [],
				addition: {detail: []},
			};

			function addRow(gid, route, dto, property) {
				if (route) {
					route += '.';
				}
				var model = route + dto + '.' + property;

				var detail = {
					'gid': gidPrefix + gid,
					'rid': model,
					'model': model,
					'label': $translate.instant('boq.main.oen.dto.' + dto + 'Dto.' + property),
					'type': 'description'
				};
				if (property === 'CountryFk') {
					var detailExtension = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.country');
					detail.type      = detailExtension.detail.type;
					detail.directive = detailExtension.detail.directive;
					detail.options   = detailExtension.detail.options;
				}

				layout.addition.detail.push(detail);
			}

			addRow('groupPerson', '',                           'OenPerson',        'FamilyName');
			addRow('groupPerson', '',                           'OenPerson',        'FirstName');
			addRow('groupPerson', 'OenPerson',                  'OenCommunication', 'Phone');
			addRow('groupPerson', 'OenPerson',                  'OenCommunication', 'Email');
			addRow('groupPerson', 'OenPerson',                  'OenCommunication', 'Fax');
			addRow('groupPerson', 'OenPerson',                  'OenCommunication', 'Url');
			addRow('groupPerson', 'OenPerson',                  'OenCommunication', 'AdditionalInfo');
			addRow('groupPerson', 'OenPerson.OenCommunication', 'OenAddress',       'Street');
			addRow('groupPerson', 'OenPerson.OenCommunication', 'OenAddress',       'City');
			addRow('groupPerson', 'OenPerson.OenCommunication', 'OenAddress',       'ZipCode');
			addRow('groupPerson', 'OenPerson.OenCommunication', 'OenAddress',       'CountryFk');

			addRow('groupCompany',       '',                                      'OenCompany',       'Name');
			addRow('groupCompany',       'OenCompany',                            'OenCommunication', 'Phone');
			addRow('groupCompany',       'OenCompany',                            'OenCommunication', 'Email');
			addRow('groupCompany',       'OenCompany',                            'OenCommunication', 'Fax');
			addRow('groupCompany',       'OenCompany',                            'OenCommunication', 'Url');
			addRow('groupCompany',       'OenCompany',                            'OenCommunication', 'Email');
			addRow('groupCompany',       'OenCompany',                            'OenCommunication', 'AdditionalInfo');
			addRow('groupCompany',       'OenCompany.OenCommunication',           'OenAddress',       'Street');
			addRow('groupCompany',       'OenCompany.OenCommunication',           'OenAddress',       'City');
			addRow('groupCompany',       'OenCompany.OenCommunication',           'OenAddress',       'ZipCode');
			addRow('groupCompany',       'OenCompany.OenCommunication',           'OenAddress',       'CountryFk');
			addRow('groupContactPerson', 'OenCompany',                            'OenPerson',        'FirstName');
			addRow('groupContactPerson', 'OenCompany',                            'OenPerson',        'FamilyName');
			addRow('groupContactPerson', 'OenCompany.OenPerson',                  'OenCommunication', 'Phone');
			addRow('groupContactPerson', 'OenCompany.OenPerson',                  'OenCommunication', 'Email');
			addRow('groupContactPerson', 'OenCompany.OenPerson',                  'OenCommunication', 'Fax');
			addRow('groupContactPerson', 'OenCompany.OenPerson',                  'OenCommunication', 'Url');
			addRow('groupContactPerson', 'OenCompany.OenPerson',                  'OenCommunication', 'Email');
			addRow('groupContactPerson', 'OenCompany.OenPerson',                  'OenCommunication', 'AdditionalInfo');
			addRow('groupContactPerson', 'OenCompany.OenPerson.OenCommunication', 'OenAddress',       'Street');
			addRow('groupContactPerson', 'OenCompany.OenPerson.OenCommunication', 'OenAddress',       'City');
			addRow('groupContactPerson', 'OenCompany.OenPerson.OenCommunication', 'OenAddress',       'ZipCode');
			addRow('groupContactPerson', 'OenCompany.OenPerson.OenCommunication', 'OenAddress',       'CountryFk');

			_.forEach(gids, function (gid) {
				layout.groups.push({'gid': gid});
			});

			/*
			// Handle overloads
			function setMaxLength(length) {
				return {
					'detail': {
						'maxLength': length
					}
				};
			}
			// Todo BH: DOT notation of the properties currently not working when setting up 'overloads'
			layout.overloads = {
				'oenperson.firstname': setMaxLength(60),
				'oenperson.familyname': setMaxLength(60),
				'oencompany.oenperson.firstname': setMaxLength(60),
				'oencompany.oenperson.familyname': setMaxLength(60)
			};
			*/
			var schema = platformSchemaService.getSchemaFromCache({moduleSubModule: 'Boq.Main', typeName: 'OenContactDto'});
			boqMainOenTranslationService.register(schema, gids);

			var service = new platformUIStandardConfigService(layout, schema.properties, boqMainTranslationService);
			platformUIStandardExtentService.extend(service, layout.addition, schema.properties);

			return service;
		}
	]);
})();

