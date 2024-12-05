import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsTeachersPageRoutingModule } from './tabs-teachers-routing.module';

import { TabsTeachersPage } from './tabs-teachers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsTeachersPageRoutingModule
  ],
  declarations: [TabsTeachersPage]
})
export class TabsTeachersPageModule {}
