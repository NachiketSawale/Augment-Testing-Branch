(function () {
	'use strict';

	/**
	 * basics-common-project-navigator-tree-node
	 */
	angular.module('basics.common').directive('basicsCommonProjectNavigatorTreeNode', basicsCommonProjectNavigatorTreeNode);

	basicsCommonProjectNavigatorTreeNode.$inject = ['_', 'platformTranslateService', '$parse', 'platformStringUtilsService',
		'$templateCache', '$translate'];

	function basicsCommonProjectNavigatorTreeNode(_, platformTranslateService, $parse, stringUtils, $templateCache, $translate) {

		return {
			restrict: 'A',
			scope: true,
			transclude: true,
			template: function(elem, attr) {
				let nodeTemplate = $templateCache.get('project-navigator/project-navigator-tree-node-template.html');
				let showNodeImg = String(!_.isEmpty(attr.iconclass));
				let buttonClass = _.isEmpty(attr.iconclass) ? 'onClickSubNode' : 'onClickNode';
				let filterFn = attr.onFilter ?? '';

				let titleText = platformTranslateService.instant(stringUtils.replaceSpecialChars(attr.title), null, true);
				if(_.isEmpty(titleText)){
					titleText = attr.title;
				}
				let tooltipText = titleText;

				let cursorStyle = 'pointer';
				if(!_.isEmpty(attr.ngDisabled)){
					cursorStyle = attr.ngDisabled === 'true' ? 'default' : 'pointer';
					tooltipText = attr.ngDisabled === 'true' && attr.type === "module" ?
						'' : $translate.instant('basics.common.projectNavi.openModule', {p1: titleText});
				}

				let favButton = '';
				if(attr.type === "project"){
					favButton = `<button type="button" class="tree-accordion-favorite control-icons"
							 		 		ng-class="projectItem.IsFavourite ? 'ico-favourite-selected':'ico-favourite-unselected'"
							 		 		title="{{ (projectItem.IsFavourite ? 'basics.common.projectNavi.removeProjectFromFavourite' : 'basics.common.projectNavi.saveProjectToFavourite') | translate }}"
											data-ng-click="naviOpts.onToggleFavorite(naviTreeMap.project.id)">
									 </button>`
					tooltipText = $translate.instant('basics.common.projectNavi.openProject');
				}

				nodeTemplate = nodeTemplate.replace('@@navigateOnClick@@', attr.onClick)
					.replace('@@favButton@@', favButton)
					.replace('@@filterfn@@', filterFn)
					.replace('@@shownodeimg@@', showNodeImg)
					.replace('@@buttonclass@@', buttonClass)
					.replace('@@datatype@@', attr.type)
					.replace('@@cursorstyle@@', cursorStyle)
					.replace('@@nodeimgicon@@', attr.iconclass || '')
					.replace('@@nodeimgiconcolor@@', attr.iconcolor || '')
					.replace(/@@nodetitletext@@/g, titleText)
					.replace(/@@nodetooltiptext@@/g, tooltipText);

				return nodeTemplate;
			},
			link: postLink

		};

		function postLink(scope, elem, attr) {

			let content = null;
			let thisElem = elem[0];

			let onExpandToggleFct = attr.onExpanded;
			let myElem = angular.element(thisElem.querySelector('.nodetoggleimg'));

			let expandedModel = $parse(attr.expandedModel);  // bind model
			let expanded = expandedModel(scope); // get value from scope // scope.$eval(attr.expandedModel);

			if (!expanded) {

				setToggleImg(myElem, true);

				expanded = expandedToggle(true); // initial we're expanded
			}

			/**
			 * @function expandedToggle
			 * @param {boolean} expandedState   current expanded state
			 * @returns {boolean|*}
			 */
			function expandedToggle(expandedState) {
				// now toggle
				expandedState = !expandedState;

				if (!expandedState) {

					content = angular.element(thisElem).find('.transclude-element:first'); // save in content

					content.detach(); // the events are retained

					angular.element(thisElem).find('.transclude-element:first').remove(); // remove from dom tree
				} else if (content) {
					angular.element(thisElem).append(content); // insert if there is an content
				}
				return expandedState;
			}

			function onToggle(e) {
				if (e.target.className.indexOf('nodetoggle') !== -1) {
					e.stopImmediatePropagation();

					setToggleImg(angular.element(e.target), expanded);

					expanded = expandedToggle(expanded);
					if(angular.isFunction(expandedModel.assign)){
						expandedModel.assign(scope, expanded);  // write back to model
					}

					if (onExpandToggleFct) {
						let fct = scope.$eval(onExpandToggleFct); // jshint ignore:line
						_.noop(fct);
					}
				}
			}

			function setToggleImg(elem, toggleStand) {
				elem.removeClass((!toggleStand ? 'ico-arrow-right' : 'ico-arrow-down'));
				elem.addClass((toggleStand ? 'ico-arrow-right' : 'ico-arrow-down'));
			}

			let treeNodeExpander = angular.element(thisElem.querySelector('.nodetoggleimg'));
			treeNodeExpander.bind('click', onToggle);

			// Filter event
			let filterModel = $parse(attr.filterOption);  // bind model
			let onFilterFn = attr.onFilter;
			function onFilter(e) {
				e.stopImmediatePropagation();
				console.log('Receive filter event in node directive');
				const { key: key, value: value } = e.detail;
				if(angular.isFunction(filterModel.assign)){
					let filterOptions = filterModel(scope);
					if (filterOptions[key]) {
						// Key exists, add the value to the array if it's not already there
						if (!filterOptions[key].find(opt => opt.id === value.id)) {
							filterOptions[key].push(value);
						}
					} else {
						// Key doesn't exist, create a new array with the value
						filterOptions[key] = [value];
					}
					filterModel.assign(scope, filterOptions);  // write back to model
				}

				if (onFilterFn) {
					let fn = scope.$eval(onFilterFn); // jshint ignore:line
					_.noop(fn);
				}
			}
			elem.bind('onFilter', onFilter);

			scope.$on('$destroy', function () {
				treeNodeExpander.unbind();
				elem.unbind();
			});
		}
	}
})();