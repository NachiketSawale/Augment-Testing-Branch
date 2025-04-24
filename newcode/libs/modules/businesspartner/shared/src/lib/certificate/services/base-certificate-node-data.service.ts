import {CompleteIdentification} from '@libs/platform/common';
import {
	DataServiceFlatNode, IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	CertificateHelperService,
	ICertificateHelperServiceOptions, BusinesspartnerSharedCertificateValidationService,
	CertificateEntityComplete
} from '../../model';
import {cloneDeep} from 'lodash';
import { ICertificateEntity } from '@libs/businesspartner/interfaces';

export abstract class BusinesspartnerSharedCertificateNodeDataService<PT extends object, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatNode<ICertificateEntity, CertificateEntityComplete, PT, PU> {

	protected helperService: CertificateHelperService;
	protected validationService: BusinesspartnerSharedCertificateValidationService;

	/*
		default data service options:
		{
			apiUrl: 'businesspartner/certificate/certificate',
			readInfo: <IDataServiceEndPointOptions>{
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				usePost: true
			},
			roleInfo: {
				role: ServiceRole.Node,
				itemName: 'Certificate',
			}
		}
	 */
	protected constructor(identifier: string,
					   dataServiceOptions: object,
					   helperOptions?: ICertificateHelperServiceOptions) {

		const options = cloneDeep(CertificateHelperService.defaultOptions);
		CertificateHelperService.extendOptions(options, dataServiceOptions, '', ['roleInfo.parent']);
		CertificateHelperService.extendOptions(options.roleInfo,  {
			role: ServiceRole.Node,
		});

		super(options as IDataServiceOptions<ICertificateEntity>);
		this.validationService = BusinesspartnerSharedCertificateValidationService.getService(identifier, this);
		this.helperService = new CertificateHelperService(this, this.validationService, helperOptions || {});
		this.processor.addProcessor({
			process: (item) => this.helperService.processItem(item),
			revertProcess() {
			}
		});
	}

	protected override onCreateSucceeded(created: ICertificateEntity): ICertificateEntity {
		return this.helperService.onCreateSucceeded(created);
	}
}