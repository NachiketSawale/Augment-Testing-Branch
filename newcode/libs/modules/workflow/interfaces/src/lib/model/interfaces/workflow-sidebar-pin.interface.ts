import { Translatable } from '@libs/platform/common';

export interface IWorkflowSidebarPin {
	uuid: string;
	pinItems: IPinItem[];
	text: string;
}

export interface IPinItem {
	id: number;
	description: Translatable;
}