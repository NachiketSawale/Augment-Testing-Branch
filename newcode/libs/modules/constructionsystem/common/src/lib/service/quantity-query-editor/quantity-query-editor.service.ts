/*
 * Copyright(c) RIB Software GmbH
 */

import { EditorView } from 'codemirror';
import { inject, InjectionToken } from '@angular/core';
import { IEntitySelection } from '@libs/platform/data-access';
import { GetHttpOptions, IDescriptionInfo, PlatformHttpService } from '@libs/platform/common';
import { ContainerFlag } from '../../model/enums/quantity-query-editor/type-flag.enum';
import { ParameterTypeValid } from '../../model/enums/quantity-query-editor/parameter-type-valid.enum';
import { FunctionObj, ParameterObj, ParameterValueObj } from '../../model/entities/quantity-query-editor/parsed-object.interface';
import { Operator, Parameter, RIBFunction, RIBFunctionParameterType, RibFunctionsXMLAndUomEntity } from '../../model/entities/quantity-query-editor/rib-function-doc.interface';
import { LanguageMenuService } from './language-menu.service';
import { isString } from 'lodash';
import { IConstructionSystemShardTranslationEntity } from '@libs/constructionsystem/shared';
import { Compartment, EditorState } from '@codemirror/state';
import { CosDefaultType } from '../../model/enums/cos-default-type.enum';

interface IMainQuantityQuery {
	QuantityQuery?: string | null;
}

interface IMasterQuantityQuery {
	/**
	 * CosDefaultTypeFk
	 */
	CosDefaultTypeFk?: number;
	/**
	 * QuantityQueryInfo
	 */
	QuantityQueryInfo?: IDescriptionInfo | null;
	/**
	 * QuantityQueryTranslationList
	 */
	QuantityQueryTranslationList?: IConstructionSystemShardTranslationEntity[] | null;
}

export const QUANTITY_QUERY_EDITOR_SERVICE_TOKEN = new InjectionToken<QuantityQueryEditorService>('quantity-query-editor-service-token');

// todo-allen: The QuantityQueryEditorService needs to inherit from the relevant base class of DataServiceBase.
export abstract class QuantityQueryEditorService {
	private readonly http = inject(PlatformHttpService);

	public readonly languageMenuService: LanguageMenuService;
	private readonly httpService = inject(PlatformHttpService);

	public currentCosMasterParameterQuantityQueryTranslationEntity: IConstructionSystemShardTranslationEntity | null = null;
	public currentCosMasterParameter2TemplateQuantityQueryTranslationEntity: IConstructionSystemShardTranslationEntity | null = null;

	private readonly loadInfo: { languageId: number | null; isLoaded: boolean } = { languageId: null, isLoaded: false };

	private readonly ribFunctionsXMLAndUomObjectArray: { [key: string]: RibFunctionsXMLAndUomEntity } = {}; // ribFunctionsXMLAndUomOjbectArray

	public operatorExtKeysArray: string[] = [];
	public functionsArray: FunctionObj[] = [];
	public uomArray: string[] = [];
	public operatorObjectsArray: Operator[] = [];
	public functionNamesArray: string[] = [];
	public parameterTypeKeyMapExtKey = {}; // todo-allen: Type Annotation
	private parameterValueKeyMapExtKey = {}; // todo-allen: Type Annotation
	public targetOperatorRegExp: string | RegExp = '';
	public targetWordOperatorArray: string[] = [];
	public editor?: EditorView;
	public readOnlyCompartment?: Compartment;
	private isInstanceParameter: boolean = false;

	public abstract readonly parentService: IEntitySelection<IMainQuantityQuery & IMasterQuantityQuery>;

	protected constructor(public readonly typeFlag: ContainerFlag) {
		this.languageMenuService = new LanguageMenuService(this.typeFlag);

		this.languageMenuService.onLanguageSelectionChanged.subscribe(this.selectedLanguageChanged.bind(this));
	}

	public abstract parameterSelectionChanged(): void;

	public async selectedLanguageChanged(option: { languageId: number; typeFlag: string }) {
		const getHttpOptions: GetHttpOptions = {
			params: { languageId: option.languageId },
			responseType: 'text' as 'json',
		};
		const languageCode = await this.http.get('cloud/common/language/getCultureByLanguageId', getHttpOptions);
		this.setRibFunctionsXMLAndUom(null, languageCode as string).then((data) => {
			this.setValueToCodeMirror(option.languageId, option.typeFlag);
		});

		this.loadInfo.languageId = option.languageId;
		this.loadInfo.isLoaded = true;
	}

	public async getLanguageCode(languageId: number) {
		const getHttpOptions: GetHttpOptions = {
			params: { languageId: languageId },
			responseType: 'text' as 'json',
		};
		return (await this.http.get('cloud/common/language/getCultureByLanguageId', getHttpOptions)) as string;
	}

	public getDefaultLanguageCode() {
		return this.getLanguageCode(this.languageMenuService.defaultLanguageId);
	}

	public async setValueToCodeMirror(languageId: number, typeFlag: string) {
		const parameterEntity = this.parentService.getSelectedEntity();

		if (!parameterEntity) {
			this.setCMReadOnly();
			this.setValueOfCMDoc('');
			return;
		}

		const serviceName = this.parentService.constructor.name;
		const isInstanceParamService = ['ConstructionSystemMainInstanceParameterService', 'ConstructionSystemMainInstance2ObjectParamDataService'].includes(serviceName);

		if (isInstanceParamService) {
			this.handleInstanceParameterCase(typeFlag, parameterEntity);
			return;
		}

		this.handleDefaultParameterCase(languageId, typeFlag, parameterEntity);
	}

	private handleInstanceParameterCase(typeFlag: string, parameterEntity: IMainQuantityQuery & IMasterQuantityQuery) {
		this.isInstanceParameter = typeFlag === ContainerFlag.instanceParameter;
		this.currentCosMasterParameterQuantityQueryTranslationEntity = null;
		this.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = null;
		this.setCMEditable();
		this.setValueOfCMDoc(parameterEntity.QuantityQuery ?? '');
	}

	private async handleDefaultParameterCase(languageId: number, typeFlag: string, parameterEntity: IMainQuantityQuery & IMasterQuantityQuery) {
		if (parameterEntity.CosDefaultTypeFk === CosDefaultType.PropertyOrQuantityQuery || parameterEntity.CosDefaultTypeFk === CosDefaultType.QuantityQuery || parameterEntity.CosDefaultTypeFk === CosDefaultType.QuantityQueryOrProperty) {
			this.setCMEditable();
		} else {
			this.setCMReadOnly();
		}

		if (this.languageMenuService.langCode !== 'en') {
			await this.handleTranslation(languageId, typeFlag, parameterEntity);
		} else {
			this.clearTranslationEntities(typeFlag);
			this.setValueOfCMDoc(parameterEntity.QuantityQueryInfo?.Description ?? '');
		}
	}

	private async handleTranslation(languageId: number, typeFlag: string, parameterEntity: IMainQuantityQuery & IMasterQuantityQuery) {
		if (!parameterEntity.QuantityQueryTranslationList || !Array.isArray(parameterEntity.QuantityQueryTranslationList)) {
			return;
		}

		const currentTranslationEntity = parameterEntity.QuantityQueryTranslationList.find((item) => item.BasLanguageFk === languageId);

		if (currentTranslationEntity) {
			this.setTranslationEntity(typeFlag, currentTranslationEntity);
			this.setValueOfCMDoc(currentTranslationEntity?.Description ?? '');
		} else {
			await this.createNewTranslation(languageId, typeFlag, parameterEntity);
		}
	}

	private async createNewTranslation(languageId: number, typeFlag: string, parameterEntity: IMainQuantityQuery & IMasterQuantityQuery) {
		const response = await this.http.post<IConstructionSystemShardTranslationEntity>('cloud/common/translation/createTranslationEntity', {
			Id: parameterEntity.QuantityQueryTranslationList && parameterEntity.QuantityQueryTranslationList?.length > 0 ? parameterEntity.QuantityQueryTranslationList[0].Id : null,
			LangugeId: languageId,
		});

		if (response) {
			this.setTranslationEntity(typeFlag, response);
			parameterEntity.QuantityQueryTranslationList = [response];
			this.setValueOfCMDoc('');
		}
	}

	private setTranslationEntity(typeFlag: string, entity: IConstructionSystemShardTranslationEntity) {
		if (typeFlag === ContainerFlag.cosParameter) {
			this.currentCosMasterParameterQuantityQueryTranslationEntity = entity;
		} else if (typeFlag === ContainerFlag.cosParameter2Template) {
			this.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = entity;
		}
	}

	private clearTranslationEntities(typeFlag: string) {
		if (typeFlag === ContainerFlag.cosParameter) {
			this.currentCosMasterParameterQuantityQueryTranslationEntity = null;
		} else if (typeFlag === ContainerFlag.cosParameter2Template) {
			this.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = null;
		}
	}

	public setValueOfCMDoc(docValue: string) {
		this.editor?.dispatch({
			changes: { from: 0, to: this.editor?.state.doc.length, insert: docValue },
		});
	}
	public setCMReadOnly() {
		if (this.editor) {
			this.editor.dispatch({
				effects: this.readOnlyCompartment?.reconfigure(EditorState.readOnly.of(true)),
			});
		}
	}

	public setCMEditable() {
		if (this.editor) {
			this.editor.dispatch({
				effects: this.readOnlyCompartment?.reconfigure(EditorState.readOnly.of(false)),
			});
		}
	}

	// todo-allen: The function needs to be rewritten.
	public handleChange() {}

	public async onFocus() {
		await this.setRibFunctionsXMLAndUom(null, this.languageMenuService.langCode);
		// $scope.$emit('updateRequested', true); // todo-allen
	}

	/**
	 * get the content of the RIBFunctions.xml
	 **/
	public getRIBFunctionsXMLAndUoM(languageCode: string) {
		const getHttpOptions: GetHttpOptions = { params: { languageCode: languageCode } };
		return this.http.get<RibFunctionsXMLAndUomEntity>('constructionsystem/master/quantityquery/getRIBFunctioinsXMLAndUoM', getHttpOptions);
	}

	public async setRibFunctionsXMLAndUom(cm: EditorView | null, languageCode: string) {
		let ribFunctionsXMLAndUoMJsonData = this.ribFunctionsXMLAndUomObjectArray[languageCode];
		if (!ribFunctionsXMLAndUoMJsonData) {
			ribFunctionsXMLAndUoMJsonData = await this.getRIBFunctionsXMLAndUoM(languageCode);
			this.ribFunctionsXMLAndUomObjectArray[languageCode] = ribFunctionsXMLAndUoMJsonData;
		}
		this.extractRibFunctionsXMLAndUom(cm, ribFunctionsXMLAndUoMJsonData);
	}

	public extractRibFunctionsXMLAndUom(cm: EditorView | null, jsonData: RibFunctionsXMLAndUomEntity) {
		this.resetOptionConfigValue(cm);
		const xmlDocJson = jsonData.RibFunctionDoc;
		const uomArrayReturned = jsonData.UomArray;
		if (xmlDocJson && uomArrayReturned) {
			this.uomArray = uomArrayReturned;
			if (xmlDocJson.Global && xmlDocJson.Global.Operators) {
				this.operatorObjectsArray = xmlDocJson.Global.Operators;
				for (let i = 0; i < xmlDocJson.Global.Operators.length; i++) {
					this.operatorExtKeysArray.push(xmlDocJson.Global.Operators[i].ExtKey);
				}
			}

			if (xmlDocJson.Functions) {
				this.parameterTypeKeyMapExtKey = this.getParameterTypeKeyMapExtKey(xmlDocJson.Functions);
				this.parameterValueKeyMapExtKey = this.getParameterValueKeyMapExtKey(xmlDocJson.Functions);
				// cm.setOption('parameterTypeKeyMapExtKey', parameterTypeKeyMapExtKey); // todo-allen: This code appears to be deprecated
				// cm.setOption('parameterValueKeyMapExtKey', parameterValueKeyMapExtKey); // todo-allen: This code appears to be deprecated
				for (let j = 0; j < xmlDocJson.Functions.length; j++) {
					const functionObj: FunctionObj = {
						functionKey: xmlDocJson.Functions[j].Key,
						functionName: xmlDocJson.Functions[j].ExtKey,
						functionExtDesc: xmlDocJson.Functions[j].ExtDesc,
						defaultUoMs: xmlDocJson.Functions[j].DefaultUoMs,
						ParametersArray: [],
						defaultTypesObjectArray: [],
						defaultUoMsObjectArray: [],
					};
					if (xmlDocJson.Functions[j].ExtKey === 'QTO') {
						const defaultTypes = xmlDocJson.Functions[j].DefaultTypes;
						if (defaultTypes && defaultTypes instanceof Array) {
							const defaultTypesObjectArray = [];
							for (let k = 0; k < defaultTypes.length; k++) {
								const defaultTypeObj = { dim: defaultTypes[k].DIM, p_Type: defaultTypes[k].P_Type };
								defaultTypesObjectArray.push(defaultTypeObj);
							}
							functionObj.defaultTypesObjectArray = defaultTypesObjectArray;
						}

						const defaultUoMs = xmlDocJson.Functions[j].DefaultUoMs;
						if (defaultUoMs && defaultUoMs instanceof Array) {
							const defaultUoMsObjectArray: { dim: string; uoM: string | undefined }[] = [];
							for (let m = 0; m < defaultUoMs.length; m++) {
								const defaultUoMObj = { dim: defaultTypes[m].DIM, uoM: defaultTypes[m].UoM };
								defaultUoMsObjectArray.push(defaultUoMObj);
							}
							functionObj.defaultUoMsObjectArray = defaultUoMsObjectArray;
						}

						const calcDictionary = xmlDocJson.Functions[j].CalcDictionary;
						if (calcDictionary) {
							functionObj.calcDictionary = calcDictionary;
						}
					}
					this.functionsArray.push(functionObj);

					if (xmlDocJson.Functions[j].ParameterTypes && xmlDocJson.Functions[j].ParameterTypes.ParameterTypeList) {
						this.getFunctionParams(cm, functionObj, xmlDocJson.Functions[j].ParameterTypes.ParameterTypeList, xmlDocJson.Functions[j].Parameters);
					}
				}
			}
		}
		this.prepareTargetArray();
		this.functionNamesArray = this.getFunctionNamesArray(cm, this.functionsArray);
		// cm.setOption('operatorExtKeysArray', operatorExtKeysArray); // todo-allen: This code appears to be deprecated
		// cm.setOption('operatorObjectsArray', operatorObjectsArray); // todo-allen: This code appears to be deprecated
		// cm.setOption('functionsArray', functionsArray); // todo-allen: This code appears to be deprecated

		// cm.setOption('functionNamesArray', getFunctionNamesArray(cm, functionsArray));
		// cm.setOption('uomArray', uomArray); // todo-allen: This code appears to be deprecated
	}

	public prepareTargetArray() {
		if (this.operatorExtKeysArray.length > 0) {
			this.targetOperatorRegExp = '';
			this.targetWordOperatorArray = [];
			const operatorCharRegexA = /[+\-*%=<>]+/;
			const operatorCharRegexB = /[a-z]+/i;
			this.operatorExtKeysArray.forEach((item) => {
				if (operatorCharRegexA.test(item)) {
					for (let j = 0; j < item.length; j++) {
						if (isString(this.targetOperatorRegExp) && this.targetOperatorRegExp.indexOf(item[j]) === -1) {
							this.targetOperatorRegExp += item[j];
						}
					}
				} else if (operatorCharRegexB.test(item)) {
					if (!this.targetWordOperatorArray.includes(item)) {
						this.targetWordOperatorArray.push(item);
					}
				}
			});

			if (this.targetOperatorRegExp) {
				this.targetOperatorRegExp = new RegExp('[' + this.targetOperatorRegExp + ']');
			}
		}
	}

	// todo-allen: Do the function names need to be added in the order specified in the RIBFunctions.xml file?
	public getFunctionNamesArray(cm: EditorView | null, functionsArray: FunctionObj[]) {
		if (!Array.isArray(functionsArray)) {
			return [];
		}

		const functionNamesSet = new Set<string>();
		functionsArray.forEach((func) => functionNamesSet.add(func.functionName));

		return Array.from(functionNamesSet);
	}

	public resetOptionConfigValue(cm: EditorView | null) {
		this.parameterTypeKeyMapExtKey = [];
		this.parameterValueKeyMapExtKey = [];
		this.operatorExtKeysArray = [];
		this.functionsArray = [];
		this.uomArray = [];
		this.operatorObjectsArray = [];

		// todo-allen: The codes appear to be deprecated ?
		//  cm.setOption('parameterTypeKeyMapExtKey', null);
		//  cm.setOption('parameterValueKeyMapExtKey', null);
		//  cm.setOption('operatorExtKeysArray', null);
		//  cm.setOption('functionsArray', null);
		//  cm.setOption('uomArray', null);
		//  cm.setOption('operatorObjectsArray', null);
	}

	public getParameterTypeKeyMapExtKey(functionsArray: RIBFunction[]) {
		const parameterTypeKeyMapExtKey: { [key: string]: string } = {};

		if (Array.isArray(functionsArray)) {
			functionsArray.forEach((functionObj) => {
				functionObj.ParameterTypes?.ParameterTypeList?.forEach(({ Key, ExtKey }) => {
					if (!(Key.Text in parameterTypeKeyMapExtKey)) {
						parameterTypeKeyMapExtKey[Key.Text] = ExtKey;
					}
				});
			});
		}
		return parameterTypeKeyMapExtKey;
	}

	public getParameterValueKeyMapExtKey(functionsArray: RIBFunction[]) {
		const parameterValueKeyMapExtKeyObject: { [key: string]: string } = {};
		if (Array.isArray(functionsArray)) {
			functionsArray.forEach((functionObj) => {
				functionObj.Parameters?.forEach(({ Key, ExtKey }) => {
					if (!(Key in parameterValueKeyMapExtKeyObject)) {
						parameterValueKeyMapExtKeyObject[Key] = ExtKey;
					}
				});
			});
		}
		return parameterValueKeyMapExtKeyObject;
	}

	public getFunctionParams(cm: EditorView | null, functionObj: FunctionObj, parameterTypeNodes: RIBFunctionParameterType[], parameterNodes: Parameter[]) {
		enum ParameterTypeName {
			Type = 'Type',
			HRef = 'HRef',
		}

		enum ParameterName {
			UoM = 'UoM',
			QNorm = 'QNorm',
		}

		function processQNormParameter(functionObj: FunctionObj, parameterObj: ParameterObj) {
			if (Array.isArray(functionObj.calcDictionary?.Norms)) {
				const normsArray = functionObj.calcDictionary.Norms;
				normsArray.forEach((norm) => {
					const parameterValueObj: ParameterValueObj = {
						parameterValueKey: norm.Key,
						parameterValueExtKey: norm.ExtKey,
						parameterValueExtDesc: norm.ExtDesc,
						parentParameterValueKey: undefined,
						hasChildren: false,
						parameterValueShortKey: norm.ShortKey,
					};
					parameterObj.parameterValuesArray.push(parameterValueObj);

					if (Array.isArray(norm.Policies) && norm.Policies.length > 0) {
						parameterValueObj.hasChildren = true;
						norm.Policies.forEach((policy) => {
							parameterObj.parameterValuesArray.push({
								parameterValueKey: policy.Key,
								parameterValueExtKey: policy.ExtKey ?? policy.Key,
								parameterValueExtDesc: policy.Key,
								parentParameterValueKey: norm.Key,
								hasChildren: false,
							});
						});
					}
				});
			}
		}

		function processOtherParameters(parameterNodes: Parameter[], parameterObj: ParameterObj) {
			parameterNodes.forEach((paramNode) => {
				paramNode.TypeConfigList.forEach((typeConfig) => {
					if (typeConfig.TypeName === parameterObj.parameterNameKey && typeConfig.Valid === ParameterTypeValid.item) {
						const parameterValueObj: ParameterValueObj = {
							parameterValueKey: paramNode.Key,
							parameterValueExtKey: paramNode.ExtKey,
							parameterValueExtDesc: paramNode.ExtDesc,
							parameterValueShortKey: paramNode.ShortKey,
							parameterValuePType: paramNode.PType,
							parameterValuePic: paramNode.Pic
								? {
										sizeX: paramNode.Pic.SizeX,
										sizeY: paramNode.Pic.SizeY,
										Path: paramNode.Pic.Path,
									}
								: undefined,
							connectionsForTypeNode: typeConfig.TypeName === ParameterTypeName.Type ? typeConfig.ConnectionsForTypeNode : undefined,
							connectionsForHRefNode: typeConfig.TypeName === ParameterTypeName.HRef ? typeConfig.ConnectionsForHRefNode : undefined,
						};
						parameterObj.parameterValuesArray.push(parameterValueObj);
					}
				});
			});
		}

		const processUoMParameter = (functionObj: FunctionObj) => {
			const uomParameterObj = functionObj.ParametersArray.find((param) => param.parameterNameKey === ParameterName.UoM);
			if (uomParameterObj && uomParameterObj.parameterValuesArray.length === 0) {
				this.uomArray.forEach((uom) => {
					uomParameterObj.parameterValuesArray.push({
						parameterValueKey: uom,
						parameterValueExtKey: uom,
						parameterValueExtDesc: uom,
					});
				});
			}
		};

		parameterTypeNodes.forEach((typeNode) => {
			if (!this.arrayContains(functionObj.ParametersArray, typeNode.ExtKey)) {
				const parameterObj: ParameterObj = {
					parameterNameKey: typeNode.Key.Text,
					parameterName: typeNode.ExtKey,
					parameterNameDesc: typeNode.ExtDesc,
					parameterValuesArray: [],
				};

				functionObj.ParametersArray.push(parameterObj);

				if (parameterObj.parameterNameKey === ParameterName.QNorm) {
					processQNormParameter(functionObj, parameterObj);
				} else {
					if (parameterNodes) {
						processOtherParameters(parameterNodes, parameterObj);
					}
				}
			}
		});

		processUoMParameter(functionObj);
	}

	// todo-allen: The purpose of this function is to ensure compatibility with Internet Explorer. It may no longer be needed.
	private arrayContains(arr: unknown[], item: unknown) {
		if (!Array.prototype.indexOf) {
			let i = arr.length;
			while (i--) {
				if (arr[i] === item) {
					return true;
				}
			}
			return false;
		}
		if (arr) {
			return arr.indexOf(item) !== -1;
		} else {
			return false;
		}
	}

	public getFunctionDescription(functionsArray: FunctionObj[], functionName: string) {
		if (Array.isArray(functionsArray)) {
			const functionObj = functionsArray.find((f) => f.functionName === functionName);
			return functionObj?.functionExtDesc || null;
		}
		return null;
	}

	public getParameterDescription(functionsArray: FunctionObj[], functionName: string, parameterName: string) {
		if (!Array.isArray(functionsArray)) {
			return null;
		}

		const func = functionsArray.find((f) => f.functionName === functionName);

		if (func) {
			const param = func.ParametersArray?.find((p) => p.parameterName === parameterName);
			return param?.parameterNameDesc || null;
		}

		return null;
	}

	public getParameterValueDescription(functionsArray: FunctionObj[], functionName: string, parameterName: string, parameterValue: string) {
		if (!Array.isArray(functionsArray)) {
			return null;
		}
		// find function
		const functionObj = functionsArray.find((fn) => fn.functionName === functionName);
		if (!functionObj) {
			return null;
		}
		// find parameter of the target function
		const parameterObj = functionObj.ParametersArray?.find((param) => param.parameterName === parameterName);
		if (!parameterObj) {
			return null;
		}
		// find parameter of the target parameter
		const parameterValueObj = parameterObj.parameterValuesArray?.find((val) => val.parameterValueExtKey === parameterValue || val.parameterValueShortKey === parameterValue);
		return parameterValueObj ? parameterValueObj.parameterValueExtDesc : null;
	}

	public getExtKeyOfParameterNameFromKey(parameterTypeKeyMapExtKey: { [p: string]: string }, key: string) {
		let extKey = null;
		if (!!parameterTypeKeyMapExtKey && !!key) {
			if (parameterTypeKeyMapExtKey[key]) {
				extKey = parameterTypeKeyMapExtKey[key];
			}
		}
		return extKey;
	}

	// todo-allen: The function needs to be rewritten. (quantity-query-editor.js)
	public getLastToken() {}

	// todo-allen: The function needs to be rewritten. (quantity-query-editor.js)
	public getCurrentFunctionName() {}

	// todo-allen: The function needs to be rewritten. (quantity-query-editor.js)
	public getCurrentParameterName() {}
}
