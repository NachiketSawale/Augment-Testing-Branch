/*
 * Copyright(c) RIB Software GmbH
 */

/***
 * Structure of exported object for Field operand type
 */
export interface IOperandPropertyExport {
	DdProperty: {
		Path: string
	}
}

/***
 * Structure of exported object for Value operand type
 */
export interface IOperandLiteralExport {
	Literal: {
		[key:string]: string
	}
}

/***
 * Structure of exported object when Environment Expressions are used in operands
 */
export interface IEnvironmentExpressionExport {
	EnvironmentExpression: {
		kind: string,
		id: number
	}
}

/***
 * Structure of exported object of Dynamic Expressions, i.e. Variable Time Period
 */
export interface IDynamicValueExport {
	DynamicValue: {
		Parameters: IDynamicValueLiteral[],
		Transformation: number
	}
}

/***
 * Structure of Parameter array items of IDynamicValueExport
 */
export interface IDynamicValueLiteral {
	Literal: {
		Integer: number
	}
}

/***
 * The structure of rule export which is sent as the filterString while performing search
 */
export interface IRuleExport {
	Children: IRuleExport[],
	Context: object,
	Operands: (IOperandPropertyExport | IOperandLiteralExport | IEnvironmentExpressionExport | IDynamicValueExport)[],
	Id: number,
	Description: string,
	ConditionFk: number,
	ConditionFktop: number,
	ConditiontypeFk: number,
	EntityIdentifier: string | null,
	OperatorFk: number,
	ClobsFk: number | null,
	InsertedAt: string,
	InsertedBy: number,
	UpdatedAt: string | null,
	UpdatedBy: number | null,
	Version: number,
	BulkConfigurationEntities: string,
	_ruleEditorInstance: object,
	$$hashKey: string
}