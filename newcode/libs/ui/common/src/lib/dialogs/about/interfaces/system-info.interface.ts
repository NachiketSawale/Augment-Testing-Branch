/*
 * Copyright(c) RIB Software GmbH
 */
import { IBuildRecord } from './build-record.interface';
import { IOtherComponentsRecord } from './other-components-record.interface';

/**
 * Interface representing system information.
 */
export interface ISystemInfo {

    /**
     * Node machine name where the application is running.
     */
    nodeMachineName: string;

    /**
     * Build version of the application.
     */
    buildVersion: string;

    /**
     * Product version of the application.
     */
    productVersion: string;

    /**
     * Product Date.
     */
    productDate: string | Date;

    /**
     * Installation date.
     */
    installationDate: string | Date;

    /**
     * Service URL.
     */
    servicesUrl: string;

    /**
     * Client URL.
     */
    clientUrl:string,

     /**
     * Server URL.
     */
    serverUrl:string,

    /**
     * Interface representing system information.
     */
    databaseServerName: string;

    /**
     * Database server version
     */
    databaseServerVersion: string;

    /**
     * Database version read time.
     */
    dbVersionReadTime: string;

    /**
     * Language information for the application.
     */
    languageInfo?: string;

    /**
     * Records of build information for the application.
     */
    buildRecords: IBuildRecord[];

    /**
     * Records of other components used in the application.
     */
    otherComponentsRecords: IOtherComponentsRecord[];
}
