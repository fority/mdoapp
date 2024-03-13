export interface FxtIdServerUserDto {
  Id: string;
  UserName: string | null;
  Email: string | null;
  EmailConfirmed: boolean;
  PhoneNumber: string | null;
  PhoneNumberConfirmed: boolean;
  TwoFactorEnabled: boolean;
  LockoutEnd: Date | string | null;
  LockoutEnabled: boolean;
  AccessFailedCount: number;
  FirstName: string;
  LastName: string;
  DisplayName: string;
  Department: string | null;
  StaffId: string | null;
  Remark: string | null;
  Disable: boolean;
  Confirm: boolean;
  Photo: string | null;
}
