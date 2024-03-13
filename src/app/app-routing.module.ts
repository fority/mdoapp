import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { CallbackComponent } from './shared/components/callback/callback.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'menu' },

  {
    path: 'menu',
    loadComponent: () =>
      import(
        '../app/shared/layout/sidebar-layout/sidebar-layout.component'
      ).then((mod) => mod.SidebarLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/menu/menu.component').then(
            (mod) => mod.MenuComponent
          ),
      },
    ],
  },
  {
    path: 'mdo',
    loadComponent: () =>
      import(
        '../app/shared/layout/sidebar-layout/sidebar-layout.component'
      ).then((mod) => mod.SidebarLayoutComponent),
    children: [
      {
        path: 'view',
        loadComponent: () =>
          import('./pages/mdo/mdo-listings/mdo-listings.component').then(
            (mod) => mod.MdoListingsComponent
          ),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./pages/mdo/details/details.component').then(
            (mod) => mod.DetailsComponent
          ),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/mdo/create-update/create-update.component').then(
            (mod) => mod.CreateUpdateComponent
          ),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
      {
        path: 'update/:id',
        loadComponent: () =>
          import('./pages/mdo/create-update/create-update.component').then(
            (mod) => mod.CreateUpdateComponent
          ),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
    ],
  },
  {
    path: 'setting',
    loadComponent: () =>
      import('./shared/layout/sidebar-layout/sidebar-layout.component').then(
        (mod) => mod.SidebarLayoutComponent
      ),
    children: [
      {
        path: 'shipper',
        loadComponent: () =>
          import('./pages/shipper/shipper.component').then(
            (mod) => mod.ShipperComponent
          ),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
      {
        path: 'reason-code',
        loadComponent: () =>
          import('./pages/reason/reason.component').then(
            (mod) => mod.ReasonComponent
          ),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
      {
        path: 'uom',
        loadComponent: () =>
          import('./pages/uom/uom.component').then((mod) => mod.UomComponent),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
      {
        path: 'ship-to',
        loadComponent: () =>
          import('./pages/shipTo/shipTo.component').then(
            (mod) => mod.ShipToComponent
          ),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
      {
        path: 'request-by',
        loadComponent: () =>
          import('./pages/requestBy/requestBy.component').then(
            (mod) => mod.RequestByComponent
          ),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
    ],
  },
  {
    path: 'user-manager',
    loadComponent: () =>
      import('./shared/layout/sidebar-layout/sidebar-layout.component').then(
        (mod) => mod.SidebarLayoutComponent
      ),
    children: [
      {
        path: 'view',
        loadComponent: () =>
          import(
            './pages/user-manager/user-listings/user-listings.component'
          ).then((mod) => mod.UserListingsComponent),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
      {
        path: 'update/:id',
        loadComponent: () =>
          import('./pages/user-manager/update-user/update-user.component').then(
            (mod) => mod.UpdateUserComponent
          ),
        canActivate: [AutoLoginPartialRoutesGuard],
      },
    ],
  },

  { path: 'authcallback', component: CallbackComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', pathMatch: 'full', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
