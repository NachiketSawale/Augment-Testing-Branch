/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IAssignCostGroupsEntity, IModelObjectEntity } from '../model/models';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IControllingUnitEntity } from '@libs/controlling/structure';
import { IProjectLocationEntity } from '@libs/project/interfaces';
// import { basicsCostGroupCatalogConfigDataService } from '@libs/basics/cost-group-catalog-config-data-service';

@Injectable({
    providedIn: 'root'
})

export class modelMainObjectAssignmentWizardService {
    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private http = inject(HttpClient);
    private config = inject(PlatformConfigurationService);
    /**
     * @ngdoc method
     * @name checkSelection
     * @function
     * @methodOf modelMainObjectAssignmentWizardService
     * @description Checks whether a model is selected.
     * @returns {Boolean} A value that indicates whether there is any selection.
     */
    public checkSelection() {
        // TODO modelViewerModelSelectionService
        // if (modelViewerModelSelectionService.getSelectedModelId()) {
        //     return true;
        // } else {
        //     platformSidebarWizardCommonTasksService.showErrorNoSelection('model.main.assignmentError', $translate.instant('model.main.noModelSelected'));
        //     return false;
        // }
    }

    /**
     * @ngdoc method
     * @name getDefaultConfigObject
     * @function
     * @methodOf modelMainObjectAssignmentWizardService
     * @description Creates an object with default properties that are valid for all bulk assignment wizards.
     * @param {Object} dialogData The entity object that stores the input from the dialog box.
     * @returns {Object} An object with default properties that can be merged into the actual config object to
     *                   transmit with a request.
     */
    public getDefaultConfigObject(dialogData: any) {
        return {
            // modelId: this.modelViewerModelSelectionService.getSelectedModelId(), //TODO
            objectIds: dialogData.objectIds.useGlobalModelIds().toCompressedString(),
            destination: 's'
        };
    }


    public extractCostGroupAssignments(
        entity: Record<string, any>,
        extractCostGroupValue: (value: string | number | null) => string | number | null
    ): { cgType: number, cgCat: number, value: string | number | null }[] {
        const result: { cgType: number, cgCat: number, value: string | number | null }[] = [];

        // Ensure entity.cg is an object before accessing
        if (entity['cg'] && typeof entity['cg'] === 'object') {
            // Iterate over the cg object (equivalent to Lodash's _.isObject check)
            Object.keys(entity['cg']).forEach((cgTypeKey) => {
                const cgTypeId = parseInt(cgTypeKey, 10);
                const cgTypeGroup = entity['cg'][cgTypeKey];  // Access using bracket notation

                // Iterate over each cgCatKey in the cgTypeGroup
                Object.keys(cgTypeGroup).forEach((cgCatKey) => {
                    const cgCatId = parseInt(cgCatKey, 10);

                    // Call the extractCostGroupValue function and get the cgValue
                    const cgValue = extractCostGroupValue(cgTypeGroup[cgCatKey]);

                    // Check if cgValue is not null or undefined (equivalent to _.isNil)
                    if (cgValue !== null && cgValue !== undefined) {
                        result.push({
                            cgType: cgTypeId,
                            cgCat: cgCatId,
                            value: cgValue
                        });
                    }
                });
            });
        }

        return result || null;
    }


    public getCostGroupInfo() {
        // function extractCommonCostGroupInfo(cg) {
        //     return {
        //         id: cg.Id,
        //         name: cg.DescriptionInfo.Translated
        //     };
        // }

        // const cgcSvc = basicsCostGroupCatalogConfigDataService.getProjectCostGroupCatalogService(projectMainProjectSelectionService.getSelectedProjectId());
        // return cgcSvc.loadConfig('model.main').then(function processCompleteCostGroupConfig(cgConfig) {
        //     return _.concat(_.map(cgConfig.licCostGroupCats, function extractLicCostGroupInfo(cg) {
        //   const result = extractCommonCostGroupInfo(cg);
        //         result.costGroupType = basicsCostGroupType.licCostGroup;
        //         return result;
        //     }), _.map(cgConfig.prjCostGroupCats, function extractPrjCostGroupInfo(cg) {
        //         var result = extractCommonCostGroupInfo(cg);
        //         result.costGroupType = basicsCostGroupType.projectCostGroup;
        //         result.projectIdGetter = function () {
        //             return projectMainProjectSelectionService.getSelectedProjectId();
        //         };
        //         return result;
        //     }));
        // });
    }

    /**
             * @ngdoc method
             * @name getDefaultFormFields
             * @function
             * @methodOf modelMainObjectAssignmentWizardService
             * @description Creates an array of read-only default form field definitions to show in the wizard dialogs.
             * @returns {Array} The form field definitions.
             */
    public getDefaultFormFields() {
        return [{
            groupId: 'general',
            id: 'model',
            model: 'model',
            label$tr$: 'model.main.model',
            readonly: true,
            type: 'description'
        },
            // TODO model-main-object-source
            // {
            //     groupId: 'general',
            //     id: 'objSource',
            //     type: 'directive',
            //     directive: 'model-main-object-source',
            //     directiveOptions: {
            //         allowCollapse: false
            //     },
            //     model: 'objectIds',
            //     label$tr$: 'model.main.assignmentDest'
            // }
        ];
    }

    public async unassignLinkedEntities(): Promise<void> {
        // Call to getCostGroupInfo if needed (can be an async operation)
        this.getCostGroupInfo();

        // Show the dialog and wait for its result
        const result = await this.formDialogService.showDialog<IModelObjectEntity>({
            width: '70%',
            id: 'model.main.unassignProperties',
            headerText: { key: 'model.main.unassignProperties' },
            formConfiguration: this.unassignPropertiesFormConfiguration,
            entity: this.modelObject,
            runtime: undefined,
            customButtons: [],
            topDescription: '',
        });

        // Wait for the dialog result and only proceed if it's "Ok"
        if (result?.closingButtonId === StandardDialogButtonId.Ok) {
            // Make the HTTP request and wait for its response
            await new Promise<void>((resolve, reject) => {
                this.http.post(this.config.webApiBaseUrl + 'model/main/object/clearproperties', {})
                    .subscribe({
                        next: (response) => {
                            // Handle the response if needed (add the changeset if required)
                            // this.changesetDataService.addChangeSet(response); // Uncomment if necessary
                            resolve(); // Resolve when the request is done
                        },
                        error: (error) => {
                            reject(error); // Reject if there's an error with the HTTP request
                        }
                    });
            });
        }
    }


    private modelObject: IModelObjectEntity = {
        CompoundId: '',
        selModelRole: '',
        Id: 0,
        IsComposite: false,
        IsDeleted: false,
        IsNegative: false,
        IsOpeningParent: false,
        ModelFk: 0
    };

    private unassignPropertiesFormConfiguration: IFormConfig<IModelObjectEntity> = {
        formId: 'model.main.unassignPropertiesModal',
        showGrouping: true,
        // version: '0.1',
        groups: [{
            groupId: 'general',
            header: 'Target Objects',
            sortOrder: 1,
            open: true
        }, {
            groupId: 'deletion',
            header: 'Properties to Clear',
            sortOrder: 2,
            open: true
        }
        ],
        rows: [
            {
                id: 'deletion',
                model: 'location',
                sortOrder: 1,
                type: FieldType.Boolean
            }, {
                id: 'deletion',
                model: 'controllingUnit',
                sortOrder: 2,
                type: FieldType.Boolean
            },
            // ...this.cgInfo.map((cg, index) => ({
            //     id: 'deletion',
            //     model: `cg[${cg.costGroupType}][${cg.id}]`,
            //     sortOrder: index + 3, // Starting sortOrder after the first 2
            //     type: FieldType.Boolean
            //   }))
        ]

    };

    public async assignControllingUnits(): Promise<void> {
        // Show the dialog and wait for its result
        const result = await this.formDialogService.showDialog<IControllingUnitEntity>({
            width: '70%',
            id: 'model.main.unassignProperties',
            headerText: { key: 'model.main.unassignProperties' },
            formConfiguration: this.controllingUnitsFormConfiguration,
            entity: this.controllingUnitObject,
            runtime: undefined,
            customButtons: [],
            topDescription: '',
        });

        // Check if the dialog was closed with "Ok" and make the HTTP request
        if (result?.closingButtonId === StandardDialogButtonId.Ok) {
            // Prepare the request parameters
            const prms = {
                ...this.getDefaultConfigObject(result),
                // controllingUnitId: result.data.controllingUnitId // Uncomment if necessary
            };

            // Return a Promise for the HTTP request completion
            return new Promise<void>((resolve, reject) => {
                this.http.post(this.config.webApiBaseUrl + 'model/main/object/assigncontrollingunit', prms)
                    .subscribe({
                        next: (response) => {
                            // Handle the response if needed
                            // this.changesetDataService.addChangeSet(response); // Uncomment if needed
                            resolve(); // Resolve the Promise when the request is done
                        },
                        error: (error) => {
                            reject(error); // Reject the Promise in case of an error
                        }
                    });
            });
        } else {
            // If the dialog was not closed with "Ok", resolve immediately
            return Promise.resolve(); // Ensure a resolved promise is returned in this case
        }
    }


    private controllingUnitsFormConfiguration: IFormConfig<IControllingUnitEntity> = {
        formId: 'model.main.assignControllingUnits',
        showGrouping: true,
        // version: '0.1',
        groups: [{
            groupId: 'general',
            open: true
        }
        ],
        rows: [//         {
            //         id: 'entityControllingUnit',
            //         label: {
            //             key: 'model.main.entityControllingUnit',
            //         },
            //         type: FieldType.Lookup,
            //         model: 'entityControllingUnit',
            //         lookupOptions: createLookup({
            //             dataServiceToken: projectLocationLookupDataService,
            //             serverSideFilter: {
            //                 execute() {
            //                     return modelViewerModelSelectionService.getSelectedModel().info.projectId;
            //                 }
            //             }
            //         }),
            // },
            {
                id: 'general',
                // rowId: 'location',
                model: 'controllingUnitId',
                sortOrder: 1,
                type: FieldType.Integer,
            }]
    };

    private controllingUnitObject: IControllingUnitEntity = {
        Budget: 0,
        Code: '',
        CompanyFk: 0,
        CompanyResponsibleFk: 0,
        ContextFk: 0,
        ControllingCatFk: 0,
        ControllingunitstatusFk: 0,
        Id: 0,
        IsAccountingElement: false,
        IsAssetmanagement: false,
        IsBillingElement: false,
        IsDefault: false,
        IsFixedBudget: false,
        IsIntercompany: false,
        IsPlanningElement: false,
        IsPlantmanagement: false,
        IsStockmanagement: false,
        IsTimekeepingElement: false,
        PlannedDuration: 0,
        Quantity: 0
    };


    /**
    * @ngdoc method
    * @name assignLocations
    * @function
    * @methodOf modelMainObjectAssignmentWizardService
    * @description Shows a dialog box for picking a location that will be assigned to any currently selected
    *              model objects.
    */
    public async assignLocations(): Promise<void> {
        // Show the dialog and wait for its result
        const result = await this.formDialogService.showDialog<IProjectLocationEntity>({
            width: '70%',
            id: 'model.main.locationHierarchy.assignLocations',
            headerText: { key: 'model.main.locationHierarchy.assignLocations' },
            formConfiguration: this.locationFormConfiguration,
            entity: this.locationObject,
            runtime: undefined,
            customButtons: [],
            topDescription: '',
        });

        // Check if the dialog was closed with "Ok" and make the HTTP request
        if (result?.closingButtonId === StandardDialogButtonId.Ok) {
            // Prepare the request parameters
            const prms = {
                ...this.getDefaultConfigObject(result),
                // locationId: result.data?.locationId // Uncomment if needed
            };

            // Return a Promise for the HTTP request completion
            return new Promise<void>((resolve, reject) => {
                this.http.post(this.config.webApiBaseUrl + 'model/main/object/assignlocation', prms)
                    .subscribe({
                        next: (response) => {
                            // Handle the response if needed
                            // this.changesetDataService.addChangeSet(response); // Uncomment if needed
                            resolve(); // Resolve the Promise when the request is done
                        },
                        error: (error) => {
                            reject(error); // Reject the Promise in case of an error
                        }
                    });
            });
        } else {
            // If the dialog was not closed with "Ok", resolve immediately
            return Promise.resolve(); // Ensure a resolved promise is returned in this case
        }
    }

    private locationFormConfiguration: IFormConfig<IProjectLocationEntity> = {
        formId: 'model.main.locationHierarchy.assignLocations',
        showGrouping: true,
        // version: '0.1',
        groups: [{
            groupId: 'general',
            open: true
        }
        ],
        rows: [
            //         {
            //         id: 'log',
            //         label: {
            //             key: 'model.changeset.logLevel',
            //         },
            //         type: FieldType.Lookup,
            //         model: 'LoggingLevel',
            //         lookupOptions: createLookup({
            //             dataServiceToken: projectLocationLookupDataService,
            //             serverSideFilter: {
            //                 key: 'rubric-category-by-rubric-company-lookup-filter',
            //                 execute() {
            //                     return modelViewerModelSelectionService.getSelectedModel().info.projectId;
            //                 }
            //             }
            //         }),
            // },
            {
                id: 'general',
                // rowId: 'location',
                model: 'locationId',
                sortOrder: 1,
                type: FieldType.Integer,
            }]
    };

    private locationObject: IProjectLocationEntity = {
        Id: 0,
        ProjectFk: 0,
        Code: '',
        IsDetailer: false,
        ExternalCode: '',
        Sorting: 0,
        HasChildren: false,
        Locations: []
    };

    /**
    * @ngdoc method
    * @name assignCostGroups
    * @function
    * @methodOf modelMainObjectAssignmentWizardService
    * @description Shows a dialog box for picking cost groups that will be assigned to model objects.
    */
    public async assignCostGroups(): Promise<void> {
        // Show the dialog and wait for its result
        const result = await this.formDialogService.showDialog<IAssignCostGroupsEntity>({
            width: '70%',
            id: 'model.main.assignCostGroups',
            headerText: { key: 'model.main.assignCostGroups' },
            formConfiguration: this.costGroupFormConfiguration,
            entity: this.costGroupObject,
            runtime: undefined,
            customButtons: [],
            topDescription: '',
        });

        // Check if the dialog was closed with "Ok" and handle the HTTP request
        if (result?.closingButtonId === StandardDialogButtonId.Ok) {
            // Return a Promise for the HTTP request completion
            return new Promise<void>((resolve, reject) => {
                this.handleOk(result)
                    .then(() => {
                        resolve(); // Resolve the Promise after successful execution of handleOk
                    })
                    .catch((error) => {
                        reject(error); // Reject the Promise if an error occurs in handleOk
                    });
            });
        } else {
            // If the dialog was not closed with "Ok", resolve immediately
            return Promise.resolve(); // Resolve immediately if no action is needed
        }
    }


    /**
     * Method handles 'Ok' button functionality.
     */
    private handleOk(result: IEditorDialogResult<IAssignCostGroupsEntity>): Promise<void> {
        if (result && result && result.value) {
            const prms = Object.assign(this.getDefaultConfigObject(result.value), {
                CostGroupAssignments: this.extractCostGroupAssignments(result.value, (v) => {
                    const id = parseInt(v?.toString() ?? '', 10);
                    return Number.isInteger(id) ? id : null;
                }).map((assignment) => {
                    return {
                        PKey2: assignment.cgType,
                        PKey1: assignment.cgCat,
                        Id: assignment.value
                    };
                })
            });
            return new Promise<void>((resolve, reject) => {
                this.http.post(this.config.webApiBaseUrl + 'model/main/object/assigncostgroups', prms, {
                }).subscribe({
                    next: (response) => {
                        resolve();
                    },
                    error: (error) => {
                        reject(error);
                    }
                });
            });
        }

        return Promise.resolve();

    }
    private costGroupFormConfiguration: IFormConfig<IAssignCostGroupsEntity> = {
        formId: 'model.main.assignCostGroups',
        showGrouping: true,
        groups: [{
            groupId: 'general',
            open: true
        }
        ],
        rows: [
            //         {
            //         id: 'log',
            //         label: {
            //             key: 'model.changeset.logLevel',
            //         },
            //         type: FieldType.Lookup,
            //         model: 'LoggingLevel',
            //         lookupOptions: createLookup({
            //             dataServiceToken: projectLocationLookupDataService,
            //             serverSideFilter: {
            //                 key: 'rubric-category-by-rubric-company-lookup-filter',
            //                 execute() {
            //                     return modelViewerModelSelectionService.getSelectedModel().info.projectId;
            //                 }
            //             }
            //         }),
            // },
            {
                id: 'general',
                // rowId: 'location',
                model: 'locationId',
                sortOrder: 1,
                type: FieldType.Integer,
            }]
    };

    private costGroupObject: IAssignCostGroupsEntity = {
        CostGroupAssignments: [],
        destination: 'FullModel',
        modelId: 0,
        objectIds: ''
    };
}