/*
 * Copyright(c) RIB Software GmbH
 */

import { CalcDictionary, DefaultUoM, ParameterTypeConnectionsForHRefNode, ParameterTypeConnectionsForTypeNode } from './rib-function-doc.interface';

export interface FunctionObj {
	functionKey: string;
	functionName: string;
	functionExtDesc: string;
	defaultUoMs: DefaultUoM[];
	defaultTypesObjectArray: { dim: string; p_Type: string }[];
	defaultUoMsObjectArray: { dim: string; uoM: string | undefined }[];
	calcDictionary?: CalcDictionary;
	ParametersArray: ParameterObj[];
}

export interface ParameterObj {
	parameterNameKey: string;
	parameterName: string;
	parameterNameDesc: string;
	parameterValuesArray: ParameterValueObj[];
}

export interface ParameterValueObj {
	parameterValueKey: string;
	parameterValueShortKey?: string;
	parameterValueExtKey: string;
	parameterValueExtDesc: string;
	parentParameterValueKey?: string;
	hasChildren?: boolean;
	parameterValuePType?: string;
	parameterValuePic?: { sizeX: number; sizeY: number; Path: string };
	connectionsForTypeNode?: ParameterTypeConnectionsForTypeNode;
	connectionsForHRefNode?: ParameterTypeConnectionsForHRefNode;
}
