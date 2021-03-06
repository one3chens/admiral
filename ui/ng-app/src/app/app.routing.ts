/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 *
 * This product is licensed to you under the Apache License, Version 2.0 (the "License").
 * You may not use this product except in compliance with the License.
 *
 * This product may include a number of subcomponents with separate copyright notices
 * and license terms. Your use of these subcomponents is subject to the terms and
 * conditions of the subcomponent's license, as noted in the LICENSE file.
 */

import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule } from '@angular/router';
import { RoutesRestriction } from './utils/routes-restriction';

import { AdministrationComponent } from './views/administration/administration.component';
import { MainResourcesComponent } from './views/main-resources/main-resources.component';
import { MainResourcesComputeComponent } from './views/main-resources-compute/main-resources-compute.component';

import { IdentityManagementComponent } from './views/identity-management/identity-management.component';
import { ProjectsComponent } from './views/projects/projects.component';
import { ProjectDetailsComponent } from './views/projects/project-details/project-details.component';
import { ProjectCreateComponent } from './views/projects/project-create/project-create.component';
import { ProjectAddMemberComponent } from "./views/projects/project-details/project-add-member.component";
import { RegistriesComponent } from './views/registries/registries.component';
import { ConfigurationComponent } from './views/configuration/configuration.component';
import { LogsComponent } from './views/logs/logs.component';

import { DashboardComponent } from './views/dashboard/dashboard.component';
import { FormerPlaceholderViewComponent } from './views/former-view/former-view.component';
import { RepositoryComponent } from './views/hbr/repository/repository.component';
import { ClustersComponent } from './views/clusters/clusters.component';
import { ClusterDetailsComponent } from './views/clusters/cluster-details/cluster-details.component';
import { ClusterCreateComponent } from './views/clusters/cluster-create/cluster-create.component';

import { DummyComponent } from './components/dummy/dummy.component';

import { PodListComponent } from './kubernetes/pods/list/pod-list.component';
import { PodDetailsComponent } from './kubernetes/pods/details/pod-details.component';
import { DeploymentListComponent } from './kubernetes/deployments/list/deployment-list.component';
import { DeploymentDetailsComponent } from './kubernetes/deployments/details/deployment-details.component';
import { ServiceListComponent } from './kubernetes/services/list/service-list.component';
import { ServiceDetailsComponent } from './kubernetes/services/details/service-details.component';

import { NavigationContainerType } from './components/navigation-container/navigation-container.component';
import { LoginComponent } from './components/login/login.component';

import { AdminAuthGuard } from 'app/services/admin-auth-guard.service';
import { HomeAuthGuard } from 'app/services/home-auth-guard.service';
import { TagDetailsComponent } from './views/tag-details/tag-details.component';


// compute views
import { InstanceTypesComponent } from './views/profiles/instance-types/instance-types.component';

export const ROUTES: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home', component: MainResourcesComponent,
        children: [
            {
                path: '', canActivate: [HomeAuthGuard], data: { roles: RoutesRestriction.HOME }, pathMatch: 'full', redirectTo: 'applications' 
            },
            {
                path: 'dashboard', component: DashboardComponent,
            },
            {
                path: 'applications', component: DummyComponent, canActivate: [HomeAuthGuard], data: { roles: RoutesRestriction.DEPLOYMENTS }
            },
            {
                path: 'containers', component: DummyComponent, canActivate: [HomeAuthGuard], data: { roles: RoutesRestriction.DEPLOYMENTS }
            },
            {
                path: 'networks', component: DummyComponent, canActivate: [HomeAuthGuard], data: { roles: RoutesRestriction.DEPLOYMENTS }
            },
            {
                path: 'volumes', component: DummyComponent, canActivate: [HomeAuthGuard], data: { roles: RoutesRestriction.DEPLOYMENTS }
            },
            {
                path: 'project-repositories', component: RepositoryComponent,
                children: [
                    { path: 'repositories/:rid/tags/:tid', component: TagDetailsComponent, data: {
                        navigationContainerType: NavigationContainerType.Fullscreen,
                        hideBackButton: true
                    }},
                ]
            },
            {
                path: 'registries', component: RegistriesComponent
            },
            {
                path: 'identity-management', component: IdentityManagementComponent
            },
            {
                path: 'clusters', component: ClustersComponent,
                data: { roles: RoutesRestriction.CLUSTERS },
                canActivate: [HomeAuthGuard],
                children: [
                    { path: 'cluster/new',
                        canActivate: [HomeAuthGuard], component: ClusterCreateComponent, data: {
                        navigationContainerType: NavigationContainerType.Default,
                        roles: RoutesRestriction.CLUSTERS_NEW
                    }},
                    { path: 'cluster/:id',
                        canActivate: [HomeAuthGuard], component: ClusterDetailsComponent, data: {
                        navigationContainerType: NavigationContainerType.Fullscreen,
                        roles: RoutesRestriction.CLUSTERS_ID
                    }},
                    { path: 'cluster/:id/edit',
                        canActivate: [HomeAuthGuard], component: ClusterCreateComponent, data: {
                        navigationContainerType: NavigationContainerType.Fullscreen,
                        roles: RoutesRestriction.CLUSTERS_EDIT
                    }}
                ]
            },
            {
                path: 'kubernetes/pods', component: PodListComponent,
                children: [
                    { path: ':id', component: PodDetailsComponent, data: {
                        navigationContainerType: NavigationContainerType.Fullscreen
                    }}
                ]
            },
            {
                path: 'kubernetes/deployments', component: DeploymentListComponent,
                children: [
                    { path: ':id', component: DeploymentDetailsComponent, data: {
                        navigationContainerType: NavigationContainerType.Fullscreen
                    }}
                ]
            },
            {
                path: 'kubernetes/services', component: ServiceListComponent,
                children: [
                    { path: ':id', component: ServiceDetailsComponent, data: {
                        navigationContainerType: NavigationContainerType.Fullscreen
                    }}
                ]
            },
            {
                 path: '**', component: FormerPlaceholderViewComponent
            }
        ]
    },
    {
        path: 'administration', component: AdministrationComponent,
        canActivate: [AdminAuthGuard],
        data: { roles: RoutesRestriction.ADMINISTRATION },
        children: [
            {
                path: '', redirectTo: 'projects', pathMatch: 'full'
            },
            {
                path: 'identity-management', component: IdentityManagementComponent,
                canActivate: [AdminAuthGuard],
                data: { roles: RoutesRestriction.IDENTITY_MANAGEMENT }
            },
            {
                path: 'projects', component: ProjectsComponent,
                canActivate: [AdminAuthGuard],
                data: { roles: RoutesRestriction.PROJECTS },
                children: [
                    { path: 'new', component: ProjectCreateComponent,
                        canActivate: [AdminAuthGuard],
                        data: {
                            navigationContainerType: NavigationContainerType.Default,
                            roles: RoutesRestriction.PROJECTS_NEW
                        }
                    },
                    { path: ':id', component: ProjectDetailsComponent,
                        canActivate: [AdminAuthGuard],
                        data: {
                            navigationContainerType: NavigationContainerType.Fullscreen,
                            roles: RoutesRestriction.PROJECTS_ID
                        }
                    },
                    { path: ':id/edit', component: ProjectCreateComponent,
                        canActivate: [AdminAuthGuard],
                        data: {
                            navigationContainerType: NavigationContainerType.Fullscreen,
                            roles: RoutesRestriction.PROJECTS_ID_EDIT
                        }
                    },
                    { path: ':projectId/cluster/new', component: ClusterCreateComponent,
                        canActivate: [AdminAuthGuard],
                        data: {
                            navigationContainerType: NavigationContainerType.Fullscreen,
                            roles: RoutesRestriction.CLUSTERS_NEW
                        }
                    },
                    { path: ':projectId/cluster/:id', component: ClusterDetailsComponent,
                        canActivate: [AdminAuthGuard],
                        data: {
                            navigationContainerType: NavigationContainerType.Fullscreen,
                            roles: RoutesRestriction.CLUSTERS_ID
                        }
                    },
                    { path: ':projectId/cluster/:id/edit', component: ClusterCreateComponent,
                        canActivate: [AdminAuthGuard],
                        data: {
                            navigationContainerType: NavigationContainerType.Fullscreen,
                            roles: RoutesRestriction.CLUSTERS_EDIT
                        }
                    },
                    { path: ':id/repositories/:rid/tags/:tid', component: TagDetailsComponent, data: {
                        navigationContainerType: NavigationContainerType.Fullscreen,
                        hideBackButton: true
                     }},
                    { path: ':id/add-member', component: ProjectAddMemberComponent,
                        canActivate: [AdminAuthGuard],
                        data: {
                            navigationContainerType: NavigationContainerType.Fullscreen,
                            roles: RoutesRestriction.PROJECTS_ID_ADD_MEMBER
                        }
                    }
                ]
            },
            {
                path: 'registries', component: RegistriesComponent,
                canActivate: [AdminAuthGuard],
                data: { roles: RoutesRestriction.REGISTRIES }
            },
            {
                path: 'configuration', component: ConfigurationComponent,
                canActivate: [AdminAuthGuard],
                data: { roles: RoutesRestriction.CONFIGURATION }
            },
            {
                path: 'logs', component: LogsComponent,
                canActivate: [AdminAuthGuard],
                data: { roles: RoutesRestriction.LOGS }
            }
        ]
    },

    // Compute paths
    {
        path: 'compute', component: MainResourcesComputeComponent,
        children: [
            {
                path: '', redirectTo: 'endpoints', pathMatch: 'full'
            },
            {
                path: 'endpoints', component: FormerPlaceholderViewComponent
            },
            {
                path: 'compute', component: FormerPlaceholderViewComponent
            },
            {
                path: 'profiles', component: FormerPlaceholderViewComponent
            },
            {
                path: 'instance-types', component: InstanceTypesComponent,
                children: [{
                  path: 'new',
                  component: FormerPlaceholderViewComponent
                }, {
                  path: ':id',
                  component: FormerPlaceholderViewComponent
                }]
            },
            {
                path: 'placements', component: FormerPlaceholderViewComponent
            },
            {
                path: 'machines', component: FormerPlaceholderViewComponent
            },
            {
                path: 'networks', component: FormerPlaceholderViewComponent
            },
            {
                 path: '**', component: FormerPlaceholderViewComponent
            }
        ]
    }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES, {useHash: true});
