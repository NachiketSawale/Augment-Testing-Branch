/*
* clv
* */
/*
* @Description: This file describe the layout of certificates(BID_CERTIFICATE and ORD_CERTIFICATE) which have the mostly same fields.
* */
(function(angular){
	'use strict';
	var moduleName = 'sales.common';
	var cloudCommonModule = 'cloud.Common';
	angular.module(moduleName).value('salesCommonCertificateLayout', {

		'fid': 'sales.common.certificate.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['bpdcertificatetypefk', 'isrequired', 'ismandatory', 'isrequiredsubsub', 'ismandatorysubsub', 'requiredby', 'requiredamount', 'commenttext']
			},
			{
				'gid': 'UserDefinedFields',
				'attributes': ['userdefinedtext1', 'userdefinedtext2', 'userdefinedtext3', 'userdefinedtext4', 'userdefinedtext5',
					'userdefineddate1','userdefineddate2','userdefineddate3','userdefineddate4','userdefineddate5',
					'userdefinednumber1','userdefinednumber2','userdefinednumber3','userdefinednumber4','userdefinednumber5']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [moduleName, cloudCommonModule],
			'extraWords': {
				UserDefinedFields: {location: cloudCommonModule, identifier: 'entityUserDefinedFields', initial: 'User Defined Fields'},
				BpdCertificateTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
				IsRequired: {location: cloudCommonModule, identifier: 'entityIsRequired', initial: 'Is Required'},
				IsMandatory: {location: cloudCommonModule, identifier: 'entityIsMandatory', initial: 'Is Mandatory'},
				IsRequiredSubSub: {location: cloudCommonModule, identifier: 'entityIsRequiredSubSub', initial: 'Sub-Sub Required'},
				IsMandatorySubSub: {location: cloudCommonModule, identifier: 'entityIsMandatorySubSub', initial: 'Sub-Sub Mandatory'},
				RequiredBy: {location: cloudCommonModule, identifier: 'entityRequiredBy', initial: 'Required By'},
				RequiredAmount: {location: cloudCommonModule, identifier: 'entityRequiredAmount', initial: 'Required Amount'},
				CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},
				UserDefinedText1: {location: cloudCommonModule, identifier: 'entityUserDefinedText1', initial: 'User Defined Text 1'},
				UserDefinedText2: {location: cloudCommonModule, identifier: 'entityUserDefinedText2', initial: 'User Defined Text 2'},
				UserDefinedText3: {location: cloudCommonModule, identifier: 'entityUserDefinedText3', initial: 'User Defined Text 3'},
				UserDefinedText4: {location: cloudCommonModule, identifier: 'entityUserDefinedText4', initial: 'User Defined Text 4'},
				UserDefinedText5: {location: cloudCommonModule, identifier: 'entityUserDefinedText5', initial: 'User Defined Text 5'},
				UserDefinedDate1: {location: cloudCommonModule, identifier: 'entityUserDefinedDate1', initial: 'User Defined Date 1'},
				UserDefinedDate2: {location: cloudCommonModule, identifier: 'entityUserDefinedDate2', initial: 'User Defined Date 2'},
				UserDefinedDate3: {location: cloudCommonModule, identifier: 'entityUserDefinedDate3', initial: 'User Defined Date 3'},
				UserDefinedDate4: {location: cloudCommonModule, identifier: 'entityUserDefinedDate4', initial: 'User Defined Date 4'},
				UserDefinedDate5: {location: cloudCommonModule, identifier: 'entityUserDefinedDate5', initial: 'User Defined Date 5'},
				UserDefinedNumber1: {location: cloudCommonModule, identifier: 'entityUserDefinedNumber1', initial: 'User Defined Number 1'},
				UserDefinedNumber2: {location: cloudCommonModule, identifier: 'entityUserDefinedNumber2', initial: 'User Defined Number 2'},
				UserDefinedNumber3: {location: cloudCommonModule, identifier: 'entityUserDefinedNumber3', initial: 'User Defined Number 3'},
				UserDefinedNumber4: {location: cloudCommonModule, identifier: 'entityUserDefinedNumber4', initial: 'User Defined Number 4'},
				UserDefinedNumber5: {location: cloudCommonModule, identifier: 'entityUserDefinedNumber5', initial: 'User Defined Number 5'}
			}
		},
		'overloads': {
			'bpdcertificatetypefk': {
				'detail': {
					'type': 'directive',
					'directive': 'businesspartner-certificate-certificate-type-combobox',
					'options': {
						descriptionMember: 'Description',
						lookupOptions: {
							filterKey: 'prc-certificate-type-filter'
						}
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'businesspartner-certificate-certificate-type-combobox',
						lookupOptions: {filterKey: 'prc-certificate-type-filter'}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CertificateType',
						displayMember: 'Description'
					},
					width: 100
				}
			},
			'isrequired': {
				'mandatory': true
			},
			'ismandatory': {
				'mandatory': true
			},
			'isrequiredsubsub': {
				'mandatory': true
			},
			'ismandatorysubsub': {
				'mandatory': true
			},
			'requiredamount': {
				'mandatory': true
			},
			'userdefineddate1':{
				'mandatory': true
			},
			'userdefineddate2': {
				'mandatory': true
			},
			'userdefineddate3': {
				'mandatory': true
			},
			'userdefineddate4': {
				'mandatory': true
			},
			'userdefineddate5': {
				'mandatory': true
			},
			'userdefinednumber1': {
				'mandatory': true
			},
			'userdefinednumber2': {
				'mandatory': true
			},
			'userdefinednumber3': {
				'mandatory': true
			},
			'userdefinednumber4': {
				'mandatory': true
			},
			'userdefinednumber5': {
				'mandatory': true
			}
		}
	});
})(angular);