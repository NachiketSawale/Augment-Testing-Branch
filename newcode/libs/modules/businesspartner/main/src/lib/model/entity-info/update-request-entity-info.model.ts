import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BusinessPartnerMainUpdateRequestDataService } from '../../services/update-request-data.service';
import { IUpdaterequestEntity } from '@libs/businesspartner/interfaces';

export const UPDATE_REQUEST_ENTITY_INFO = EntityInfo.create<IUpdaterequestEntity>({
	grid: {
		title: {
			text: 'Update Requests',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.updateRequestTitle',
		},
		containerUuid: '7c29553fdae541dda903d4707d0c8df3'
	},
	// eslint-disable-next-line strict
	dataService: (ctx) => ctx.injector.get(BusinessPartnerMainUpdateRequestDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'UpdaterequestDto' },
	permissionUuid: '7c29553fdae541dda903d4707d0c8df3',
	layoutConfiguration: {
		groups: [
			{ gid: 'basicData', attributes: ['Updatesource', 'Updatetable', 'Updatecolumn', 'ObjectFk', 'ObjectFkDescription','ObjectFkNew', 'OldValue', 'NewValue', 'NewValueDescription', 'Isaccepted', 'CommentText', 'MessageText']}
		],
		overloads: {
			Updatesource: {readonly: true},
			Updatetable: {readonly: true},
			Updatecolumn: {readonly: true},
			ObjectFk: {readonly: true},
			ObjectFkDescription: {readonly: true},
			ObjectFkNew: {readonly: true},
			OldValue: {readonly: true},
			NewValue: {readonly: true},
			NewValueDescription: {readonly: true},
			MessageText: {readonly: true}
		},
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
				Updatesource: { key: 'updateSource'},
				Updatetable: { key: 'updateTable'},
				Updatecolumn: { key: 'updateColumn'},
				ObjectFk: { key: 'objectFk'},
				ObjectFkDescription: { key: 'objectFkDescription'},
				ObjectFkNew: { key: 'objectFkNew'},
				OldValue: { key: 'oldValue'},
				NewValue: { key: 'newValue'},
				NewValueDescription: { key: 'newValueDescription'},
				Isaccepted: { key: 'isAccepted'},
				CommentText: { key: 'commentText'},
				MessageText: { key: 'messageText'}
			})
		}
	}
});