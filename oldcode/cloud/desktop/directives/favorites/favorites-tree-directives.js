(function () {
	'use strict';

	/**
	 * <div data-cloud-Desktop-Favorites-Directive data-project-favorites="favOpts.projectFavorites" ></div>
	 */
	var addInfoTemplate = '<div class="hint">{{::\'cloud.desktop.favorites.addInfo\'|translate}}</div>';

	var nodeTemplate = '<div class="projectname tree-accordion-header flex-box" >' +
		'<div class="nodetoggleimg header-collapse control-icons ico-tree-expand"></div>' +
		'<div class="nodetoggle header-body flex-element">' +
		'<div class="nodeimg"><svg data-cloud-desktop-svg-image data-sprite="app-small-icons" data-image="@@nodeimgicon@@" data-color="@@nodeimgiconcolor@@" class="filler"></svg></div>' +
		'<button class="onClickNode nodetitle" data-ng-click="@@navigateOnClick@@;$event.stopPropagation();" title="@@nodetitletext@@">' +
		'@@nodetitletext@@</button></div>@@delbutton@@</div>' +
		'<ng-transclude class="transclude-element"></ng-transclude>';

	// project delete button template. is optional , used by directive 'cloudDesktopFavorites'
	var delButtonTemplate = '<button class="nodedelete header-delete control-icons ico-input-delete" title="{{::\'cloud.desktop.favorites.delProjectTitle\'|translate}}" @@ngclick@@></button>';

	function checkFavSettings(projectId, favType, favSetting) {
		if (!favSetting[projectId].expanded) {
			favSetting[projectId].expanded = {};
		}
		if (!_.isBoolean(favSetting[projectId].expanded[favType])) {
			favSetting[projectId].expanded[favType] = false;
		}
		return favSetting[projectId].expanded[favType];
	}

	angular.module('cloud.desktop').directive('cloudDesktopFavorites', cloudDesktopFavorites);
	cloudDesktopFavorites.$inject = ['_', '$translate', '$compile', 'cloudDesktopSidebarFavoritesService'];

	function cloudDesktopFavorites(_, $translate, $compile, sidebarFavoritesService) {

		/**
		 * @param scope
		 * @param cs
		 * @returns {*|Object}
		 */
		function makeChildScopewithClean(scope, cs) {
			if (cs) {
				cs.$destroy();
			}
			return scope.$new();
		}

		return {
			restrict: 'A',
			scope: true,
			replace: true,
			transclude: true,
			template: '<div>@@content@@</div>',
			link: function (scope, elem, attr) {
				var childscope;


				/**
				 * @param favorites
				 */
				function processFavorites(favorites) {
					let favSetting;
					if(favorites && favorites.hasOwnProperty('favDropHandler')) {
						scope.favDropHandler = favorites.favDropHandler;
					}

					var content;
					let completecontent = '';
					if (favorites && favorites.projectInfo) {
						content = '';
						favSetting = favorites.favoritesSetting;
						scope.favSetting = favSetting;

						_.forEach(favorites.projectInfo, function(item) {
							item.addedAt = favSetting[item.projectId].addedAt;
							item.projectName = sidebarFavoritesService.IsJsonObj(favSetting[item.projectId].projectName) ? JSON.parse(favSetting[item.projectId].projectName) : favSetting[item.projectId].projectName;
						});

						let sortedProjects = _.sortBy(favorites.projectInfo, ['projectName.sort', 'addedAt']);
						scope.sortedFavProjects = sortedProjects;
						favorites.sortedFavProjects = scope.sortedFavProjects;
						scope.favsortable = favorites.sortable;

						completecontent = `
						<ul as-sortable="favDropHandler" ng-model="sortedFavProjects">
							<li ng-repeat="projectitem in sortedFavProjects" as-sortable-item class="as-sortable-item" data-ng-class="{\'flex-box\': favsortable}">
							 	<div data-ng-show="${favorites.sortable}" as-sortable-item-handle class="as-sortable-item-handle control-icons ico-grip sortable-grip-icon"></div>
							 	<div cloud-desktop-favorites-project-html-container data-project-item="projectitem" fav-setting="favSetting" data-ng-class="{\'flex-element\': favsortable}"></div>
						</li></ul>`;
					} else {
						content = addInfoTemplate;
					}


					elem.empty();
					childscope = makeChildScopewithClean(scope, childscope);
					elem.append($compile(completecontent)(childscope));
				}

				scope.$watch(function () {
					return scope.$eval(attr.projectFavorites); // scope.enhancedFilterOptions.currentFilterDef;
				}, function (favorites) {
					processFavorites(favorites);
				});

				function watchfn() {
					processFavorites(scope.$eval(attr.projectFavorites));
				}

				scope.$watch('version', watchfn);
			}
		};
	}

	/**
	 * cloud-Desktop-Favorites-Treenode-Directive
	 */
	angular.module('cloud.desktop').directive('cloudDesktopFavoritesTreenode', cloudDesktopFavoritesTreenode);
	cloudDesktopFavoritesTreenode.$inject = ['_', 'platformTranslateService', '$parse', 'platformStringUtilsService'];

	function cloudDesktopFavoritesTreenode(_, platformTranslateService, $parse, stringUtils) {

		return {
			restrict: 'A',
			scope: true,
			transclude: true,
			template: function (elem, attr) {
				var delBtn = '';
				if (attr.onDeleteClick) {
					delBtn = delButtonTemplate.replace('@@ngclick@@', 'data-ng-click="' + attr.onDeleteClick + ';$event.stopPropagation();" ');
				}

				return nodeTemplate.replace('@@delbutton@@', delBtn)
					.replace('@@navigateOnClick@@', attr.onClick)
					.replace('@@nodeimgicon@@', attr.iconclass || '')
					.replace('@@nodeimgiconcolor@@', attr.iconcolor || '')
					.replace(/@@nodetitletext@@/g, platformTranslateService.instant(stringUtils.replaceSpecialChars(attr.title), null, true));
			},
			link: postLink
		};

		function postLink(scope, elem, attr) {

			var content = null;
			var thisElem = elem[0];

			var onExpandToggleFct = attr.onExpanded;
			var myElem = angular.element(thisElem.querySelector('.nodetoggleimg'));
			let deleteBtn = angular.element(thisElem.querySelector('.nodedelete'));
			deleteBtn.hide();
			if(scope.favOpts.isSortable()) {
				myElem.hide(); // hidden arrow-icons
				deleteBtn.show();
			}

			// var model = $parse(attr.expandedModel);
			// "model" is now a function which can be invoked to get the expression's value;
			// the following line logs the value of obj.name on scope:  el.bind('click', function() {
			// "model.assign" is also a function; it can be invoked to update the expresssion value
			var expandedModel = $parse(attr.expandedModel);  // bind model
			var expanded = expandedModel(scope); // get value from scope // scope.$eval(attr.expandedModel);

			if(scope.favOpts.isSortable()) {
				setToggleImg(myElem, false);

				expanded = expandedToggle(true); // initial we're expanded
			}
			else if (!expanded) {

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
					expandedModel.assign(scope, expanded);  // write back to model

					if (onExpandToggleFct) {
						var fct = scope.$eval(onExpandToggleFct); // jshint ignore:line
						_.noop(fct);
					}
				}
			}

			function setToggleImg(elem, toggleStand) {
				elem.removeClass((!toggleStand ? 'ico-tree-collapse' : 'ico-tree-expand'));
				elem.addClass((toggleStand ? 'ico-tree-collapse' : 'ico-tree-expand'));
			}

			var treeNodeExpander = angular.element(thisElem.querySelector('.nodetoggleimg'));
			treeNodeExpander.bind('click', onToggle);

			scope.$on('$destroy', function () {
				treeNodeExpander.unbind();
			});
		}
	}

	/**
	 *  data-cloud-Desktop-Favorites-Treeleave-Directive
	 *
	 <div data-cloud-Desktop-Favorites-Treeleave-Directive data-tiltle="fhdskjfhksjd" data-onClick="onClick()" ></div>
	 */
	angular.module('cloud.desktop').directive('cloudDesktopFavoritesTreeleave', cloudDesktopFavoritesTreeleave);
	cloudDesktopFavoritesTreeleave.$inject = ['platformStringUtilsService'];

	function cloudDesktopFavoritesTreeleave(stringUtils) {
		return {
			restrict: 'A',
			scope: false,
			template: function (elem, attr) {
				var template = '<button class="flex-box rw" data-ng-click="@@ngclick@@" >' +
					'<ul class="flex-element rw-content"><li class="onClickLeave title" title="@@leavetitle@@" style="font-size: 10pt;">@@leavetitle@@</li>' +
					'</ul></button>';
				var title = stringUtils.replaceSpecialChars(attr.title);
				var theTemplate = template.replace('@@leavetitle@@', title).replace('@@leavetitle@@', title)
					.replace('@@ngclick@@', attr.onClick + ';$event.stopPropagation();');
				return theTemplate;
			}
		};
	}

	// <div cloud-desktop-favorites-project-html-container></div>
	angular.module('cloud.desktop').directive('cloudDesktopFavoritesProjectHtmlContainer', cloudDesktopFavoritesProjectHtmlContainer);
	cloudDesktopFavoritesProjectHtmlContainer.$inject = ['platformStringUtilsService', '$compile', 'cloudDesktopSidebarFavoritesService'];

	function cloudDesktopFavoritesProjectHtmlContainer(stringUtils, $compile, cloudDesktopSidebarFavoritesService) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, elem) {

				let projectIdx = scope.projectitem.projectId;
				checkFavSettings(projectIdx, 0, scope.favSetting); // create fav setting if there is no expanded[]
				let projectExpandedModel = 'favData.favoritesSetting[' + projectIdx + '].expanded[0]';
				let projectTitle = stringUtils.replaceSpecialChars(scope.projectitem.projectDescription);


				function getFavTypeInfoById(favtype) {
					return cloudDesktopSidebarFavoritesService.favtypeInfo[favtype] || {};
				}

				_.forEach(scope.projectitem.itemToFavType, function (item, index) {
					item.favType = index;
				});

				// sort by FavType Sort criteria
				scope.sortedFavType = _.sortBy(scope.projectitem.itemToFavType, function (favType) {
					return getFavTypeInfoById(favType.favType).sort;
				});

				let htmlMarkup = `<div class="treelist tree-accordion" data-cloud-desktop-favorites-treenode data-on-click="favOpts.onProjectClick(${projectIdx})"
					data-expanded-model="${projectExpandedModel}" data-on-expanded="favOpts.onExpanded(1,${projectIdx},0)"
					data-on-delete-click="favOpts.onDeleteClick(${projectIdx})" data-title="${projectTitle}" data-iconclass="ico-project">

						<div ng-repeat="favTypeItem in sortedFavType">
							<div cloud-desktop-favorites-fav-type-html-container></div>
						</div>

				</div>`;

				elem.append($compile(htmlMarkup)(scope));
			}
		};
	}

	// <div cloud-Desktop-Favorites-Fav-Type-Html-Container></div>
	angular.module('cloud.desktop').directive('cloudDesktopFavoritesFavTypeHtmlContainer', cloudDesktopFavoritesFavTypeHtmlContainer);
	cloudDesktopFavoritesFavTypeHtmlContainer.$inject = ['platformStringUtilsService', '$compile', 'cloudDesktopSidebarFavoritesService', '$translate'];

	function cloudDesktopFavoritesFavTypeHtmlContainer(stringUtils, $compile, cloudDesktopSidebarFavoritesService, $translate) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, elem) {

				function getFavTypeInfoById(favtype) {
					return cloudDesktopSidebarFavoritesService.favtypeInfo[favtype] || {};
				}

				scope.getOnLeaveItemClick = function(index) {
					// return an integer value
					return index;
				};

				var favTypeIdx = scope.favTypeItem.favType;
				let projectIdx = scope.projectitem.projectId;

				checkFavSettings(projectIdx, favTypeIdx, scope.favSetting); // create fav setting if there is no expanded[]

				var favExpandedModel = 'favData.favoritesSetting[' + projectIdx + '].expanded[' + favTypeIdx + ']';
				var favTypeInfo = getFavTypeInfoById(favTypeIdx);
				let favTypeInfoName = $translate.instant(favTypeInfo.name);

				let collator = new Intl.Collator([], {numeric: true});
				scope.favTypeItem.sort(function(a, b) {
					return collator.compare(a.description, b.description);
				});

				let htmlMarkupFavTpe = `<div class="favtype tree-accordion-content" data-cloud-desktop-favorites-treenode data-expanded-model="${favExpandedModel}"
										data-on-expanded="favOpts.onExpanded(2,${projectIdx},${favTypeIdx})" data-title="${favTypeInfoName}" data-iconclass="${favTypeInfo.ico}">
										<div class="treeleave group-items">
												<div ng-repeat="favItem in favTypeItem">
													<div data-cloud-desktop-favorites-treeleave data-title="{{favItem.description}}"
													data-on-click="favOpts.onLeaveItemClick(favData.projectInfo[${projectIdx}].itemToFavType[${favTypeIdx}][getOnLeaveItemClick($index)],${projectIdx})"></div>
												</div>
										</div></div>`;

				elem.append($compile(htmlMarkupFavTpe)(scope));
			}
		};
	}
})();
