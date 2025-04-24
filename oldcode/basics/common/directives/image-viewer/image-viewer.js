/**
 * @description: image viewer.
 */

(function (angular) {
	'use strict';

	function Watcher(scope) {
		this.scope = scope;
		this.list = [];
	}

	Watcher.prototype.watch = function (name, callBack) {
		this.list.push(this.scope.$watch(name, callBack));
	};

	Watcher.prototype.destroy = function () {
		this.list.forEach(function (unwatch) {
			unwatch();
		});
	};

	angular.module('basics.common').directive('basicsCommonImageViewer', ['platformObjectHelper', function (platformObjectHelper) {

		return {
			restrict: 'A',
			scope: {
				data: '=imgData',
				currentItem: '=imgCurrent',
				options: '=imgOptions'
			},
			templateUrl: window.location.pathname + '/basics.common/templates/image-viewer.html',
			controller: ['$http', '$scope', 'platformModalService', 'basicsCommonUtilities', controller]
		};

		function controller($http, scope, platformModalService, basicsCommonUtilities) {
			const watcher = new Watcher(scope);

			if (scope.data && !angular.isArray(scope.data)) {
				throw new Error('imgData must be an array');
			}

			scope.getImage = function (dataItem) {
				if (!scope.contentProperty) {
					throw new Error('Please bind img-content');
				}

				return dataItem ? basicsCommonUtilities.toImage(platformObjectHelper.getValue(dataItem, scope.contentProperty)) : '';
			};

			scope.generateFileElement = function () {
				return angular.element('<input type="file" accept="image/*" />');
			};

			scope.add = function () {
				const fileElement = scope.generateFileElement();

				fileElement.bind('change', addImage);
				fileElement.click();

				function addImage(e) {
					let reader = null;

					if (e.target.files.length > 0 && /image/.test(e.target.files[0].type)) {
						reader = new FileReader();
						reader.onload = function () {
							if (angular.isFunction(scope.onCreate)) {
								scope.onCreate(basicsCommonUtilities.toBlob(reader.result));
							}
						};
						reader.readAsDataURL(e.target.files[0]);
					}
					fileElement.unbind('change', addImage);
				}
			};

			scope.delete = function () {
				const modalOptions = {
					headerText: 'Delete Picture',
					headerTextKey: 'basics.common.questionDeleteImageHeaderText',
					bodyText: 'Do you want to delete this picture!',
					bodyTextKey: 'basics.common.questionDeleteImageBodyText',
					showCancelButton: true,
					showYesButton: true,
					showNoButton: true,
					iconClass: 'ico-question'
				};

				// show message box to confirm.
				platformModalService.showDialog(modalOptions).then(function (result) {
					if (!result || result.no) {
						return;
					}
					if (angular.isFunction(scope.onDelete)) {
						scope.onDelete();
					}
				});
			};

			scope.change = function () {
				// return if has no image data.
				if (scope.data.length === 0) {
					return;
				}

				const fileElement = scope.generateFileElement();

				fileElement.bind('change', changeImage);
				fileElement.click();

				function changeImage(e) {
					let reader = null;

					if (e.target.files.length > 0 && /image/.test(e.target.files[0].type)) {
						reader = new FileReader();
						reader.onload = function () {
							if (angular.isFunction(scope.onChange)) {
								scope.onChange(basicsCommonUtilities.toBlob(reader.result));
							}

						};
						reader.readAsDataURL(e.target.files[0]);
					}
					fileElement.unbind('change', changeImage);
				}
			};

			scope.$on('$destroy', function () {
				unregisterCommand();
				watcher.destroy();
			});

			init();

			function init() {
				if (angular.isDefined(scope.currentItem)) {
					scope.getCurrentItem = function () {
						let result = null;
						const dataArray = scope.data;

						if (angular.isArray(dataArray) && dataArray.length > 0) {
							for (let i = 0; i < dataArray.length; i++) {
								if (dataArray[i].isActive) {
									result = dataArray[i];
									break;
								}
							}
						}

						return result;
					};

					watcher.watch('getCurrentItem()', function (newValue) {
						scope.currentItem = newValue;
					});

					watcher.watch('currentItem', function (newValue) {
						show(newValue);
					});
				}

				// extend scope with options
				if (angular.isDefined(scope.options)) {
					angular.extend(scope, scope.options);
				}

				registerCommand();
			}

			function show(targetItem) {
				if (!targetItem) {
					return;
				}

				if (scope.data.length > 1) {
					scope.data.forEach(function (dataItem) {
						if (dataItem === targetItem) {
							dataItem.isActive = true;
						} else if (dataItem.isActive) {
							dataItem.isActive = false;
						}
					});
				}
			}

			function registerCommand() {
				if (angular.isObject(scope.messengers)) {
					scope.messengers.register(handleCommand);
				}

			}

			function unregisterCommand() {
				if (angular.isObject(scope.messengers)) {
					scope.messengers.unregister(handleCommand);
				}
			}

			function handleCommand(e, args) {
				switch (args.action) {
					case 'add':
						scope.add();
						break;
					case 'delete':
						scope.delete();
						break;
					case 'change':
						scope.change();
						break;
				}
			}

		}
	}]);

})(angular);