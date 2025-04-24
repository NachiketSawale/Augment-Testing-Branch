/* global angular */

(function () {
	'use strict';

	function basicsWorkflowMockHttp($q, globals) {
		var nextId = 3;
		var workflowMock = [
			{
				id: 2,
				Id: 2,
				code: '',
				description: 'Sonstiges',
				kind: 'sytem workflow',
				kindId: 1,
				type: 'workflow',
				typeId: 1,
				comment: 'no comment',
				helpText: 'no help text',
				escalationWorkflow: 'escalation workflow',
				context: {
					entity: 'Project',
					value1: 'value 1'
				},
				workflowAction: {
					id: 1,
					code: '',
					description: 'start',
					workflowId: 1,
					documentList: null,
					actionTypeId: 1,
					actionType: 'start',
					actionName: null,
					transitions: null
				}
			},
			{
				id: 1,
				Id: 1,
				code: '',
				description: 'Rechnungsprüfung',
				kind: 'sytem workflow',
				kindId: 1,
				type: 'workflow',
				typeId: 1,
				comment: 'no comment',
				helpText: 'no help text',
				escalationWorkflow: 'escalation workflow',
				context: {
					entity: 'Invoice',
					value1: 'value 1'
				},
				workflowAction: {
					id: 1,
					code: '',
					description: 'start',
					workflowId: 1,
					documentList: null,
					actionTypeId: 1,
					actionType: 'start',
					actionName: null,
					transitions: [
						{
							id: 10,
							code: '',
							description: '',
							parameter: null,
							workflowAction: {
								id: 101,
								code: '',
								description: 'Hochbau oder Tiefbau',
								workflowId: 1,
								documentList: [
									'http://rib-s-wiki01.rib-software.com/cloud/wiki/1095/module-basics',
									'http://rib-s-wiki01.rib-software.com/cloud/wiki/22/module-scheduling'
								],
								actionTypeId: 3,
								actionType: 'decision',
								actionName: null,
								context: {
									sql: 'Select * from '
								},
								transitions: [
									{
										id: 120,
										code: '',
										description: '',
										parameter: 'Hochbau',
										workflowAction: {
											id: 121,
											code: '',
											description: 'E-Mail an Frau Müller und Herr Maier',
											workflowId: 1,
											documentList: [],
											actionTypeId: 4,
											actionType: 'action',
											actionName: null,
											context: {
												mailAdress: 'müller@irgendwas.de;maier@irgendwas.de'
											},
											transitions: [
												{
													id: 122,
													code: '',
													description: '',
													parameter: null,
													workflowAction: {
														id: 123,
														code: '',
														description: 'Projekt in Masterplan anlegen',
														workflowId: 1,
														documentList: [],
														actionTypeId: 5,
														actionType: 'action',
														actionName: null,
														transitions: [{
															id: 124,
															code: '',
															description: '',
															parameter: null,
															workflowAction: {
																id: 125,
																code: '',
																description: 'Ende',
																workflowId: 1,
																documentList: [],
																actionTypeId: 2,
																actionType: 'end',
																actionName: null,
																transitions: null
															}
														}]
													}
												}
											]
										}
									},
									{
										id: 130,
										code: '',
										description: '',
										parameter: 'Tiefbau',
										workflowAction: {
											id: 131,
											code: '',
											description: 'E-Mail an Frau Schulz und Herr Schneider',
											workflowId: 1,
											documentList: [],
											actionTypeId: 4,
											actionType: 'action',
											actionName: null,
											transitions: [
												{
													id: 132,
													code: '',
													description: '',
													parameter: null,
													workflowAction: {
														id: 133,
														code: '',
														description: 'Geräteeinsatzplan erstellen',
														workflowId: 1,
														documentList: [],
														actionTypeId: 5,
														actionType: 'action',
														actionName: null,
														transitions: [{
															id: 134,
															code: '',
															description: '',
															parameter: null,
															workflowAction: {
																id: 135,
																code: '',
																description: 'Ende',
																workflowId: 1,
																documentList: [],
																actionTypeId: 2,
																actionType: 'end',
																actionName: null,
																transitions: null
															}
														}]
													}
												}
											]
										}
									},
									{
										id: 140,
										code: '',
										description: '',
										parameter: 'Tiefbau',
										workflowAction: {
											id: 141,
											code: '',
											description: 'Auftrag > 100.000 €',
											workflowId: 1,
											documentList: [],
											actionTypeId: 3,
											actionType: 'decision',
											actionName: null,
											transitions: [
												{
													id: 142,
													code: '',
													description: '',
													parameter: 'true',
													workflowAction: {
														id: 143,
														code: '',
														description: 'Meldung an statistisches Landesamt',
														workflowId: 1,
														documentList: [],
														actionTypeId: 4,
														actionType: 'action',
														actionName: null,
														transitions: [{
															id: 144,
															code: '',
															description: '',
															parameter: null,
															workflowAction: {
																id: 145,
																code: '',
																description: 'Ende',
																workflowId: 1,
																documentList: [],
																actionTypeId: 2,
																actionType: 'end',
																actionName: null,
																transitions: null
															}
														}]
													}
												},
												{
													id: 162,
													code: '',
													description: '',
													parameter: 'false',
													workflowAction: {
														id: 173,
														code: '',
														description: 'Ende',
														workflowId: 1,
														documentList: [],
														actionTypeId: 2,
														actionType: 'end',
														actionName: null,
														transitions: null
													}
												}]
										}
									},
									{
										id: 150,
										code: '',
										description: '',
										parameter: 'Tiefbau',
										workflowAction: {
											id: 151,
											code: '',
											description: 'E-Mail an Herr Meier',
											workflowId: 1,
											documentList: [],
											actionTypeId: 4,
											actionType: 'action',
											actionName: null,
											transitions: [
												{
													id: 152,
													code: '',
													description: '',
													parameter: null,
													workflowAction: {
														id: 153,
														code: '',
														description: 'Geräteeinsatzpläne überprüfen',
														workflowId: 1,
														documentList: [],
														actionTypeId: 5,
														actionType: 'action',
														actionName: null,
														transitions: [{
															id: 154,
															code: '',
															description: '',
															parameter: null,
															workflowAction: {
																id: 155,
																code: '',
																description: 'Ende',
																workflowId: 1,
																documentList: [],
																actionTypeId: 2,
																actionType: 'end',
																actionName: null,
																transitions: null
															}
														}]
													}
												}
											]
										}
									}

								]
							}
						}
					]
				}
			}
		];

		function getWorkflowTemplateList() {
			return $q(function (resolve) {
				resolve({data: workflowMock});
			});
		}

		function createWorkflow() {
			var newWorkflow = {
				id: nextId,
				Id: nextId,
				code: '',
				description: '',
				kind: 'user workflow',
				kindId: 2,
				type: 'workflow',
				typeId: 1,
				comment: '',
				helpText: '',
				escalationWorkflow: 'escalation workflow',
				context: {entity: null},
				workflowAction: {
					id: 1,
					code: '',
					description: 'start',
					workflowId: nextId,
					documentList: null,
					actionTypeId: 1,
					actionType: 'start',
					actionName: null,
					transitions: null
				}
			};
			nextId++;
			return $q(function (resolve) {
				resolve({data: newWorkflow});
			});

		}

		return function (request) {

			if (request.url === (globals.webApiBaseUrl + 'basics/workflow/template/list')) {
				return getWorkflowTemplateList();
			}
			if (request.url === (globals.webApiBaseUrl + 'basics/workflow/template/create')) {
				return createWorkflow();
			}
			if (request.url === (globals.webApiBaseUrl + 'basics/workflow/template/delete')) {
				return $q(function (resolve) {
					resolve({data: true});
				});
			}

			return $q(function (resolve) {
				resolve({data: []});
			});

		};
	}

	angular.module('basics.workflow').factory('basicsWorkflowMockHttp', ['$q', 'globals', basicsWorkflowMockHttp]);

})();
