(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';

	function commentBox() {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: 'basics.workflow/commentBox.html',
			scope: {
				getCurrentClerk: '&getCurrentClerk'
			},
			link: function (scope, elem, att, ctrl) {
				// eslint-disable-next-line no-control-regex
				var re = new RegExp('\n', 'g');
				scope.comment = '';
				scope.commentList = [];
				scope.add = function () {
					scope.comment = scope.comment.replace(re, '<br>');
					scope.getCurrentClerk().then(function (clerk) {
						var current = {
							clerk: clerk,
							date: new Date(),
							comment: scope.comment
						};
						if (!angular.isArray(scope.commentList)) {
							scope.commentList = [];
						}
						scope.commentList.push(current);
						ctrl.$setViewValue(scope.commentList);
						scope.comment = '';
					});
				};

				ctrl.$render = function () {
					scope.commentList = ctrl.$viewValue;
				};

			}
		};
	}

	angular.module(moduleName)
		.directive('basicsWorkflowCommentBox', commentBox);

})(angular);
