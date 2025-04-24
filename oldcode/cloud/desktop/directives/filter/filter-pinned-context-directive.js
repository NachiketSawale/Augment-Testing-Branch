(angular => {
	'use strict';

	let modulename = 'cloud.desktop';
	let directiveName = 'cloudDesktopFilterPinnedContext';

	angular.module(modulename).directive(directiveName, directiveFn);

	directiveFn.$inject = ['$translate', 'cloudDesktopPinningContextService', '_', '$compile'];

	function directiveFn($translate, pinningContextService, _, $compile) {
		return {
			restrict: 'E',
			scope: {
				options: '<?'
			},
			link: postLink
		};

		function postLink(scope, elem, attr) {
			scope.tokens = getTokenArray(_.get(scope.options, 'tokens'));
			scope.deleteTitle = $translate.instant('cloud.desktop.sbdeletePinningContext');

			function onClearPinningContext() {
				refresh();

				let onClearFn = _.get(scope, 'options.onClearFn');
				if (_.isFunction(onClearFn)) {
					onClearFn({pinningContexts: scope.pinningContexts});
				}
			}

			function onSetPinningContext() {
				refresh();
			}

			scope.clearPinningContext = function clearPinningContext(index) {
				pinningContextService.clearPinningItem(scope.pinningContexts[index].token);
			};

			function refresh() {
				create(scope.tokens, scope.options);
			}

			pinningContextService.onSetPinningContext.register(onSetPinningContext);
			pinningContextService.onClearPinningContext.register(onClearPinningContext);

			scope.$on('$stateChangeSuccess', () => {
				refresh();
			});

			// unregister on destroy
			scope.$on('$destroy', function () {
				pinningContextService.onSetPinningContext.unregister(onSetPinningContext);
				pinningContextService.onClearPinningContext.unregister(onClearPinningContext);
			});

			function getTokenArray(tokens) {
				let retVal = tokens || [];
				if (!_.isArray(retVal)) {
					retVal = [retVal];
				}
				return retVal;
			}

			function create(tokens, options) {
				let pinningContextArray = pinningContextService.getVisiblePinningContexts(getTokenArray(tokens));
				scope.pinningContexts = pinningContextArray;
				let template = getTemplate(pinningContextArray, options);

				elem.empty();
				let compiledElem = angular.element($compile(template)(scope)).addClass(_.get(options, 'cssClass', ''));
				elem.append(compiledElem);
			}

			function getTemplate(pinningContextArray) {
				let template = '';

				for (let i = 0; i < pinningContextArray.length; i++) {
					if (!_.isEmpty(template)) {
						template += '\n';
					}
					template += `<div class="form-control shaded" title="{{ ::pinningContexts[${i}].title }}">
					<span class="header-body" data-ng-class="::'header-body ' + pinningContexts[${i}].icon"></span>
					<div class="input-group-content ellipsis" data-ng-bind="::pinningContexts[${i}].info"></div>
					<span class="input-group-btn"><button class="nodelete header-delete btn btn-default control-icons ico-input-delete" title="{{::deleteTitle}}" data-ng-click="clearPinningContext(${i})"></button></span>
					</div>`;
				}

				return template;
			}

			create(scope.tokens, scope.options);
		}
	}
})(angular);
