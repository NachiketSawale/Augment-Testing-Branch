(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	let businesspartnerEvaluationschemaModule = angular.module('businesspartner.evaluationschema');
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationSchemaSubgroupService',
		['globals', 'businessPartnerEvaluationSchemaGroupService', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
			'platformRuntimeDataService', 'businessPartnerEvaluationschemaSubgroupValidationService', 'PlatformMessenger',
			function (globals, businessPartnerEvaluationSchemaGroupService, platformDataServiceFactory, basicsLookupdataLookupDescriptorService,
				platformRuntimeDataService, validationService, PlatformMessenger) {

				let serviceOption = {
					flatNodeItem: {
						module: businesspartnerEvaluationschemaModule,
						serviceName: 'businessPartnerEvaluationSchemaSubgroupService',
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationsubgroup/', endCreate: 'createnew'},
						httpRead: {
							route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationsubgroup/',
							endRead: 'list'
						},
						actions: {
							delete: true,
							create: 'flat'
						},
						entityRole: {
							node: {
								itemName: 'Subgroup',
								parentService: businessPartnerEvaluationSchemaGroupService
							}
						},
						dataProcessor: [{processItem: processItem}],
						presenter: {
							list: {
								handleCreateSucceeded: function handleCreateSucceeded(creationData, data) { // jshint ignore: line
									// Set the Sorting field as the max value of the current list.
									let newItem = creationData,
										list = data.getList(),
										newSorting = _.max(_.map(list, 'Sorting'));
									if (newSorting) {
										newItem.Sorting = newSorting + 1;
									} else {
										newItem.Sorting = 1;
									}
									let parentSelected = businessPartnerEvaluationSchemaGroupService.getSelected();
									if (!parentSelected) {
										newItem.GroupSorting = '#' + parentSelected.Sorting + '.' + newItem.Sorting;
									}
								}
							}
						},
						translation: {
							uid: '43E66D41-8B95-4770-8920-A98C198DA0C9',
							title: 'businesspartner.evaluationschema.title.subgroups',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}, {
								header: 'businesspartner.evaluationschema.entityCommentText', field: 'CommentTextInfo'
							}],
							dtoScheme: {
								typeName: 'EvaluationSubgroupDto',
								moduleSubModule: 'BusinessPartner.EvaluationSchema'
							}
						}
					}
				};
				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption),
					validationServiceInstance = validationService(serviceContainer.service);

				angular.extend(serviceContainer.service, {
					multiSelectValueChangeEvent: new PlatformMessenger()
				});

				init();

				return serviceContainer.service;

				function processItem(item) {
					platformRuntimeDataService.applyValidationResult(validationServiceInstance.validateWeighting(item, item.Weighting, 'Weighting'), item, 'Weighting');
				}

				function init() {
					serviceContainer.data.listLoaded.register(listChangeHandler);
				}

				function listChangeHandler() {
					serviceContainer.service.getList().forEach(function (item) {
						processItem(item);
					});
				}
			}
		]);
})(angular);