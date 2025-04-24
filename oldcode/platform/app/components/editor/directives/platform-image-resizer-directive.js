(function () {
	'use strict';

	angular.module('platform').directive('platformImageResizer', platformImageResizer);

	platformImageResizer.$inject = ['platformWysiwygEditorSettingsService', 'cloudDesktopTextEditorConsts'];

	function platformImageResizer(platformWysiwygEditorSettingsService, cloudDesktopTextEditorConsts) {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'app/components/editor/templates/image-resizer-template.html',
			scope: {
				imgWidth: '=',
				imgHeight: '=',
				options: '=',
				prop: '='
			},
			link: function ($scope) {

				$scope.oldImgWidth = $scope.imgWidth;
				$scope.oldImgHeight = $scope.imgHeight;

				let data = $scope.$parent.customSettings;
				let unit;
				if (data.user.useSettings) {
					unit = data.user.unitOfMeasurement;
				}
				else {
					unit = data.system.unitOfMeasurement;
				}

				let unitConst = cloudDesktopTextEditorConsts.units.find(item => item.value === unit);
				$scope.unit = unitConst.caption;

				$scope.widthChange = function () {
					let originalWidth = platformWysiwygEditorSettingsService.convertInRequiredUnit('px', unit, $scope.oldImgWidth);
					let newImgWidth = platformWysiwygEditorSettingsService.convertInRequiredUnit('px', unit, $scope.imgWidth);
					const scalingFactor = newImgWidth / originalWidth;
					$scope.imgHeight = $scope.oldImgHeight * scalingFactor;
					let imageHeight = platformWysiwygEditorSettingsService.convertInRequiredUnit('px', unit, $scope.imgHeight);
					$scope.prop.currentSpec.img.style.width = newImgWidth + 'px';
					$scope.prop.currentSpec.img.style.height = imageHeight + 'px';
					$scope.oldImgWidth = $scope.imgWidth;
					$scope.oldImgHeight = $scope.imgHeight;
					$scope.prop.quill.updateContents(null, 'user');
					$scope.prop.repositionOverlay();
				};

				$scope.heightChange = function () {
					let originalHeight = platformWysiwygEditorSettingsService.convertInRequiredUnit('px', unit, $scope.oldImgHeight);
					let newImgHeight = platformWysiwygEditorSettingsService.convertInRequiredUnit('px', unit, $scope.imgHeight);
					const scalingFactor = newImgHeight / originalHeight;
					$scope.imgWidth = $scope.oldImgWidth * scalingFactor;
					let imageWidth = platformWysiwygEditorSettingsService.convertInRequiredUnit('px', unit, $scope.imgWidth);
					$scope.prop.currentSpec.img.style.width = imageWidth + 'px';
					$scope.prop.currentSpec.img.style.height = newImgHeight + 'px';
					$scope.oldImgWidth = $scope.imgWidth;
					$scope.oldImgHeight = $scope.imgHeight;
					$scope.prop.quill.updateContents(null, 'user');
					$scope.prop.repositionOverlay();
				};

				const widthInput = document.getElementById('idWidth');
				const heightInput = document.getElementById('idHeight');

				widthInput.addEventListener('keydown', handleKeyDown);
				heightInput.addEventListener('keydown', handleKeyDown);

				function handleKeyDown(event) {
					if (event.key === 'Tab') {
						event.preventDefault();

						const isWidthInputFocused = document.activeElement === widthInput;

						if (isWidthInputFocused) {
							heightInput.focus();
						} else {
							widthInput.focus();
						}
						moveCursorToEnd(document.activeElement);
						$scope.prop.quill.updateContents(null, 'user');
						$scope.prop.repositionOverlay();
					}
					else if(event.key === 'Enter')
					{
						if(event.currentTarget.id==='idWidth')
						{
							$scope.imgWidth=event.target.value;
							$scope.widthChange();
						}
						else if(event.currentTarget.id === 'idHeight')
						{
							$scope.imgHeight=event.target.value;
							$scope.heightChange();
						}
						$scope.prop.repositionOverlay();
					}
				}

				function moveCursorToEnd(inputElement) {
					const valueLength = inputElement.value.length;

					inputElement.setSelectionRange(valueLength, valueLength);
				}
			}
		};
	}
})();