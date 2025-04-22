/*
 * Copyright(c) RIB Software GmbH
 */

import { ChangeItemType } from '../enums/change-item-type.enum';
import { RequisitionType } from '../enums/requisition-type.enum';
import { IExistedValidBaseRequisitionEntity } from '../entities/create-requisition/existed-valid-base-requisition-entity.interface';

export interface IChangeOrder {
	req: ChangeItemType;
	changeReq: ChangeItemType;
	contract: ChangeItemType;
}

export interface IChangeOrderEntity {
	changeItemEnum: IChangeOrder;
	isChangeItem: boolean | ChangeItemType | null;
	overwriteDisabled: boolean;
	showBtnPrevious: boolean;
	selectedBtnRadioValue: string;
	isOrderStatus: boolean;
	showBtnNext?: boolean;
}

export interface ICreateRequisitionModalOptions {
	headerText: string;
	headerTitle: string;
	selectSubPackageTitle: string;
	createRequisitionTitle: string;
	basedOnExistedRequisitionTitle: string;
	basedOnExistedContractTitle: string;
	overwriteRequisitionText: string;
	changeOrderRequisitionText: string;
	doesCopyHeaderTextFromPackage: boolean;
	changeRequestText: string;
	btnOkText: string;
	btnCloseText: string;
	btnPreviousText: string;
	btnNextText: string;
	navigateTitle: string;
	isBtnNextDisabled: boolean;
	isBtnOKDisabled: boolean;
	isBtnNavigateDisabled: boolean;
	changeOrder: IChangeOrderEntity;
	step: string;
	dialogLoading: boolean;
	reqType: RequisitionType;
	requisitionId: number;
	overwriteReq?: boolean;
	isSelectedBase?: boolean;
	selectedBaseReq?: IExistedValidBaseRequisitionEntity;
	selectedButtonReadonly?: () => void;
	setChangeItem: (value: ChangeItemType) => void;
}
