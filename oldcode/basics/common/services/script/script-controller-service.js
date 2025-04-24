/**
 * Created by wui on 7/26/2016.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonScriptControllerService', [
		'PlatformMessenger', 'platformModalService', 'globals',
		function (PlatformMessenger, platformModalService, globals) {
			return {
				initController: function ($scope, options) {
					// Toolbar command
					const command = new PlatformMessenger();

					// Standard toolbar for script container.
					const toolbarItems = [
						{
							id: 't00',
							sort: 0,
							caption: 'basics.common.taskBar.undo',
							type: 'item',
							iconClass: 'tlb-icons ico-undo',
							fn: fireCommand('undo')
						},
						{
							id: 't01',
							sort: 1,
							caption: 'basics.common.taskBar.redo',
							type: 'item',
							iconClass: 'tlb-icons ico-redo',
							fn: fireCommand('redo')
						},
						{
							id: 't09',
							sort: 9,
							caption: 'basics.common.taskBar.renameVariable',
							type: 'item',
							iconClass: 'tlb-icons ico-rename-variable',
							fn: fireCommand('rename')
						},
						{
							id: 't11',
							sort: 11,
							caption: 'basics.common.taskBar.jumpBack',
							type: 'item',
							iconClass: 'tlb-icons ico-jump-back',
							fn: fireCommand('jumpBack')
						},
						{
							id: 't10',
							sort: 10,
							caption: 'basics.common.taskBar.jumpToDef',
							type: 'item',
							iconClass: 'tlb-icons ico-jump-to-def',
							fn: fireCommand('jumpToDef')
						},
						{
							id: 't19',
							sort: 19,
							caption: 'basics.common.taskBar.showHint',
							type: 'item',
							iconClass: 'tlb-icons ico-show-type-doc',
							fn: fireCommand('showDoc')
						},
						{
							id: 't20',
							sort: 20,
							caption: 'basics.common.taskBar.codeFold',
							type: 'item',
							iconClass: 'tlb-icons ico-code-fold',
							fn: fireCommand('foldAll')
						},
						{
							id: 't21',
							sort: 21,
							caption: 'basics.common.taskBar.codeUnfold',
							type: 'item',
							iconClass: 'tlb-icons ico-code-unfold',
							fn: fireCommand('unfoldAll')
						},
						{
							id: 't30',
							sort: 30,
							caption: 'basics.common.taskBar.comment',
							type: 'item',
							iconClass: 'tlb-icons ico-toggle-comment',
							fn: fireCommand('toggleComment')
						},
						{
							id: 't31',
							sort: 31,
							caption: 'basics.common.taskBar.indent',
							type: 'item',
							iconClass: 'tlb-icons ico-code-indent',
							fn: fireCommand('indent')
						},
						{
							id: 't32',
							sort: 32,
							caption: 'basics.common.taskBar.format',
							type: 'item',
							iconClass: 'tlb-icons ico-code-format',
							fn: fireCommand('format')
						},
						{
							id: 't41',
							sort: 41,
							caption: 'basics.common.taskBar.find',
							type: 'item',
							iconClass: 'tlb-icons ico-find',
							fn: fireCommand('find')
						},
						{
							id: 't42',
							sort: 42,
							caption: 'basics.common.taskBar.clearSearch',
							type: 'item',
							iconClass: 'tlb-icons ico-find-clear',
							fn: fireCommand('clearSearch')
						},
						{
							id: 't44',
							sort: 44,
							caption: 'basics.common.taskBar.findPrev',
							type: 'item',
							iconClass: 'tlb-icons ico-find-previous',
							fn: fireCommand('findPrev')
						},
						{
							id: 't43',
							sort: 43,
							caption: 'basics.common.taskBar.findNext',
							type: 'item',
							iconClass: 'tlb-icons ico-find-next',
							fn: fireCommand('findNext')
						},
						{
							id: 'd110',
							sort: 119,
							type: 'divider'
						},
						{
							id: 't45',
							sort: 45,
							caption: 'basics.common.taskBar.replace',
							type: 'item',
							iconClass: 'tlb-icons ico-replace',
							fn: fireCommand('replace')
						},
						{
							id: 't46',
							sort: 46,
							caption: 'basics.common.taskBar.replaceAll',
							type: 'item',
							iconClass: 'tlb-icons ico-replace-all',
							fn: fireCommand('replaceAll')
						},
						{
							id: 'd120',
							sort: 129,
							type: 'divider'
						},
						{
							id: 't47',
							sort: 47,
							caption: 'basics.common.taskBar.jumpToLine',
							type: 'item',
							iconClass: 'tlb-icons ico-jump-to-line',
							fn: fireCommand('jumpToLine')
						},
						{
							id: 't98',
							sort: 98,
							caption: 'basics.common.taskBar.shortcuts',
							type: 'item',
							iconClass: 'tlb-icons ico-info',
							fn: showShortcut
						}
						// {
						// 	id: 't100',
						// 	sort: 100,
						// 	caption: 'basics.common.taskBar.showTypeDoc',
						// 	type: 'item',
						// 	iconClass: 'tlb-icons ico-script',
						// 	fn: fireCommand('showApiDoc')
						// }
					];

					$scope.onInit = function (cm, vm) {
						command.register(function (name) {
							if (name === 'rename') {
								vm.ts.rename(cm);
							} else if (name === 'jumpToDef') {
								vm.ts.jumpToDef(cm);
							} else if (name === 'jumpBack') {
								vm.ts.jumpBack(cm);
							} else if (name === 'showDoc') {
								vm.ts.showDocs(cm);
							} else if (name === 'toggleComment') {
								cm.toggleComment();
							} else if (name === 'indent') {
								vm.indent(cm);
							} else if (name === 'format') {
								vm.format(cm);
							} else if (name === 'showApiDoc') {
								showApiDoc(vm);
							} else {
								cm.execCommand(name);
							}
						});

						if (angular.isFunction(options.onInit)) {
							options.onInit(cm, vm);
						}
					};

					$scope.setTools({
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: toolbarItems
					});

					$scope.options = options || {};

					function fireCommand(name) {
						return function () {
							command.fire(name);
						};
					}

					function showShortcut() {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'basics.common/templates/script/script-shortcuts-view.html'
						});
					}

					function showDoc() {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'basics.common/templates/script/script-doc-view.html',
							controller: 'basicsCommonScriptDocController',
							resolve: {
								scriptApiId: function () {
									return options.scriptId;
								}
							},
							width: '1000px',
							height: '700px',
							resizeable: true
						});
					}

					function showApiDoc(vm) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'basics.common/templates/script/api-doc-view.html',
							controller: ['$scope', function ($scope) {
								$scope.doc = vm.getApiDoc();
							}],
							width: '1000px',
							height: '700px',
							resizeable: true
						});
					}

					function showHelp() {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'basics.common/templates/script/script-help-dialog.html',
							controller: 'basicsCommonScriptHelpDialogController',
							resolve: {
								scriptApiId: function () {
									return options.scriptId;
								}
							},
							width: '1000px',
							height: '700px',
							resizeable: true
						});
					}
				}
			};
		}
	]);

})(angular);