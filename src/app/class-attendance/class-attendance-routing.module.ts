import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassAttendancePage } from './class-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: ClassAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassAttendancePageRoutingModule {}
