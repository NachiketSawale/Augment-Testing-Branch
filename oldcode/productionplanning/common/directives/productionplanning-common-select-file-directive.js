/**
 * Created by lav on 4/9/2019.
 */
(function (angular) {
	'use strict';
	/* globals _ */

	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc function
	 * @name productionplanningCommonSelectFileDirective
	 * @function
	 * @methodOf
	 * @description Support to select a list of files which belong to a directory or select the name(without extension) of a file
	 * @param {}
	 * @param {}
	 * @returns {}
	 */
	angular.module(moduleName).directive('productionplanningCommonSelectFileDirective',
		['$injector',
			'$compile',
			'$translate',
			function ($injector,
					  $compile,
					  $translate) {
				return {
					restrict: 'A',
					require: '^ngModel',
					scope: true,
					link: function (scope, element, attrs, ngModelCtrl) {
						var options = scope.$eval('$parent.' + attrs.options) || {};
						var chooseFolder = options.chooseFolder;
						let multiple = chooseFolder || _.isNil(options.multiple) ? '' : ' multiple ';
						let accept = chooseFolder || _.isNil(options.accept) ? '' : ` accept="${options.accept}" `;
						var getFileName = options.getFileName;
						scope.chooseFile = function () {
							// var fileInput = angular.element('<input type="file" ' + (chooseFolder ? 'webkitdirectory' : '') + '>');
							let htmlTmpl = `<input type="file" ${chooseFolder ? 'webkitdirectory' : ''} ${accept} ${multiple} />`;
							let fileInput = angular.element(htmlTmpl);
							fileInput.bind('change', function (e) {
								var files = e.target && e.target.files;
								if (chooseFolder || multiple) {
									setValue(files);
								} else {
									if (!getFileName) {
										setValue(files[0]);
									} else {
										setValue(files[0].name);
									}
								}
							}).bind('destroy', function () {
								fileInput.unbind('change');
							});
							fileInput.click();
						};

						function setValue(value) {
							ngModelCtrl.$setViewValue(value);
							ngModelCtrl.$commitViewValue();
							scope.$eval('$parent.' + attrs.config).rt$change();
							scope.$evalAsync();
						}

						function onChanged(arg) {
							if (!chooseFolder) {
								setValue(arg.target.value);
							}
						}

						var unwatchModel = scope.$watch('$parent.' + (attrs.model || attrs.ngModel), function (value) {
							var displayTxt = value;
							if (displayTxt) {
								if (chooseFolder || multiple) {
									var folder = value[0].webkitRelativePath.split('/')[0];
									displayTxt = folder + '    (' + value.length + ' ' + $translate.instant('productionplanning.common.files') + ')';
									if (multiple) {
										displayTxt += ':';
										_.each(value, file =>{
											displayTxt += file.name+';';
										});
									}
								} else {
									if (!getFileName) {
										displayTxt = value.name;
									} else {
										displayTxt = value;
									}
								}
							}
							if (scope.displayTxt !== displayTxt) {
								scope.displayTxt = displayTxt;
							}
						});

						var template =
							/*jshint multistr: true */
							'<div class="control-directive input-group form-control">\
								<input type="text" class="input-group-content" data-platform-control-validation data-platform-select-on-focus\
								data-ng-readonly="#readonly#" data-config="#config#" data-entity="#entity#" data-ng-value="displayTxt" placeholder="#placeholder#"/>\
								<span class="input-group-btn">\
									<button class="btn btn-default input-sm" data-ng-click="chooseFile()" title="#tooltip#">\
										<img class="block-image #image#">\
									</button>\
								</span>\
							</div>';

						template = template.replace('#config#', '$parent.' + attrs.config)
							.replace('#entity#', '$parent.' + attrs.entity)
							.replace('#readonly#', options.readonly === false ? false : true)
							.replace('#placeholder#', $translate.instant(chooseFolder ? 'productionplanning.common.chooseFolder' : 'productionplanning.common.chooseFile'))
							.replace('#tooltip#', $translate.instant(chooseFolder ? 'productionplanning.common.chooseFolder' : 'productionplanning.common.chooseFile'))
							.replace('#image#', chooseFolder ? 'tlb-icons ico-select-path' : 'tlb-icons ico-open1');

						var templateEle = angular.element(template);
						templateEle.find('input').bind('change', onChanged);

						$compile(templateEle.appendTo(element))(scope);

						scope.$on('$destroy', function () {
							unwatchModel();
							templateEle.find('input').unbind('change', onChanged);
						});
					}
				};
			}]);

})(angular);