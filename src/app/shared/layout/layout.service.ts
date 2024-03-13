import { Route, Routes } from '@angular/router';
import { SidebarLayoutComponent } from './sidebar-layout/sidebar-layout.component';

/**
 * Provides helper methods to create routes.
 */
export class Layout {
  // pageTitle: string;
  // constructor(private route: ActivatedRoute) {}
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static normalChildRoutes(routes: Routes): Route {
    return {
      path: '',
      component: SidebarLayoutComponent,
      children: routes,
    };
  }

  // static internalChildRoutes(routes: Routes): Route {
  //   return {
  //     path: '',
  //     component: SidebarLayoutComponent,
  //     children: routes,
  //   };
  // }

  // static externalChildRoutes(routes: Routes): Route {
  //   return {
  //     path: '',
  //     component: SidebarLayoutComponent,
  //     children: routes,
  //   };
  // }
}
