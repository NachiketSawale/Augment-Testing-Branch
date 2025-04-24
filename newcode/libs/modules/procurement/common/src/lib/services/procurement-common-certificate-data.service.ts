/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { BasicsSharedDecimalPlacesEnum } from '@libs/basics/shared';
import { IPrcCertificateCopyOptions, IPrcHeaderContext, IPrcModuleValidatorService } from '../model/interfaces';
import { format } from 'mathjs';
import { ProcurementCommonTotalDataService } from './procurement-common-total-data.service';

import { ProcurementCommonCertificateReadonlyProcessor } from './processors/procurement-common-certificate-readonly-processor.service';
import { ProcurementCommonCertificateDataProcessor } from './processors/procurement-common-certificate-data-processor.class';
import { firstValueFrom } from 'rxjs';
import { IPrcConfiguration2CertEntity } from '@libs/basics/procurementstructure';
import { ProcurementCommonDataServiceFlatLeaf } from './procurement-common-data-service-flat-leaf.service';
import { IPrcCertificateCopyParameters } from '../model/interfaces/prc-certificate-copy-parameter.interface';
import { IPrcCommonTotalEntity, IPrcCertificateEntity } from '@libs/procurement/interfaces';


/**
 * The basic data service for procurement Certificate entity
 */
export abstract class ProcurementCommonCertificateDataService<T extends IPrcCertificateEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
    extends ProcurementCommonDataServiceFlatLeaf<T, PT, PU> {

    public readonly readonlyProcessor: ProcurementCommonCertificateReadonlyProcessor<T, PT, PU>;
    public readonly dataProcessor: ProcurementCommonCertificateDataProcessor<T, PT, PU>;
    private configuration2certCache: { [key: string]: IPrcConfiguration2CertEntity[] } | undefined;

    protected constructor(
        public override parentService: IPrcModuleValidatorService<PT, PU> & IReadonlyParentService<PT, PU>,
        protected config: { apiUrl?: string, itemName?: string },
        protected totalDataService?: ProcurementCommonTotalDataService<IPrcCommonTotalEntity, PT, PU>,) {
        const dataConfig: { apiUrl: string, itemName: string, endPoint?: string } = {
            apiUrl: config.apiUrl || 'procurement/common/prccertificate',
            itemName: config.itemName || 'PrcCertificate'
        };

        super(parentService, dataConfig);
        this.readonlyProcessor = new ProcurementCommonCertificateReadonlyProcessor(this);
        this.dataProcessor = new ProcurementCommonCertificateDataProcessor(this);

        this.processor.addProcessor([
            this.readonlyProcessor,
            this.dataProcessor
        ]);
    }

    /**
     * Copy certificate information from another module
     * @param value
     * @param parameters
     */
    public async copyCertificatesFromOtherModule(value: number, parameters: IPrcCertificateCopyParameters) {
        const copyOptions = this.createCopyOptions(value, parameters);
        const {url, parameter, dataService} = copyOptions;

        const lists = dataService.getList();

        parameter.BpdCertificateTypeIds = lists.map(item => item.BpdCertificateTypeFk as number);

        return await firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + url, parameter));

        //todo Generate data, should be put in the background code
        // if (!_.isNil(response.data)) {
        //     var responseData = response.data;
        //     var newCerts = responseData.invCertificatesNew;
        //     if (newCerts !== null && newCerts.length > 0) {
        //         service.createCertificates(newCerts);
        //     }
        //     // if some BpdCertificateTypes exist, some changes will happen to them.
        //     var existedCerts = responseData.existedCertificates;
        //     if (existedCerts !== null && existedCerts.length > 0) {
        //         _.forEach(existedCerts, function (cert) {
        //             // may some with some same BpdCtificateType delete but not save to DB yet , so filter and copy.
        //             var item = _.find(lists, {BpdCertificateTypeFk: cert.BpdCertificateTypeFk || cert.CertificateTypeFk});
        //             if (item) {
        //                 doModifyItemAndMark(item, cert, false, service);
        //             }
        //         });
        //     }
        // }
    }

    /**
     * Calculate the amount of a given item and certificate type
     * @param item
     * @param certificateTypeFk
     */
    public async calculateAmount(item: T, certificateTypeFk: number): Promise<void> {
        const parentItem = this.parentService.getSelectedEntity();
        if (!parentItem) {
            return;
        }

        const headerContext = this.getHeaderContext() as unknown as IPrcHeaderContext;
        if (!headerContext.structureFk) {
            return;
        }

        const cacheKey = `${headerContext.prcConfigFk}-${headerContext.structureFk}`;
        let certificateInfoList = this.configuration2certCache?.[cacheKey];

        if (!certificateInfoList) {
            const paramData = {
                PrcConfigFk: headerContext.prcConfigFk,
                StructureFk: headerContext.structureFk,
                MainItemId: headerContext.prcHeaderFk
            };
            const response = await firstValueFrom(
                this.http.post<IPrcConfiguration2CertEntity[]>(
                    this.configurationService.webApiBaseUrl + 'procurement/common/prccertificate/getconfig2certifcates',
                    paramData
                )
            );
            if (response) {
                this.configuration2certCache ??= {};
                this.configuration2certCache[cacheKey] = response;
                certificateInfoList = response;
            }
        }

        this.calculateAmountExp(item, certificateTypeFk, certificateInfoList);
    }

    public calculateAmountExp(item: T, certificateTypeFk: number, certificateInfoList: IPrcConfiguration2CertEntity[] | undefined): void {
        const config2cert = certificateInfoList?.find((cert) => cert.BpdCertificateTypeFk === certificateTypeFk);
        if (config2cert) {
            item.GuaranteeCost = config2cert.GuaranteeCost;
            item.GuaranteeCostPercent = config2cert.GuaranteeCostPercent;
            item.ValidFrom = config2cert.ValidFrom ? config2cert.ValidFrom : null;
            item.ValidTo = config2cert.ValidTo ? config2cert.ValidTo : null;
            this.recalculateAmountExp(item, item.GuaranteeCostPercent);
        } else {
            item.GuaranteeCost = null;
            item.GuaranteeCostPercent = null;
            item.ValidFrom = null;
            item.ValidTo = null;
            item.RequiredAmount = 0;
        }
    }

    public recalculateAmountExp(item: T, costPercent: number | undefined | null): void {
        const netTotalItem = this.totalDataService!.getNetTotalItem();
        if (item && costPercent && netTotalItem) {
            item.RequiredAmount = Number(format(costPercent * netTotalItem.ValueNet / 100,
                {precision: BasicsSharedDecimalPlacesEnum.decimalPlaces14}));
        }
    }

    /**
     * Create copy options (maybe to be overridden).
     * @param value
     * @param entity
     * @protected
     */
    protected createCopyOptions(value: number, parameters: IPrcCertificateCopyParameters): IPrcCertificateCopyOptions<T, PT, PU> {
        return {
            url: 'procurement/common/prccertificate/copycertificatesfromproject',
            dataService: this,
            parameter: {PrcHeaderId: parameters.PrcHeaderId, PrjProjectId: value}
        };
    }

	public clearConfiguration2certCache ():void {
		if (this.configuration2certCache) {
			this.configuration2certCache = undefined;
		}
	}

	public onReloadSuccessed(loaded:T[]){}

	public clearCache(){
		 this.clearCache();
		 this.setList([]);
	}
}