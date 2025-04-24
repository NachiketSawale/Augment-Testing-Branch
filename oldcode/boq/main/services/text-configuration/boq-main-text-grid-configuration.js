/**
 * Created by zen on 5/15/2017.
 */
(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainTextGridConfigurationService', [
		function () {
			return {
				getBoqMainTextGridLayout: function () {
					return {
						'showGrouping': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['configcaption', 'configbody', 'configtail', 'isoutput', 'remark']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'configtail': {
								detail: {
									maxLength: 16
								},
								grid: {
									maxLength: 16
								}
							},
							'remark': {
								detail: {
									'type': 'directive',
									'directive': 'boq-main-text-config-remark-lookup',
									'options': {
										lookupDirective: 'boq-main-text-config-remark-lookup',
										valueMember: 'Code',
										descriptionMember: 'Description',
										dataServiceName: 'boqMainTextConfigRemarkService',
										lookupOptions: {
											showClearButton: false,
											isTextEditable: true
										}
									},
									maxLength: 255
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'boq-main-text-config-remark-lookup',
										lookupOptions: {
											showClearButton: false,
											isTextEditable: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'boqMainTextConfigRemarkLookupType',
										valueMember: 'Code',
										displayMember: 'Description',
										dataServiceName: 'boqMainTextConfigRemarkService',
									},
									maxLength: 255
								}
							}
						}
					};
				}
			};
		}
	]);
})();
