import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { RoleService } from '../services/role.service';


@Directive({
  standalone: true,
  selector: '[FxtRoleGuard]',
})
export class FxtRoleGuard implements OnInit {
  @Input('FxtRoleGuard') roles: string[] = [];
  private viewContainerRef = inject(ViewContainerRef);
  private template = inject(TemplateRef<any>);
  readonly roleService = inject(RoleService);

  ngOnInit() {
    this.roleService.userRoleSubject.subscribe((_roles) => {
      const isFound = this.roles?.some((role) => _roles.includes(role));
      if (isFound) {
        this.viewContainerRef.createEmbeddedView(this.template);
      }
    });
  }
}
