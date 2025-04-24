(function () {

	'use strict';

	let moduleName =  'estimate.main';
	let cloudCommonModule = 'cloud.common';
	angular.module(moduleName).factory('costGroupStructureLayoutServiceFactory',[
		function () {
			function createNewComplete() {

				let service = {};

				let layout = {

					'fid': 'cost.group.strcuture.layout',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['code','descriptioninfo', 'quantity','uomfk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [moduleName],
						'extraWords': {
							Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
							Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'},
							UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'Uom'}
						}
					},
					'overloads': {
						'code': {
							'readonly': true
						},
						'quantity': {
							'readonly': true
						},
						'descriptioninfo':{
							'readonly': true
						},
						'uomfk': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-uom-lookup',
								'options': {
									showClearButton: true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-lookupdata-uom-lookup',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'uom',
									displayMember: 'Unit'
								}
							}
						}
					}
				};



				service.getLayout = function () {
					return layout;
				};

				return service;
			}

			return {
				getService: function () {
					return createNewComplete();
				},

				getLayoutForTranslation: function () {
					let service = createNewComplete(null);
					return service.getLayout();
				}

			};

		}]);
})(angular);
