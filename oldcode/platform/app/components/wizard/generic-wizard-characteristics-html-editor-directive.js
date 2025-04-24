(function (angular) {
	'use strict';

	angular.module('platform').directive('characteristicsHtmlEditor', control);

	control.$inject = ['$compile', 'basicsLookupFileService', 'genericWizardContainerLayoutService', 'genericWizardCharacteristicsService', '$injector', '$http', '_', 'basicsConfigMainService', 'basicsCharacteristicDataServiceFactory'];

	function control($compile, fileService, layoutService, characteristicsService, $injector, $http, _, basicsConfigMainService, characteristicDataServiceFactory) {
		return {
			restrict: 'AE',
			scope: {
				ctnId: '=',
				docId: '=',
				moduleFk: '=',
				inProgress: '='
			},
			link: function ($scope, elem) {

				function getIds(content) {
					var ids = [];
					content.find('input').each(function () {
						ids.push(this.id);
					});
					return ids;
				}

				function getModel(domain, id) {
					return 'characEntities.c_' + id + '.' + characteristicsService.getBindingProp(domain);
				}

				function getEntityModel(id) {
					return 'characEntities.c_' + id;
				}

				function createDomainControl(domain, id, classes) {
					var model = getModel(domain, id);
					return $('<span dynamic-domain-control data-domain="' + domain + '" data-model="' + model + '"></span>').attr('class', classes);
				}

				// replaces the original input elements for domain controls
				function createDomainControlsFromCharacs(content, characList) {
					_.each(characList, function (charac) {
						var id = charac.Code;
						var oldInput = content.find('#' + id);
						var classes = oldInput.attr('class');
						oldInput.replaceWith(createDomainControl(charac.domain, id, classes));
					});
				}

				function createBinding(characValueList, mainItemId) {
					$scope.characEntities = {};

					_.each(characValueList, function (characValue) {
						if (characValue.CharacteristicEntity) {
							var code = characValue.CharacteristicEntity.Code;
							$scope.characEntities['c_' + code] = characValue;

							var expression = getEntityModel(code);
							$scope.$watch(expression, function (newVal, old) {
								if (newVal !== old) {
									characteristicsService.markItemAsModified(newVal, mainItemId);
								}
							}, true);
						}
					});
				}

				function renderCharacFields() {
					$scope.inProgress = true;
					fileService.getFileHtml($scope.docId).then(function (html) {
						var linkFn = $compile(html);
						var content = linkFn($scope);
						var ids = getIds(content);
						basicsConfigMainService.getByModuleId(parseInt($scope.moduleFk)).then(function (module) {
							var internalName = module.InternalName;
							characteristicsService.getSectionFromSectionName(internalName).then(function (section) {
								var info = layoutService.getContainerLayoutByContainerId(parseInt($scope.ctnId), internalName);
								var dataService = info.ctnrInfo.dataServiceName ? $injector.get(info.ctnrInfo.dataServiceName) : info.ctnrInfo.dataServiceProvider();
								characteristicsService.getCharacsFromCodeList(ids).then(function (characList) {
									var sectionId = section.Id;
									dataService.unregisterEntityCreated(renderCharacFields);
									dataService.registerEntityCreated(renderCharacFields);
									var mainItemId = dataService.getSelected() ? dataService.getSelected().Id : null;
									// cannot work without an selected Main Item Id
									if (!mainItemId) {
										$scope.inProgress = false;
										return;
									}
									var factory = characteristicDataServiceFactory.getService(dataService, sectionId);
									characteristicsService.setDependendService(factory);
									characteristicsService.createOrReadCharacValues(sectionId, characList, mainItemId).then(function (characValueList) {
										// the ids of the custom templates must match with a code from an characteristic
										createBinding(characValueList, mainItemId, factory);
										$scope.inProgress = false;
										createDomainControlsFromCharacs(content, characList);
										linkFn = $compile(content);
										content = linkFn($scope);
										elem.replaceWith(content);
									});
								});
							});
						});
					});
				}

				renderCharacFields();

			}
		};
	}
})(angular);