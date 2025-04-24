/**
 * Created by zwz on 03/17/2022.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawingtype';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingtypeLookupOverloadProvider
	 */
	module.service('productionplanningDrawingtypeLookupOverloadProvider', LookupOverloadProvider);

	LookupOverloadProvider.$inject = [];

	function LookupOverloadProvider() {

		this.provideDrawingtypeLookupOverload = function provideDrawingtypeLookupOverload(isReadOnly= false) {
			return {
				readonly: isReadOnly,
				grid: {
					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						directive: 'productionplanning-drawingtype-lookup',
						lookupOptions: {
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService',
							filter: {showIcon:true},
							showClearButton: true,
							valueMember: 'Id',
							lookupType: 'EngDrawingType'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						version: 3,
						lookupType: 'EngDrawingType',
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
						lookupDirective: 'productionplanning-drawingtype-lookup',
						lookupOptions: {
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService',
							filter: {showIcon:true},
							showClearButton: true,
							valueMember: 'Id',
							lookupType: 'EngDrawingType'
						}
					}
				}
			};
		};
	}
})(angular);

