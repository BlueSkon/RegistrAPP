import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'register-attendance',
    loadChildren: () => import('./register-attendance/register-attendance.module').then( m => m.RegisterAttendancePageModule)
  },
  {
    path: 'create-class',
    loadChildren: () => import('./create-class/create-class.module').then( m => m.CreateClassPageModule)
  },
  {
    path: 'generate-qr',
    loadChildren: () => import('./generate-qr/generate-qr.module').then( m => m.GenerateQrPageModule)
  },
  
  {
    path: 'edit-class/:id',
    loadChildren: () => import('./edit-class/edit-class.module').then( m => m.EditClassPageModule)
  },
  {path: 'attendance-history',
    loadChildren: () => import('./attendance-history/attendance-history.module').then(m => m.AttendanceHistoryPageModule)},
  {
    path: 'class-attendance',
    loadChildren: () => import('./class-attendance/class-attendance.module').then( m => m.ClassAttendancePageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'tabs-teachers',
    loadChildren: () => import('./tabs-teachers/tabs-teachers.module').then( m => m.TabsTeachersPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
