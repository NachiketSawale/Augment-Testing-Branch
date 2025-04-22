/*
 * Copyright(c) RIB Software GmbH
*/

import { find, map } from 'lodash';
import {inject, Injectable} from '@angular/core';
import { EvaluationPermissionEnum } from '@libs/businesspartner/interfaces';
import {PlatformPermissionService} from '@libs/platform/common';

export type PermissionDic = {
	name: EvaluationPermissionEnum;
	permission: string;
};

@Injectable({
	providedIn: 'root',
})
export class EvaluationPermissionService{
	private readonly permissionDic: PermissionDic[] = [
		{ name: EvaluationPermissionEnum.EVAL, permission: '953895e120714ab4b6d7283c2fc50e14' },
		{ name: EvaluationPermissionEnum.EVALGROUP, permission: 'e65064d4b4e2466aa043941a50ac3ba7' },
		{ name: EvaluationPermissionEnum.EVALCLERK, permission: '2902e129fa9c4c2d9e3f8cd1bfa6b7d8' },
		{ name: EvaluationPermissionEnum.EVALGROUPCLERK, permission: '7fdae404c0164283a7f0ffc8a5fcbf01' },
		{ name: EvaluationPermissionEnum.EVALSUBGROUPCLERK, permission: 'ccdb79b7bba44c808e1173e1385554fa' },
		{ name: EvaluationPermissionEnum.EVALITEM, permission: '26262220fe874ea1bc218229c1f96114' },
	];

	private readonly permissionService = inject(PlatformPermissionService);

	public constructor() {
	}

	public getPermissions() {
		return map(this.permissionDic, item => {
			return item.permission;
		});
	}

	public getPermission(name: EvaluationPermissionEnum) {
		const permissionObj = find(this.permissionDic, { name: name });
		if (!permissionObj) {
			throw new Error('No such permission.');
		}

		return permissionObj.permission;
	}
}
