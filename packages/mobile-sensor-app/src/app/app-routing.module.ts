import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataAcquisitionComponent } from './sensor-data/data-acquisition.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  {
    path: '',
    component: DataAcquisitionComponent
  },
  {
    path: 'statistics',
    component: StatisticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
