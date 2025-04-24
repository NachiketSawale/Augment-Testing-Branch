/**
 * Created by chi on 2/20/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).value('procurementRfqBidderSettingDetailLayout', {
		'fid': 'procurement.rfq.bidder.setting.detailform',
		'version': '1.0.0',
		'showGrouping': true,
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'setting',
				'attributes': ['clerkemailbcc', 'sendwithownmailaddress', 'generatesafelink', 'disabledataformatexport', 'replytoclerk', 'disablezipping', 'linkandattachment', 'filenamefromdescription', 'additionalemailforbcc', 'useaccesstokenforsafelink', 'safelinklifetime']
			}
		],
		'translationInfos': {
			'extraModules': [moduleName],
			'extraWords': {
				ClerkEmailBcc: {
					location: moduleName,
					identifier: 'rfqBidderSetting.clerkEmailBcc',
					initial: 'Clerk Email Bcc'
				},
				SendWithOwnMailAddress: {location: moduleName, identifier: 'rfqBidderSetting.sendWithOwnMailAddress', initial: 'Send with own Mailaddress'},
				GenerateSafeLink: {location: moduleName, identifier: 'rfqBidderSetting.generateSafeLink', initial: 'Generate Safe Link'},
				DisableDataFormatExport: {location: moduleName, identifier: 'rfqBidderSetting.disableDataFormatExport', initial: 'Disable Data Format Export'},
				ReplyToClerk: {location: moduleName, identifier: 'rfqBidderSetting.replyToClerk', initial: 'Reply to Clerk'},
				DisableZipping: {location: moduleName, identifier: 'rfqBidderSetting.disableZipping', initial: 'disablezipping'},
				LinkAndAttachment: {location: moduleName, identifier: 'rfqBidderSetting.linkAndAttachment', initial: 'Link and Attachment'},
				FileNameFromDescription: {location: moduleName, identifier: 'rfqBidderSetting.fileNameFromDescription', initial: 'Use Description for File Name'},
				AdditionalEmailForBCC: {location: moduleName, identifier: 'rfqBidderSetting.additionalEmailForBCC', initial: 'Additional Email for BCC'},
				UseAccessTokenForSafeLink: {location: moduleName, identifier: 'rfqBidderSetting.useAccessTokenForSafeLink', initial: 'Use Access Token for Safe Link'},
				SafeLinkLifetime: {location: moduleName, identifier: 'rfqBidderSetting.safeLinkLifetime', initial: 'Safe Link Lifetime (h)'}
			}
		},
		'overloads': {}
	});

})(angular);