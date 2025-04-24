/**
 * Created by bh on 19.12.2014.
 */
(function () {
	/* global _ */
	'use strict';

	const moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainSpecificationControllerService
	 * @function
	 *
	 * @description
	 * The service to initialize the mentioned controller.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainSpecificationControllerService', ['$injector', '$translate','$rootScope','platformPermissionService','basicCustomizeSystemoptionLookupDataService','boqMainTextComplementServiceFactory','boqMainTextComplementHelperService','boqMainCommonService','boqMainReadonlyProcessor','boqMainCrbService','boqMainOenService',
		function ($injector, $translate,$rootScope, platformPermissionService, basicCustomizeSystemoptionLookupDataService, textComplementServiceFactory, boqMainTextComplementHelperService, boqMainCommonService, boqMainReadonlyProcessor, boqMainCrbService, boqMainOenService) {
			var service = {};
			var boqMainService;

			/**
			 * @ngdoc function
			 * @name initSpecificationController
			 * @function
			 * @methodOf boqMainDetailFormControllerService
			 * @description This function handles the initialization of the specification controller in whose context it is called
			 */
			service.initSpecificationController = function($scope, boqMainServiceParam, textComplementServiceKey) {
				boqMainService = boqMainServiceParam;
				var textComplementService = textComplementServiceFactory.getService(boqMainService, textComplementServiceKey);

				var isEditable = function () {
					let entity = boqMainService.getSelected();
					let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					return !boqMainService.getReadOnly() && platformPermissionService.hasWrite(boqMainService.getContainerUUID().toLowerCase()) && _.isObject(entity) &&
						!boqMainService.isCrbBoq() &&
						((boqMainService.isOenBoq() && boqMainOenService.isBlobSpecificationEditable(boqMainService)) ||
						(!boqMainCommonService.isDivisionOrRoot(entity) || boqMainCommonService.isDivision(entity) && boqMainService.isFreeBoq()) &&
						boqMainReadonlyProcessor.isFieldEditable(entity, 'BasBlobsSpecificationFk', boqMainService) && // check also boqMainReadonlyProcessor...
						!platformRuntimeDataService.isReadonly(entity, 'BasBlobsSpecificationFk'));
				};

				// #region directive parameter
				$scope.addTextComplement = null;
				$scope.selectTextComplement = null;
				$scope.getContainerUUID = function getContainerUUID() { return '43107E9C90944E7BADC9239DEF245820'; };
				$scope.editable = isEditable();
				$scope.imageDataUrl = 'from control';
				$scope.specification = boqMainService.getCurrentSpecification(); // Returns a reference and not a value so it's always up-to-date !!
				$scope.editorOptions = { canAddTextComplement: null };
				// #endregion

				boqMainCrbService.tryDisableContainer($scope, boqMainService, true);

				// #region tools

				var tools = [boqMainOenService.addBlobSpecificationSwitchTool($scope, boqMainService, textComplementService)];
				tools.push({
					id: 'tc1',
					type: 'item',
					iconClass: 'tlb-icons ico-text-complements1',
					fn: function () {
						if (!$scope.readonly && $scope.editorOptions.canAddTextComplement()) {
							if (boqMainService.isOenBoq()) {
								$scope.addTextComplement = boqMainOenService.createBlobSpecificationGap('al');
							}
							else {
								textComplementService.insertNewTextComplement(0).then(function (phrase) {
									$scope.addTextComplement = phrase;
								});
							}
						}
					},
					disabled: function() {
						return !$scope.editable;
					}
				});
				tools.push({
					id: 'tc2',
					type: 'item',
					iconClass: 'tlb-icons ico-text-complements2',
					fn: function () {
						if (!$scope.readonly && $scope.editorOptions.canAddTextComplement()) {
							if (boqMainService.isOenBoq()) {
								$scope.addTextComplement = boqMainOenService.createBlobSpecificationGap('bl');
							}
							else {
								textComplementService.insertNewTextComplement(1).then(function(phrase) {
									$scope.addTextComplement = phrase;
								});
							}
						}
					},
					disabled: function() {
						return !$scope.editable;
					}
				});
				tools.push({
					id: 'tc3',
					type: 'item',
					iconClass: 'tlb-icons ico-text-complements3',
					fn: function () {
						if (!$scope.readonly && $scope.editorOptions.canAddTextComplement()) {
							$scope.addTextComplement = boqMainOenService.createBlobSpecificationGap('blo');
						}
					},
					disabled: function() {
						return !$scope.editable || !boqMainService.isOenBoq();
					}
				});
				$scope.setTools({showImages:true, showTitles:true, cssClass:'tools', items:tools});

				// OENORM and GAEB get different captions for the new tool buttons.
				var updateToolCaptions = function() {
					if (!$scope.tools) {
						return;
					}

					function setCaption(tooId, caption) {
						const tool = _.find($scope.tools.items, {'id':tooId});
						if (tool) {
							tool.caption  = '';
							if (caption) {
								tool.caption += $translate.instant('boq.main.'+caption) + '\n';
								tool.caption += $translate.instant('boq.main.textComplementHint') + ' "'+$translate.instant('boq.main.boqMainHtmlTextComplement')+'"';
							}
						}
					}

					if (boqMainService.isOenBoq()) {
						setCaption('tc1', 'oen.uicontainer.blobSpecification.al');
						setCaption('tc2', 'oen.uicontainer.blobSpecification.bl');
						setCaption('tc3', 'oen.uicontainer.blobSpecification.blo');
					}
					else {
						setCaption('tc1', 'addTextComplementBidder');
						setCaption('tc2', 'addTextComplementClient');
						setCaption('tc3');
					}

					$scope.tools.update();
				};
				boqMainService.registerForBoqChanged($scope, updateToolCaptions);

				// #endregion

				var onCurrentBoqItemChanged = function() {
					$scope.editable = isEditable();
					$scope.specification = { Content: null, Id: 0, Version: 0 };

					if ($scope.tools && _.isFunction($scope.tools.update)) {
						$scope.tools.update();  // force to call disabled fn of toolbar buttons
					}
				};
				boqMainService.registerSelectionChanged(onCurrentBoqItemChanged);

				// React on changes of the specification
				$scope.onTextChanged = function() {
					if (boqMainService.isOenBoq()) {
						boqMainOenService.setModifiedBlobSpecification(boqMainService);
					}
					else {
						boqMainService.setSpecificationAsModified($scope.specification);
					}

					// The deletion of text complements in HTML must be synchronized with the 'textComplementService'
					if ($scope.specification.Content) {
						_.forEach(textComplementService.getList(), function(textComplement) {
							if (!boqMainTextComplementHelperService.findTextComplement($scope.specification.Content, textComplement.Sorting)) {
								textComplementService.deleteItem(textComplement);
							}
						});
					}
				};

				var onCurrentTextComplementChanged = function() {
					var entity = textComplementService.getSelected();
					if (entity) {
						$scope.selectTextComplement = (entity.Sorting);
					}
				};
				textComplementService.registerSelectionChanged(onCurrentTextComplementChanged);

				// As the current specification has changed it has to be assigned it to the corresponding scope variable.
				function updateSpecification(specification) {
					if (!specification) { return; }

					if (!boqMainService.isOenBoq()) { // OENORM has its own handling of 'currentSpecificationChanged'
						$scope.specification = specification;
					}
				}
				boqMainService.currentSpecificationChanged.register(updateSpecification);

				// unregister boq service messenger
				$scope.$on('$destroy', function () {
					boqMainService.currentSpecificationChanged.unregister(updateSpecification);
					boqMainService.unregisterSelectionChanged(onCurrentBoqItemChanged);
					textComplementService.unregisterSelectionChanged(onCurrentTextComplementChanged);
				});
			};

			service.isForcedPlaintextForBoqSpecifications = function() {

				if ($rootScope.currentModule === 'estimate.main') {
					const isForcedPlaintextForBoqSpecifications = _.find(basicCustomizeSystemoptionLookupDataService.getList(), {'Id':50});
					return isForcedPlaintextForBoqSpecifications && isForcedPlaintextForBoqSpecifications.ParameterValue==='0';
				}
				else {
					const isForcedPlaintextForBoqSpecifications = _.find(basicCustomizeSystemoptionLookupDataService.getList(), {'Id': 50});
					return isForcedPlaintextForBoqSpecifications && isForcedPlaintextForBoqSpecifications.ParameterValue === '1';
				}
			};

			service.isOenBoq = function() {
				return boqMainService.isOenBoq();
			};

			return service;
		}]);
})();
