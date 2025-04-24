/**
 * Created by reimer on 20.12.2016.
 */

(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainTextComplementControllerFactory
	 * @function
	 *
	 * @description
	 * The service to initialize the mentioned controller.
	 */
	angular.module(moduleName).factory('boqMainTextComplementControllerFactory', [
		'$translate',
		'platformGridControllerService',
		'boqMainTextComplementServiceFactory',
		'boqMainTextComplementUIService',
		'boqMainTextComplementHelperService',
		'boqMainTextComplementConfigService',
		'boqMainCrbService',
		'boqMainOenService',
		'platformDialogService',
		'platformGridAPI',
		function ($translate,
			platformGridControllerService,
			textComplementServiceFactory,
			UIService,
			textComplementHelperService,
			boqMainTextComplementConfigService,
			boqMainCrbService,
			boqMainOenService,
			platformDialogService,
			platformGridAPI) {

			var service = {};

			/**
			 * @ngdoc function
			 * @name initController
			 * @function
			 * @methodOf boqMainDetailFormControllerService
			 * @description This function handles the initialization of the specification controller in whose context it is called
			 */
			service.initController = function ($scope, boqService, textComplementServiceKey) {

				var textComplementService = textComplementServiceFactory.getService(boqService, textComplementServiceKey);

				var myGridConfig = {initCalled: false, columns: []};
				platformGridControllerService.initListController($scope, UIService, textComplementService, null, myGridConfig);

				var removeTool = function (id) {
					$scope.tools.items = _.without($scope.tools.items, _.find($scope.tools.items, {'id': id}));
					$scope.tools.update();
				};
				removeTool('create');   // we must use create button in text controller!

				boqMainTextComplementConfigService.complTypeChanged.register($scope.complTypeChanged);

				var updateSpecification = function (textComplement, caption, body, tail) {
					var currentBlobSpecification = boqService.getCurrentSpecification();

					if (boqService.isOenBoq()) {
						boqMainOenService.replaceBlobSpecificationGap(currentBlobSpecification, textComplement.Sorting, body, textComplementHelperService);
					}
					else {
						var oldComplementPhrase = textComplementHelperService.findTextComplement(currentBlobSpecification.Content, textComplement.Sorting);
						var newComplementPhrase = textComplementHelperService.getHtmlComplementPhrase(caption, body, tail, textComplement.ComplType, textComplement.Sorting);

						if (currentBlobSpecification.Content.indexOf(newComplementPhrase) === -1) { // specification seems to be alreday updated.
							// Can occur since setCurrentSpecificationAsModified will cause second update call?!
							if (currentBlobSpecification.Content.indexOf(oldComplementPhrase) === -1) {
								platformDialogService.showErrorBox($translate.instant('boq.main.errorTextComplementEditFailed'), 'cloud.common.errorMessage');
								return;
							}

							currentBlobSpecification.Content = currentBlobSpecification.Content.replace(oldComplementPhrase, newComplementPhrase);
							platformGridAPI.grids.commitAllEdits();
						}
					}
				};

				$scope.complCaptionChanged = function (entity, newVal) {
					updateSpecification(entity, newVal, entity.ComplBody, entity.ComplTail);
				};

				$scope.complBodyChanged = function (entity, newVal) {
					updateSpecification(entity, entity.ComplCaption, newVal, entity.ComplTail);
				};

				$scope.complTailChanged = function (entity, newVal) {
					updateSpecification(entity, entity.ComplCaption, entity.ComplBody, newVal);
				};
				$scope.complTypeChanged = function (entity, newType) {
					var currentSpecification = boqService.getCurrentSpecification();
					entity.ComplType = newType;
					updateSpecification(entity, entity.ComplCaption, entity.ComplBody, entity.ComplTail);
					currentSpecification.Content = textComplementHelperService.adjustHtmlContent(currentSpecification.Content);
				};

				var onBeforeEditCell = function (e, args) {
					return boqService.isOenBoq() ? boqMainOenService.isTextcomplementFieldEditable(args.column.field) : true;
				};
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

				boqMainCrbService.tryDisableContainer($scope, boqService, true);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					boqMainTextComplementConfigService.complTypeChanged.unregister($scope.complTypeChanged);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
				});
			};

			return service;
		}
	]);
})();
