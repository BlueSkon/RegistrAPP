import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'register-attendance',
        loadChildren: () => import('../register-attendance/register-attendance.module').then(m => m.RegisterAttendancePageModule)
      },
      {
        path: 'attendance-history',
        loadChildren: () => import('../attendance-history/attendance-history.module').then(m => m.AttendanceHistoryPageModule)
      },
      
      
      {
        path: '',
        redirectTo: '/tabs/register-attendance',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
