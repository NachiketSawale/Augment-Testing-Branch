/**
 * Created by balkanci on 19.05.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';

	angular.module('platform').factory('platformLongtextFormControllerFactory', ['_', 'platformLongTextRegisterService', '$translate', 'platformGridAPI', 'platformObjectHelper', 'platformRuntimeDataService',
		function (_, longTextRegisterService, $translate, platformGridAPI, objectHelper, platformRuntimeDataService) {

			var service = {};

			function generateFormConfig(entity, longTextProperties) {
				var configStub = {
					fid: 'platform.longText.remarkForm',
					version: '1.0.0',
					showGrouping: true,
					groups: [],
					rows: []
				};

				var configClone = _.clone(configStub);

				_.each(longTextProperties, function (item, index) {
					configClone.rows.push({
						gid: index,
						rid: 'remark',
						domain: 'remark',
						type: 'remark',
						subtype: 'remark',
						model: item.displayProperty,
						visible: true,
						sortOrder: index,
						readonly: platformRuntimeDataService.isReadonly(entity, item.displayProperty)
					});
					configClone.groups.push({
						gid: index,
						identifier: item.displayProperty,
						header: $translate.instant(item.propertyTitle),
						isOpen: index === 0,
						visible: true,
						sortOrder: index
					});
				});

				return configClone;
			}

			service.initTextController = function ($scope, translationService, moduleName) {

				var containerDescription = $translate.instant('platform.longTextContainer.container');
				$scope.path = globals.appBaseUrl;
				var formConfig = generateFormConfig(null, null);

				$scope.formOptions = {
					configure: formConfig
				};

				$scope.formContainerOptions = {
					formOptions: $scope.formOptions
				};

				var setSelectionListener = function setSelectionListener() {
					$scope.dataService.unregisterSelectionChanged(loadCurrentItem);

					function loadCurrentItem() {
						$scope.currentItem = $scope.dataService.getSelected();
						if (!$scope.currentItem) {
							longTextRegisterService.clear(moduleName);
						}
					}

					$scope.dataService.registerSelectionChanged(loadCurrentItem);
				};

				// set the new entity to show the remark property
				var configure = function configure(dataObject) {

					var service = dataObject.service;
					$scope.currentItem = dataObject.entity;
					// set the watch on the new currentItem
					setWatch(dataObject);
					// when dataService ref is different a new container wants to present its remark properties
					if ($scope.dataService !== service) {
						$scope.gridId = service.getRelatedGridId();
						platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
						$scope.dataService = service;
						var relatedContainerTitle = $translate.instant(service.getRelatedContainerTitle());

						$scope.messageItems = [{titleKey: containerDescription, messageKey: relatedContainerTitle}];

						formConfig = generateFormConfig(dataObject.entity, service.getLongTextProperties());
						$scope.formOptions.configure = formConfig;
						platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
						setSelectionListener();
						$scope.$broadcast('form-config-updated');
					}
				};

				function onActiveCellChanged(event, args) {
					if (!objectHelper.isSet(args.cell)) {
						// if there is no active cell, early exit
						return;
					}
					var group2Open = null;
					// A group in the remark-container has the same identifier as the fieldName
					var groupIdentifier = args.grid.getColumns()[args.cell].field;
					if (groupIdentifier) {
						group2Open = _.find($scope.formOptions.configure.groups, function (group) {
							return group.identifier === groupIdentifier;
						});
					}

					if (group2Open) {
						// close all groups
						_.each($scope.formOptions.configure.groups, function (group) {
							group.isOpen = false;
						});

						group2Open.isOpen = true;
						$scope.$broadcast('form-config-updated');
					}

				}

				function setWatch(serviceObject) {

					var service = serviceObject.service;
					var longtextOptions = service.getLongTextProperties();

					var handle = $scope.$watch(function () {
						return $scope.currentItem;
					}, function (newItem, oldItem) {

						// early exit
						if (newItem === oldItem || !newItem || !oldItem) {
							return;
						} else {
							// enitity has changed, so the id did, set a new watch for the new reference
							if (!_.isEqual(newItem, oldItem) && !_.isEqual(newItem.Id, oldItem.Id) || $scope.dataService !== service) {
								// remove the current watch
								handle();
								return;
							}
							// search in all longTextProperties for changes
							_.each(longtextOptions, function (option) {
								if (!_.isEqual(_.get(oldItem, option.displayProperty), _.get(newItem, option.displayProperty)) && _.isEqual(newItem.Id, oldItem.Id)) {
									service.markItemAsModified(newItem, service);
								}
							});
						}
					}, true);

				}

				longTextRegisterService.registerOnEntityAdded(configure);
				$scope.$on('$destroy', function () {
					longTextRegisterService.unregisterOnEntityAdded(configure);
					if (objectHelper.isSet($scope.gridId)) {
						platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
					}
				});

				var last = longTextRegisterService.getLastAddedEntityByModule(moduleName);
				if (last) {
					configure(last);
				}

			};

			return service;

		}
	]);
})(angular);
