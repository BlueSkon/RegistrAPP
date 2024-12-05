import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassAttendancePageRoutingModule } from './class-attendance-routing.module';

import { ClassAttendancePage } from './class-attendance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassAttendancePageRoutingModule
  ],
  declarations: [ClassAttendancePage]
})
export class ClassAttendancePageModule {}
