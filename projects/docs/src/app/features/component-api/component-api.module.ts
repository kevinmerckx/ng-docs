import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ComponentApiExample1Component, ProfileComponent } from './component-api-example1/component-api-example1.component';
import { ComponentApiComponent } from './component-api/component-api.component';

@NgModule({
  declarations: [ComponentApiComponent, ComponentApiExample1Component, ProfileComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ComponentApiModule { }
