import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DataAcquisitionComponent } from './sensor-data/data-acquisition.component';
import { StatisticsApiService } from './statistics/statistics-api.service';
import { StatisticsComponent } from './statistics/statistics.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { FixedNumberPipe } from './shared/fixed-number.pipe';
import { DeviceSensorService } from './sensor-data/device-sensor.service';
import { PushSensorDataService } from './sensor-data/push-sensor-data.service';

@NgModule({
  declarations: [
    AppComponent,
    DataAcquisitionComponent,
    StatisticsComponent,
    FixedNumberPipe
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxChartsModule,
    HttpClientModule
  ],
  providers: [StatisticsApiService, DeviceSensorService, PushSensorDataService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly _pushSensorDataService: PushSensorDataService) {
    this._pushSensorDataService.initialize();
  }
}
