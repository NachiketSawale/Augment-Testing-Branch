(function () {
	'use strict';

	// Fix to support disconnected scopes!

	angular.module('ui.bootstrap.dropdown').controller('DropdownController', ['$scope', '$attrs', '$parse', 'dropdownConfig', 'dropdownService', '$animate', function ($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) {
		var self = this,
			scope = $scope.$new(), // create a child scope so we are not polluting original one
			openClass = dropdownConfig.openClass,
			getIsOpen,
			setIsOpen = angular.noop,
			toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;

		this.init = function (element) {
			self.$element = element;

			if ($attrs.isOpen) {
				getIsOpen = $parse($attrs.isOpen);
				setIsOpen = getIsOpen.assign;

				$scope.$watch(getIsOpen, function (value) {
					scope.isOpen = !!value;
				});
			}
		};

		this.toggle = function (open) {

			scope.isOpen = arguments.length ? !!open : !scope.isOpen;
			$animate[scope.isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);
			return scope.isOpen;
		};

		// Allow other directives to watch status
		this.isOpen = function () {
			return scope.isOpen;
		};

		scope.getToggleElement = function () {
			return self.toggleElement;
		};

		scope.focusToggleElement = function () {
			if (self.toggleElement) {
				self.toggleElement[0].focus();
			}
		};

		scope.$watch('isOpen', function (isOpen, wasOpen) {
			$animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);

			if (isOpen) {
				scope.focusToggleElement();
				dropdownService.open(scope);
			} else {
				dropdownService.close(scope);
			}

			setIsOpen($scope, isOpen);
			if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
				toggleInvoker($scope, {open: !!isOpen});
			}
		});

		$scope.$on('$locationChangeSuccess', function () {
			scope.isOpen = false;
		});

		$scope.$on('$destroy', function () {
			scope.$destroy();
		});
	}]);

})();