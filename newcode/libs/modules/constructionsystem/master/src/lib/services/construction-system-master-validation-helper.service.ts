import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IEntityRuntimeDataRegistry, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IEntityIdentification } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterValidationHelperService {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	private readonly variableNameKeywords = [
		'public', 'private', 'protected', 'static', 'int', 'string', 'break', 'delete', 'function', 'return',
		'typeof', 'case', 'do', 'if', 'switch', 'var', 'catch', 'in', 'this', 'void', 'continue', 'false',
		'instanceof', 'throw', 'while', 'debugger', 'finally', 'new', 'true', 'with', 'default', 'for', 'null',
		'try', 'class', 'const', 'enum', 'export', 'extends', 'import', 'super', 'arguments', 'eval', 'abstract',
		'double', 'goto', 'native', 'boolean', 'implements', 'package', 'byte', 'synchronized', 'char', 'final',
		'interface', 'transient', 'float', 'long', 'short', 'volatile', 'encodeURI', 'Infinity', 'Number', 'RegExp',
		'Array', 'encodeURIComponent', 'isFinite', 'Object', 'String', 'Boolean', 'Error', 'isNaN', 'parseFloat',
		'SyntaxError', 'Date', 'JSON', 'parseInt', 'TypeError', 'decodeURI', 'EvalError', 'Math', 'RangeError',
		'undefined', 'decodeURIComponent', 'Function', 'NaN', 'ReferenceError', 'URIError', 'Context', 'Project',
		'Lookup', 'Log', 'context', 'project', 'lookup', 'log', 'prompt', 'debuuger', 'else', 'let', 'throws',
		'yield', 'hasOwnProperty', 'isPrototypeOf', 'length', 'name', 'prototype', 'toString', 'valueOf', 'getClass',
		'java', 'JavaArray', 'javaClass', 'JavaObject', 'JavaPackage', 'alert', 'all', 'anchor', 'anchors', 'area',
		'assign', 'blur', 'button', 'checkbox', 'clearInterval', 'clearTimeout', 'clientInformation', 'close',
		'closed', 'confirm', 'constructor', 'crypto', 'defaultStatus', 'document', 'element', 'elements', 'embed',
		'embeds', 'escape', 'event', 'fileUpload', 'focus', 'form', 'forms', 'frame', 'innerHeight', 'innerWidth',
		'layer', 'layers', 'link', 'location', 'mimeTypes', 'navigate', 'navigator', 'frames', 'frameRate', 'hidden',
		'history', 'image', 'images', 'offscreenBuffering', 'open', 'opener', 'option', 'outerHerght', 'outerWidth',
		'packages', 'pageXOffset', 'pageYOffset', 'parent', 'password', 'pkcs11', 'plugin', 'propertylsEnum', 'radio',
		'reset', 'screenX', 'screenY', 'scroll', 'secure', 'select', 'self', 'setInterval', 'setTimeout', 'status',
		'submit', 'taint', 'text', 'textarea', 'top', 'unescape', 'untaint', 'window', 'onblur', 'onclick', 'onerror',
		'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onmouseover', 'onload', 'onmouseup', 'onmousedown', 'onsubmit',
	];

	public validateSorting(info: ValidationInfo<IEntityIdentification>) {
		return this.validationUtils.isMandatory(info);
	}

	public validateDescriptionInfo(runtime: IEntityRuntimeDataRegistry<IEntityIdentification>, info: ValidationInfo<IEntityIdentification>, itemList: Array<IEntityIdentification>) {
		let result: ValidationResult;
		if (this.validationUtils.isEmptyProp(info.value)) {
			result = this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: 'description' } });
		} else {
			result = this.validationUtils.isUnique(runtime, info, itemList);
			if (!result.valid) {
				result = this.validationUtils.createErrorObject({ key: 'cloud.common.uniqueValueErrorMessage', params: { object: 'description' } });
			} else {
				result = this.validationUtils.createSuccessObject();
			}
		}

		if (result.valid) {
			runtime.removeInvalid(info.entity, { field: 'Description', result: result });
		}
		return result;
	}

	public validateVariableName(runtime: IEntityRuntimeDataRegistry<IEntityIdentification>, info: ValidationInfo<IEntityIdentification>, itemList: Array<IEntityIdentification>) {
		let result: ValidationResult;
		result = this.validationUtils.isUnique(runtime, info, itemList);

		const variableNameField = 'VariableName';
		this.variableNameKeywords.forEach((keyword) => {
			if (keyword === info.value) {
				result = this.validationUtils.createErrorObject({ key: 'cloud.common.keywordValueErrorMessage', params: { object: variableNameField } });
			}
		});

		if (!result.valid) {
			runtime.addInvalid(info.entity, { result: result, field: variableNameField });
		} else {
			runtime.removeInvalid(info.entity, { result: result, field: variableNameField });
		}
		return result;
	}
}
