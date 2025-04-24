(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.common';

	angular.module(moduleName).service('ppsDocumentToolbarButtonExtension', Extension);

	Extension.$inject = ['basicsCommonToolbarExtensionService'];

	function Extension(basicsCommonToolbarExtensionService) {

		const documentActions = [{
			name: 'upload',
			iconClass: 'tlb-icons ico-upload-create',
			caption: 'productionplanning.common.document.uploadDocument',
		}, {
			name: 'download',
			iconClass: 'tlb-icons ico-download',
			caption: 'productionplanning.common.document.downloadDocument',
		}, {
			name: 'preview',
			iconClass: 'tlb-icons ico-preview-form',
			caption: 'productionplanning.common.document.previewDocument',
		}];

		this.extendDocumentButtons = extendDocumentButtons;
		this.createDocumentButtons = createDocumentButtons;

		function createDocumentButtons(ppsDocumentType, $scope, dataService) {
			const documentButtonsObj = {};
			const fns = {
				upload() {
					dataService.uploadDocument(ppsDocumentType).then(function () {
						$scope.tools.update();
					});
				},
				download() {
					dataService.downloadDocument(ppsDocumentType);
				},
				preview() {
					dataService.previewDocument($scope, true, ppsDocumentType);
				}
			};
			_.each(documentActions, function (action) {
				const tmpActionName = action.name.charAt(0).toUpperCase() + action.name.slice(1);
				documentButtonsObj[action.name + 'Button'] = {
					id: action.name + ppsDocumentType.name + 'Document',
					caption: 'productionplanning.common.document.' + action.name + ppsDocumentType.name,
					type: 'item',
					iconClass: action.iconClass,
					fn: fns[action.name],
					disabled: function () {
						return !dataService['can' + tmpActionName + 'Document'](ppsDocumentType);
					}
				};
			});

			return documentButtonsObj;
		}

		function createDocumentToolbarItems($scope, dataService, childButtons) {
			_.each(documentActions, function (action) {
				if (action.name === 'upload' && dataService.isDocumentReadOnly === true) {
					return; // If isDocumentReadOnly is true, it means document is readonly, then it doesn't allow user to upload document, we don't need to add the upload button.
				}
				const buttons = _.map(childButtons, action.name + 'Button'); // buttons for corresponding action preview, upload or download

				basicsCommonToolbarExtensionService.insertBefore($scope, {
					id: action.name,
					caption: action.caption,
					type: 'dropdown-btn',
					iconClass: action.iconClass,
					list: {
						showImages: true,
						listCssClass: 'dropdown-menu-right',
						items: buttons
					},
					disabled: function () {
						return buttons.every(btn => btn.disabled());
					}
				});
			});
		}

		function extendDocumentButtons(ppsDocumentTypes, $scope, dataService) {
			const buttons = _.map(ppsDocumentTypes, type => {
				return createDocumentButtons(type, $scope, dataService);
			});

			createDocumentToolbarItems($scope, dataService, buttons);

			dataService.registerSelectionChanged(updateToolbar);
			function updateToolbar () {
				$scope.tools.update();
			}

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(updateToolbar);
			});
		}
	}
})(angular);