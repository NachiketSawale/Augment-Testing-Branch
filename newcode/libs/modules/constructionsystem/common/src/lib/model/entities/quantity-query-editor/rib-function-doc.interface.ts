/*
 * Copyright(c) RIB Software GmbH
 */

import { OperatorType } from '../../enums/quantity-query-editor/operator-type.enum';
import { ParameterTypeValid } from '../../enums/quantity-query-editor/parameter-type-valid.enum';
import { ConnectionTypeAllow } from '../../enums/quantity-query-editor/connection-type-allow.enum';

export interface RibFunctionsXMLAndUomEntity {
	RibFunctionDoc: RIBFunctionDocEntity;
	UomArray: string[];
}

export interface RIBFunctionDocEntity {
	Global: Global;
	Functions: RIBFunction[];
}

export interface Global {
	Operators: Operator[];
	Pic: GlobalPicConfig;
}

export interface Operator {
	Key: string;
	Type: OperatorType;
	ExtKey: string;
	ExtDesc: string;
}

export interface GlobalPicConfig {
	SizeX: number;
	SizeY: number;
}

export interface RIBFunction {
	Key: string;
	ExtKey: string;
	ExtDesc: string;
	ParameterTypes: ParameterTypes;
	ComponentTypes: string[];
	DefaultConfiguration_2Q: DefaultConfiguration_2Q;
	DefaultTypes: RIBFunctionDefaultType[];
	DefaultUoMs: DefaultUoM[];
	Parameters: Parameter[];
	Messages: Message[];
	CalcDictionary: CalcDictionary;
}

export interface ParameterTypes {
	InputParameter: boolean;
	InputSequence: boolean;
	ParameterTypeList: RIBFunctionParameterType[];
}

export interface RIBFunctionParameterType {
	Key: ParameterTypeKeyConfig;
	ExtKey: string;
	ExtDesc: string;
}

export interface ParameterTypeKeyConfig {
	Optional: boolean | null;
	Multiple: boolean | null;
	IsCond: boolean | null;
	IsMultiCond: boolean | null;
	Text: string;
}

export interface DefaultConfiguration_2Q {
	PrecisionConditions: PrecisionConditions;
	Correction: Correction;
	PolyhedronConditions: PolyhedronConditions;
	DecompositionConditions: DecompositionConditions;
	VisualisationConditions: VisualisationConditions;
	OutputResultEntriesToCpi: OutputResultEntriesToCpi;
	DenoteErrorWarning: DenoteErrorWarning;
}

export interface PrecisionConditions {
	PercentageMath: PercentageMath;
	PercentageTech: PercentageTech;
	LengthMath: LengthMath;
	AngleMath: AngleMath;
	AngleTech: AngleTech;
}

export interface PercentageMath {
	Eps: string;
	Unit: string;
}

export interface PercentageTech {
	Eps: string;
	Unit: string;
}

export interface LengthMath {
	Eps: string;
	Unit: string;
}

export interface AngleMath {
	Eps: string;
	Unit: string;
}

export interface AngleTech {
	Eps: string;
	Unit: string;
}

export interface Correction {
	CorrectSpace: boolean;
}

export interface PolyhedronConditions {
	LimitFaceOptimization: number;
}

export interface DecompositionConditions {
	LimitVolumeDecomposition: number;
	LimitFaceDecomposition: number;
}

export interface VisualisationConditions {
	ResultVisualisation: boolean;
	FormulaVisualisation: boolean;
}

export interface OutputResultEntriesToCpi {
	ErroneousWithoutResult: boolean;
	WithoutResult: boolean;
}

export interface DenoteErrorWarning {
	AccuracyProblem: boolean;
}

export interface RIBFunctionDefaultType {
	DIM: string;
	P_Type: string;
	UoM?: string; // todo-allen: The field seems be always undefined.
}

export interface DefaultUoM {
	DIM: string;
	UoM: string;
}

export interface Parameter {
	RuleFilter: string;
	Key: string;
	ShortKey: string;
	ExtKey: string;
	ExtDesc: string;
	Pic: ParameterPicConfig;
	PType: string;
	TypeConfigList: ParameterTypeConfig[];
	CoponentTypes: string[];
}

export interface ParameterPicConfig {
	SizeX: number;
	SizeY: number;
	Path: string;
}

export interface ParameterTypeConfig {
	TypeName: string;
	Valid: ParameterTypeValid;
	ConnectionsForTypeNode: ParameterTypeConnectionsForTypeNode;
	ConnectionsForHRefNode: ParameterTypeConnectionsForHRefNode;
}

export interface ParameterTypeConnectionsForTypeNode {
	Dim: string;
	ConnectionsTypeList: ParameterTypeConnectionsType[];
}

export interface ParameterTypeConnectionsForHRefNode {
	Operator: string;
	ConnectionPropList: string[];
}

export interface ConnectionAllowType {
	Use: string;
	Text: string;
}

export interface ParameterTypeConnectionsType {
	TypeName: string;
	Allow: ConnectionTypeAllow;
	AllowTypeList: ConnectionAllowType[];
}

export interface Message {
	Key: string;
	ExtKey: string;
}

export interface CalcDictionary {
	DefaultQTOParameter: DefaultQTOParameterConfig[];
	Options: { [key: string]: string };
	Norms: Norm[];
}

export interface DefaultQTOParameterConfig {
	Name: string;
	Text: string;
	Key: string;
}

export interface Norm {
	Key: string;
	ExtKey: string;
	ExtDesc: string;
	Relation: string;
	NormConfig: NormConfigNode[];
	Policies: Policy[];
	ShortKey?: string; // todo-allen: The field seems be always undefined.
}

export interface NormConfigNode {
	NodeName: string;
	Key: string;
	Type: string;
	Position: string;
	Text: string;
}

export interface Policy {
	Key: string;
	ExtKey: string;
	Rules: Rule[];
}

export interface Rule {
	Typ: string;
	ModellList: Modell[];
}

export interface Modell {
	CADComp: string;
	CADSubtComp: CADSubtComp;
}

export interface CADSubtComp {
	Condition: string;
	Text: string;
}
