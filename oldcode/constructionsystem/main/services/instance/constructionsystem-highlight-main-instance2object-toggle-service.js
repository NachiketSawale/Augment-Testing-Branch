/**
 * Created by wwa on 6/13/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).factory('constructionSystemHighlightToggleService', ['PlatformMessenger',
		'constructionSystemMainModelFilterService',
		function (PlatformMessenger,
			constructionSystemMainModelFilterService) {
			var service = {}, mainArg = null, assArg = null, lineitemArg = null;

			service.currentHighlight = 'mainObject';
			service.highlight = {
				mainObject: 'mainObject',
				assignObject: 'assignObject',
				objectSet: 'objectSet',
				lineItemObject: 'lineItemObject',
				lineItem: 'lineItem',

				isMainObject: function () {
					return service.currentHighlight === service.highlight.mainObject;
				},
				isAssignObject: function () {
					return service.currentHighlight === service.highlight.assignObject;
				},
				isObjectSet: function () {
					return service.currentHighlight === service.highlight.objectSet;
				},
				isLineItemObject: function () {
					return service.currentHighlight === service.highlight.lineItemObject;
				},
				isLineItem: function () {
					return service.currentHighlight === service.highlight.lineItem;
				}
			};
			service.setCurrentHighlight = function (highlightObject) {
				service.currentHighlight = highlightObject;
			};


			service.toggleHighlight = function (gridItemList,highlightObject) {
				service.setCurrentHighlight(highlightObject);

				if (service.highlight.isAssignObject()) {
					service.setAssObjSelectionOnViewer(null, assArg, gridItemList);
				} else if (service.highlight.isMainObject()) {
					service.setMainSelectionOnViewer(null, mainArg, gridItemList);
				}else if (service.highlight.isObjectSet()) {
					service.setObjectSetSelectionOnViewer(gridItemList);
				} else if (service.highlight.isLineItemObject()) {
					service.setLineItemObjectSelectionOnViewer(null, lineitemArg, gridItemList);
				}else if (service.highlight.isLineItem()) {
					service.setLineItemSelectionOnViewer(gridItemList);
				}else {
					constructionSystemMainModelFilterService.emptySelection();
				}
				service.onBarToolHighlightStatusChanged.fire();
			};



			// service.isMainObjectHighlight = true;

			service.onBarToolHighlightStatusChanged = new PlatformMessenger();

			service.setMainSelectionOnViewer = function (e, arg, gridItemList) {
				if (service.highlight.isMainObject()) {
					constructionSystemMainModelFilterService.setSelectionOnViewer(e, arg, 'mainObject', gridItemList);
				}
				mainArg = arg;
			};

			service.setAssObjSelectionOnViewer = function (e, arg, gridItemList) {
				if (service.highlight.isAssignObject()) {
					constructionSystemMainModelFilterService.setSelectionOnViewer(e, arg, 'assignedObj', gridItemList);
				}
				assArg = arg;
			};

			service.setObjectSetSelectionOnViewer = function (dataList) {
				if (service.highlight.isObjectSet()) {
					constructionSystemMainModelFilterService.setSelectionOnViewerByList(dataList,
						function (item) {
							return item.ModelFk;
						}, function (item) {
							return item.ObjectFk;
						});
				}
			};

			/* service.setLineItemObjectSelectionOnViewer = function (dataList) {
				if (service.highlight.isLineItemObject()) {
					constructionSystemMainModelFilterService.setSelectionOnViewerByList(dataList,
						function (item) {
							return item.MdlModelFk;
						}, function (item) {
							return item.MdlObjectFk;
						});
				}
			}; */
			service.setLineItemObjectSelectionOnViewer = function (e, arg, gridItemList) {
				if (service.highlight.isLineItemObject()) {
					constructionSystemMainModelFilterService.setSelectionOnViewer(e, arg, 'lineItemObject', gridItemList);
				}
				lineitemArg = arg;
			};

			service.setLineItemSelectionOnViewer = function (dataList) {
				if (service.highlight.isLineItem()) {
					constructionSystemMainModelFilterService.setSelectionOnViewerByList(dataList,
						function (item) {
							return item.MdlModelFk;
						}, function (item) {
							return item.MdlObjectFk;
						});
				}
			};


			// service.getIsMainObjectHighlight = function () {
			// return service.isMainObjectHighlight;
			// };
			//
			// service.toggleHighlight = function (gridItemList) {
			// service.isMainObjectHighlight = !service.isMainObjectHighlight;
			// if (assArg !== null && !service.isMainObjectHighlight) {
			//     service.setAssObjSelectionOnViewer(null, assArg, gridItemList);
			// } else if (mainArg != null && service.isMainObjectHighlight) {
			//            service.setMainSelectionOnViewer(null, mainArg, gridItemList);
			// }
			// else {
			//       constructionSystemMainModelFilterService.emptySelection();
			// }
			// service.onBarToolHighlightStatusChanged.fire();
			// };

			return service;
		}]);

})(angular);

