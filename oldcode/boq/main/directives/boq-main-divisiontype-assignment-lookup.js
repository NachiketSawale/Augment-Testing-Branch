/**
 * Created by xia on 3/1/2018.
 */

(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc directive
	 * @name boqMainDivisionTypeAssignmentLookup
	 * @requires $q
	 * @description display a grid view to configure totals by filter selection
	 */

	angular.module(moduleName).directive('boqMainDivisionTypeAssignmentLookup', [
		'$q', '$translate', '$injector', 'basicsLookupdataSimpleLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		'platformGridDomainService', 'basicsLookupdataLookupDescriptorService', 'boqDivisionTypeAssignmentFormatterService',
		function ($q, $translate, $injector, basicsLookupdataSimpleLookupService, BasicsLookupdataLookupDirectiveDefinition,
			platformGridDomainService, basicsLookupdataLookupDescriptorService, boqDivisionTypeAssignmentFormatterService) {
			var defaults = {
				uuid: 'c8546cf72bdd48338a0812378a9aa25f',
				lookupType: 'boqMainDivisionTypeAssignment',
				valueMember: 'Id',
				displayMember: 'Description',
				field: 'DivisionTypeAssignment',
				showCustomInputContent: true,
				formatter: function displayFormatter(data/* , lookupItem, displayValue, lookupConfig */) {
					var divisionTypes = boqDivisionTypeAssignmentFormatterService.getDivisionTypes();
					return _.map(data, function (item) {
						var divisionTypeItem = _.find(divisionTypes, {'Id': item.BoqDivisionTypeFk});
						return !divisionTypeItem ? '' : divisionTypeItem.Code;
					}).join(', ');
				},
				idProperty: 'Id',
				columns: [
					{
						id: 'Filter',
						field: 'Filter',
						name: 'Filter',
						name$tr$: 'cloud.common.Filter_FilterTitle_TXT',
						width: 70,
						toolTip: 'Filter',
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: true
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'basics.customize.code',
						width: 75
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						width: 150
					}
				],
				popupOptions:
					{
						templateUrl: 'grid-popup-lookup.html',
						controller: 'boqDivisionTypeAssignmentController',
						width: 250, height: 300
					},
				onDataRefresh: function (/* $scope */) {
					//
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (/* e, args */) {
							// var scope = this;
						}
					},
					{
						name: 'onInputGroupClick',
						handler: function (e/* , args */) {
							var scope = this;
							// if this has been setted readonly,
							if (this.ngReadonly) {
								return;
							}
							// clear all items
							if (e && e.target && e.target.className && e.target.className.indexOf('ico-input-delete') !== -1) {
								if (scope.entity && angular.isArray(scope.entity.DivisionTypeAssignment) && scope.entity.DivisionTypeAssignment.length > 0) {
									var boqDivisionTypeAssignmentUpdateService = $injector.get('boqDivisionTypeAssignmentUpdateService');
									_.forEach(scope.entity.DivisionTypeAssignment, function (item) {
										boqDivisionTypeAssignmentUpdateService.addBoq2DivisionTypeToUpdateByAssignment(scope.entity, item, false);
									});
									var boqMainService = $injector.get('boqMainService');
									boqMainService.divisionTypeAssignmentChanged.fire(boqMainService, scope.entity.DivisionTypeAssignment, scope, true);
									var selectedBoqItem = boqMainService.getSelected();
									selectedBoqItem.DivisionTypeAssignment = [];
									boqMainService.gridRefresh();
								}
							}
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function (settings, scope) {
						return scope.entity.DivisionTypeAssignment ? $q.when(scope.entity.DivisionTypeAssignment) : $q.when([]);
					},
					getItemByKey: function (value, options, scope) {
						value = angular.copy(scope.ngModel);
						return $q.when([]);
					}
				},
				processData: function (data/* , options */) {
					var divisionTypes = angular.copy(boqDivisionTypeAssignmentFormatterService.getDivisionTypes());
					_.forEach(divisionTypes, function (item) {
						item.Filter = _.findIndex(data, {'BoqDivisionTypeFk': item.Id}) > -1;
					});
					return divisionTypes;
				},
				controller: ['$scope', 'platformGridAPI', 'platformCreateUuid', function (/* $scope */) {
					/* $.extend($scope.lookupOptions, {
						 //formatterOptions: $scope.$parent.config.formatterOptions,
						 dataToProcess: $scope.entity.DivisionTypeAssignment
					}); */
				}]
			});
		}
	]);

})(angular);
