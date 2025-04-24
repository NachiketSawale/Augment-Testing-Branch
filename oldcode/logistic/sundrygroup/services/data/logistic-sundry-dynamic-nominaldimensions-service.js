/**
 * Created by nitsche on 17.05.2020.
 */

(function (angular) {
	'use strict';

	var logisticSundryModule = angular.module('logistic.sundrygroup');

	/**
	 * @ngdoc service
	 * @name logisticSundryDynamicNominaldimensionService
	 * @function
	 *
	 * @description
	 * logisticSundryDynamicNominaldimensionService contains logic for dynamic assignments based on customized data
	 */
	logisticSundryModule.factory('logisticSundryDynamicNominaldimensionService', ['_', 'logisticCommonContextService', 'basicsLookupdataConfigGenerator', 'logisticSundryLookupService', 'controllingGroupDetailLookupDataService', 'platformSchemaService', 'logisticSundryServiceGroupConstantValues',
		function (_, logisticCommonContextService, basicsLookupdataConfigGenerator, logisticSundryLookupService, controllingGroupDetailLookupDataService, platformSchemaService, logisticSundryServiceGroupConstantValues) {

			var service = {};

			service.getCurrentAccount = function getCurrentAccount() {
				var accountData = logisticSundryLookupService.getSundryNominalDimensionAssignments();

				// filter for context, see also controlling unit context
				var currentLogisticDataContext = logisticCommonContextService.getLogisticContextFk();
				var assignment = _.first(_.filter(accountData, {ContextFk: currentLogisticDataContext}));

				return assignment;
			};

			service.getAccount2Label = function getAccount2Label() {
				var assignment2Label = {};
				var assignment = service.getCurrentAccount();
				// found a assignment?
				if (assignment) {
					var groups = logisticSundryLookupService.getControllingUnitGroups();
					_.each(_.range(1, 7), function (noi) {
						_.each(_.range(1, 4), function (noj) {
							var controllinggroupFk = assignment['Controllinggroup' + _.padStart(noi, 2, '0') +_.padStart(noj, 2, '0') + 'Fk'];
							var groupDesc = _.get(_.find(groups, {Id: controllinggroupFk}), 'DescriptionInfo.Translated');

							if (_.isString(groupDesc) && _.size(groupDesc) > 0) {
								assignment2Label['NominalDimension' + _.padStart(noi, 2, '0') +_.padStart(noj, 2, '0') + 'Name'] = groupDesc;
							}
						});
					});
				}

				return assignment2Label;
			};

			service.setAccountLabels = function setAccountLabels(rows) {
				var account2Label = service.getAccount2Label();
				var accountsRows = _.get(_.find(rows, {gid: 'accounts'}),'attributes');
				_.each(accountsRows, function (row) {
					var name = account2Label[row + 'Name'];
					if (_.isString(name)) {
						row.label = name;
					}
				});
			};

			service.setAccountOverloads = function setAccountOverloads(assignmentAttributes, overloads) {
				var assignment = service.getCurrentAccount();
				// found a assignment?
				if (assignment) {
					_.each(assignmentAttributes, function (attribute) {
						if(_.includes(attribute,'nominaldimension')) {
							var assignmentNo = attribute.slice(-4);
							// assignment['Controllinggroup' + assignmentNo + 'Fk'];
							var controllingGroupFk = assignment['ControllingGroup' + assignmentNo + 'Fk'];

							if (controllingGroupFk !== null) {
								var config = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
									dataServiceName: 'controllingGroupDetailLookupDataService',
									filter: function (/* item */) {
										return controllingGroupFk || null;
									},
									enableCache: true,
									isTextEditable: true,
									events: [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var selectedItem = args.entity;
											var selectedLookupItem = args.selectedItem;

											if (selectedLookupItem && selectedItem) {
												var field = 'Controllinggrpdetail' + _.padStart(assignmentNo, 2, '0') + 'Fk';
												selectedItem[field] = selectedLookupItem.Id;
											}
										}
									}],
									columns: [
										{
											id: 'Code',
											field: 'Code',
											name: 'Code',
											formatter: 'code',
											name$tr$: 'cloud.common.entityCode'
										},
										{
											id: 'Description',
											field: 'DescriptionInfo',
											name: 'Description',
											formatter: 'translation',
											name$tr$: 'cloud.common.entityDescription'
										},
										{
											id: 'CommentText',
											field: 'CommentText',
											name: 'Comment',
											formatter: 'description',
											name$tr$: 'cloud.common.entityCommentText'
										}
									]
								}, {
									formatter: function (row, cell, value, m) {
										var assignmentNo =m.field.slice(-4);
										var controllingGroupFk = assignment['ControllingGroup' + assignmentNo + 'Fk'];
										var lookupResult = _.find(logisticSundryLookupService.getControllingUnitDetails(controllingGroupFk), {
											Code: value
										});
										if (m.id && lookupResult) {
											if (m.id.toLowerCase().match('description')) {
												return lookupResult.DescriptionInfo.Translated;
											}
											else if (m.id.toLowerCase().match('commenttext')) {
												return lookupResult.CommentText;
											}
											else if (m.id.toLowerCase().match('code')) {
												return lookupResult.Code;
											}
										}
										return value;
									}
								});

								// to fix format defect, delete this field according to "formatterValue" function in platform-grid-domain-service.js.
								config.grid.formatterOptions.displayMember = null;

								overloads[attribute] = config;
							}
							else {
								var domain = platformSchemaService.getSchemaFromCache(logisticSundryServiceGroupConstantValues.schemes.account);
								if (domain.properties['NominalDimension' + attribute.slice(-4)]) {
									var maxlen = domain.properties['NominalDimension' + attribute.slice(-4)].maxlen || 32;
									overloads[attribute] = {
										grid: {maxLength: maxlen},
										detail: {maxLength: maxlen}
									};
								}
							}
						}
					});
				}
			};

			return service;
		}]);
})(angular);
