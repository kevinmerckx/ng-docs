import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DocsModule } from 'projects/ng-docs/src/public-api';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DocsModule
  ],
  exports: [
    DocsModule
  ]
})
export class SharedModule { }
