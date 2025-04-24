/**
 * Created by yew on 11/06/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'procurement.common', cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('procurementCommonWarrantyLayout', [function () {
		return {
			fid: 'procurement.common.Warranty.detail',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [{
				gid: 'basicData',
				attributes: ['baswarrantysecurityfk', 'baswarrantyobligationfk', 'description', 'handoverdate', 'durationmonths', 'warrantyenddate', 'commenttext',
					'userdefinedtext1', 'userdefinedtext2', 'userdefinedtext3', 'userdefinedtext4', 'userdefinedtext5',
					'userdefineddate1', 'userdefineddate2', 'userdefineddate3', 'userdefineddate4', 'userdefineddate5',
					'userdefinednumber1', 'userdefinednumber2', 'userdefinednumber3', 'userdefinednumber4', 'userdefinednumber5']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}],
			translationInfos: {
				extraModules: [moduleName, cloudCommonModule],
				extraWords: {
					BasWarrantysecurityFk: {location: moduleName, identifier: 'warranty.basWarrantySecurityFk', initial: 'Warranty Security'},
					BasWarrantyobligationFk: {location: moduleName, identifier: 'warranty.basWarrantyObligationFk', initial: 'Warranty Obligation'},
					Description: {location: moduleName, identifier: 'warranty.description', initial: 'Description'},
					HandoverDate: {location: moduleName, identifier: 'warranty.handOverDate', initial: 'Hand Over Date'},
					DurationMonths: {location: moduleName, identifier: 'warranty.durationMonths', initial: 'Duration Months'},
					WarrantyEnddate: {location: moduleName, identifier: 'warranty.warrantyEndDate', initial: 'Warranty End Date'},
					CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
					UserDefinedText1: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Text 1'}},
					UserDefinedText2: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Text 2'}},
					UserDefinedText3: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Text 3'}},
					UserDefinedText4: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Text 4'}},
					UserDefinedText5: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Text 5'}},
					UserDefinedDate1: {location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '1'}},
					UserDefinedDate2: {location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '2'}},
					UserDefinedDate3: {location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '3'}},
					UserDefinedDate4: {location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '4'}},
					UserDefinedDate5: {location: cloudCommonModule, identifier: 'entityUserDefinedDate', initial: 'entityUserDefinedDate', param: {'p_0': '5'}},
					UserDefinedNumber1: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Number 1'}},
					UserDefinedNumber2: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Number 2'}},
					UserDefinedNumber3: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Number 3'}},
					UserDefinedNumber4: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Number 4'}},
					UserDefinedNumber5: {location: cloudCommonModule, identifier: 'entityUserDefined', initial: 'entityUserDefined', param: {'p_0': 'Number 5'}}
				}
			},
			overloads: {
				baswarrantysecurityfk: {
					'detail': {
						'type': 'directive',
						'directive': 'procurement-common-warranty-security-combobox',
						'options': {
							'lookupDirective': 'procurement-common-warranty-security-combobox',
							'descriptionMember': 'DescriptionInfo.Description'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {directive: 'procurement-common-warranty-security-combobox'},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'WarrantySecurity',
							displayMember: 'DescriptionInfo.Translated'
						}
					}
				},
				baswarrantyobligationfk: {
					'detail': {
						'type': 'directive',
						'directive': 'procurement-common-warranty-obligation-combobox',
						'options': {
							'lookupDirective': 'procurement-common-warranty-obligation-combobox',
							'descriptionMember': 'DescriptionInfo.Description'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {directive: 'procurement-common-warranty-obligation-combobox'},
						formatter: 'lookup',
						formatterOptions: {'lookupType': 'WarrantyObligation', 'displayMember': 'DescriptionInfo.Translated'}
					}
				},
				commenttext: {maxLength: 255},
				description: {maxLength: 252},
				userdefinedtext1: {maxLength: 252},
				userdefinedtext2: {maxLength: 252},
				userdefinedtext3: {maxLength: 252},
				userdefinedtext4: {maxLength: 252},
				userdefinedtext5: {maxLength: 252},
				userdefinednumber1: {required: false},// todo: required is not ok,so use 'checkRequireds' for the moment [yew]
				userdefinednumber2: {required: false},
				userdefinednumber3: {required: false},
				userdefinednumber4: {required: false},
				userdefinednumber5: {required: false}
			}
		};
	}]);

	angular.module(moduleName).factory('procurementCommonWarrantyUIStandardService', procurementCommonWarrantyUIStandardService);
	procurementCommonWarrantyUIStandardService.$inject = ['platformUIStandardConfigService', 'procurementCommonTranslationService',
		'procurementCommonWarrantyLayout', 'platformSchemaService'];

	function procurementCommonWarrantyUIStandardService(platformUIStandardConfigService, procurementCommonTranslationService,
		procurementCommonWarrantyLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PrcWarrantyDto',
			moduleSubModule: 'Procurement.Common'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		function UIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UIStandardService.prototype = Object.create(BaseService.prototype);
		UIStandardService.prototype.constructor = UIStandardService;
		var service = new BaseService(procurementCommonWarrantyLayout, domainSchema, procurementCommonTranslationService);

		service.checkRequireds = ['handoverdate', 'durationmonths', 'warrantyenddate', 'userdefinednumber1', 'userdefinednumber2', 'userdefinednumber3', 'userdefinednumber4', 'userdefinednumber5'];
		var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
		service.getStandardConfigForDetailView = function () {
			var list = basicGetStandardConfigForDetailView();
			angular.forEach(list.rows, function (item) {
				if (service.checkRequireds.indexOf(item.model.toLowerCase()) > -1) {
					item.required = false;
				}
			});
			return angular.copy(list);
		};
		var stdGridConfig = service.getStandardConfigForListView();
		angular.forEach(stdGridConfig.columns, function (item) {
			if (service.checkRequireds.indexOf(item.id) > -1) {
				item.required = false;
			}
		});
		service.getStandardConfigForListView = function () {
			return stdGridConfig;
		};

		return service;
	}
})(angular);