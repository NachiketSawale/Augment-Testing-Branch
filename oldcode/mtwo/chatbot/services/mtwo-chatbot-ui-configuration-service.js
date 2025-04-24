/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).factory('mtwoChatBotUIConfigurationService', ['_',
		function (_) {
			var service = {};

			service.getConfigurationListLayout = function () {
				return {
					'fid': 'mtwo.chatbot',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['luismodelid','languageid']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'luismodelid': {  //
							'detail': {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookup-data-by-custom-data-service',
									descriptionMember: 'Name',
									lookupOptions: {
										lookupType: 'nlpDataServiceTwo',
										dataServiceName: 'nlpDataServiceTwo',
										valueMember: 'Id',
										displayMember: 'Name',
										lookupModuleQualifier: 'nlpDataServiceTwo',
										disableDataCaching: true,
										columns: [
											{
												field: 'Name',
												formatter: 'description',
												id: 'Name',
												name: 'Name',
												name$tr$: 'mtwo.chatbot.entityChatbotConfigurationNlpName',
												readonly: true
											},
											{
												field: 'Culture',
												formatter: 'description',
												id: 'Culture',
												name: 'Culture',
												name$tr$: 'mtwo.chatbot.entityChatbotConfigurationNlpCulture',
												readonly: true
											}
										],
										isClientSearch: true,
										isTextEditable: false,
										isColumnFilters: true,
										events: [{
											name: 'onSelectedItemChanged',
											handler: function onSelectedItemChangedHandler(e, args) {
												var culture = _.get(args, 'selectedItem.Culture');
												args.entity.Culture = culture;
												args.entity.Activeversion = _.get(args, 'selectedItem.ActiveVersion');
											}
										}],

									}
								}
							},
							'grid': {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'mtwo-chatbot-configuration-dialog',
									lookupOptions: {
										displayMember: 'Name',
										lookupModuleQualifier: 'mtwoChatbotConfigurationViewLookupDataHandler',
										lookupType: 'MtwoChatbotConfigurationView',
										valueMember: 'Id',
										enableCache: false,
										isClientSearch: true,
										isTextEditable: false,
										isColumnFilters: true,
										addGridColumns: [{
											id: 'culture',
											field: 'Culture',
											name: 'Culture',
											width: 200,
											formatter: 'description',
											name$tr$: 'mtwo.chatbot.entityChatbotConfigurationNlpCulture'
										},
										{
											id: 'activeversion',
											field: 'ActiveVersion',
											name: 'ActiveVersion',
											width: 200,
											formatter: 'description',
											name$tr$: 'mtwo.chatbot.entityChatbotConfigurationNlpActiveVersion'
										}
										],
										additionalColumns: true,
										events: [{
											name: 'onSelectedItemChanged',
											handler: function onSelectedItemChangedHandler(e, args) {
												var culture = _.get(args, 'selectedItem.Culture');
												args.entity.Culture = culture;
												args.entity.Activeversion = _.get(args, 'selectedItem.ActiveVersion');
											}
										}]
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MtwoChatbotConfigurationView',
									displayMember: 'Name',
									dataServiceName: 'nlpDataServiceTwo',
								},
								bulkSupport: false
							}
						},
						'languageid': {
							readonly: true,
							'detail': {
								'type': 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookup-data-by-custom-data-service',
									descriptionMember: 'Cultrue'
								},
								'lookupOptions': {
									columns: [
										{
											field: 'Name',
											formatter: 'description',
											id: 'Name',
											name: 'Name',
											name$tr$: 'cloud.common.entityNlpModelName',
											readonly: true
										},
										{
											field: 'Culture',
											formatter: 'description',
											id: 'culture',
											name: 'Culture',
											name$tr$: 'cloud.common.entityNlpCultrue',
											readonly: true
										}
									],
									dataServiceName: 'nlpDataService',
									descriptionMember: 'Culture',
									disableDataCaching: true,
									displayMember: 'NlpModelName',
									lookupModuleQualifier: 'nlpDataService',
									lookupType: 'nlpDataService',
									navigator: false,
									// uuid: 'f4341c6fa21b412587468fd0c14ca8ab'
									valueMember: 'Id',
									enableCache: false,
									isClientSearch: true,
									isTextEditable: false
								}
							},
							'grid': {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'mtwo-chatbot-wf2intent-language-dialog',
									lookupOptions: {
										displayMember: 'Description',
										lookupModuleQualifier: 'mtwoChatbotWf2intentViewLanguageLookupDataHandler',
										lookupType: 'MtwoChatbotWf2intentLanguageView',
										valueMember: 'Id',
										enableCache: false,
										isClientSearch: true,
										isTextEditable: false,
										additionalColumns: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MtwoChatbotWf2intentLanguageView',
									displayMember: 'Description',
									dataServiceName: 'languageLookupDataService',
								},
								bulkSupport: false
							}
						}

					},
					'addAdditionalColumns': true
				};
			};
			service.getWf2intentListLayout = function () {
				return {
					'fid': 'mtwo.chatbot',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': [ 'wfetemplatefk', 'intent']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'wfetemplatefk': {  //
							'detail': {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookup-data-by-custom-data-service',
									descriptionMember: 'Description',
									lookupOptions: {
										lookupType: 'workflowLookupDataServiceTwo',
										dataServiceName: 'workflowLookupDataServiceTwo',
										valueMember: 'Id',
										displayMember: 'Description',
										lookupModuleQualifier: 'workflowLookupDataServiceTwo',
										disableDataCaching: true,
										columns: [
											{
												id: 'Description',
												field: 'Description',
												name: 'Description',
												name$tr$: 'cloud.common.entityDescription',
												formatter: 'description',
												readonly: true
											},
											{
												id: 'Kind',
												field: 'Kind',
												name: 'Kind',
												name$tr$: 'cloud.common.entityKind',
												formatter: 'description',
												readonly: true
											}
										],
										isClientSearch: true,
										isTextEditable: false,
										isColumnFilters: true,
										uuid: 'f4341c6fa21b412587468fd0c14ca8ab'
									}
								}
							},
							'grid': {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'mtwo-chatbot-wf2intent-dialog',
									lookupOptions: {
										displayMember: 'Description',
										lookupModuleQualifier: 'mtwoChatbotWf2ViewLookupDataHandler',
										lookupType: 'MtwoChatbotWf2intentView',
										valueMember: 'Id',
										enableCache: false,
										isClientSearch: true,
										isTextEditable: false,
										isColumnFilters: true,
										additionalColumns: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MtwoChatbotWf2intentView',
									displayMember: 'Description',
									dataServiceName: 'workflowLookupDataServiceTwo',
								},
								bulkSupport: false
							}
						},
						'intent': {
							readonly: true,
							'detail': {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookup-data-by-custom-data-service',
									descriptionMember: 'Name',
									lookupOptions: {
										lookupType: 'mtwoChatbotNlpIntentLookupDataService',
										dataServiceName: 'mtwoChatbotNlpIntentLookupDataService',
										isColumnFilters: true,
										valueMember: 'Name',
										displayMember: 'Name',
										lookupModuleQualifier: 'mtwoChatbotNlpIntentLookupDataService',
										disableDataCaching: true,
										columns: [
											{
												id: 'name',
												field: 'Name',
												name: 'name',
												name$tr$: 'cloud.common.entityDescription',
												formatter: 'description',
												readonly: true
											}
										],
										isClientSearch: true,
										isTextEditable: false
									}
								}
							},
							'grid': {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'mtwo-chatbot-wf2intent-nlp-dialog',
									lookupOptions: {
										displayMember: 'Name',
										lookupModuleQualifier: 'mtwoChatbotWf2intentNlpLookupDataHandler',
										lookupType: 'MtwoChatbotWf2intentNlpView',
										valueMember: 'Name',
										enableCache: false,
										isClientSearch: true,
										isTextEditable: false,
										isColumnFilters: true,
										additionalColumns: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MtwoChatbotWf2intentNlpView',
									displayMember: 'Name',
									dataServiceName: 'mtwoChatbotNlpIntentLookupDataService',
								},
								bulkSupport: false
							}
						}
					},
				};
			};
			service.getHeaderListLayout = function () {
				return {
					'fid': 'mtwo.chatbot',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': [ 'comment', 'moduleid','isgeneral']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					/*
					'overloads': {
						'moduleid' : {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookup-data-by-custom-data-service',
									descriptionMember: 'Cultrue'
								},
								'lookupOptions':{
									columns:[
										{
											field: 'Name',
											formatter: 'description',
											id: 'Name',
											name: 'Name',
											name$tr$: 'cloud.common.entityNlpModelName',
											readonly: true
										},
										{
											field: 'Culture',
											formatter: 'description',
											id: 'culture',
											name: 'Culture',
											name$tr$: 'cloud.common.entityNlpCultrue',
											readonly: true
										}
									],
									dataServiceName: 'nlpDataService',
									descriptionMember: 'Culture',
									disableDataCaching: true,
									displayMember: 'NlpModelName',
									lookupModuleQualifier: 'nlpDataService',
									lookupType: 'nlpDataService',
									navigator: false,
									// uuid: 'f4341c6fa21b412587468fd0c14ca8ab'
									valueMember: 'Id',
									enableCache: false,
									isClientSearch: true,
									isTextEditable: false
								}
							},
							'grid': {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'mtwo-chatbot-wf2intent-language-dialog',
									lookupOptions: {
										displayMember: 'Description',
										lookupModuleQualifier: 'languageLookupDataService',
										lookupType: 'MtwoChatbotWf2intentLanguageView',
										valueMember: 'Id',
										enableCache: false,
										isClientSearch: true,
										isTextEditable: false,
										additionalColumns: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MtwoChatbotWf2intentLanguageView',
									displayMember: 'Description',
									dataServiceName: 'languageLookupDataService',
								},
								bulkSupport: false
							}
						},
					}
					*/
					'overloads': {
						'moduleid': {
							'detail': {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookup-data-by-custom-data-service',
									descriptionMember: 'Description.Description',
									lookupOptions: {
										lookupType: 'moduleLookupDataService',
										dataServiceName: 'moduleLookupDataService',
										isColumnFilters: true,
										valueMember: 'Id',
										displayMember: 'Description.Description',
										lookupModuleQualifier: 'moduleLookupDataService',
										disableDataCaching: true,
										columns: [
											{
												id: 'description',
												field: 'Description.Description',
												name: 'Description',
												name$tr$: 'cloud.common.entityDescription',
												formatter: 'description',
												readonly: true
											}
										],
										isClientSearch: true,
										isTextEditable: false
									}
								}
							},
							'grid': {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'mtwo-chatbot-header-dialog',
									lookupOptions: {
										displayMember: 'Description.Description',
										lookupModuleQualifier: 'moduleLookupDataService',
										lookupType: 'MtwoChatbotHeaderModuleView',
										valueMember: 'Id',
										enableCache: false,
										isClientSearch: true,
										isTextEditable: false,
										additionalColumns: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MtwoChatbotHeaderModuleView',
									displayMember: 'Description.Description',
									dataServiceName: 'moduleLookupDataService',
								},
								bulkSupport: false
							}
						},
					}
				};
			};

			return service;
		}
	]);
})(angular);
