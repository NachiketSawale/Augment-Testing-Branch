/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AccessScope, AccessScopedPermissions, PlatformCommonAccessScopeService } from '..';
import { PlatformPermissionService } from '../../services/platform-permission.service';

import { Permissions } from '../../model/permission/permissions.enum';

import { CheckAccessRightsResult } from '../model/check-access-rights-result.type';
import { AccessPermissionData } from '../model/required-access-permissions.type';

describe('PlatformCommonAccessScopeService', () => {
  let service: PlatformCommonAccessScopeService;
  let permissionService: PlatformPermissionService;

  const requiredPermissions: AccessScopedPermissions = {
    'user': 'd8fa3a03e8314952b41ab659217e6cb2',
    'role': 'da63204cc70643c1bebe4c7a9bd3b272',
    'system': ['35866bede7d3481284fef40332c547a0', '3370d97838704b85ae0d49a1d8fdbf73'],
    permission: Permissions.Execute
  };

  const expectedResult: CheckAccessRightsResult = {
    [AccessScope.User]: true,
    [AccessScope.Role]: true,
    [AccessScope.Global]: true
  };

  const allDescriptor = ['d8fa3a03e8314952b41ab659217e6cb2', 'da63204cc70643c1bebe4c7a9bd3b272',
    '35866bede7d3481284fef40332c547a0',
    '3370d97838704b85ae0d49a1d8fdbf73'];

  const requiredAccess: AccessPermissionData = {
    allDescriptors: allDescriptor,
    'u': [{ 'd8fa3a03e8314952b41ab659217e6cb2': 16 }],
    'r': [{ 'da63204cc70643c1bebe4c7a9bd3b272': 16 }],
    'g': [{ '35866bede7d3481284fef40332c547a0': 16 },
    { '3370d97838704b85ae0d49a1d8fdbf73': 16 }],
    'p': []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [PlatformPermissionService]
    });
    service = TestBed.inject(PlatformCommonAccessScopeService);
    permissionService = TestBed.inject(PlatformPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns info for a known access scope value', () => {
    const info = service.getInfo(AccessScope.Role);
    expect(info).toBeTruthy();
  });

  it('throws when getting info for an unknown value', () => {
    expect(() => service.getInfo(<AccessScope>519814)).toThrow(Error);
  });

  it('returns info for a known short access scope ID', () => {
    const info = service.getInfoById('u');
    expect(info).toBeTruthy();
  });

  it('throws when getting info for an unknown short access scope ID', () => {
    expect(() => service.getInfoById('$')).toThrow(Error);
  });

  it('returns info for a known long access scope ID', () => {
    const info = service.getInfoByLongId('role');
    expect(info).toBeTruthy();
  });

  it('throws when getting info for an unknown long access scope ID', () => {
    expect(() => service.getInfoByLongId('abc')).toThrow(Error);
  });

  it('correctly evaluates relative access', () => {
    expect(service.canAccess(AccessScope.Global, AccessScope.User)).toBeFalsy();
    expect(service.canAccess(AccessScope.User, AccessScope.Role)).toBeTruthy();
  });

  describe('processRequiredPermissionItems', () => {
    it('should process required permission items correctly', () => {
      const permissionData = jest.spyOn(permissionService, 'loadPermissions');
      permissionService.loadPermissions(allDescriptor);

      let result = {} as CheckAccessRightsResult;
      service.processRequiredPermissionItems(requiredPermissions).then((res) => {
        result = res;
      });
      setTimeout(() => {
        expect(result).toEqual(expectedResult);
      }, 2000);
    });

    it('should process permission item if allDescriptor not present', () => {
      const requiredPermissionsData: AccessScopedPermissions = {
        'user': '',
        'role': '',
        'system': [],
      };

      const permissionData = jest.spyOn(permissionService, 'loadPermissions');
      permissionService.loadPermissions(allDescriptor);

      let result = {} as CheckAccessRightsResult;
      service.processRequiredPermissionItems(requiredPermissionsData).then((res) => {
        result = res;
      });
      setTimeout(() => {
        expect(result).toEqual(expectedResult);
      }, 2000);
    });

  });


  describe('checkAccessRights', () => {
    it('should handle single permission input', () => {
      let result = {} as CheckAccessRightsResult;
      service.checkAccessRights(requiredPermissions).then((res) => {
        result = res as CheckAccessRightsResult;
      });
      setTimeout(() => {
        expect(result).toEqual(expectedResult);
      }, 2000);
    });

    it('should handle array permission input', () => {
      const permissionData: AccessScopedPermissions[] = [
        {
          'permission': 16,
          'system': [
            '3370d97838704b85ae0d49a1d8fdbf73'
          ],
          'role': [
            '2a9924e3d31546c380f236e5f5fa4b5e'
          ],
          'user': [
            '60cc1283416a404f96985ff04af6c9b6'
          ]
        },
        {
          'permission': 16,
          'system': [
            '3370d97838704b85ae0d49a1d8fdbf73'
          ],
          'role': [
            '2a9924e3d31546c380f236e5f5fa4b5e'
          ],
          'user': [
            '60cc1283416a404f96985ff04af6c9b6'
          ]
        }
      ];

      const expectedResultAll: CheckAccessRightsResult[] = [
        {
          [AccessScope.User]: true,
          [AccessScope.Role]: true,
          [AccessScope.Global]: true
        },
        {
          [AccessScope.User]: true,
          [AccessScope.Role]: true,
          [AccessScope.Global]: true
        }
      ];

      let result = [] as CheckAccessRightsResult[];
      service.checkAccessRights(permissionData).then((res) => {
        result = res as CheckAccessRightsResult[];
      });
      setTimeout(() => {
        expect(result).toEqual(expectedResultAll);
      }, 2000);
    });

  });

  describe('checkForRequiredPermissions', () => {
    it('should check for required permissions', () => {
      let result = {} as CheckAccessRightsResult;

      result = service.checkForRequiredPermissions(requiredAccess);

      setTimeout(() => {
        expect(result).toEqual(expectedResult);
      }, 2000);
    });

  });

  describe('retrievePermissionItem', () => {
    it('should retrieve permission item having descriptor UUID with access rights', () => {
      let result = {} as Record<string, Permissions>;
      const expectedPermissionResult: Record<string, Permissions> = {
        'd8fa3a03e8314952b41ab659217e6cb2': 16
      };

      const requiredAccess: AccessPermissionData = {
        allDescriptors: [],
        u: [],
        r: [],
        g: [],
        p: []
      };

      const permissionData = {
        'user': 'd8fa3a03e8314952b41ab659217e6cb2#e',
        'role': 'da63204cc70643c1bebe4c7a9bd3b272#e',
        'system': ['35866bede7d3481284fef40332c547a0#e', '3370d97838704b85ae0d49a1d8fdbf73#e'],
      };
      result = service.retrievePermissionItem('d8fa3a03e8314952b41ab659217e6cb2#e', requiredAccess, permissionData);

      expect(result).toEqual(expectedPermissionResult);
    });

  });


});
