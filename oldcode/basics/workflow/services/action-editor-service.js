(function (angular) {
	'use strict';

	/**
	 * @typedef  {Object} basics.workflow.basicsWorkflowActionEditorService
	 * @property  {function} registerEditor,
	 * @property {function} createEditor,
	 * @property {function} getEditor,
	 */

	/**
	 * Returns the basicsWorkflowActionEditorService.
	 * @returns {basicsWorkflowActionEditorService} basicsWorkflowActionEditorService
	 *
	 */
	function basicsWorkflowActionEditorService(_, basicsWorkflowGlobalContextUtil, $log, platformModuleStateService) {
		var editors = [];

		return {
			registerEditor: registerEditor,
			createEditor: createEditor,
			getEditor: getEditor,
			getEditorInput: getEditorInput,
			setEditorInput: setEditorInput,
			getEditorOutput: getEditorOutput,
			getEditorOutputByIndex: getEditorOutputByIndex,
			setEditorOutput: setEditorOutput,
			getGridDataFormat: getGridDataFormat,
			setGridDataFormat: setGridDataFormat,
			getSimpleGridDataFormat: getSimpleGridDataFormat,
			setSimpleGridDataFormat: setSimpleGridDataFormat,
			setCodeMirrorOptions: setCodeMirrorOptions,
			tryGetObjectFromJson: tryGetObjectFromJson,
			setRadioButtonInEditor: setRadioButtonInEditor,
			parserHelper: parserHelper,
			getRadioGroupOptions: getRadioGroupOptions,
			updateEditorOutputFromInput: updateEditorOutputFromInput
		};

		function registerEditor(editor) {
			editors.push(editor);
		}

		function tryGetObjectFromJson(json) {
			try {
				return angular.fromJson(json);
			} catch (e) {
				$log.error(e);
				return json;
			}
		}

		function createEditor(actionId, directive, tools, prio) {
			return {
				actionId: actionId,
				directive: directive,
				prio: prio,
				tools: tools
			};
		}

		function getEditor(actionId) {
			if (actionId === '0' || actionId === null) {
				return null;
			}
			var result = _.sortBy(
				_.filter(editors, {actionId: actionId}),
				'prio');
			return result.length !== 0 ? result[0] : getDefaultEditor();
		}

		function getDefaultEditor() {
			var result = _.sortBy(
				_.filter(editors, {actionId: null}),
				'prio');
			return result.length !== 0 ? result[0] : undefined();
		}

		function getEditorInput(scriptKey, action) {
			if (scriptKey && action && action.hasOwnProperty('input')) {
				return _.find(action.input, {key: scriptKey});
			}
		}

		function setEditorInput(value, scriptKey, action) {
			if (action) {
				var param = getEditorInput(scriptKey, action);
				if (param) {
					param.value = value;
				}
			}
		}

		function getEditorOutput(scriptKey, action) {
			if (scriptKey && action && action.hasOwnProperty('output')) {
				return _.find(action.output, {key: scriptKey});
			}
		}

		function getEditorOutputByIndex(index, action) {
			if (action && action.hasOwnProperty('output')) {
				return action.output[index];
			}
		}

		function setEditorOutput(value, scriptKey, action) {
			if (action && action.hasOwnProperty('output')) {
				var param = _.find(action.output, {key: scriptKey});

				if (param) {
					param.value = value;
				}
			}
		}

		function getSimpleGridDataFormat(values, key) {
			var gridContent = [];

			for (var i = 0; i < values.length; i++) {
				if (values[i]) {

					var _object = {};
					_object.id = Math.floor(Math.random() * 90000) + 10000;
					_object[key] = values[i];
					gridContent.push(_object);
				}
			}
			return gridContent;
		}

		function getGridDataFormat(values, keys) {
			var gridContent = [];

			for (var i = 0; i < values.length; i++) {
				if (values[i]) {
					// var _split = values[i].split(':');
					var _split = values[i].match(/([^:]*):(.*)/);
					_split.shift();
					_split.unshift(i);

					var _object = {};

					for (var j = 0; j < keys.length; j++) {
						_object[keys[j]] = _split[j];
					}

					gridContent.push(_object);
				}
			}
			return gridContent;
		}

		function setSimpleGridDataFormat(gridValue) {
			var result = '';

			if (gridValue && gridValue.length > 0) {
				angular.forEach(gridValue, function (item) {
					result += item.value + ';';
				});
			}

			return result;
		}

		function setGridDataFormat(gridValue) {
			var result = '';

			if (gridValue && gridValue.length > 0) {
				angular.forEach(gridValue, function (item) {
					result += item.key;

					if (item.value) {
						result += ':' + item.value;
					}

					result += ';';
				});
			}

			return result;
		}

		function setCodeMirrorOptions(singleLine) {
			var state = platformModuleStateService.state('basics.workflow');
			var lint;
			if (state.currentWorkflowAction) {
				// check whether the selected current action is 'Script Action'?.
				lint = (state.currentWorkflowAction.actionId === '409ed310344011e5a151feff819cdc9f' || state.currentWorkflowAction.actionId === 'c8fff2580378485bbb941d5029e3f569') ? true : false;				// ALM #115931 - Workflow Action Detail container is visible.
			}
			var readonly = state.selectedTemplateVersion && state.selectedTemplateVersion.IsReadOnly ? true : false;

			return {
				lineWrapping: singleLine ? false : true,
				lineNumbers: singleLine ? false : true,
				singleLine: singleLine,
				scrollbarStyle: singleLine ? 'none' : 'native',
				lint: lint,																								// ALM #114023 - Script Action has no syntax error warning.
				showHint: false,
				readOnly: readonly,
				hintOptions: {
					get globalScope() {
						return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
					}
				}
			};
		}

		function setRadioButtonInEditor(input, model) {
			var toReturn = false;
			if (input < 1 && model && model !== '') {
				toReturn = true;
			}
			return toReturn;
		}

		function parserHelper(fn, obj, action) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					fn(obj[key], key, action);
				}
			}
		}

		function getRadioGroupOptions($translate) {
			return {
				displayMember: 'description',
				valueMember: 'value',
				cssMember: 'cssClass',
				items: [
					{
						value: 1,
						description: $translate.instant('basics.workflow.modalDialogs.defaultRadio'),
						cssClass: 'pull-left spaceToUp'
					},
					{
						value: 2,
						description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
						cssClass: 'pull-left margin-left-ld'
					}
				]
			};
		}

	}

	var editedInputValuePattern = /^(?:{(?:{(.*?)}?}?)?)?$/;

	function updateEditorOutputFromInput(oldInputValue, newInputValue, outputObject, outputProperty) {
		var oldStr = _.isString(oldInputValue) ? oldInputValue : '';
		var newStr = _.isString(newInputValue) ? newInputValue : '';
		var oldMatch = editedInputValuePattern.exec(oldStr);
		var newMatch = editedInputValuePattern.exec(newStr);
		if (_.isArray(oldMatch) && _.isArray(newMatch)) {
			if (_.isNil(oldMatch[1])) {
				oldMatch[1] = '';
			}
			if (_.isNil(newMatch[1])) {
				newMatch[1] = '';
			}

			if (oldMatch[1] === outputObject[outputProperty]) {
				outputObject[outputProperty] = newMatch[1];
				return true;
			}
		}
		return false;
	}

	basicsWorkflowActionEditorService.$inject = ['_', 'basicsWorkflowGlobalContextUtil', '$log', 'platformModuleStateService'];

	/**
	 * @ngdoc service
	 * @name basicsWorkflowActionEditorService
	 * @function
	 * @description
	 * Common Service for the editors in workflow
	 */
	angular.module('basics.workflow').factory('basicsWorkflowActionEditorService', basicsWorkflowActionEditorService);

})(angular);
