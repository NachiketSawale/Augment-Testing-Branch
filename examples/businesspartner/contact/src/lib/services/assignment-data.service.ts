import {
	DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {IContactEntityComplete} from '@libs/businesspartner/common';
import { IBusinessPartnerAssignmentEntity, IContactEntity } from '@libs/businesspartner/interfaces';
import {Injectable} from '@angular/core';
import {ContactDataService} from './contact-data.service';
import {find, set, isArray} from 'lodash';
import {PlatformConfigurationService, PropertyType, ServiceLocator} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {UiCommonMessageBoxService} from '@libs/ui/common';
import {ContactAssignmentValidationService} from './validations/assignment-validation.service';

@Injectable({
	providedIn: 'root'
})
export class ContactAssignmentDataService extends DataServiceFlatLeaf<IBusinessPartnerAssignmentEntity, IContactEntity, IContactEntityComplete> {

	public constructor(parentService: ContactDataService) {
		const options: IDataServiceOptions<IBusinessPartnerAssignmentEntity> = {
			apiUrl: 'businesspartner/contact/businesspartnerassignment',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1??-1
					};
				}
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IBusinessPartnerAssignmentEntity, IContactEntity, IContactEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartnerAssignment',
				parent: parentService
			}
		};
		super(options);
		this.processor.addProcessor([{
			process: (item) => {
				this.processItem(item);
			},
			revertProcess() {
			}
		}]);
	}

	private processItem(item: IBusinessPartnerAssignmentEntity) {
		if (item) {
			const validationService = ServiceLocator.injector.get(ContactAssignmentValidationService);
			const result = validationService.validateBusinessPartnerFk({entity: item, value: item.BusinessPartnerFk, field: 'BusinessPartnerFk'});
			if (result.valid) {
				this.addInvalid(item, {result: result, field: 'BusinessPartnerFk'});
			} else {
				this.removeInvalid(item, {result: result, field: 'BusinessPartnerFk'});
			}
			if (item.IsMain) {
				this.setEntityReadOnlyFields(item, [{field: 'BusinessPartnerFk', readOnly: true}]);
			}
		}
	}

	protected override provideCreatePayload(): object {
		const selection = this.getSelectedParent();
		if (selection) {
			return {
				mainItemId: selection.Id
			};
		}
		throw new Error('No Contact is selected');
	}

	protected override onCreateSucceeded(created: object): IBusinessPartnerAssignmentEntity {
		return created as unknown as IBusinessPartnerAssignmentEntity;
	}

	public override delete(entities: IBusinessPartnerAssignmentEntity[] | IBusinessPartnerAssignmentEntity): void {
		if (!isArray(entities)) {
			entities = [entities];
		}
		if (entities && entities.length > 0) {
			for (let i = 0; i < entities.length; ++i) {
				if (entities[i].IsMain) {
					const msgBox = ServiceLocator.injector.get(UiCommonMessageBoxService);
					msgBox.showMsgBox({
						headerText: 'cloud.common.errorMessage',
						bodyText: 'businesspartner.contact.businessPartnerAssignment.deleteError',
						iconClass: 'ico-error'
					});
					return;
				}
			}
			super.delete(entities);
		}


		if (entities && entities.length > 0) {
			const entity = entities[0];
			const http = ServiceLocator.injector.get(HttpClient);
			const configService = ServiceLocator.injector.get(PlatformConfigurationService);
			http.get<IBusinessPartnerAssignmentEntity[]>(configService.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/list?mainItemId=' + entity.Id)
				.subscribe({
					next: (response) => {
						if (response.length > 1) {
							const msgBox = ServiceLocator.injector.get(UiCommonMessageBoxService);
							msgBox.showMsgBox({
								bodyText: 'businesspartner.main.contact.deleteError',
								iconClass: 'ico-error'
							});
						} else {
							super.delete([entity]);
						}
					}
				});
		}
	}

	public syncAssignmentFieldData(args: {value: PropertyType | null | undefined, field: keyof IBusinessPartnerAssignmentEntity}) {
		const bpAssignments = this.getList();
		if(bpAssignments && bpAssignments.length > 0){
			const bpAssignment = find(bpAssignments, {IsMain: true});
			if(bpAssignment && bpAssignment[args.field] !== args.value){
				set(bpAssignment, args.field, args.value);
				this.setModified(bpAssignment);
			}

		}
	}

	public override isParentFn(parentKey: IContactEntity, entity: IBusinessPartnerAssignmentEntity): boolean {
		return entity.ContactFk === parentKey.Id;
	}
}