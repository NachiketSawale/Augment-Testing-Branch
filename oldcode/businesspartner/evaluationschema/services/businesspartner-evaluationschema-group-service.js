(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	let businesspartnerEvaluationschemaModule = angular.module('businesspartner.evaluationschema');
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationSchemaGroupService',
		['globals', 'businesspartnerEvaluationschemaHeaderService', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
			'platformRuntimeDataService', 'businessPartnerEvaluationschemaGroupValidationService',
			function (globals, businesspartnerEvaluationschemaHeaderService, platformDataServiceFactory, basicsLookupdataLookupDescriptorService,
				platformRuntimeDataService, validationService) {

				let serviceOption = {
					flatNodeItem: {
						module: businesspartnerEvaluationschemaModule,
						serviceName: 'businessPartnerEvaluationSchemaGroupService',
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationgroup/',endCreate: 'createnew'},
						httpRead: {
							route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationgroup/',
							endRead: 'list'
						},
						actions: {
							delete: true,
							create: 'flat'
						},
						entityRole: {
							node: {
								itemName: 'Group',
								parentService: businesspartnerEvaluationschemaHeaderService
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
								}
							}
						},
						translation: {
							uid: 'F5D871CA-744E-468C-B8D8-67EB1A22FB10',
							title: 'businesspartner.evaluationschema.title.groups',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}, {
								header: 'businesspartner.evaluationschema.entityCommentText', field: 'CommentTextInfo'
							}],
							dtoScheme: {
								typeName: 'EvaluationGroupDto', moduleSubModule: 'BusinessPartner.EvaluationSchema'
							}
						}
					}
				};
				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption),
					validationServiceInstance = validationService(serviceContainer.service);

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