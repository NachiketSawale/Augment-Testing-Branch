/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyTagSelectorDialogService
	 * @function
	 *
	 * @description
	 * Provides a dialog box for selecting property key tags.
	 */
	angular.module(moduleName).factory('modelAdministrationPropertyKeyTagSelectorDialogService',
		modelAdministrationPropertyKeyTagSelectorDialogService);

	modelAdministrationPropertyKeyTagSelectorDialogService.$inject = ['_', '$translate',
		'$http', 'platformListSelectionDialogService'];

	function modelAdministrationPropertyKeyTagSelectorDialogService(_, $translate,
		$http, platformListSelectionDialogService) {

		const service = {};

		function retrieveAvailableItems() {
			return $http.get(globals.webApiBaseUrl + 'model/administration/propkeytag/tree').then(function (response) {
				const rootItems = [];

				const itemById = {};
				response.data.forEach(function (item) {
					if (item.IsTag) {
						item.image = 'control-icons ico-ctrl-label';
					} else {
						item.Id = 'c' + item.Id;
						item.children = [];
					}
					if (item.ParentId) {
						item.ParentId = 'c' + item.ParentId;
					}

					itemById[item.Id] = item;
				});
				response.data.forEach(function (item) {
					if (item.ParentId) {
						itemById[item.ParentId].children.push(item);
					} else {
						rootItems.push(item);
					}
				});

				return rootItems;
			});
		}

		const nodeColumnsDef = [{
			id: 'description',
			formatter: 'description',
			name$tr$: 'cloud.common.entityDescription',
			field: 'Description',
			width: 200
		}];

		service.showDialog = function (config) {
			const actualConfig = _.assign({
				selectedTags: [],
				acceptEmptySelection: true
			}, config);

			return retrieveAvailableItems().then(function (allItems) {
				const dlgConfig = {
					dialogTitle: $translate.instant('model.administration.propertyKeys.selectTags'),
					allItems: allItems,
					value: _.clone(actualConfig.selectedTags),
					acceptItems: function (items) {
						return items.length > 0;
					},
					isSelectable: function (item) {
						return item.IsTag;
					},
					idProperty: 'Id',
					childrenProperty: 'children',
					availableColumns: nodeColumnsDef,
					selectedColumns: nodeColumnsDef
				};
				if (!actualConfig.acceptEmptySelection) {
					dlgConfig.acceptSelection = function (tags) {
						return !_.isEmpty(tags);
					};
				}

				return platformListSelectionDialogService.showDialog(dlgConfig).then(function (result) {
					if (result.success) {
						return _.map(result.value, function (selTag) {
							return _.isInteger(selTag) ? selTag : selTag.Id;
						});
					} else {
						return false;
					}
				});
			});
		};

		return service;
	}
})(angular);
