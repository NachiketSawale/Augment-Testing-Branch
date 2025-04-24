(function () {
	/*global angular*/
	'use strict';

	angular.module('basics.workflow').value('basicsWorkflowUserInputItemTypes', {
		money: {
			icon: 'ico-number'
		},
		integer: {
			icon: 'ico-number'
		},
		quantity: {
			icon: 'ico-number'
		},
		percent: {
			icon: 'ico-number'
		},
		factor: {
			icon: 'ico-number'
		},
		exchangerate: {
			icon: 'ico-number'
		},
		code: {
			icon: 'ico-number'
		},
		dateutc: {
			icon: 'ico-number'
		},
		description: {
			icon: 'ico-text'
		},
		email: {
			icon: 'ico-text'
		},
		remark: {
			icon: 'ico-text'
		},
		comment: {
			icon: 'ico-text'
		},
		commentBox: {
			icon: 'ico-text'
		},
		boolean: {
			icon: 'ico-ctrl-combo',
			options: {
				defaultValue: false
			}
		},
		inputselect: {
			icon: 'ico-ctrl-combo'
		},
		space: {
			icon: 'ico-ctrl-divider'
		},
		divider: {
			icon: 'ico-ctrl-divider',
			options: {
				allowMergeColumn: true
			}
		},
		label: {
			icon: 'ico-ctrl-divider',
			dialogParams: {
				header: 'basics.workflow.modalDialogs.labelEditorHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-label-dialog.html'
			},
			options: {
				displayText: ''
			}
		},
		table: {
			icon: 'ico-ctrl-divider',
			dialogParams: {
				header: 'basics.workflow.modalDialogs.tableEditorHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-table-dialog.html'
			},
			options: {
				displayText: ''
			}
		},
		link: {
			icon: 'ico-linkto',
			dialogParams: {
				header: 'basics.workflow.modalDialogs.wwwLinkHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-wwwLink-dialog.html'
			},
			options: {
				url: '',
				displayText: ''
			}
		},
		entityLink: {
			icon: 'ico-linkto',
			options: {
				entity: undefined,
				moduleName: undefined,
				displayText: ''
			},
			dialogParams: {
				header: 'basics.workflow.modalDialogs.wwwLinkHeader',
				template: 'basics.workflow/templates/dialogs/workflow-entitylink-dialog.html'
			}
		},
		workflowButton: {
			icon: 'ico-linkto',
			dialogParams: {
				header: 'basics.workflow.modalDialogs.workflowLinkHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-workflow-button-dialog.html'
			},
			options: {
				displayText: '',
				templateId: undefined
			}
		},
		wizardButton: {
			icon: 'ico-linkto',
			dialogParams: {
				header: 'basics.workflow.modalDialogs.workflowLinkHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-wizard-button-dialog.html'
			},
			options: {
				displayText: '',
				entity: '',
				module: null,
				wizard: null
			}
		},
		reportButton: {
			icon: 'ico-linkto',
			dialogParams: {
				header: 'basics.workflow.modalDialogs.reportLinkHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-reportlink-dialog.html',
				bodyFlexColumn: true
			},
			options: {
				displayText: '',
				report: undefined,
				parameters: undefined
			}
		},
		documentButton: {
			icon: 'ico-linkto',
			dialogParams: {
				displayText: '',
				header: 'basics.workflow.modalDialogs.documentLinkHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-document-link-dialog.html'
			},
			options: {
				displayText: '',
				documentId: undefined
			}
		},
		pinboardButton: {
			icon: 'ico-linkto',
			dialogParams: {
				displayText: '',
				header: 'basics.workflow.modalDialogs.pinboardContentHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-pinboard-link-dialog.html'
			},
			options: {
				displayText: '',
				allowMergeColumn: true
			}
		},
		select: {
			icon: 'ico-ctrl-combo',
			dialogParams: {
				header: 'basics.workflow.modalDialogs.selectContentHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-select-dialog.html'
			},
			options: {
				items: [],
				displayMember: '',
				valueMember: ''
			}
		},
		clerkLookup: {
			ico: 'ico-ctrl-combo',
			options: {
				lookupDirective: 'cloud-clerk-clerk-dialog',
				descriptionMember: 'Description',
				lookupOptions: {
					multipleSelection: true,
					showClearButton: true
				},
				disableNoWrap: true
			}
		},
		materialLookup: {
			ico: 'ico-ctrl-combo',
			options: {
				lookupDirective: 'basics-material-material-lookup',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					multipleSelection: true,
					showClearButton: true
				},
				disableNoWrap: true
			}
		},
		uploadDocuments: {
			ico: 'ico-ctrl-combo',
			dialogParams: {
				displayText: '',
				header: 'basics.workflow.modalDialogs.uploadDocuments',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-upload-documents-dialog.html'
			},
			options: {
				lookupDirective: 'basics-workflow-documents-file-upload-lookup',
				displayText: ''
			}
		},
		userDecision: {
			icon: 'ico-ctrl-combo-decision'
		},
		title: {
			icon: 'ico-ctrl-divider',
			dialogParams: {
				header: 'basics.workflow.modalDialogs.labelEditorHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-label-dialog.html'
			},
			options: {
				displayText: ''
			}
		},
		subtitle: {
			icon: 'ico-ctrl-divider',
			dialogParams: {
				header: 'basics.workflow.modalDialogs.labelEditorHeader',
				bodyTemplate: 'basics.workflow/templates/dialogs/workflow-label-dialog.html'
			},
			options: {
				displayText: ''
			}
		}
	});
})();