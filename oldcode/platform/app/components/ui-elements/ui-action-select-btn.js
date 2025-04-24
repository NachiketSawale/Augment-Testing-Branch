((angular => {
	'use strict';

	let modulename = 'platform';
	let directiveName = 'platformActionSelectBtn';

	angular.module(modulename).directive(directiveName, ['_', 'basicsLookupdataPopupService', '$timeout', '$log', (_, basicsLookupdataPopupService, $timeout, $log) => {
		return ({
			restrict: 'AE',
			templateUrl: 'ui-component/action-select-template.html',
			scope: true,
			link: function (scope, element, attrs) {
				if (!_.isUndefined(attrs.grid)) {
					$log.error('This control is not compatible for using in the grid.');
					return;
				}

				let instance;
				const existModel = _.hasIn(scope, attrs.ngModel); // indicates if there is a ng-model. If so, than the value is set in ng-model additionally.
				const listConfig = scope.$eval(attrs.options);

				// listConfig = _.cloneDeep(_.get(config, 'options.list'));
				// listConfig = _.get(config, 'options');
				setControlValues(existModel ? scope.$eval(attrs.ngModel) : _.get(listConfig, 'activeValue'));
				scope.options = listConfig;

				scope.activeActionFnWrapper = (that, id, event, info) => {
					scope.activeAction.fn.apply(that, [id, scope.activeAction, {scope: scope, event: event, info: info}]);
				};

				function setControlValues(activeActionId) {
					var actions = [];
					let activeAction;
					let items = _.get(listConfig, 'items');

					if (_.isUndefined(activeActionId) || _.isUndefined(_.find(items, {'id': activeActionId}))) {
						activeAction = _.head(items);
					}

					_.forEach(items, item => {
						if (_.isUndefined(activeAction) && activeActionId === item.id) {
							activeAction = item;
						} else if (item.type === 'item' && item.id !== _.get(activeAction, 'id')) { // only items will be added
							actions.push(item);
						}
					});

					listConfig.activeValue = activeAction.id;
					activeAction.showCaption = listConfig.showCaption;
					scope.activeAction = activeAction;
					scope.actions = actions;
					if (existModel) {
						_.set(scope, attrs.ngModel, activeAction.id);
					}
				}

				function getDropdownList() {
					return {
						showImages: listConfig.showImages,
						cssClass: listConfig.cssClass ? listConfig.cssClass : '',
						items: scope.actions,
						itemFnWrapper: (item, event, info) => {
							info.callItemFn({test: 'mein TEst'});
							setControlValues(item.id);
							instance.close();
						}
					};
				}

				scope.initActionItemsLink = link => {
					let list = getDropdownList();
					link.setFields(list);
				};

				scope.openDropDown = (event) => {
					const template = '<div platform-action-item-list data-set-link="initActionItemsLink(link)" class=""></div>';

					const options = {
						multiPopup: false,
						plainMode: true,
						hasDefaultWidth: false
					};

					instance = basicsLookupdataPopupService.toggleLevelPopup(_.assign({}, options, {
						scope: scope,
						focusedElement: angular.element(event.currentTarget),
						template: template,
						level: listConfig.level ? listConfig.level : 0
					}));

					if (!(_.isNull(instance) || _.isUndefined(instance))) {
						instance.opened.then(() => {
							$timeout(() => {
								scope.$digest();
							}, 0);
						});
					}
				};
			}
		});
	}]);
})(angular));
