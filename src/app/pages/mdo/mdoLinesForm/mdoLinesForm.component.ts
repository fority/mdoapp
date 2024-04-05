import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { Observable, map, of, tap } from 'rxjs';
import {
  DefaultPage,
  SelectOption
} from 'src/app/core/models/sharedModels';
import { GridifyQueryExtend } from 'src/app/core/utils/GridifyHelpers';
import { ValidateAllFormFields } from 'src/app/core/utils/helpers';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { UOMService } from 'src/app/services/mdo.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
  ],
  selector: 'app-mdoLinesForm',
  templateUrl: './mdoLinesForm.component.html',
  styleUrls: ['./mdoLinesForm.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MdoLinesFormComponent {
  @Input() sidebarVisible: boolean = false;
  @Input() isUpdate?: boolean;

  @Output() successEmitter = new EventEmitter();
  @Output() updateEmitter = new EventEmitter();
  @Output() HideSideBarEmitter = new EventEmitter();

  private uomService = inject(UOMService);
  private dataSharingService = inject(DataSharingService);

  uomSelected?: string = '';
  update: boolean = false;
  selectedIndex: number = 0;
  FG = {} as FormGroup;
  uomSource$: Observable<SelectOption<string>[]> | undefined = of(
    [] as SelectOption<string>[]
  );
  constructor() {
    this.dataSharingService.currentMdo.subscribe((x) => {
      this.update = x.update;
    });
    this.FG = new FormGroup({
      Id: new FormControl({ value: '', disabled: true }),
      Item: new FormControl(null, [Validators.required]),
      Qty: new FormControl(null, [Validators.required, Validators.min(0)]),
      UOMId: new FormControl(null, [Validators.required]),
      ItemDesc: new FormControl(null),
      LineStatus: new FormControl(null),
      Remark: new FormControl(null),
      LotID: new FormControl(null),
      UOMName: new FormControl(null),
    });
    if (this.update) {
      this.LoadForm();
    } else {
      this.FG.get('Id')?.disable();
    }

    let query: GridifyQueryExtend = {} as GridifyQueryExtend;

    query.Page = DefaultPage;
    query.PageSize = 100000;
    query.OrderBy = null;
    query.Filter = null;
    query.Select = `Id, Name`;
    query.Includes = null;

    this.uomSource$ = this.uomService
      .GetMany(query)
      .pipe(map((x) => x.Content.map((x) => ({ label: x.Name, value: x.Id }))));
  }

  LoadForm() {
    this.FG.get('Id')?.enable();
    this.dataSharingService.currentMdo.subscribe((x) => {
      this.selectedIndex = x.index;
      this.FG.patchValue({
        Id: x.data?.Id,
        Item: x.data?.Item,
        Qty: x.data?.Qty,
        UOMId: x.data?.UOMId,
        ItemDesc: x.data?.ItemDesc,
        LineStatus: x.data?.LineStatus,
        Remark: x.data?.Remark,
        LotID: x.data?.LotID,
        UOMName: x.data?.UOMId,
      });
    });
  }

  UomChange(event: any) {
    if (this.uomSource$) {
      this.uomSource$
        .pipe(
          tap((options) => {
            const selectedOption = options.find(
              (option) => option.value === event
            );
            this.uomSelected = selectedOption ? selectedOption.label : '';
            this.FG.get('UOMName')?.patchValue(this.uomSelected);
          })
        )
        .subscribe();
    }
  }

  SaveUpdateClick() {
    if (this.FG.valid) {
      const uomId = this.FG.get('UOMId')?.value;
      if (uomId) {
        if (this.uomSource$) {
          this.uomSource$.subscribe((options) => {
            const selectedOption = options.find(
              (option) => option.value === uomId
            );
            const uomName = selectedOption ? selectedOption.label : '';
            this.FG.get('UOMName')?.patchValue(uomName);
            const emitter = this.update
              ? this.updateEmitter
              : this.successEmitter;
            if (this.update) {
              emitter.emit({ line: this.FG.value, index: this.selectedIndex });
            } else {
              emitter.emit(this.FG);
            }
            this.HideSideBar();
          });
        }
      }
    } else {
      ValidateAllFormFields(this.FG);
    }
  }

  HideSideBar = () => {
    this.update = false; // Set updateMdo to false when hiding the sidebar
    this.HideSideBarEmitter.emit();
  };
}
