(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,$ */
	globals.lookups.prcStructure = function prcStructure($injector) {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'prcstructure',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'a4cc03889298406495178b513a0b8ead',
				columns: [
					{id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode'},
					{id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation',  name$tr$: 'cloud.common.entityDescription'},
					{id: 'Comment', field: 'CommentTextInfo', name: 'Comment', width: 300, formatter: 'translation', name$tr$: 'cloud.common.entityCommentText'},
					{id: 'AllowAssignment', field: 'AllowAssignment', name: 'AllowAssignment', width: 100, formatter: function (row,cell,value,columnDef,dataContext) {
						let colText = '<input disabled="disabled" type="checkbox" checked/>';
						if (!value) {
							colText = '<input disabled="disabled" type="checkbox"/>';
							let entityId = dataContext.Id;
							$injector.get('$timeout')(function () {
								$('.item-id_' + entityId).addClass('disabled');
							});
						}
						return '<div class="text-center" >' + colText + '</div>';
					}, readOnly: true, name$tr$: 'basics.procurementstructure.allowAssignment'}
				],
				width: 660,
				height: 200,
				treeOptions: {
					parentProp: 'PrcStructureFk',
					childProp: 'ChildItems',
					inlineFilters: true,
					hierarchyEnabled: true,
					lazyLoad: true
				},
				title: {name$tr$: 'basics.procurementstructure.dialogTitleStructure'},
				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					var searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g, searchValue);
				},
				matchDisplayMembers: ['Code', 'DescriptionInfo.Translated'],
				selectableCallback: function (dataItem) {
					// only dataItem.AllowAssignment can be assigned.
					return dataItem.IsLive && dataItem.AllowAssignment;
				}
			}
		};
	};

	angular.module(moduleName).directive('procurementContractPrcStructureDialog', [
		'BasicsLookupdataLookupDirectiveDefinition', '$translate', '$http','$q', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $translate, $http,$q, $injector) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.prcStructure($injector).lookupOptions, {
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					var getLastStructure = function () {
						var entity = $scope.entity;
						var id = entity.Id;
						var BusinessPartnerId = entity.BusinessPartnerFk;
						if (!_.isNull(BusinessPartnerId)) {
							var url = 'procurement/contract/header/getLastestPrcStructure?id=' + id + '&busniessPartnerFk=' + BusinessPartnerId;
							$http.get(globals.webApiBaseUrl + url).then(function (response) {
								if (null !== response.data) {
									$scope.entity.PrcHeaderEntity.StructureFk = response.data;
								}
							});
						}

					};
					$.extend($scope.lookupOptions, {
						extButtons: [
							{
								class: 'control-icons ico-input-get',
								// style: lookupButtonStyle,
								execute: getLastStructure,
								canExecute: function () {
									var entity = $scope.entity;
									if (!entity) {
										return false;
									}
									if (entity.__rt$data && entity.__rt$data.locked) {
										return false;
									}
									if (entity.__rt$data && !_.isNil(entity.__rt$data.readonly)) {
										var arrReadonlyFields = entity.__rt$data.readonly;
										var readonlyField = _.find(arrReadonlyFields, function (o) {
											return o.field === 'PrcHeaderEntity.StructureFk' && o.readonly;
										});
										if (readonlyField) {
											return false;
										}
									}
									return true;
								}
							}
						]
					});

				}]
			});
		}
	]);
})(angular, globals);