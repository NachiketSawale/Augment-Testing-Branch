/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formworktype';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningFormworktypeLookupOverloadProvider
	 */
	module.service('productionplanningFormworktypeLookupOverloadProvider', LookupOverloadProvider);

	LookupOverloadProvider.$inject = [];

	function LookupOverloadProvider() {

		this.provideFormworktypeLookupOverload = function provideFormworktypeLookupOverload(isReadOnly = false) {
			return {
				readonly: isReadOnly,
				grid: {
					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						directive: 'productionplanning-formworktype-lookup',
						lookupOptions: {
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService',
							filter: { showIcon: true },
							showClearButton: true,
							valueMember: 'Id',
							lookupType: 'FormworkType'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						version: 3,
						lookupType: 'FormworkType',
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: 'platformStatusIconService',
						showClearButton: true,
						valueMember: 'Id'
					},
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'productionplanning-formworktype-lookup',
						lookupOptions: {
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService',
							filter: { showIcon: true },
							showClearButton: true,
							valueMember: 'Id',
							lookupType: 'FormworkType'
						}
					}
				}
			};
		};
	}
})(angular);

