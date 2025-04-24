/**
 * Created by sandu on 31.03.2015.
 */
(function (angular) {
	'use strict';


	var moduleName = 'basics.config';
	var mod = new angular.module(moduleName);

	/* define visibility selection values */
	mod.value('basicsConfigVisibilityValues', [
		{Id: 1, description$tr$: 'basics.config.visibilityProperty.standardOnly'},
		{Id: 2, description$tr$: 'basics.config.visibilityProperty.portalOnly'},
		{Id: 3, description$tr$: 'basics.config.visibilityProperty.standardPortal'}
	]);

	/* define visibility selection options */
	var visibilitySelectOptions = {
		displayMember: 'description',
		valueMember: 'Id',
		items: 'basicsConfigVisibilityValues'
	};
	mod.value('basicsConfigVisibilitySelectOptions', visibilitySelectOptions);


	mod.value('basicsConfigModuleDetailLayout', {
		fid: 'basics.config.modular.detailform',
		version: '1.0.0',
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['ishome', 'descriptioninfo', 'internalname', 'sorting', 'sortorderpath', 'logfiletablename', 'maxpagesize']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		'overloads': {
			'internalname': {
				'readonly': true
			},
			'logfiletablename': {
				'readonly': false
			},
			'sortorderpath': {
				'readonly': true
			},
			'descriptioninfo': {
				'readonly': true
			},
			'ishome': {
				'readonly': true
			}
		},
		'translationInfos': {
			'extraModules': ['basics.config'],
			'extraWords': {
				'DisplayName': {
					location: 'basics.config',
					identifier: 'entityDisplayName',
					initial: 'Display Name'
				},
				'InternalName': {
					location: 'basics.config',
					identifier: 'entityInternalName',
					initial: 'Internal Name'
				},
				'ModuleName': {location: 'basics.config', identifier: 'entityModuleName', initial: 'Module Name'},
				'IsActive': {location: 'basics.config', identifier: 'entityIsActive', initial: 'Is Active'},
				'Sorting': {location: 'basics.config', identifier: 'tabSorting', initial: 'Sort Order'},
				'MaxPageSize': {location: 'basics.config', identifier: 'entityMaxPageSize', initial: 'Max Page Size'},
				'SortOrderPath': {
					location: 'basics.config',
					identifier: 'moduleSortOrderPath',
					initial: 'Sort Order Path'
				},
				'LogFileTableName': {
					location: 'basics.config',
					identifier: 'moduleLogFileTableName',
					initial: 'Log File Table Name'
				},
				'IsHome': {location: 'basics.config', identifier: 'isHome', initial: 'Is Home'},
				'NavbarEnabled': {location: 'basics.config', identifier: 'navbarEnabled', initial: 'Navbar Enabled'},
				'CombarEnabled': {
					location: 'basics.config',
					identifier: 'combarEnabled',
					initial: 'Commandbar Enabled'
				},
				'NavbarPortalEnabled': {
					location: 'basics.config',
					identifier: 'navbarPortalEnabled',
					initial: 'Navbar Portal Enabled'
				},
				'CombarPortalEnabled': {
					location: 'basics.config',
					identifier: 'combarPortalEnabled',
					initial: 'Commandbar Portal Enabled'
				}
			}
		}

	});

	mod.value('basicsConfigTabDetailLayout', {
		fid: 'basics.config.tab.detailform',
		version: '1.0.0',
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['descriptioninfo', 'sorting', 'isvisible', 'visibility', 'accessrightdescriptor']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		'translationInfos': {
			'extraModules': ['basics.config'],
			'extraWords': {
				'Sorting': {location: 'basics.config', identifier: 'tabSorting', initial: 'Sort Order'},
				'Visibility': {location: 'basics.config', identifier: 'tabVisibility', initial: 'Portal Visibility'},
				'AccessRightDescriptor': {
					location: 'basics.config',
					identifier: 'descriptor',
					initial: 'Access Right Descriptor Name'
				}
			}
		},
		'overloads': {
			'accessrightdescriptor': {readonly: true},
			'visibility': {
				grid: {editorOptions: visibilitySelectOptions, width: 190},
				detail: {options: visibilitySelectOptions}
			}
		}
	});

	mod.value('basicsConfigMcTwoQnADetailLayout', {
		fid: 'basics.config.mctwoqna.detailform',
		version: '1.0.0',
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['question', 'answer', 'sorting', 'islive']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		'translationInfos': {
			'extraModules': ['basics.config'],
			'extraWords': {
				'Question': {location: 'basics.config', identifier: 'question', initial: 'Question'},
				'Answer': {location: 'basics.config', identifier: 'answer', initial: 'Answer'},
				'Sorting': {location: 'basics.config', identifier: 'tabSorting', initial: 'Sort Order'},
				'IsLive': {location: 'basics.config', identifier: 'islive', initial: 'Is Live'}
			}
		}
	});

	mod.value('basicsConfigReportGroupDetailLayout', {
		fid: 'basics.config.reportgroup.detailform',
		version: '1.0.0',
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['descriptioninfo', 'icon', 'sorting', 'isvisible', 'accessrightdescriptor']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		'translationInfos': {
			'extraModules': ['basics.config'],
			'extraWords': {
				'Sorting': {location: 'basics.config', identifier: 'tabSorting', initial: 'Sort Order'},
				'Isvisible': {location: 'basics.config', identifier: 'entityIsVisible', initial: 'Is Visible'},
				'Icon': {location: 'basics.config', identifier: 'entityIcon', initial: 'Icon'},
				'AccessRightDescriptor': {
					location: 'basics.config',
					identifier: 'descriptor',
					initial: 'Access Right Descriptor Name'
				}
			}
		},
		'overloads': {
			'icon': {
				'grid': {
					editor: 'imageselect',
					editorOptions: {serviceName: 'basicsConfigReportGroupIconService'},
					formatter: 'imageselect',
					formatterOptions: {serviceName: 'basicsConfigReportGroupIconService'}

				}
			},
			'accessrightdescriptor': {readonly: true}
		}
	});

	mod.value('basicsConfigReportXGroupDetailLayout', {
		fid: 'basics.config.reportXgroup.detailform',
		version: '1.0.0',
		addValidationAutomatically: true,
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['reportfk', 'accessrightdescriptor', 'sorting', 'isvisible', 'visibility']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		'translationInfos': {
			'extraModules': ['basics.config'],
			'extraWords': {
				'ReportFk': {location: 'basics.config', identifier: 'entityReportFK', initial: 'Report'},
				'Sorting': {location: 'basics.config', identifier: 'tabSorting', initial: 'Sort Order'},
				'IsVisible': {location: 'basics.config', identifier: 'entityIsVisible', initial: 'Is Visible'},
				'Visibility': {location: 'basics.config', identifier: 'tabVisibility', initial: 'Portal Visibility'},
				'AccessRightDescriptor': {
					location: 'basics.config',
					identifier: 'descriptor',
					initial: 'Access Right Descriptor Name'
				}
			}
		},
		'overloads': {
			'reportfk': {
				/* detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-reporting-report-dialog',
						descriptionMember: 'Name.Description',
						lookupOptions: {
							showClearButton: true
						}
					}
				}, */
				grid: {
					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						lookupDirective: 'basics-reporting-report-dialog',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Name.Translated'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Report',
						displayMember: 'Name.Translated'
					}
				}
			},
			'accessrightdescriptor': {readonly: true},
			'visibility': {
				grid: {editorOptions: visibilitySelectOptions, width: 190},
				detail: {options: visibilitySelectOptions}
			}
		}
	});

	mod.value('basicsConfigAdditionalWordsForGenericWizard', {
		translationInfos: {
			extraModules: ['cloud.common', 'basics.customize'],
			extraWords: {
				Comment: {location: 'cloud.common', identifier: 'entityComment', initial: 'Comment'},
				CommentInfo: {location: 'cloud.common', identifier: 'entityComment', initial: 'Comment'},
				Name: {location: 'cloud.common', identifier: 'entityName', initial: 'Name'},
				Description: {location: 'cloud.common', identifier: 'entityDescription', initial: 'Description'},
				Value: {location: 'cloud.common', identifier: 'entityParameterValue', initial: 'Value'},
				ModuleFk: {location: 'basics.config', identifier: 'module', initial: 'Module'},
				Wizard2GroupFk: {
					location: 'basics.config',
					identifier: 'wizard2group',
					initial: 'Wizardgruppen-Zuordnung'
				},
				Remark: {location: 'cloud.common', identifier: 'entityRemark', initial: 'Remark'},
				GenericWizardInstanceFk: {
					location: 'basics.config',
					identifier: 'genericWizardInstance',
					initial: 'Generic Wizard Instance'
				},
				DisplayDomainFk: {location: 'basics.config', identifier: 'displayDomain', initial: 'Display Domain'},
				Title: {location: 'basics.config', identifier: 'entityTitle', initial: 'Title'},
				TitleInfo: {location: 'basics.config', identifier: 'entityTitle', initial: 'Title'},
				TextHeader: {location: 'basics.config', identifier: 'textHeader', initial: 'Header Text'},
				TextFooter: {location: 'basics.config', identifier: 'textFooter', initial: 'Footer Text'},
				GenericWizardStepTypeFk: {
					location: 'basics.customize',
					identifier: 'genericwizardsteptype',
					initial: 'Generic Wizard Step Type'
				},
				GenericWizardStepFk: {
					location: 'basics.config',
					identifier: 'genericWizardStep',
					initial: 'Wizard Step'
				},
				AutoSave: {location: 'basics.config', identifier: 'autoSave', initial: 'Automatic Save'},
				GenericWizardScriptTypeFk: {
					location: 'basics.customize',
					identifier: 'genericwizardscripttype',
					initial: 'Generic Wizard Script Type'
				},
				GenericWizardContainerFk: {
					location: 'basics.config',
					identifier: 'genericWizardContainer',
					initial: 'Container'
				},
				GenericWizardContainerPropertyFk: {
					location: 'basics.config',
					identifier: 'genericWizardContainerProperty',
					initial: 'Property'
				},
				ScriptAction: {location: 'basics.config', identifier: 'scriptAction', initial: 'Script Action'},
				CanInsert: {location: 'basics.config', identifier: 'canInsert', initial: 'Can Insert'},
				IsGrid: {location: 'basics.config', identifier: 'isGrid', initial: 'Is Grid'},
				Label: {location: 'basics.config', identifier: 'label', initial: 'Label'},
				LabelInfo: {location: 'basics.config', identifier: 'label', initial: 'Label'},
				ToolTip: {location: 'basics.config', identifier: 'toolTip', initial: 'toolTip'},
				ToolTipInfo: {location: 'basics.config', identifier: 'toolTip', initial: 'toolTip'},
				PropertyId: {location: 'basics.config', identifier: 'propertyId', initial: 'Property Id'},
				IsReadOnly: {location: 'basics.config', identifier: 'isReadOnly', initial: 'Is Read-Only'},
				Width: {location: 'basics.config', identifier: 'width', initial: 'Width'},
				IsPinned: {location: 'basics.config', identifier: 'isPinned', initial: 'Is Pinned'},
				ContainerUuid: {location: 'basics.config', identifier: 'containerUuid', initial: 'Container'},
				FilearchivedocFk: {
					location: 'basics.config',
					identifier: 'filearchivedocFk',
					initial: 'Custom Template File'
				},
				WizardConfiGuuid: {location: 'basics.config', identifier: 'wizardConfiGuuid'},
				IsHidden: {location: 'basics.config', identifier: 'isHidden', initial: 'Hide'},
				Pattern: {location: 'basics.config', identifier: 'pattern', initial: 'Pattern'},
				NamingType: {location: 'basics.config', identifier: 'namingType', initial: 'Naming Type'}
			}
		}
	});

	mod.value('basicsConfigAuditContainerLayout', {
		fid: 'basics.config.auditcontainer.layout',
		version: '1.0.0',
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['id', 'descriptioninfo', 'checked']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		'overloads': {
			// 	'containeruuid': {
			// 		'detail': {
			// 			'type': 'directive',
			// 			'directive': 'basics-config-audit-container-combobox',
			// 			'options': {
			// 				'eagerLoad': true,
			// 				'events': [
			// 					{
			// 						name: 'onSelectedItemChanged', //register event and event handler here.
			// 						handler: function (e, args) { // jshint ignore:line
			// 							// console.log(args.selectedItem);
			// 						}
			// 					}
			// 				]
			// 			}
			// 		},
			// 		'grid': {
			// 			editor: 'lookup',
			// 			editorOptions: {
			// 				lookupDirective: 'basics-config-audit-container-combobox',
			// 				'lookupOptions': {
			// 					'showClearButton': true
			// 					// 'disableDataCaching': true
			// 				}
			// 			},
			// 			formatter: 'lookup',
			// 			formatterOptions: {
			// 				lookupType: 'basicsConfigAuditContainerLookup',
			// 				displayMember: 'DescriptionInfo.Description'
			// 			}
			// 		}
			// 	}
			'id': {readonly: true},
			'descriptioninfo': {readonly: true}
		},
		'translationInfos': {
			'extraModules': ['basics.config'],
			'extraWords': {}
		}

	});

	mod.value('basicsConfigAuditColumnLayout', {
		fid: 'basics.config.auditcolum.layout',
		version: '1.0.0',
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['id', 'columnname', 'isenabletracking']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		'overloads': {
			'id': {readonly: true},
			'columnname': {readonly: true}
		},
		'translationInfos': {
			extraModules: [],
			extraWords: {
				Columnname: {'location': moduleName, identifier: 'entityColumnname', initial: 'Fieldname'},
				Isenabletracking: {'location': moduleName, identifier: 'entityIsenabletracking', initial: 'Track'}
			}
		}

	});

	mod.value('basicsConfigModuleViewsLayout', {
		fid: 'basics.config.moduleviews.layout',
		version: '1.0.0',
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['id', 'tabname', 'rolename', 'lastviews', 'pendingresetcount', 'alllastviews', 'viewname', 'issystem', 'isdefault', 'isportal']
			},
			{
				gid: 'entityHistory',
				isHistory: false
			}
		],
		'overloads': {
			'id': {
				readonly: true,
				'grid': {
					exclude: true
				},
			},
			'tabname': {readonly: true},
			'rolename': {readonly: true},
			'lastviews': {readonly: true},
			'pendingresetcount': {readonly: true},
			'alllastviews': {readonly: true},
			'viewname': {readonly: true},
			'issystem': {readonly: true},
			'isdefault': {readonly: true},
			'isportal': {readonly: true}
		},
		'translationInfos': {
			extraModules: ['basics.config'],
			extraWords: {
				Id: {'location': moduleName, identifier: 'moduleViews.columnViewId', initial: 'View ID'},
				Tabname: {'location': moduleName, identifier: 'moduleViews.columnTabName', initial: 'Tab Name'},
				Rolename: {'location': moduleName, identifier: 'moduleViews.columnRoleName', initial: 'Role Name'},
				Lastviews: {
					'location': moduleName,
					identifier: 'moduleViews.columnLastViews',
					initial: 'Last Views'
				},
				Pendingresetcount: {
					'location': moduleName,
					identifier: 'moduleViews.columnPendingResetCount',
					initial: 'Pending Reset Views Count'
				},
				Alllastviews: {
					'location': moduleName,
					identifier: 'moduleViews.columnAllViews',
					initial: 'All Views'
				},
				Viewname: {'location': moduleName, identifier: 'moduleViews.columnViewName', initial: 'View Name'},
				Issystem: {'location': moduleName, identifier: 'moduleViews.columnISSYSTEM', initial: 'Is SYSTEM View'},
				Isdefault: {
					'location': moduleName,
					identifier: 'moduleViews.columnISDEFAULT',
					initial: 'Is DEFAULT View'
				},
				Isportal: {'location': moduleName, identifier: 'moduleViews.columnISPORTAL', initial: 'Is PORTAL View'}
			}
		}

	});

	mod.value('basicsConfigDataConfigurationColumnLayout', {
		fid: 'basics.config.data.configuration.layout',
		version: '1.0.0',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['tablename', 'isnewwizardactive', 'accessrolefk', 'modulecolumninfo.columnname', 'isaddmandatoryactive', 'modulecolumninfo.mandatorycolumnname', 'modulecolumninfo.readonlycolumnname', 'isaddreadonlyactive']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		// overloads: {},
		translationInfos: {
			extraModules: ['basics.audittrail'],
			extraWords: {
				TableName: {'location': 'basics.audittrail', identifier: 'entityUiTableName', initial: 'Table Name'},
				AccessRoleFk: {'location': moduleName, identifier: 'moduleViews.columnRoleName', initial: 'Role Name'},
				IsNewWizardActive: {
					'location': moduleName,
					identifier: 'entityIsNewWizardActive',
					initial: 'Is New Wizard Active'
				},
				IsAddMandatoryActive: {
					'location': moduleName,
					identifier: 'entityIsAddMandatoryActive',
					initial: 'Is Add Mandatory Active'
				},
				'ModuleColumnInfo.ColumnName': {
					'location': moduleName,
					identifier: 'entityColumnNames',
					initial: 'Wizard Data Fields'
				},
				IsAddReadOnlyActive: {
					'location': moduleName,
					identifier: 'entityIsAddReadOnlyActive',
					initial: 'Is Add Read Only Active'
				},
				'ModuleColumnInfo.MandatoryColumnName': {
					'location': moduleName,
					identifier: 'entityMandatoryColumnNames',
					initial: 'Mandatory Data Fields'
				},
				'ModuleColumnInfo.ReadOnlyColumnName': {
					'location': moduleName,
					identifier: 'entityReadOnlyColumnNameNames',
					initial: 'Read Only Data Fields'
				},
			}
		}
	});


	mod.value('basicsConfigDataConfigurationDialogColumnLayout', {
		fid: 'basics.config.data.configuration.dialog.layout',
		version: '1.0.0',
		showGrouping: true,
		groups: [
			{
				gid: 'basicData',
				attributes: ['columnname', 'showinwizard', 'sorting', 'ismandatory', 'isreadonly']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		// overloads: {},
		translationInfos: {
			extraModules: [],
			extraWords: {
				ColumnName: {'location': moduleName, identifier: 'entityColumnName', initial: 'Column Name'},
				ShowInWizard: {'location': moduleName, identifier: 'entityShowInWizard', initial: 'Show In Wizard'},
				IsMandatory: {'location': moduleName, identifier: 'entityIsMandatory', initial: 'Is Mandatory'},
				IsReadOnly: {'location': moduleName, identifier: 'entityIsReadOnly', initial: 'Read Only'}
			}
		}
	});

	mod.factory('basicsConfigNavbarLayout', basicsConfigNavbarLayout);
	basicsConfigNavbarLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function basicsConfigNavbarLayout(basicsLookupdataConfigGenerator) {
		return {
			fid: 'basics.config.navbar.form',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['basbaritemfk', 'sorting', 'visibility', 'ismenueitem']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				basbaritemfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsConfigBarItemsLookupService',
					enableCache: true,
					readonly: true
					//translate: true
				}),
			},
			'translationInfos': {
				'extraModules': ['basics.config'],
				'extraWords': {
					'BasBarItemFk': {location: 'basics.config', identifier: 'barItemFk', initial: 'Item Name'},
					'Sorting': {location: 'basics.config', identifier: 'tabSorting', initial: 'Sort Order'},
					'Visibility': {location: 'basics.config', identifier: 'barvisibility', initial: 'Visibility'},
					'IsMenueItem': {location: 'basics.config', identifier: 'isMenueItem', initial: 'Is Menue Item'}
				}
			}
		};
	}

	mod.factory('basicsConfigCommandbarLayout', basicsConfigCommandbarLayout);
	basicsConfigCommandbarLayout.$inject = ['basicsLookupdataConfigGenerator'];

	function basicsConfigCommandbarLayout(basicsLookupdataConfigGenerator) {
		return {
			fid: 'basics.config.commandbar.form',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['basbaritemfk', 'sorting', 'visibility']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				basbaritemfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsConfigBarItemsLookupService',
					enableCache: true,
					readonly: true
					//translate: true
				}),
			},
			'translationInfos': {
				'extraModules': ['basics.config'],
				'extraWords': {
					'BasBarItemFk': {location: 'basics.config', identifier: 'barItemFk', initial: 'Item Name'},
					'Sorting': {location: 'basics.config', identifier: 'tabSorting', initial: 'Sort Order'},
					'Visibility': {location: 'basics.config', identifier: 'barvisibility', initial: 'Visibility'}
				}
			}
		};
	}

})(angular);
