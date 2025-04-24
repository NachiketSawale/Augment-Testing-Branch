/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelAnnotationSendMessageWizardService
	 * @function
	 *
	 * @description Provides a send message wizard for model annotations.
	 */
	angular.module('model.annotation').service('modelAnnotationSendMessageWizardService',
		modelAnnotationSendMessageWizardService);

	modelAnnotationSendMessageWizardService.$inject = ['_', '$http', 'platformDialogService',
		'modelAnnotationDataService', 'platformGridDialogService'];

	function modelAnnotationSendMessageWizardService(_, $http, platformDialogService,
		modelAnnotationDataService, platformGridDialogService) {

		const service = {};

		function extractionOfRecipients(result) {
			let recipients = [];
			for (let category of result) {
				let contacts = {
					CategoryId: category.Id,
					ContactIds: []
				};
				for (let contact of category.ContactTypes) {
					if (contact.IsChecked === true) {
						contacts.ContactIds.push(contact.Id);
					}
				}
				if (contacts.ContactIds.length > 0) {
					recipients.push(contacts);
				}
			}
			return recipients;
		}

		function getAnnotationIds() {
			let annotationIds = [];
			const annotationData = modelAnnotationDataService.getSelectedEntities();
			if (annotationData.length > 0) {
				annotationData.forEach(function (item) {
					if (item.Id) {
						annotationIds.push(item.Id);
					}
				});
				return annotationIds;
			}
		}

		service.showDialog = function () {
			const annoIds = getAnnotationIds();
			if (_.isEmpty(annoIds)) {
				return platformDialogService.showMsgBox('model.annotation.noSelAnnosDesc', 'model.annotation.noSelAnnos', 'info');
			}

			const fieldValues = {
				resultData: {
					Subject: '{desc}',
					Message: '',
					BCFFileName:'',
					BCFVersion:'',
					IsBCFAdded:false,
					IsReportAdded:false,
					Report:'',
					ReportFileName: '',
					ReportFileType:'',
				}
			};

			function isChecked() {
				if (Array.isArray(fieldValues.categories)) {
					for (let category of fieldValues.categories) {
						for (let contactTypes of category.ContactTypes) {
							if (contactTypes.IsChecked === true) {
								return true;
							}
						}
					}
				}
				return false;
			}

			const modalOptions = {
				headerTextKey: 'model.annotation.sendMessage',
				bodyTemplateUrl: globals.appBaseUrl + 'model.annotation/templates/model-annotation-send-message-wizard.html',
				gridId: '53fd8ad4c35f4c13bd41117e2d9c1663',
				resizeable: true,
				minWidth: '300px',
				height: '600px',
				value: fieldValues,
				buttons: [{
					id: 'cancel'
				}, {
					id: 'ok',
					disabled: function disabled() {
						return (isChecked() === false || !fieldValues.resultData.Subject);
					}
				}],
			};

			platformDialogService.showDialog(modalOptions).then(function (result) {
				if (result.ok) {
					const values = extractionOfRecipients(result.value.categories);
					$http.post(globals.webApiBaseUrl + 'model/annotation/contacts/sendmessage', {
						AnnotationIds: annoIds,
						Recipients: values,
						Subject: result.value.resultData.Subject,
						Message: result.value.resultData.Message,
						BCFFileName:result.value.resultData.BCFFileName,
						BCFVersion: result.value.resultData.BCFVersion,
						IsBCFAdded:result.value.resultData.IsBCFAdded,
						IsReportAdded:result.value.resultData.IsReportAdded,
						Report:result.value.resultData.Report,
						ReportFileName:result.value.resultData.ReportFileName,
						ReportFileType:result.value.resultData.ReportFileType,
					}).then(function (response) {
						const cols = [{
							id: 'description',
							name$tr$: 'model.annotation.name',
							formatter: 'description',
							field: 'Description',
							width: 200
						}, {
							id: 'count',
							name$tr$: 'model.annotation.numberOfEmailsSent',
							formatter: 'integer',
							field: 'SentEMailCount',
							width: 150
						}];

						return platformGridDialogService.showDialog({
							columns: cols,
							headerText$tr$: 'model.annotation.emailConfirmation',
							items: response.data,
							id: 'EmailConfirmaiton',
							idProperty: 'Id',
							lazyInit: true,
							showOkButton: true,
							showCancelButton: false,
							resizeable: true,
							isReadOnly: true,
							width: 350
						});
					});
				}
			});
		};
		return service;
	}
})(angular);
