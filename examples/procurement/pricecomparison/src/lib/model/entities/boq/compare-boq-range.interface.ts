/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICompareBoqRange {
	BoqHeaderId: number;
	ReferenceNo?: string;
	HeaderOutlineSpecification?: string;
	FromId: number;
	FromBoqHeaderId: number;
	FromOutlineSpecification?: string;
	FromReferenceNo?: string;
	ToId: number;
	ToBoqHeaderId: number;
	ToOutlineSpecification?: string;
	ToReferenceNo?: string;
}