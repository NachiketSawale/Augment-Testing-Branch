/*
 * Copyright(c) RIB Software GmbH
 */

import {
	EntityInfo,
	IEntityTreeConfiguration
} from '@libs/ui/business-base';

import { UsermanagementRightBehavior } from '../behaviors/usermanagement-right-behavior.service';
import { UsermanagementRightDataService } from '../services/usermanagement-right-data.service';
import { IDescriptorStructureEntity } from './entities/descriptor-structure-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * The Usermanagement Right entity container configuration
 */
export const USERMANAGEMENT_RIGHT_ENTITY_INFO: EntityInfo = EntityInfo.create<IDescriptorStructureEntity>({
	grid: {
		title: { key: 'usermanagement.right.rightContainerTitle' },
		behavior: (ctx) => ctx.injector.get(UsermanagementRightBehavior),
		treeConfiguration: (ctx) => {
			return {
				children: (usermanagement) => usermanagement.Nodes,
				parent: function (usermanagement: IDescriptorStructureEntity) {
					return ctx.injector.get(UsermanagementRightDataService).parentOf(usermanagement);
				},
			} as IEntityTreeConfiguration<IDescriptorStructureEntity>;
		},
	},
	form: {
		title: { key: 'usermanagement.right.usermanagementRightDetailsContainerTitle' },
		containerUuid: 'f8c426a1491d43bba106ba982b3fcf66',
	},
	dataService: (ctx) => ctx.injector.get(UsermanagementRightDataService),
	dtoSchemeId: { moduleSubModule: 'UserManagement.Main', typeName: 'DescriptorStructureDto' },
	permissionUuid: '7699abc07ec946cfb35d3646ed63c273',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['Name', 'Description', 'Read', 'Write', 'Create', 'Delete', 'Execute', 'ReadDeny', 'WriteDeny', 'CreateDeny', 'DeleteDeny', 'ExecuteDeny'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('usermanagement.right.', {
				Name: {
					key: 'rightName',
					text: 'Name',
				},
				Description: {
					key: 'rightDescription',
					text: 'Description',
				},
				Read: {
					key: 'rightRead',
					text: 'R',
				},
				Write: {
					key: 'rightWrite',
					text: 'W',
				},
				Create: {
					key: 'rightCreate',
					text: 'C',
				},
				Delete: {
					key: 'rightDelete',
					text: 'D',
				},
				Execute: {
					key: 'rightExecute',
					text: 'E',
				},
				ReadDeny: {
					key: 'rightReadDeny',
					text: 'DR',
				},
				WriteDeny: {
					key: 'rightWriteDeny',
					text: 'DW',
				},
				CreateDeny: {
					key: 'rightCreateDeny',
					text: 'DC',
				},
				DeleteDeny: {
					key: 'rightDeleteDeny',
					text: 'DD',
				},
				ExecuteDeny: {
					key: 'rightExecuteDeny',
					text: 'DE',
				},
			}),
		},
		overloads: {
			Name: { readonly: true },
			Description: { readonly: true },
			Read: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipRead' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipRead' },
					label: { key: 'usermanagement.right.toolTipRead' },
				},
			},
			Write: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipWrite' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipWrite' },
					label: { key: 'usermanagement.right.toolTipWrite' },
				},
			},
			Create: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipCreate' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipCreate' },
					label: { key: 'usermanagement.right.toolTipCreate' },
				},
			},
			Delete: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipDelete' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipDelete' },
					label: { key: 'usermanagement.right.toolTipDelete' },
				},
			},
			Execute: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipExecute' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipExecute' },
					label: { key: 'usermanagement.right.toolTipExecute' },
				},
			},
			ReadDeny: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipReadDeny' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipReadDeny' },
					label: { key: 'usermanagement.right.toolTipReadDeny' },
				},
			},
			WriteDeny: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipWriteDeny' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipWriteDeny' },
					label: { key: 'usermanagement.right.toolTipWriteDeny' },
				},
			},
			CreateDeny: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipCreateDeny' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipCreateDeny' },
					label: { key: 'usermanagement.right.toolTipCreateDeny' },
				},
			},
			DeleteDeny: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipDeleteDeny' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipDeleteDeny' },
					label: { key: 'usermanagement.right.toolTipDeleteDeny' },
				},
			},
			ExecuteDeny: {
				grid: {
					tooltip: { key: 'usermanagement.right.toolTipExecuteDeny' },
				},
				form: {
					tooltip: { key: 'usermanagement.right.toolTipExecuteDeny' },
					label: { key: 'usermanagement.right.toolTipExecuteDeny' },
				},
			},
		},
	},
});
