import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsTeachersPage } from './tabs-teachers.page';

const routes: Routes = [
  {
    path: '',
    component: TabsTeachersPage,
    children: [
      {
        path: 'create-class',
        loadChildren: () => import('../create-class/create-class.module').then(m => m.CreateClassPageModule)
      },
      {
        path: 'class-attendance',
        loadChildren: () => import('../class-attendance/class-attendance.module').then(m => m.ClassAttendancePageModule)
      },
      {
        path: 'generate-qr',
        loadChildren: () => import('../generate-qr/generate-qr.module').then(m => m.GenerateQrPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs-teachers/generate-qr',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsTeachersPageRoutingModule {}
