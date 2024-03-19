import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Calendar } from 'primeng/calendar';
import { AppModule } from './app/app.module';


Calendar.prototype.getDateFormat = () => 'dd/mm/yy';
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
