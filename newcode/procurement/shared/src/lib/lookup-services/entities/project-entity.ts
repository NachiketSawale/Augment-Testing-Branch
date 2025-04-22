/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Project
 */
export class ProjectEntity {

    public ProjectNo!: string;
    public ProjectName!: string;
    public CompanyFk!: number;
    public ProjectName2!: string;
    public StartDate!: Date;
    public GroupDescription!: string;
	 public StatusFk!: number;

    /**
     * constructor
     * @param Id
     */
    public constructor(public Id: number) {

    }
}