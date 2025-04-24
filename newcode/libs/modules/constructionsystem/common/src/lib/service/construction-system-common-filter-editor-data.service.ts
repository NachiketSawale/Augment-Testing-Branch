import { inject, Injectable } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { forEach } from 'lodash';
import { ConstructionsystemCommonPropertyValueTypeDataService } from './constructionsystem-common-property-value-type-data.service';

export interface IPathValue {
	keyPath: string;
	description: string;
}

export interface IScriptViewModel {
	id: string;
	language: string;
	dataLanguageId?: number;
	isLoad: boolean;
	filterDef: {
		methods: object;
		operators: string[];
		keywords: string[];
		ov: string[];
		propertyTypes: [];
		atom: string[];
	};
	propertyDef: IPropertyDef[];
	fieldKeyDef: IPropertyDef[];
	msgTemplate: {
		propertyNameUndefined: IPathValue;
		propertyNameError: IPathValue;
		variableNameUndefined: IPathValue;
		variableNameError: IPathValue;
		notSupport: IPathValue;
		missingError: IPathValue;
		value: IPathValue;
		operator: IPathValue;
		syntaxError: IPathValue;
	};
}

export interface IPropertyDef {
	type: string;
	name: string;
	text: string;
	description: string;
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonFilterEditorDataService {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(PlatformHttpService);
	private readonly valueTypeService = inject(ConstructionsystemCommonPropertyValueTypeDataService);
	private viewModels = {};
	private cmInstances = {};
	private filterUrl: string = 'constructionSystem.common/directives/filter-editor/filterscript.json';
	private getPropertyDefUrl = 'model/administration/propertykey/listwithvaluetype';
	private getFieldKeyDefUrl = 'constructionsystem/master/selectionstatement/getfieldkeylist';
	public scriptViewModel: IScriptViewModel;

	public ScriptViewModel(id: string) {
		this.scriptViewModel = {
			id: id,
			language: null,
			dataLanguageId: null,
			isLoad: false,
			filterDef: {
				methods: {},
				operators: [],
				keywords: [],
				ov: [],
				propertyTypes: [],
				atom: [],
			},
			propertyDef: [],
			fieldKeyDef: [],
			msgTemplate: {
				propertyNameUndefined: {
					keyPath: 'constructionsystem.common.msgTemplate.propertyNameUndefined',
					description: 'The {a} property is undefined.',
				},
				propertyNameError: {
					keyPath: 'constructionsystem.common.msgTemplate.propertyNameError',
					description: 'Missing {a} near {b}, eg: [propertyName].',
				},
				variableNameUndefined: {
					keyPath: 'constructionsystem.common.msgTemplate.variableNameUndefined',
					description: 'The {a} variable is undefined.',
				},
				variableNameError: {
					keyPath: 'constructionsystem.common.msgTemplate.variableNameError',
					description: 'Missing {a} near variable {b}, eg: @[variableName].',
				},
				notSupport: {
					keyPath: 'constructionsystem.common.msgTemplate.notSupport',
					description: '{a} is not supported. please use {b}',
				},
				missingError: {
					keyPath: 'constructionsystem.common.msgTemplate.missingError',
					description: 'Missing {a} near {b}',
				},
				value: {
					keyPath: 'constructionsystem.common.msgTemplate.value',
					description: 'value',
				},
				operator: {
					keyPath: 'constructionsystem.common.msgTemplate.operator',
					description: 'operator',
				},
				syntaxError: {
					keyPath: 'constructionsystem.common.msgTemplate.syntaxError',
					description: 'Syntax error near {a}',
				},
			},
		};
	}

	public clear() {
		this.scriptViewModel.propertyDef = [];
	}

	public loadKeyWordsDef() {
		if (!this.scriptViewModel.isLoad) {
			(() => {
				function translate(key: string) {
					const translateResult = { translated: false, value: '' };
					translateResult.value = this.translateService.instant(key).text;
					if (translateResult.value === key) {
						return translateResult;
					} else {
						translateResult.translated = true;
						return translateResult;
					}
				}

				forEach(this.scriptViewModel.msgTemplate, (propName) => {
					if (Object.prototype.hasOwnProperty.call(this.scriptViewModel.msgTemplate, propName)) {
						const translation = translate(propName.keyPath);
						if (translation.translated === true) {
							propName.description = translation.value;
						}
					}
				});
			})();
			this.http.get<{ data: object }>(this.filterUrl).then((resp) => {
				const def = resp.data;
				const methods = {};
				const funcReg = new RegExp(/fn\(([\w\W]*[^)]*)\)(\s*->\s*([\w\W]+))*/);
				forEach(def, (m) => {
					formatMethod(m, def[m]);
				});

				function trim(str: string) {
					const reg = new RegExp(/\s+/);
					str = str.replace(reg, '');
					return str;
				}

				function formatMethod(m, dm) {
					const method = { name: m, paramCount: 0, params: [], resultType: '', text: m, description: '' };
					if (funcReg.test(dm['!type'])) {
						const match = funcReg.exec(dm['!type']);
						if (match && match[1]) {
							const p = match[1].split(',');
							method.paramCount = p.length;
							for (let n: number = 0, plen: number = p.length; n < plen; n++) {
								const pt = p[n].split(':');
								method.params.push({ name: trim(pt[0]), type: trim(pt[1]) });
							}
						}
						method.resultType = match[3];
						method.description = this.translateService.instant(dm['!doc'] || '').text;
						methods[m] = method;
					}
				}

				this.scriptViewModel.filterDef.methods = methods;
				this.scriptViewModel.filterDef.keywords = ['and', 'or', 'And', 'Or', 'AND', 'OR'];
				this.scriptViewModel.filterDef.operators = ['like', 'not like', '=', '<>', '>', '<', '>=', '<='];
				this.scriptViewModel.filterDef.ov = ['is null', 'is not null', 'exists', 'not exists'];
				this.scriptViewModel.filterDef.atom = ['true', 'false'];
			});
			this.http.get<{ data: { ValueType: string; PropertyName: string }[] }>(this.getPropertyDefUrl).then((resp) => {
				const propertyDef: IPropertyDef[] = [];
				const tempData = resp.data;
				if (tempData) {
					for (let j: number = 0, l = tempData.length; j < l; j++) {
						const prop: IPropertyDef = { type: '', name: '', text: '', description: '' };
						const p = tempData[j];
						prop.type = p.ValueType;
						prop.name = p.PropertyName;
						prop.text = '[' + p.PropertyName + ']';
						prop.description = this.valueTypeService.getValueTypeDescription(prop.type);
						propertyDef.push(prop);
					}
				}
				this.scriptViewModel.propertyDef = propertyDef;
			});
			this.http.get<{ data: { valueType: string; propertyName: string }[] }>(this.getFieldKeyDefUrl).then((resp) => {
				const fieldKeyDef: IPropertyDef[] = [];
				const tempData = resp.data;
				if (tempData) {
					for (let j: number = 0, l = tempData.length; j < l; j++) {
						const prop: IPropertyDef = { type: '', name: '', text: '', description: '' };
						const p = tempData[j];
						prop.type = p.valueType;
						prop.name = p.propertyName;
						prop.text = '[' + p.propertyName + ']';
						prop.description = this.valueTypeService.getValueTypeDescription(prop.type);
						fieldKeyDef.push(prop);
					}
				}
				this.scriptViewModel.fieldKeyDef = fieldKeyDef;
			});

			this.scriptViewModel.isLoad = true;
			return this.getKeyWordsDefs();
		} else {
			return this.getKeyWordsDefs();
		}
	}

	public getKeyWordsDefs() {
		return [this.scriptViewModel.filterDef, this.scriptViewModel.propertyDef, this.scriptViewModel.msgTemplate];
	}
}