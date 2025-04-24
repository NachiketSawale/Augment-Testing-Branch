(function () {

	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicDataLayoutServiceFactory',
		['basicsCharacteristicCodeLookupService',
			'basicsCharacteristicTypeHelperService',
			'basicsLookupdataConfigGenerator',
			function (basicsCharacteristicCodeLookupService,
				basicsCharacteristicTypeHelperService, basicsLookupdataConfigGenerator) {

				var serviceCache = [];

				function createNewComplete(sectionId, params) {

					var service = {};

					if (!params) {
						params = {};
					}

					var layout = {

						'fid': 'basics.characteristic.data.layout',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								// 'attributes': ['id', 'characteristicgroupfk', 'characteristicfk', 'description', 'valuetext', 'isreadonly' ]
								'attributes': ['characteristicfk', 'description', 'valuetext']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'translationInfos': {

							'extraModules': [moduleName],

							'extraWords': {
								'CharacteristicFk': {location: moduleName, identifier: 'entityCode', initial: 'Code'},
								'CharacteristicGroupFk': {
									location: moduleName,
									identifier: 'entityGrpFk',
									initial: 'GroupID'
								},
								'DefaultValue': {
									location: moduleName,
									identifier: 'entityDefaultValue',
									initial: 'Def. value'
								},
								'ValueText': {location: moduleName, identifier: 'entityValueText', initial: 'Value'},
								'IsReadonly': {
									location: moduleName,
									identifier: 'entityIsReadonly',
									initial: 'Readonly'
								}
							}
						},
						'overloads': {

							'id': {
								'readonly': true
							},

							'characteristicgroupfk': {
								'readonly': true
							},
							'indexheaderfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
								{
									dataServiceName: 'basicsCharacteristicIndexHeaderLookupDataService',
									enableCache: true
								}
							),
							'characteristicfk': {

								'detail': {},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-characteristic-data-code-lookup',
										lookupOptions: {
											showClearButton: false,
											// filterKey: 'basicsCharacteristicCodeLookupFilter' + service.getSectionId(), --> done in service
											//filter: function (item) {   --> does not work?
											//	return service.getSectionId();
											//}
											sectionId: sectionId,
											removeUsed: params.hasOwnProperty('removeUsedCodes') ? params.removeUsedCodes : true,
											characteristicDataService: params.characteristicDataService
										}
									},
									formatter: codeFormatter,
									bulkSupport: false
								}
								// validator: 'validateCode' --> does not work?
							},

							'description': {
								'readonly': true
							},

							'valuetext': {
								'grid': {
									maxLength: 252,
									formatter: 'dynamic',
									editor: 'dynamic',
									domain: function (item, column) {
										var domain;
										if (basicsCharacteristicTypeHelperService.isLookupType(item.CharacteristicTypeFk)) {
											domain = 'lookup';
											column.editorOptions = {
												lookupDirective: 'basics-lookup-data-by-custom-data-service-grid-less',
												lookupOptions: { // TODO: this.scope.options: initialize default and merge the lookupOptions
													dataServiceName: 'basicsCharacteristicDataDiscreteValueLookupService',
													lookupModuleQualifier: 'basicsCharacteristicDataDiscreteValueLookup',
													lookupType: 'basicsCharacteristicDataDiscreteValueLookup',
													valueMember: 'Id',
													displayMember: 'DescriptionInfo.Translated',
													showClearButton: true,
													// filterKey: 'basicsCharacteristicDataDiscreteValueLookupFilter' + sectionId
													filterKey: params.hasOwnProperty('discreteValueLookupFilter') ? params.discreteValueLookupFilter : 'basicsCharacteristicDataDiscreteValueLookupFilter' + sectionId
													// isClientSearch: true
												}
											};
											// column.formatter = 'lookup';
											column.formatterOptions = {
												lookupType: 'basicsCharacteristicDataDiscreteValueLookup',
												dataServiceName: 'basicsCharacteristicDataDiscreteValueLookupService',
												valueMember: 'Id',
												displayMember: 'DescriptionInfo.Translated',
												filter: function (item) {
													return item.CharacteristicSectionFk;
												}
											};
										} else {
											domain = basicsCharacteristicTypeHelperService.characteristicType2Domain(item.CharacteristicTypeFk);
											//if ((domain === 'datetimeutc' || domain === 'dateutc') && item.ValueText && !item.ValueText._isAMomentObject) {
											//	item.ValueText = moment.utc(item.ValueText);
											//}
											column.editorOptions = null;
											column.formatterOptions = null;
										}
										item.ValueText = basicsCharacteristicTypeHelperService.convertValue(item.ValueText, item.CharacteristicTypeFk);
										return domain;
									},
									sortable: false,
									bulkSupport: false
								}
							},
							'iseditable': {
								'readonly': true
							}
						}
					};

					function codeFormatter(row, cell, value, columnDef, dataContext) {

						var orgVal = dataContext.CharacteristicFk;
						if (orgVal) {

							var item = basicsCharacteristicCodeLookupService.getItemById(orgVal);
							if (!item) {   // characteristic entity not found in filtered list! Maybe assignment was changed. Fallback to navigation property
								if (dataContext.CharacteristicEntity) {
									item = dataContext.CharacteristicEntity;
								}
							}

							if (item) {
								// update Characteristic data
								dataContext.CharacteristicGroupFk = item.CharacteristicGroupFk;
								dataContext.Description = item.DescriptionInfo.Translated || item.DescriptionInfo.Description;
								dataContext.CharacteristicTypeFk = item.CharacteristicTypeFk;
								dataContext.Remark = item.Remark;
								return item.Code;
							}

						}
						return orgVal;
					}

					service.getLayout = function () {
						return layout;
					};

					return service;
				}

				return {
					getService: function (sectionId, params) {

						var serviceId = params && params.serviceId ? params.serviceId : sectionId; // fallback
						if (!serviceCache[serviceId]) {
							serviceCache[serviceId] = createNewComplete(sectionId, params);
						}
						return serviceCache[serviceId];
					},

					getLayoutForTranslation: function () {
						var service = createNewComplete(null);
						return service.getLayout();
					}

				};

			}]);
})(angular);
