import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { Observable, map, of } from 'rxjs';
import { DefaultPage, DefaultPageSize, SelectOption } from 'src/app/core/models/sharedModels';
import { GridifyQueryExtend } from 'src/app/core/utils/GridifyHelpers';
import { ValidateAllFormFields } from 'src/app/core/utils/helpers';
import { MDOHeaderDto, MDOLineDto, UpdateMDOLineRequest } from 'src/app/models/mdo';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { MdoService, ReasonCodeService, RequestByService, ShipToService, ShipperService } from 'src/app/services/mdo.service';
import { SharedModule } from 'src/app/shared/module/SharedModule/SharedModule.module';
import { MdoLinesFormComponent } from '../mdoLinesForm/mdoLinesForm.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    ToolbarModule,
    DropdownModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    DividerModule,
    TableModule,
    CalendarModule,
    SharedModule,
    MdoLinesFormComponent,
  ],
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.less'],
})
export class CreateUpdateComponent {
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private mdoSevice = inject(MdoService);
  private shipperService = inject(ShipperService);
  private requestByService = inject(RequestByService);
  private shipToService = inject(ShipToService);
  private reasonService = inject(ReasonCodeService);
  private dataSharingService = inject(DataSharingService);

  Query: GridifyQueryExtend = {} as GridifyQueryExtend;

  mdoId: string = '';
  isUpdate: boolean = false;
  updateMdo: boolean = false;
  FG!: FormGroup;
  Title: string = '';
  visible: boolean = false;
  mdoLine: MDOLineDto[] = [];
  mdoLineForm!: MDOLineDto;
  selectedIndex: number = 0;

  PagingSignal = signal<MDOHeaderDto>({} as MDOHeaderDto);

  ShipperSource$: Observable<SelectOption<string>[]> | undefined = of(
    [] as SelectOption<string>[]
  );

  requestBySource$: Observable<SelectOption<string>[]> | undefined = of(
    [] as SelectOption<string>[]
  );

  shipToSource$: Observable<SelectOption<string>[]> | undefined = of(
    [] as SelectOption<string>[]
  );

  reasonSource$: Observable<SelectOption<string>[]> | undefined = of(
    [] as SelectOption<string>[]
  );

  constructor() {
    this.FG = new FormGroup({
      Id: new FormControl({ value: '', disabled: true }),
      Date: new FormControl<string>('', [Validators.required]),
      ShipDate: new FormControl<string>('', [Validators.required]),
      ShipToId: new FormControl<string>('', [Validators.required]),
      ShipAddress: new FormControl<string>('', [Validators.required]),
      ShipperId: new FormControl<string>('', [Validators.required]),
      RequestById: new FormControl<string>('', [Validators.required]),
      ReasonCodeId: new FormControl<string>('', [Validators.required]),
      SORef: new FormControl<string>(''),
      PORef: new FormControl<string>(''),
      ProdRef: new FormControl<string>(''),
      Remark: new FormControl<string>(''),
      MDOLines: new FormArray([]),
    });
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id']) {
      this.mdoId = this.activatedRoute.snapshot.params['id'];
      this.isUpdate = true;
      this.Title = 'Update Mdo';
      this.LoadForm();
    } else {
      this.isUpdate = false;
      this.Title = 'Create New Mdo';
      this.FG.get('Id')?.disable();
    }

    this.Query.Page = DefaultPage;
    this.Query.PageSize = 100000;
    this.Query.OrderBy = null;
    this.Query.Filter = null;
    this.Query.Select = `Id, Name`;
    this.Query.Includes = null;

    this.ShipperSource$ = this.shipperService
      .GetMany(this.Query)
      .pipe(map((x) => x.Content.map((x) => ({ label: x.Name, value: x.Id }))));

    this.requestBySource$ = this.requestByService
      .GetMany(this.Query)
      .pipe(map((x) => x.Content.map((x) => ({ label: x.Name, value: x.Id }))));

    this.shipToSource$ = this.shipToService
      .GetMany(this.Query)
      .pipe(map((x) => x.Content.map((x) => ({ label: x.Name, value: x.Id }))));

    let query: GridifyQueryExtend = {} as GridifyQueryExtend;

    query.Page = DefaultPage;
    query.PageSize = 100000;
    query.OrderBy = null;
    query.Filter = null;
    query.Select = `Id, Reason`;
    query.Includes = null;

    this.reasonSource$ = this.reasonService
      .GetMany(query)
      .pipe(
        map((x) => x.Content.map((x) => ({ label: x.Reason, value: x.Id })))
      );
  }

  CreateMDOLineForm() {
    return new FormGroup({
      Id: new FormControl({ value: '', disabled: true }),
      Item: new FormControl('', [Validators.required]),
      ItemDesc: new FormControl(''),
      Qty: new FormControl(0, [Validators.required]),
      UOMId: new FormControl('', [Validators.required]),
      LineStatus: new FormControl(),
      Remark: new FormControl(''),
      LotID: new FormControl(''),
      UOMName: new FormControl(''),
    });
  }

  ShipToOnChanges(event: any) {
    if (event) {
      let query: GridifyQueryExtend = {} as GridifyQueryExtend;

      query.Page = DefaultPage;
      query.PageSize = DefaultPageSize;
      query.OrderBy = null;
      query.Filter = `Id=${event.value}`;
      query.Select = `Id, Address`;
      query.Includes = null;

      this.shipToService.GetOne(query).subscribe((x) => {
        this.FG.get('ShipAddress')?.patchValue(x.Address);
      });
    }
  }

  LoadForm() {
    this.Query.Page = 0;
    this.Query.PageSize = 0;
    this.Query.OrderBy = null;
    this.Query.Filter = `Id=${this.mdoId}`;
    this.Query.Includes = 'ShipTo,Shipper,RequestBy,ReasonCode,MDOLines.UOM';
    this.Query.Select = null;

    this.mdoSevice.GetOne(this.Query).subscribe((respond) => {
      this.PagingSignal.set(respond);
      this.FG.patchValue(respond);
      this.FG.patchValue({
        Date: new Date(respond.Date),
        ShipDate: new Date(respond.ShipDate),
        ShipperId: respond.Shipper.Id,
        ShipToId: respond.ShipTo.Id,
        ReasonCodeId: respond.ReasonCode.Id,
        RequestById: respond.RequestBy.Id,
      });
      this.mdoLine = respond.MDOLines;
      respond.MDOLines.forEach((res, i) => {
        this.formControlMDOLines.push(this.CreateMDOLineForm());
        this.formControlMDOLines.controls[i].patchValue(res);
        this.formControlMDOLines.controls[i].patchValue({
          UOMId: res.UOM.Id,
          UOMName: res.UOM.Name,
        });
      });
    });
  }

  AddLine() {
    this.visible = true;
    this.updateMdo = false;
    this.dataSharingService.getDataInstallation(this.updateMdo, null, 0);
  }

  EditLine(line: UpdateMDOLineRequest, index: number) {
    this.visible = true;
    this.updateMdo = true;
    this.selectedIndex = index;
    this.dataSharingService.getDataInstallation(this.updateMdo, line, index);
  }

  EditMdoLine(event: { line: UpdateMDOLineRequest; index: number }) {
    const { line, index } = event;

    const formGroup = this.formControlMDOLines.at(index) as FormGroup;
    formGroup.patchValue(line);
  }

  AddMdoLine(line: FormGroup) {
    this.formControlMDOLines.push(line);
    this.mdoLine = this.formControlMDOLines.value;
  }

  DeleteLine(index: number) {
    this.formControlMDOLines.removeAt(index);
  }

  CreateMdoLine() {
    this.visible = true;
    this.updateMdo = false;
  }

  Close() {
    this.dataSharingService.getDataInstallation(false, null, 0);
  }

  SaveUpdateClick() {
    if (this.FG.valid) {
      if (this.isUpdate) {
        this.FG.get('Id')?.enable();
        this.FG.get('Id')?.patchValue(this.mdoId);
        this.mdoSevice.Update(this.FG.value).subscribe(() => {
          this.CancelClick();
        });
      } else {
        this.mdoSevice.Create(this.FG.value).subscribe(() => {
          this.CancelClick();
        });
      }
    }
    ValidateAllFormFields(this.FG);
  }

  CancelClick() {
    this.location.back();
  }

  CloseClick() {
    this.visible = false;
  }

  get formControlMDOLines() {
    return this.FG.get('MDOLines') as FormArray;
  }
}
