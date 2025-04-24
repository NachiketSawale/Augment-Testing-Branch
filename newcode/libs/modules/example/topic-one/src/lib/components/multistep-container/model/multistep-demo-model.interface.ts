import { RgbColor } from '@libs/platform/common';

export interface IFirstFormTestEntity {
	myText: string;
	testDate: Date;
	isGood?: boolean;
	money?: number;
}

export interface IGridTestEntity {
	Id: number;
	projectNumber: string;
	testDate: Date;
	isGood?: boolean;
	money?: number;
	myOtherText?: string;
	myText1?: string;
	mode?: number;
	color?: RgbColor;
	age?: number;
}

export interface changePassword {
	username: string,
	logonname: string,
	oldpassword: string,
	newpassword: string,
	confirmpassword: string,
}

export interface save {
	User: string[];
	Role: string[];
	System: string[];
	Portal: string[];
	SelectedView: string;
}

export interface multistepDemoModel {
	alert?: object;
	changePassword?: changePassword;
	save: { saveData: save };
	form: IFirstFormTestEntity;
	grid: IGridTestEntity[];
	selectedItems: IGridTestEntity[];
}

