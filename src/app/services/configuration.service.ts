import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private httpClient = inject(HttpClient)

  Init() {
    return new Promise<void>((resolve) => { });

  }


  async loadConfiguration(): Promise<any> {
    const config = await lastValueFrom(this.httpClient.get('./assets/config/app.json'));
    Object.assign(this, config);
    return config;
  }
}
export function ConfigurationFactory(ConfigurationInit: ConfigurationService) {
  return (): Promise<any> => {
    return ConfigurationInit.Init();
  };
}

